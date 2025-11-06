// API client for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  token?: string;
  organizationId?: string;
}

async function fetchAPI(endpoint: string, options: RequestOptions = {}) {
  const { token, organizationId, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (organizationId) {
    headers['X-Organization-Id'] = organizationId;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Auth endpoints
export const authAPI = {
  getMe: (token: string, organizationId?: string) =>
    fetchAPI('/api/auth/me', { token, organizationId }),

  initOrganization: (token: string, data: { organizationId: string; organizationName: string }) =>
    fetchAPI('/api/auth/init-organization', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),
};

// Upload endpoints
export const uploadAPI = {
  uploadDocument: async (
    file: File,
    documentType: 'price_agreement' | 'invoice',
    token: string,
    organizationId: string
  ) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'X-Organization-Id': organizationId,
    };

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || error.message || 'Upload failed');
    }

    return response.json();
  },
};

// Invoice endpoints
export const invoiceAPI = {
  getInvoices: (token: string, organizationId: string, params?: { status?: string; limit?: number; offset?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchAPI(`/api/invoices${queryString}`, { token, organizationId });
  },

  getInvoice: (id: number, token: string, organizationId: string) =>
    fetchAPI(`/api/invoices/${id}`, { token, organizationId }),

  updateInvoiceStatus: (id: number, status: string, token: string, organizationId: string) =>
    fetchAPI(`/api/invoices/${id}/status`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify({ status }),
    }),

  updateDiscrepancy: (id: number, data: { status: string; notes?: string }, token: string, organizationId: string) =>
    fetchAPI(`/api/invoices/discrepancies/${id}`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify(data),
    }),

  getDashboardStats: (token: string, organizationId: string) =>
    fetchAPI('/api/invoices/stats/dashboard', { token, organizationId }),
};

// Vendor endpoints
export const vendorAPI = {
  getVendors: (token: string, organizationId: string) =>
    fetchAPI('/api/vendors', { token, organizationId }),

  getVendor: (id: number, token: string, organizationId: string) =>
    fetchAPI(`/api/vendors/${id}`, { token, organizationId }),

  updateVendor: (id: number, data: any, token: string, organizationId: string) =>
    fetchAPI(`/api/vendors/${id}`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify(data),
    }),

  deleteVendor: (id: number, token: string, organizationId: string) =>
    fetchAPI(`/api/vendors/${id}`, {
      method: 'DELETE',
      token,
      organizationId,
    }),
};

// Billing endpoints
export const billingAPI = {
  getSubscription: (token: string, organizationId: string) =>
    fetchAPI('/api/billing/subscription', { token, organizationId }),

  getUsage: (token: string, organizationId: string) =>
    fetchAPI('/api/billing/usage', { token, organizationId }),

  createCheckoutSession: (planTier: string, token: string, organizationId: string) =>
    fetchAPI('/api/billing/create-checkout-session', {
      method: 'POST',
      token,
      organizationId,
      body: JSON.stringify({ planTier }),
    }),

  createPortalSession: (token: string, organizationId: string) =>
    fetchAPI('/api/billing/create-portal-session', {
      method: 'POST',
      token,
      organizationId,
    }),
};

