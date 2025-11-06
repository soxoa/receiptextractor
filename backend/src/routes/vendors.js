const express = require('express');
const router = express.Router();
const { requireAuth, requireOrganization } = require('../middleware/auth');
const { query } = require('../db/connection');

/**
 * Get all vendors for organization
 */
router.get('/', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;

    const { rows: vendors } = await query(
      `SELECT 
         v.*,
         COUNT(DISTINCT i.id) as invoice_count,
         COALESCE(SUM(i.total_discrepancy_amount), 0) as total_overcharges,
         COALESCE(SUM(i.total_amount), 0) as total_invoiced,
         COUNT(DISTINCT pa.id) as price_agreement_count
       FROM vendors v
       LEFT JOIN invoices i ON v.id = i.vendor_id
       LEFT JOIN price_agreements pa ON v.id = pa.vendor_id
       WHERE v.organization_id = $1
       GROUP BY v.id
       ORDER BY v.name`,
      [organizationId]
    );

    // Calculate accuracy percentage
    const vendorsWithStats = vendors.map(v => ({
      ...v,
      total_overcharges: parseFloat(v.total_overcharges),
      total_invoiced: parseFloat(v.total_invoiced),
      accuracy_percentage: v.total_invoiced > 0 
        ? Math.max(0, 100 - (parseFloat(v.total_overcharges) / parseFloat(v.total_invoiced) * 100))
        : 100
    }));

    res.json({ vendors: vendorsWithStats });
  } catch (error) {
    next(error);
  }
});

/**
 * Get single vendor with details
 */
router.get('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.auth.organizationId;

    // Get vendor
    const { rows: [vendor] } = await query(
      'SELECT * FROM vendors WHERE id = $1 AND organization_id = $2',
      [id, organizationId]
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Get price agreements
    const { rows: priceAgreements } = await query(
      `SELECT pa.*, 
              (SELECT COUNT(*) FROM price_agreement_items WHERE price_agreement_id = pa.id) as item_count
       FROM price_agreements pa
       WHERE pa.vendor_id = $1
       ORDER BY pa.effective_date DESC`,
      [id]
    );

    // Get invoices
    const { rows: invoices } = await query(
      `SELECT * FROM invoices 
       WHERE vendor_id = $1 AND organization_id = $2
       ORDER BY invoice_date DESC
       LIMIT 20`,
      [id, organizationId]
    );

    // Get statistics
    const { rows: [stats] } = await query(
      `SELECT 
         COUNT(*) as invoice_count,
         COALESCE(SUM(total_amount), 0) as total_invoiced,
         COALESCE(SUM(total_discrepancy_amount), 0) as total_overcharges,
         AVG(processing_time_ms) as avg_processing_time
       FROM invoices
       WHERE vendor_id = $1 AND organization_id = $2`,
      [id, organizationId]
    );

    res.json({
      vendor,
      priceAgreements,
      invoices,
      stats: {
        ...stats,
        total_invoiced: parseFloat(stats.total_invoiced),
        total_overcharges: parseFloat(stats.total_overcharges),
        accuracy_percentage: stats.total_invoiced > 0 
          ? Math.max(0, 100 - (parseFloat(stats.total_overcharges) / parseFloat(stats.total_invoiced) * 100))
          : 100
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update vendor
 */
router.patch('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;
    const organizationId = req.auth.organizationId;

    const { rows: [vendor] } = await query(
      `UPDATE vendors 
       SET name = COALESCE($1, name),
           address = COALESCE($2, address),
           phone = COALESCE($3, phone),
           email = COALESCE($4, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND organization_id = $6
       RETURNING *`,
      [name, address, phone, email, id, organizationId]
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ vendor });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete vendor (and cascade to related records)
 */
router.delete('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.auth.organizationId;

    const { rowCount } = await query(
      'DELETE FROM vendors WHERE id = $1 AND organization_id = $2',
      [id, organizationId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

