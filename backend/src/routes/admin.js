const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { query } = require('../db/connection');

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

/**
 * Get dashboard overview stats
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    // Total users
    const { rows: [userStats] } = await query(
      `SELECT 
         COUNT(*) as total_users,
         COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as users_last_7_days,
         COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as users_last_30_days
       FROM users`
    );

    // Total organizations
    const { rows: [orgStats] } = await query(
      `SELECT 
         COUNT(*) as total_organizations,
         COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as orgs_last_7_days
       FROM organizations`
    );

    // Subscription stats
    const { rows: subscriptionBreakdown } = await query(
      `SELECT 
         plan_tier,
         COUNT(*) as count,
         SUM(CASE 
           WHEN plan_tier = 'starter' THEN 49
           WHEN plan_tier = 'pro' THEN 149
           ELSE 0
         END) as revenue
       FROM subscriptions
       WHERE status = 'active'
       GROUP BY plan_tier`
    );

    // Calculate MRR
    const totalMRR = subscriptionBreakdown.reduce((sum, tier) => sum + parseFloat(tier.revenue || 0), 0);

    // Invoice processing stats
    const { rows: [invoiceStats] } = await query(
      `SELECT 
         COUNT(*) as total_invoices,
         COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as invoices_last_7_days,
         COUNT(CASE WHEN has_discrepancies = true THEN 1 END) as invoices_with_issues,
         COALESCE(SUM(total_discrepancy_amount), 0) as total_savings_found
       FROM invoices`
    );

    // Recent activity
    const { rows: recentUsers } = await query(
      `SELECT id, email, name, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    // System health
    const { rows: [systemStats] } = await query(
      `SELECT 
         (SELECT COUNT(*) FROM invoices WHERE status = 'processing') as processing_invoices,
         (SELECT AVG(processing_time_ms) FROM invoices WHERE processing_time_ms IS NOT NULL) as avg_processing_time,
         (SELECT COUNT(*) FROM emails WHERE status = 'failed') as failed_emails
       FROM users LIMIT 1`
    );

    res.json({
      users: {
        total: parseInt(userStats.total_users),
        last7Days: parseInt(userStats.users_last_7_days),
        last30Days: parseInt(userStats.users_last_30_days)
      },
      organizations: {
        total: parseInt(orgStats.total_organizations),
        last7Days: parseInt(orgStats.orgs_last_7_days)
      },
      revenue: {
        mrr: totalMRR,
        arr: totalMRR * 12,
        subscriptionBreakdown: subscriptionBreakdown.map(tier => ({
          plan: tier.plan_tier,
          count: parseInt(tier.count),
          revenue: parseFloat(tier.revenue)
        }))
      },
      invoices: {
        total: parseInt(invoiceStats.total_invoices),
        last7Days: parseInt(invoiceStats.invoices_last_7_days),
        withIssues: parseInt(invoiceStats.invoices_with_issues),
        totalSavings: parseFloat(invoiceStats.total_savings_found)
      },
      system: {
        processingInvoices: parseInt(systemStats.processing_invoices || 0),
        avgProcessingTime: parseFloat(systemStats.avg_processing_time || 0),
        failedEmails: parseInt(systemStats.failed_emails || 0)
      },
      recentUsers
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all users with their organizations
 */
router.get('/users', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { rows: users } = await query(
      `SELECT 
         u.id, u.email, u.name, u.is_admin, u.created_at, u.last_login,
         (SELECT COUNT(*) FROM organization_members WHERE user_id = u.id) as org_count,
         (SELECT COUNT(*) FROM invoices i 
          JOIN organizations o ON i.organization_id = o.id 
          JOIN organization_members om ON o.id = om.organization_id 
          WHERE om.user_id = u.id) as invoice_count
       FROM users u
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const { rows: [count] } = await query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      total: parseInt(count.total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all organizations with details
 */
router.get('/organizations', async (req, res, next) => {
  try {
    const { rows: organizations } = await query(
      `SELECT 
         o.id, o.name, o.created_at,
         u.email as owner_email,
         u.name as owner_name,
         s.plan_tier, s.status as subscription_status,
         (SELECT COUNT(*) FROM organization_members WHERE organization_id = o.id) as member_count,
         (SELECT COUNT(*) FROM invoices WHERE organization_id = o.id) as invoice_count,
         (SELECT COUNT(*) FROM vendors WHERE organization_id = o.id) as vendor_count,
         (SELECT COALESCE(SUM(total_discrepancy_amount), 0) FROM invoices WHERE organization_id = o.id) as total_savings
       FROM organizations o
       LEFT JOIN users u ON o.owner_user_id = u.id
       LEFT JOIN subscriptions s ON o.id = s.organization_id AND s.status = 'active'
       ORDER BY o.created_at DESC`
    );

    res.json({ organizations });
  } catch (error) {
    next(error);
  }
});

/**
 * Get activity feed
 */
router.get('/activity', async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    // Recent signups
    const { rows: signups } = await query(
      `SELECT 'signup' as type, id, email, name, created_at as timestamp
       FROM users
       ORDER BY created_at DESC
       LIMIT 10`
    );

    // Recent invoice uploads
    const { rows: uploads } = await query(
      `SELECT 'invoice' as type, i.id, i.invoice_number, i.created_at as timestamp,
              o.name as organization_name, v.name as vendor_name, i.has_discrepancies
       FROM invoices i
       JOIN organizations o ON i.organization_id = o.id
       LEFT JOIN vendors v ON i.vendor_id = v.id
       ORDER BY i.created_at DESC
       LIMIT 10`
    );

    // Recent subscription changes
    const { rows: subscriptions } = await query(
      `SELECT 'subscription' as type, s.id, s.plan_tier, s.created_at as timestamp,
              o.name as organization_name
       FROM subscriptions s
       JOIN organizations o ON s.organization_id = o.id
       WHERE s.plan_tier != 'free'
       ORDER BY s.created_at DESC
       LIMIT 10`
    );

    // Merge and sort by timestamp
    const allActivity = [...signups, ...uploads, ...subscriptions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({ activity: allActivity });
  } catch (error) {
    next(error);
  }
});

/**
 * Get revenue analytics
 */
router.get('/revenue', async (req, res, next) => {
  try {
    // Current MRR by plan
    const { rows: mrrByPlan } = await query(
      `SELECT 
         plan_tier,
         COUNT(*) as customer_count,
         SUM(CASE 
           WHEN plan_tier = 'starter' THEN 49
           WHEN plan_tier = 'pro' THEN 149
           ELSE 0
         END) as mrr
       FROM subscriptions
       WHERE status = 'active'
       GROUP BY plan_tier`
    );

    const totalMRR = mrrByPlan.reduce((sum, tier) => sum + parseFloat(tier.mrr || 0), 0);

    // Monthly revenue trend (last 6 months)
    const { rows: revenueHistory } = await query(
      `SELECT 
         DATE_TRUNC('month', created_at) as month,
         COUNT(*) as new_subscriptions,
         SUM(CASE 
           WHEN plan_tier = 'starter' THEN 49
           WHEN plan_tier = 'pro' THEN 149
           ELSE 0
         END) as revenue
       FROM subscriptions
       WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
       AND plan_tier != 'free'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC`
    );

    // Churn analysis
    const { rows: [churnStats] } = await query(
      `SELECT 
         COUNT(*) as canceled_subscriptions,
         COUNT(CASE WHEN updated_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as canceled_last_30_days
       FROM subscriptions
       WHERE status = 'canceled' AND plan_tier != 'free'`
    );

    res.json({
      mrr: {
        total: totalMRR,
        arr: totalMRR * 12,
        byPlan: mrrByPlan.map(tier => ({
          plan: tier.plan_tier,
          customerCount: parseInt(tier.customer_count),
          mrr: parseFloat(tier.mrr)
        }))
      },
      history: revenueHistory,
      churn: {
        totalCanceled: parseInt(churnStats.canceled_subscriptions || 0),
        last30Days: parseInt(churnStats.canceled_last_30_days || 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get system health metrics
 */
router.get('/health', async (req, res, next) => {
  try {
    // Database size
    const { rows: [dbSize] } = await query(
      `SELECT pg_size_pretty(pg_database_size(current_database())) as size`
    );

    // Table row counts
    const { rows: [counts] } = await query(
      `SELECT 
         (SELECT COUNT(*) FROM users) as users,
         (SELECT COUNT(*) FROM organizations) as organizations,
         (SELECT COUNT(*) FROM invoices) as invoices,
         (SELECT COUNT(*) FROM vendors) as vendors,
         (SELECT COUNT(*) FROM price_agreements) as price_agreements,
         (SELECT COUNT(*) FROM emails) as emails`
    );

    // Recent errors
    const { rows: failedEmails } = await query(
      `SELECT recipient_email, subject, sent_at, status
       FROM emails
       WHERE status IN ('failed', 'bounced')
       ORDER BY sent_at DESC
       LIMIT 10`
    );

    // Processing performance
    const { rows: [performance] } = await query(
      `SELECT 
         AVG(processing_time_ms) as avg_processing_time,
         MAX(processing_time_ms) as max_processing_time,
         MIN(processing_time_ms) as min_processing_time
       FROM invoices
       WHERE processing_time_ms IS NOT NULL
       AND created_at >= CURRENT_DATE - INTERVAL '7 days'`
    );

    res.json({
      database: {
        size: dbSize.size,
        counts: {
          users: parseInt(counts.users),
          organizations: parseInt(counts.organizations),
          invoices: parseInt(counts.invoices),
          vendors: parseInt(counts.vendors),
          priceAgreements: parseInt(counts.price_agreements),
          emails: parseInt(counts.emails)
        }
      },
      performance: {
        avgProcessingTime: parseFloat(performance.avg_processing_time || 0),
        maxProcessingTime: parseFloat(performance.max_processing_time || 0),
        minProcessingTime: parseFloat(performance.min_processing_time || 0)
      },
      errors: {
        failedEmails
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get user details with full activity
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows: [user] } = await query(
      `SELECT u.*, 
              (SELECT json_agg(o.*) FROM organizations o 
               JOIN organization_members om ON o.id = om.organization_id 
               WHERE om.user_id = u.id) as organizations
       FROM users u
       WHERE u.id = $1`,
      [id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's invoice activity
    const { rows: invoices } = await query(
      `SELECT i.*, v.name as vendor_name, o.name as organization_name
       FROM invoices i
       JOIN organizations o ON i.organization_id = o.id
       JOIN organization_members om ON o.id = om.organization_id
       LEFT JOIN vendors v ON i.vendor_id = v.id
       WHERE om.user_id = $1
       ORDER BY i.created_at DESC
       LIMIT 20`,
      [id]
    );

    res.json({
      user,
      invoices
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user (e.g., make admin, ban, etc.)
 */
router.patch('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_admin } = req.body;

    const { rows: [user] } = await query(
      `UPDATE users 
       SET is_admin = COALESCE($1, is_admin),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [is_admin, id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

