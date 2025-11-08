const express = require('express');
const router = express.Router();
const { requireAuth, requireOrganization } = require('../middleware/auth');
const { query } = require('../db/connection');

/**
 * Get all price agreements (contracts) for organization
 */
router.get('/', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;

    const { rows: contracts } = await query(
      `SELECT 
         pa.*,
         v.name as vendor_name,
         v.email as vendor_email,
         v.phone as vendor_phone,
         (SELECT COUNT(*) FROM price_agreement_items WHERE price_agreement_id = pa.id) as item_count,
         (SELECT COUNT(*) FROM invoices WHERE vendor_id = pa.vendor_id AND created_at >= pa.effective_date) as invoices_verified,
         CASE 
           WHEN pa.expiration_date IS NULL THEN 'active'
           WHEN pa.expiration_date < CURRENT_DATE THEN 'expired'
           WHEN pa.expiration_date < CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
           ELSE 'active'
         END as status
       FROM price_agreements pa
       LEFT JOIN vendors v ON pa.vendor_id = v.id
       WHERE pa.organization_id = $1
       ORDER BY pa.created_at DESC`,
      [organizationId]
    );

    // Get stats
    const { rows: [stats] } = await query(
      `SELECT 
         COUNT(DISTINCT pa.id) as total_contracts,
         COUNT(DISTINCT pa.vendor_id) as total_vendors,
         SUM((SELECT COUNT(*) FROM price_agreement_items WHERE price_agreement_id = pa.id)) as total_items,
         COUNT(CASE WHEN pa.expiration_date < CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_soon
       FROM price_agreements pa
       WHERE pa.organization_id = $1`,
      [organizationId]
    );

    res.json({
      contracts,
      stats: {
        totalContracts: parseInt(stats.total_contracts) || 0,
        totalVendors: parseInt(stats.total_vendors) || 0,
        totalItems: parseInt(stats.total_items) || 0,
        expiringSoon: parseInt(stats.expiring_soon) || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get single contract with all items
 */
router.get('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.auth.organizationId;

    // Get contract
    const { rows: [contract] } = await query(
      `SELECT pa.*, v.name as vendor_name, v.address as vendor_address,
              v.phone as vendor_phone, v.email as vendor_email
       FROM price_agreements pa
       LEFT JOIN vendors v ON pa.vendor_id = v.id
       WHERE pa.id = $1 AND pa.organization_id = $2`,
      [id, organizationId]
    );

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Get all items
    const { rows: items } = await query(
      `SELECT * FROM price_agreement_items 
       WHERE price_agreement_id = $1
       ORDER BY item_code, item_description`,
      [id]
    );

    // Get recent invoices verified against this contract
    const { rows: recentInvoices } = await query(
      `SELECT i.id, i.invoice_number, i.invoice_date, i.total_amount,
              i.has_discrepancies, i.total_discrepancy_amount, i.status
       FROM invoices i
       WHERE i.vendor_id = $1 AND i.organization_id = $2
       ORDER BY i.invoice_date DESC
       LIMIT 10`,
      [contract.vendor_id, organizationId]
    );

    // Calculate total contract value
    const { rows: [valueData] } = await query(
      `SELECT SUM(unit_price) as total_value
       FROM price_agreement_items
       WHERE price_agreement_id = $1`,
      [id]
    );

    res.json({
      contract: {
        ...contract,
        item_count: items.length,
        total_value: parseFloat(valueData.total_value) || 0
      },
      items,
      recentInvoices
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete contract
 */
router.delete('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.auth.organizationId;

    const { rowCount } = await query(
      'DELETE FROM price_agreements WHERE id = $1 AND organization_id = $2',
      [id, organizationId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

