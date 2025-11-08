# 🔐 Fix Clerk 404 Errors

## ❌ Current Issue
Getting 404 on `/sign-in` and `/sign-up` links.

## ✅ Solution: Configure Clerk Dashboard

### Step 1: Add Vercel URLs to Clerk

1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to **Settings** → **Paths**
4. Add these URLs:

#### **Authorized Domains:**
```
frontend-3ah3khpsj-john-7215s-projects.vercel.app
frontend-one-tau-98.vercel.app
frontend-john-7215s-projects.vercel.app
```

#### **Redirect URLs (After Sign In):**
```
https://frontend-3ah3khpsj-john-7215s-projects.vercel.app/dashboard
https://frontend-one-tau-98.vercel.app/dashboard
https://frontend-john-7215s-projects.vercel.app/dashboard
```

#### **Redirect URLs (After Sign Up):**
```
https://frontend-3ah3khpsj-john-7215s-projects.vercel.app/dashboard
https://frontend-one-tau-98.vercel.app/dashboard
https://frontend-john-7215s-projects.vercel.app/dashboard
```

### Step 2: Enable Sign-In and Sign-Up Components

1. In Clerk Dashboard, go to **User & Authentication** → **Email, Phone, Username**
2. Make sure these are enabled:
   - ✅ Email address
   - ✅ Password
3. Go to **SSO Connections** (optional):
   - ✅ Google OAuth
   - ✅ Microsoft OAuth

### Step 3: Configure Sign In/Up Pages

1. In Clerk Dashboard, go to **Paths**
2. Set these paths:
   - **Sign-in page**: `/sign-in`
   - **Sign-up page**: `/sign-up`
   - **After sign-in redirect**: `/dashboard`
   - **After sign-up redirect**: `/dashboard`

---

## 🔗 **Your Live URLs:**

**Frontend:** https://frontend-3ah3khpsj-john-7215s-projects.vercel.app
**Backend:** https://receiptextractor-production.up.railway.app

**Alias URLs (also work):**
- https://frontend-one-tau-98.vercel.app
- https://frontend-john-7215s-projects.vercel.app

---

## ✅ **Test After Setup:**

1. Visit: https://frontend-3ah3khpsj-john-7215s-projects.vercel.app
2. Click "Get Started"
3. Should see Clerk sign-up form
4. Complete registration
5. Should redirect to `/dashboard`

---

## 🎯 **Quick Checklist:**

- [ ] Add all Vercel URLs to Clerk authorized domains
- [ ] Set redirect URLs in Clerk
- [ ] Enable email/password authentication
- [ ] Test sign-up flow
- [ ] Test sign-in flow

Once configured, the 404 errors will be gone! 🎉

