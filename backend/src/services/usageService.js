const { query } = require('../db/connection');

// Plan limits
const PLAN_LIMITS = {
  free: 10,
  starter: 100,
  pro: 500,
  enterprise: 999999 // Effectively unlimited
};

/**
 * Check if organization can process more invoices this month
 */
async function canProcessInvoice(organizationId) {
  try {
    // Get current subscription
    const { rows: [subscription] } = await query(
      `SELECT plan_tier, status FROM subscriptions 
       WHERE organization_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [organizationId]
    );

    const planTier = subscription?.plan_tier || 'free';
    const limit = PLAN_LIMITS[planTier];

    // Get current month usage
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    const { rows: [usage] } = await query(
      `SELECT invoice_count FROM usage_tracking 
       WHERE organization_id = $1 AND month = $2`,
      [organizationId, currentMonth]
    );

    const currentCount = usage?.invoice_count || 0;

    return {
      allowed: currentCount < limit,
      currentCount,
      limit,
      planTier,
      remaining: Math.max(0, limit - currentCount),
      upgradeRequired: currentCount >= limit
    };
  } catch (error) {
    console.error('Error checking usage:', error);
    throw error;
  }
}

/**
 * Increment invoice count for organization
 */
async function incrementUsage(organizationId) {
  try {
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';

    await query(
      `INSERT INTO usage_tracking (organization_id, month, invoice_count)
       VALUES ($1, $2, 1)
       ON CONFLICT (organization_id, month)
       DO UPDATE SET invoice_count = usage_tracking.invoice_count + 1`,
      [organizationId, currentMonth]
    );

    console.log(`Incremented usage for org ${organizationId}`);
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
}

/**
 * Get usage statistics for an organization
 */
async function getUsageStats(organizationId) {
  try {
    // Current month
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    const { rows: [currentUsage] } = await query(
      `SELECT invoice_count FROM usage_tracking 
       WHERE organization_id = $1 AND month = $2`,
      [organizationId, currentMonth]
    );

    // Get subscription
    const { rows: [subscription] } = await query(
      `SELECT plan_tier, status FROM subscriptions 
       WHERE organization_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [organizationId]
    );

    const planTier = subscription?.plan_tier || 'free';
    const limit = PLAN_LIMITS[planTier];
    const currentCount = currentUsage?.invoice_count || 0;

    // Last 6 months history
    const { rows: history } = await query(
      `SELECT month, invoice_count 
       FROM usage_tracking 
       WHERE organization_id = $1 
       AND month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
       ORDER BY month DESC`,
      [organizationId]
    );

    return {
      currentMonth: {
        count: currentCount,
        limit,
        remaining: Math.max(0, limit - currentCount),
        percentUsed: Math.min(100, Math.round((currentCount / limit) * 100))
      },
      planTier,
      history
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
}

/**
 * Reset usage for a new month (called by cron job)
 */
async function resetMonthlyUsage() {
  try {
    const currentMonth = new Date().toISOString().substring(0, 7) + '-01';
    
    // This doesn't delete old data, just ensures new month row exists
    await query(
      `INSERT INTO usage_tracking (organization_id, month, invoice_count)
       SELECT DISTINCT organization_id, $1::date, 0
       FROM organizations
       ON CONFLICT (organization_id, month) DO NOTHING`,
      [currentMonth]
    );

    console.log('Monthly usage reset completed');
  } catch (error) {
    console.error('Error resetting monthly usage:', error);
    throw error;
  }
}

module.exports = {
  canProcessInvoice,
  incrementUsage,
  getUsageStats,
  resetMonthlyUsage,
  PLAN_LIMITS
};

