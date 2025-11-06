const express = require('express');
const router = express.Router();
const { requireAuth, requireOrganization } = require('../middleware/auth');
const { query } = require('../db/connection');

/**
 * Get all invoices for organization
 */
router.get('/', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const organizationId = req.auth.organizationId;

    let queryText = `
      SELECT i.*, v.name as vendor_name, v.email as vendor_email,
             (SELECT COUNT(*) FROM discrepancies WHERE invoice_id = i.id AND status = 'open') as open_discrepancy_count
      FROM invoices i
      LEFT JOIN vendors v ON i.vendor_id = v.id
      WHERE i.organization_id = $1
    `;
    const params = [organizationId];

    if (status) {
      queryText += ` AND i.status = $${params.length + 1}`;
      params.push(status);
    }

    queryText += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await query(queryText, params);

    // Get total count
    const { rows: [countRow] } = await query(
      `SELECT COUNT(*) as total FROM invoices WHERE organization_id = $1${status ? ' AND status = $2' : ''}`,
      status ? [organizationId, status] : [organizationId]
    );

    res.json({
      invoices: rows,
      total: parseInt(countRow.total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get single invoice with details
 */
router.get('/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.auth.organizationId;

    // Get invoice
    const { rows: [invoice] } = await query(
      `SELECT i.*, v.name as vendor_name, v.address as vendor_address, 
              v.phone as vendor_phone, v.email as vendor_email
       FROM invoices i
       LEFT JOIN vendors v ON i.vendor_id = v.id
       WHERE i.id = $1 AND i.organization_id = $2`,
      [id, organizationId]
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Get line items
    const { rows: lineItems } = await query(
      'SELECT * FROM invoice_line_items WHERE invoice_id = $1 ORDER BY line_number',
      [id]
    );

    // Get discrepancies
    const { rows: discrepancies } = await query(
      'SELECT * FROM discrepancies WHERE invoice_id = $1 ORDER BY created_at',
      [id]
    );

    // Update onboarding if viewing first discrepancy
    if (discrepancies.length > 0) {
      await query(
        `UPDATE user_onboarding 
         SET first_discrepancy_viewed = true, step_completed = GREATEST(step_completed, 3)
         WHERE user_id = $1`,
        [req.auth.userId]
      );
    }

    res.json({
      invoice,
      lineItems,
      discrepancies
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update invoice status
 */
router.patch('/:id/status', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.auth.organizationId;

    const allowedStatuses = ['processing', 'completed', 'flagged', 'disputed', 'accepted'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { rows: [invoice] } = await query(
      `UPDATE invoices 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND organization_id = $3
       RETURNING *`,
      [status, id, organizationId]
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
});

/**
 * Update discrepancy status
 */
router.patch('/discrepancies/:id', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const organizationId = req.auth.organizationId;

    const allowedStatuses = ['open', 'disputed', 'accepted', 'resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { rows: [discrepancy] } = await query(
      `UPDATE discrepancies 
       SET status = $1, notes = $2, resolved_by = $3, 
           resolved_at = CASE WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END
       WHERE id = $4 AND organization_id = $5
       RETURNING *`,
      [status, notes, req.auth.userId, id, organizationId]
    );

    if (!discrepancy) {
      return res.status(404).json({ error: 'Discrepancy not found' });
    }

    res.json({ discrepancy });
  } catch (error) {
    next(error);
  }
});

/**
 * Get dashboard statistics
 */
router.get('/stats/dashboard', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;

    // Total savings (all time)
    const { rows: [totalSavings] } = await query(
      `SELECT COALESCE(SUM(total_discrepancy_amount), 0) as total
       FROM invoices 
       WHERE organization_id = $1 AND total_discrepancy_amount > 0`,
      [organizationId]
    );

    // This month savings
    const { rows: [monthSavings] } = await query(
      `SELECT COALESCE(SUM(total_discrepancy_amount), 0) as total
       FROM invoices 
       WHERE organization_id = $1 
       AND total_discrepancy_amount > 0
       AND invoice_date >= DATE_TRUNC('month', CURRENT_DATE)`,
      [organizationId]
    );

    // Invoice counts by status
    const { rows: statusCounts } = await query(
      `SELECT status, COUNT(*) as count
       FROM invoices
       WHERE organization_id = $1
       GROUP BY status`,
      [organizationId]
    );

    // Recent invoices with issues
    const { rows: recentIssues } = await query(
      `SELECT i.id, i.invoice_number, i.invoice_date, i.total_discrepancy_amount,
              v.name as vendor_name
       FROM invoices i
       LEFT JOIN vendors v ON i.vendor_id = v.id
       WHERE i.organization_id = $1 AND i.has_discrepancies = true
       ORDER BY i.created_at DESC
       LIMIT 5`,
      [organizationId]
    );

    // Monthly trend (last 6 months)
    const { rows: monthlyTrend } = await query(
      `SELECT 
         DATE_TRUNC('month', invoice_date) as month,
         COUNT(*) as invoice_count,
         COALESCE(SUM(total_discrepancy_amount), 0) as savings
       FROM invoices
       WHERE organization_id = $1
       AND invoice_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
       GROUP BY DATE_TRUNC('month', invoice_date)
       ORDER BY month`,
      [organizationId]
    );

    res.json({
      totalSavings: parseFloat(totalSavings.total),
      monthSavings: parseFloat(monthSavings.total),
      statusCounts,
      recentIssues,
      monthlyTrend
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

