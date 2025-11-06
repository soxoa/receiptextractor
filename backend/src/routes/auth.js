const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { query } = require('../db/connection');

/**
 * Verify authentication and return user info
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    res.json({
      userId: req.auth.userId,
      organizationId: req.auth.organizationId,
      organizationRole: req.auth.organizationRole,
      email: req.auth.email
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Initialize organization (called after Clerk org creation)
 */
router.post('/init-organization', requireAuth, async (req, res, next) => {
  try {
    const { organizationId, organizationName } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Create organization record
    await query(
      `INSERT INTO organizations (id, name, owner_user_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = $2`,
      [organizationId, organizationName || 'My Organization', req.auth.userId]
    );

    // Create initial subscription (free tier)
    await query(
      `INSERT INTO subscriptions (organization_id, plan_tier, status)
       VALUES ($1, 'free', 'active')
       ON CONFLICT DO NOTHING`,
      [organizationId]
    );

    // Initialize usage tracking for current month
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    await query(
      `INSERT INTO usage_tracking (organization_id, month, invoice_count)
       VALUES ($1, $2, 0)
       ON CONFLICT DO NOTHING`,
      [organizationId, currentMonth]
    );

    // Create onboarding record
    await query(
      `INSERT INTO user_onboarding (user_id, organization_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.auth.userId, organizationId]
    );

    res.json({ 
      success: true, 
      message: 'Organization initialized',
      organizationId 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

