require('dotenv').config();
const { query } = require('./connection');

const migrations = `
-- Organizations (cached from Clerk)
CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions (Stripe)
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_tier VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro', 'enterprise')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- Usage Tracking
CREATE TABLE IF NOT EXISTS usage_tracking (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  invoice_count INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, month)
);

CREATE INDEX IF NOT EXISTS idx_usage_org_month ON usage_tracking(organization_id, month);

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  external_id VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendors_org ON vendors(organization_id);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(organization_id, name);

-- Price Agreements
CREATE TABLE IF NOT EXISTS price_agreements (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  effective_date DATE,
  expiration_date DATE,
  file_url TEXT,
  extracted_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_price_agreements_org ON price_agreements(organization_id);
CREATE INDEX IF NOT EXISTS idx_price_agreements_vendor ON price_agreements(vendor_id);

-- Price Agreement Line Items
CREATE TABLE IF NOT EXISTS price_agreement_items (
  id SERIAL PRIMARY KEY,
  price_agreement_id INTEGER NOT NULL REFERENCES price_agreements(id) ON DELETE CASCADE,
  item_code VARCHAR(255),
  item_description TEXT,
  unit_price DECIMAL(10, 2),
  unit_of_measure VARCHAR(50),
  category VARCHAR(255),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_price_agreement_items_agreement ON price_agreement_items(price_agreement_id);
CREATE INDEX IF NOT EXISTS idx_price_agreement_items_code ON price_agreement_items(item_code);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vendor_id INTEGER REFERENCES vendors(id),
  invoice_number VARCHAR(255),
  invoice_date DATE,
  due_date DATE,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'flagged', 'disputed', 'accepted')),
  file_url TEXT,
  extracted_data JSONB,
  processing_time_ms INTEGER,
  has_discrepancies BOOLEAN DEFAULT false,
  total_discrepancy_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date DESC);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  line_number INTEGER,
  item_code VARCHAR(255),
  item_description TEXT,
  quantity DECIMAL(10, 2),
  unit_price DECIMAL(10, 2),
  line_total DECIMAL(10, 2),
  unit_of_measure VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_org ON invoice_line_items(organization_id);

-- Discrepancies
CREATE TABLE IF NOT EXISTS discrepancies (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  invoice_line_item_id INTEGER REFERENCES invoice_line_items(id) ON DELETE CASCADE,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  discrepancy_type VARCHAR(50) NOT NULL CHECK (discrepancy_type IN ('price_mismatch', 'item_not_in_contract', 'quantity_issue', 'calculation_error')),
  expected_value DECIMAL(10, 2),
  actual_value DECIMAL(10, 2),
  impact_amount DECIMAL(10, 2),
  description TEXT,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'disputed', 'accepted', 'resolved')),
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discrepancies_invoice ON discrepancies(invoice_id);
CREATE INDEX IF NOT EXISTS idx_discrepancies_org ON discrepancies(organization_id);
CREATE INDEX IF NOT EXISTS idx_discrepancies_status ON discrepancies(status);

-- Emails (audit log)
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  organization_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  template_name VARCHAR(100),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'delivered')),
  resend_message_id VARCHAR(255),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_emails_org ON emails(organization_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_sent_at ON emails(sent_at DESC);

-- User Onboarding
CREATE TABLE IF NOT EXISTS user_onboarding (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  organization_id VARCHAR(255) REFERENCES organizations(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  step_current INTEGER DEFAULT 1,
  step_completed INTEGER DEFAULT 0,
  first_price_agreement_uploaded BOOLEAN DEFAULT false,
  first_invoice_uploaded BOOLEAN DEFAULT false,
  first_discrepancy_viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_onboarding_user ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_org ON user_onboarding(organization_id);
`;

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    await query(migrations);
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

