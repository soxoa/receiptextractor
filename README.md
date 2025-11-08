# ReceiptExtractor - Invoice Verification SaaS

Automatically catch vendor overcharges by comparing invoices against negotiated pricing contracts.

## 🚀 Features

- **AI-Powered Extraction**: Claude AI extracts pricing data from PDFs, images, and Excel files
- **Automatic Verification**: Compare invoices against contracted pricing agreements
- **Real-time Alerts**: Email notifications when discrepancies are found
- **Multi-tenant**: Organization support with team collaboration via Clerk
- **Subscription Billing**: Flexible pricing tiers with Stripe integration
- **Beautiful UI**: Modern Next.js frontend with Shadcn/UI components

## 📁 Repository Structure

```
/
├── backend/          # Node.js/Express API (Railway deployment)
├── frontend/         # Next.js 14 App Router (Vercel deployment)
├── shared/           # TypeScript types shared between backend/frontend
├── emails/           # React Email templates for Resend
└── README.md         # This file
```

## 🛠 Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- Anthropic Claude API for document extraction
- Deployed on Railway

### Frontend
- Next.js 14 with App Router
- Shadcn/UI components + Tailwind CSS
- Deployed on Vercel

### Third-Party Services
- **Clerk**: Authentication and organization management
- **Stripe**: Subscription billing and payments
- **Resend**: Transactional email delivery
- **Anthropic Claude**: AI document extraction

## 📊 Pricing Tiers

| Plan | Price | Invoices/Month | Features |
|------|-------|----------------|----------|
| Free | $0 | 10 | All features unlocked |
| Starter | $49 | 50 | Email alerts, Priority support, Analytics |
| Pro | $149 | 300 | Multi-user, API access, Priority processing |
| Enterprise | Custom | Unlimited | Dedicated support, Custom integrations |

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys from: Clerk, Stripe, Anthropic, Resend

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/receiptextractor
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

### Frontend (.env.local)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🚢 Deployment

### Backend to Railway

1. Connect GitHub repo to Railway
2. Create new project with PostgreSQL addon
3. Set root directory to `/backend`
4. Configure environment variables
5. Railway auto-deploys on push to main

### Frontend to Vercel

1. Import GitHub repo to Vercel
2. Set root directory to `/frontend`
3. Configure environment variables
4. Vercel auto-deploys on push to main

### Post-Deployment Configuration

1. **Stripe Webhooks**: Add endpoint at `https://your-app.railway.app/api/webhooks/stripe`
2. **Clerk Redirect URLs**: Add production URLs in Clerk dashboard
3. **Resend Domain**: Verify your sending domain

## 📈 Database Schema

Key tables:
- `organizations` - Multi-tenant organization data
- `vendors` - Vendor information extracted from documents
- `price_agreements` - Contracted pricing data
- `invoices` - Uploaded invoices
- `invoice_line_items` - Individual line items from invoices
- `discrepancies` - Flagged overcharges
- `subscriptions` - Stripe subscription data
- `usage_tracking` - Monthly invoice counts per organization

## 🎯 Development Workflow

1. Create feature branch from `main`
2. Develop locally with hot reload
3. Test with Stripe CLI webhooks: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
4. Push to GitHub
5. Railway and Vercel auto-deploy

## 📧 Email Templates

Transactional emails via Resend:
- Welcome email after signup
- Discrepancy alerts
- Weekly savings summary
- Processing complete notifications
- Billing receipts

## 🔒 Security

- Clerk JWT verification on all backend routes
- Stripe webhook signature verification
- Organization-scoped database queries (multi-tenant isolation)
- Rate limiting on API endpoints
- File upload validation

## 📊 Success Metrics

- Time to first value: <2 minutes
- Extraction accuracy: >95%
- Average processing time: <10 seconds per invoice
- Uptime: 99.9%

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [Link to docs]
- Email: support@receiptextractor.com
- Issues: GitHub Issues

---

Built with ❤️ to help businesses stop overpaying vendors.

