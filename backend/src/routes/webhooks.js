const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe webhook handler
 * IMPORTANT: Must use raw body, not JSON parsed
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session) {
  const organizationId = session.metadata.organizationId;
  const planTier = session.metadata.planTier;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create or update subscription record
  await query(
    `INSERT INTO subscriptions 
     (organization_id, stripe_customer_id, stripe_subscription_id, plan_tier, status, 
      current_period_start, current_period_end)
     VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7))
     ON CONFLICT (organization_id) 
     DO UPDATE SET 
       stripe_customer_id = $2,
       stripe_subscription_id = $3,
       plan_tier = $4,
       status = $5,
       current_period_start = to_timestamp($6),
       current_period_end = to_timestamp($7),
       updated_at = CURRENT_TIMESTAMP`,
    [
      organizationId,
      customerId,
      subscriptionId,
      planTier,
      subscription.status,
      subscription.current_period_start,
      subscription.current_period_end
    ]
  );

  console.log(`Subscription created for org ${organizationId}: ${planTier}`);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;

  // Find organization by customer ID
  const { rows: [existingSub] } = await query(
    'SELECT organization_id FROM subscriptions WHERE stripe_customer_id = $1',
    [customerId]
  );

  if (!existingSub) {
    console.error('Subscription not found for customer:', customerId);
    return;
  }

  // Update subscription
  await query(
    `UPDATE subscriptions 
     SET status = $1,
         current_period_start = to_timestamp($2),
         current_period_end = to_timestamp($3),
         cancel_at_period_end = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_customer_id = $5`,
    [
      subscription.status,
      subscription.current_period_start,
      subscription.current_period_end,
      subscription.cancel_at_period_end,
      customerId
    ]
  );

  console.log(`Subscription updated for customer ${customerId}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  // Downgrade to free tier
  await query(
    `UPDATE subscriptions 
     SET plan_tier = 'free',
         status = 'canceled',
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_customer_id = $1`,
    [customerId]
  );

  console.log(`Subscription canceled for customer ${customerId}, downgraded to free`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  
  console.log(`Payment succeeded for customer ${customerId}: $${(invoice.amount_paid / 100).toFixed(2)}`);
  
  // Could send receipt email here via Resend
  // For now, Stripe handles receipt emails
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  console.log(`Payment failed for customer ${customerId}`);

  // Update subscription status
  await query(
    `UPDATE subscriptions 
     SET status = 'past_due',
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_customer_id = $1`,
    [customerId]
  );

  // Could send alert email here
}

module.exports = router;

