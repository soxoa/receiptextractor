# ReceiptExtractor - Complete Setup Guide

This guide will walk you through setting up the entire ReceiptExtractor application from scratch.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git installed
- Accounts on the following services:
  - [Clerk](https://clerk.com) - Authentication
  - [Stripe](https://stripe.com) - Payments
  - [Anthropic](https://console.anthropic.com) - AI API
  - [Resend](https://resend.com) - Email
  - [Railway](https://railway.app) - Backend hosting
  - [Vercel](https://vercel.com) - Frontend hosting

## Step 1: Clone the Repository

```bash
git clone https://github.com/soxoa/receiptextractor.git
cd receiptextractor
```

## Step 2: Set Up Third-Party Services

### 2.1 Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Enable email/password, Google, and Microsoft authentication
4. Enable Organizations feature
5. Copy your:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2.2 Stripe (Payments)

1. Go to [stripe.com](https://stripe.com) and create an account
2. Create products and prices:
   - **Starter Plan**: $99/month recurring
   - **Pro Plan**: $299/month recurring
3. Copy the Price IDs for each plan
4. Set up webhook endpoint (you'll add this after deploying to Railway)
5. Copy your:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET` (from webhook settings)

### 2.3 Anthropic (AI)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy your:
   - `ANTHROPIC_API_KEY`

### 2.4 Resend (Email)

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (or use their test domain)
3. Create an API key
4. Copy your:
   - `RESEND_API_KEY`

## Step 3: Backend Setup

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

### 3.2 Configure Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/receiptextractor

# Anthropic Claude AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_your-key-here

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-secret-here
STRIPE_STARTER_PRICE_ID=price_your-starter-price-id
STRIPE_PRO_PRICE_ID=price_your-pro-price-id

# Resend Email
RESEND_API_KEY=re_your-key-here

# App Configuration
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

### 3.3 Set Up Database

Run migrations:

```bash
npm run migrate
```

### 3.4 Test Backend Locally

```bash
npm run dev
```

Backend should be running at `http://localhost:3001`

## Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd ../frontend
npm install
```

### 4.2 Configure Environment Variables

Create `frontend/.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-key-here
CLERK_SECRET_KEY=sk_live_your-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-key-here
```

### 4.3 Test Frontend Locally

```bash
npm run dev
```

Frontend should be running at `http://localhost:3000`

## Step 5: Test Full Flow Locally

1. Open `http://localhost:3000`
2. Sign up for an account via Clerk
3. Create or join an organization
4. Upload a pricing agreement (PDF or image)
5. Upload an invoice from the same vendor
6. Verify discrepancies are detected

## Step 6: Deploy to Railway (Backend)

### 6.1 Connect GitHub Repository

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `/backend` directory as root

### 6.2 Add PostgreSQL Service

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for it to provision

### 6.3 Configure Environment Variables

In Railway, add all environment variables from your local `.env` file:

- `DATABASE_URL` (automatically set by Railway)
- `ANTHROPIC_API_KEY`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `FRONTEND_URL` (will be your Vercel URL)
- `NODE_ENV=production`

### 6.4 Deploy

Railway will automatically deploy on push to `main` branch.

Your backend will be available at: `https://your-app.railway.app`

### 6.5 Run Database Migrations

In Railway dashboard:
1. Go to your backend service
2. Click "Deploy Logs"
3. If migrations didn't run automatically, use the Railway CLI:

```bash
railway link
railway run npm run migrate
```

## Step 7: Deploy to Vercel (Frontend)

### 7.1 Import Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `/frontend`
4. Framework preset: Next.js

### 7.2 Configure Environment Variables

Add these in Vercel project settings:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL` (your Railway backend URL)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 7.3 Deploy

Vercel will automatically build and deploy.

Your frontend will be available at: `https://your-project.vercel.app`

## Step 8: Post-Deployment Configuration

### 8.1 Update Clerk Settings

1. Go to Clerk dashboard
2. Add your production URLs:
   - Authorized domains: `your-project.vercel.app`
   - Authorized redirect URLs: `https://your-project.vercel.app/dashboard`

### 8.2 Configure Stripe Webhooks

1. Go to Stripe dashboard
2. Create webhook endpoint: `https://your-app.railway.app/api/webhooks/stripe`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret and update `STRIPE_WEBHOOK_SECRET` in Railway

### 8.3 Update Railway Environment

Update `FRONTEND_URL` in Railway to your Vercel URL:
```
FRONTEND_URL=https://your-project.vercel.app
```

### 8.4 Test Stripe Webhooks Locally (Optional)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local backend
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

## Step 9: Verify Deployment

1. Visit your Vercel URL
2. Sign up for an account
3. Upload a test pricing agreement
4. Upload a test invoice
5. Verify email notifications are sent
6. Test upgrading to a paid plan (use Stripe test mode)
7. Verify webhook events are received (check Railway logs)

## Step 10: Production Checklist

- [ ] All environment variables are set correctly
- [ ] Database migrations have run successfully
- [ ] Clerk authentication works in production
- [ ] Stripe checkout works in production
- [ ] Stripe webhooks are being received
- [ ] Resend emails are being delivered
- [ ] File uploads work correctly
- [ ] Claude API is responding (check quotas)
- [ ] All pages load without errors
- [ ] Test the complete user flow

## Monitoring & Maintenance

### Railway (Backend)

- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel (Frontend)

- View deployment logs
- Monitor performance with Analytics
- Set up error tracking (Sentry recommended)

### Stripe

- Monitor webhook deliveries
- Check for failed payments
- Review subscription metrics

### Resend

- Monitor email delivery rates
- Check bounce and complaint rates

## Troubleshooting

### Backend Issues

**Database connection fails:**
- Check `DATABASE_URL` is correct
- Verify PostgreSQL service is running in Railway
- Run migrations: `railway run npm run migrate`

**Clerk authentication fails:**
- Verify `CLERK_SECRET_KEY` is correct
- Check that authorized domains are configured

**File uploads fail:**
- Check file size limits (50MB default)
- Verify temporary directory permissions

### Frontend Issues

**API calls fail:**
- Verify `NEXT_PUBLIC_API_URL` points to Railway backend
- Check CORS settings in backend
- Verify Clerk token is being sent

**Stripe checkout doesn't work:**
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is correct
- Verify Stripe price IDs are valid
- Test with Stripe test mode first

### Email Issues

**Emails not sending:**
- Verify `RESEND_API_KEY` is correct
- Check domain verification in Resend
- Review Resend logs for errors

## Cost Estimates (Monthly)

- **Railway**: ~$20-50 (depending on usage)
- **Vercel**: Free tier sufficient for MVP, Pro at $20/month
- **Clerk**: Free up to 10,000 MAU
- **Stripe**: 2.9% + $0.30 per transaction
- **Anthropic Claude**: ~$0.03 per invoice (varies by document size)
- **Resend**: Free up to 3,000 emails/month

**Total estimated monthly cost for MVP: $50-100**

## Support

For issues:
1. Check Railway and Vercel logs
2. Review Stripe webhook events
3. Check Resend email logs
4. Review Claude API usage

Need help? Open an issue on GitHub.

---

**Congratulations!** Your ReceiptExtractor application is now deployed and ready to catch overcharges! 🚀

