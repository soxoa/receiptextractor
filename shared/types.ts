// Shared TypeScript types between frontend and backend

export interface Organization {
  id: string;
  name: string;
  owner_user_id: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  organization_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_tier: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageTracking {
  id: number;
  organization_id: string;
  month: string;
  invoice_count: number;
  last_reset_at: string;
}

export interface Vendor {
  id: number;
  organization_id: string;
  name: string;
  external_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  invoice_count?: number;
  total_overcharges?: number;
  total_invoiced?: number;
  accuracy_percentage?: number;
  price_agreement_count?: number;
}

export interface PriceAgreement {
  id: number;
  organization_id: string;
  vendor_id: number;
  effective_date?: string;
  expiration_date?: string;
  file_url?: string;
  extracted_data: any;
  created_at: string;
  updated_at: string;
}

export interface PriceAgreementItem {
  id: number;
  price_agreement_id: number;
  item_code?: string;
  item_description: string;
  unit_price: number;
  unit_of_measure?: string;
  category?: string;
  metadata?: any;
}

export interface Invoice {
  id: number;
  organization_id: string;
  vendor_id: number;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  total_amount: number;
  status: 'processing' | 'completed' | 'flagged' | 'disputed' | 'accepted';
  file_url?: string;
  extracted_data: any;
  processing_time_ms?: number;
  has_discrepancies: boolean;
  total_discrepancy_amount: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  vendor_name?: string;
  vendor_email?: string;
  open_discrepancy_count?: number;
}

export interface InvoiceLineItem {
  id: number;
  invoice_id: number;
  organization_id: string;
  line_number: number;
  item_code?: string;
  item_description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  unit_of_measure?: string;
}

export interface Discrepancy {
  id: number;
  invoice_id: number;
  invoice_line_item_id?: number;
  organization_id: string;
  discrepancy_type: 'price_mismatch' | 'item_not_in_contract' | 'quantity_issue' | 'calculation_error';
  expected_value: number;
  actual_value: number;
  impact_amount: number;
  description: string;
  status: 'open' | 'disputed' | 'accepted' | 'resolved';
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
  created_at: string;
}

export interface Email {
  id: number;
  organization_id: string;
  recipient_email: string;
  subject: string;
  template_name: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'bounced' | 'delivered';
  resend_message_id?: string;
  metadata?: any;
}

export interface UserOnboarding {
  id: number;
  user_id: string;
  organization_id: string;
  completed: boolean;
  step_current: number;
  step_completed: number;
  first_price_agreement_uploaded: boolean;
  first_invoice_uploaded: boolean;
  first_discrepancy_viewed: boolean;
  created_at: string;
  completed_at?: string;
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UsageStats {
  currentMonth: {
    count: number;
    limit: number;
    remaining: number;
    percentUsed: number;
  };
  planTier: string;
  history: Array<{
    month: string;
    invoice_count: number;
  }>;
}

export interface DashboardStats {
  totalSavings: number;
  monthSavings: number;
  statusCounts: Array<{
    status: string;
    count: number;
  }>;
  recentIssues: Array<{
    id: number;
    invoice_number?: string;
    invoice_date?: string;
    total_discrepancy_amount: number;
    vendor_name?: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    invoice_count: number;
    savings: number;
  }>;
}

export interface UploadResponse {
  success: boolean;
  type: 'price_agreement' | 'invoice';
  vendor?: {
    id: number;
    name: string;
  };
  priceAgreement?: {
    id: number;
    itemCount: number;
    effectiveDate?: string;
    expirationDate?: string;
  };
  invoice?: {
    id: number;
    invoiceNumber?: string;
    vendor: string;
    totalAmount: number;
    lineItemCount: number;
  };
  analysis?: {
    hasDiscrepancies: boolean;
    discrepancyCount: number;
    totalImpact: number;
    discrepancies: any[];
  };
  processingTimeMs?: number;
  confidence?: string;
}

// Plan configuration
export const PLAN_LIMITS = {
  free: 10,
  starter: 50,
  pro: 300,
  enterprise: 999999
};

export const PLAN_PRICES = {
  free: 0,
  starter: 49,
  pro: 149,
  enterprise: 0 // Custom
};

