const express = require('express');
const router = express.Router();
const { requireAuth, requireOrganization } = require('../middleware/auth');
const { query } = require('../db/connection');
const { getUsageStats } = require('../services/usageService');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Plan configuration
const PLAN_CONFIG = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    amount: 4900, // $49.00 in cents
    name: 'Starter',
    limit: 50
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    amount: 14900, // $149.00 in cents
    name: 'Pro',
    limit: 300
  }
};

/**
 * Get current subscription details
 */
router.get('/subscription', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;

    const { rows: [subscription] } = await query(
      'SELECT * FROM subscriptions WHERE organization_id = $1 ORDER BY created_at DESC LIMIT 1',
      [organizationId]
    );

    if (!subscription) {
      return res.json({
        planTier: 'free',
        status: 'active',
        limit: 10
      });
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
});

/**
 * Get usage statistics
 */
router.get('/usage', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;
    const usage = await getUsageStats(organizationId);
    res.json(usage);
  } catch (error) {
    next(error);
  }
});

/**
 * Create Stripe checkout session for plan upgrade
 */
router.post('/create-checkout-session', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const { planTier } = req.body; // 'starter' or 'pro'
    const organizationId = req.auth.organizationId;

    if (!['starter', 'pro'].includes(planTier)) {
      return res.status(400).json({ error: 'Invalid plan tier' });
    }

    const plan = PLAN_CONFIG[planTier];

    // Get or create Stripe customer
    let stripeCustomerId;
    const { rows: [existingSubscription] } = await query(
      'SELECT stripe_customer_id FROM subscriptions WHERE organization_id = $1 LIMIT 1',
      [organizationId]
    );

    if (existingSubscription?.stripe_customer_id) {
      stripeCustomerId = existingSubscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: req.auth.email,
        metadata: {
          organizationId,
          userId: req.auth.userId
        }
      });
      stripeCustomerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?upgrade=canceled`,
      metadata: {
        organizationId,
        planTier
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    next(error);
  }
});

/**
 * Create Stripe Customer Portal session
 */
router.post('/create-portal-session', requireAuth, requireOrganization, async (req, res, next) => {
  try {
    const organizationId = req.auth.organizationId;

    // Get Stripe customer ID
    const { rows: [subscription] } = await query(
      'SELECT stripe_customer_id FROM subscriptions WHERE organization_id = $1 LIMIT 1',
      [organizationId]
    );

    if (!subscription?.stripe_customer_id) {
      return res.status(400).json({ 
        error: 'No subscription found. Please upgrade to a paid plan first.' 
      });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/settings?tab=billing`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    next(error);
  }
});

module.exports = router;

