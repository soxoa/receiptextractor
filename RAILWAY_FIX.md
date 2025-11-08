# 🚂 Railway Deployment Fix

## ❌ Current Issue

Railway is trying to build from the **root directory** but needs to build from the **backend directory**.

## ✅ Solution: Configure Railway Project Settings

### Step 1: Update Service Settings in Railway Dashboard

1. Go to your Railway project: https://railway.app/project/[your-project-id]
2. Click on your **receiptextractor** service
3. Click **Settings** tab
4. Under **Build & Deploy** section:
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
5. Click **Save**

### Step 2: Verify Environment Variables

Make sure these are set in Railway:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-set by Railway
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...  # ⚠️ Create in Stripe
STRIPE_PRO_PRICE_ID=price_...      # ⚠️ Create in Stripe
RESEND_API_KEY=re_...
FRONTEND_URL=https://receiptextractor.com
NODE_ENV=production
PORT=3001
```

### Step 3: Trigger Redeploy

1. In Railway dashboard, click **Deploy** → **Redeploy**
2. Or push a new commit to trigger auto-deploy

## 🔧 Alternative: Use Railway CLI

If you prefer CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory
railway up --service receiptextractor --directory backend
```

## 📋 Expected Build Output

After fixing, you should see:
```
✅ Building...
✅ Installing dependencies (npm install)
✅ Starting server (npm start)
✅ Server running on port 3001
✅ Deployment successful
```

## 🐛 If Still Failing

### Check the build logs for:

1. **Missing dependencies**: Make sure `backend/package.json` has all dependencies
2. **Database connection**: Ensure `DATABASE_URL` is set correctly
3. **Port binding**: Railway expects the app to listen on `process.env.PORT`

### Common Issues:

**Issue**: "Cannot find module 'express'"
- **Fix**: Ensure `npm install` is running in backend directory

**Issue**: "Address already in use"
- **Fix**: Use `process.env.PORT || 3001` in server.js (✅ already done)

**Issue**: "Database connection failed"
- **Fix**: Make sure PostgreSQL service is running and `DATABASE_URL` is set

## 📞 Need Help?

Check Railway logs:
```bash
railway logs
```

Or view in dashboard: **Service → Logs**

---

## ✅ Quick Checklist

- [ ] Set Root Directory to `backend` in Railway settings
- [ ] Verify all environment variables are set
- [ ] Add Stripe Price IDs (create products first)
- [ ] Trigger redeploy
- [ ] Check deployment logs
- [ ] Test health endpoint: `https://your-app.railway.app/health`

Once Railway shows "Deployment successful", your backend is live! 🚀

