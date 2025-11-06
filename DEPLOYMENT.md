# Deployment Guide

Quick reference for deploying ReceiptExtractor to production.

## Backend Deployment (Railway)

### Initial Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
git push origin main
```

### Environment Variables

Required in Railway:

```bash
DATABASE_URL=postgresql://...  # Auto-set by Railway
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
RESEND_API_KEY=re_...
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=3001
```

### Database Migrations

```bash
railway run npm run migrate
```

### View Logs

```bash
railway logs
```

## Frontend Deployment (Vercel)

### Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

### Environment Variables

Required in Vercel:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=https://your-app.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Production Deploy

```bash
vercel --prod
```

## Post-Deployment

### 1. Configure Stripe Webhook

```
URL: https://your-app.railway.app/api/webhooks/stripe
Events: checkout.session.completed, customer.subscription.*, invoice.*
```

### 2. Update Clerk URLs

```
Authorized domains: your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/dashboard
```

### 3. Verify Resend Domain

Add DNS records in Resend dashboard.

## Continuous Deployment

Both Railway and Vercel automatically deploy on push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Rollback

### Railway
```bash
railway rollback
```

### Vercel
Use Vercel dashboard to rollback to previous deployment.

## Health Checks

```bash
# Backend
curl https://your-app.railway.app/health

# Frontend
curl https://your-app.vercel.app
```

## Monitoring

- **Railway**: Dashboard → Metrics
- **Vercel**: Dashboard → Analytics
- **Stripe**: Dashboard → Developers → Webhooks
- **Resend**: Dashboard → Logs

