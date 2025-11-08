// API client for backend communication
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  token?: string;
  organizationId?: string | number;
}

async function fetchAPI(endpoint: string, options: RequestOptions = {}) {
  const { token, organizationId, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (organizationId) {
    headers['X-Organization-Id'] = organizationId.toString();
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

// Helper to get token from session
export async function getAuthToken() {
  const session = await getSession();
  return session?.accessToken as string;
}

// Auth endpoints
export const authAPI = {
  getMe: (token: string, organizationId?: string | number) =>
    fetchAPI('/api/auth/me', { token, organizationId }),
};

// Upload endpoints
export const uploadAPI = {
  uploadDocument: async (
    file: File,
    documentType: 'price_agreement' | 'invoice',
    token: string,
    organizationId: string | number
  ) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'X-Organization-Id': organizationId.toString(),
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
  getInvoices: (token: string, organizationId: string | number, params?: { status?: string; limit?: number; offset?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchAPI(`/api/invoices${queryString}`, { token, organizationId });
  },

  getInvoice: (id: number, token: string, organizationId: string | number) =>
    fetchAPI(`/api/invoices/${id}`, { token, organizationId }),

  updateInvoiceStatus: (id: number, status: string, token: string, organizationId: string | number) =>
    fetchAPI(`/api/invoices/${id}/status`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify({ status }),
    }),

  updateDiscrepancy: (id: number, data: { status: string; notes?: string }, token: string, organizationId: string | number) =>
    fetchAPI(`/api/invoices/discrepancies/${id}`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify(data),
    }),

  getDashboardStats: (token: string, organizationId: string | number) =>
    fetchAPI('/api/invoices/stats/dashboard', { token, organizationId }),
};

// Vendor endpoints
export const vendorAPI = {
  getVendors: (token: string, organizationId: string | number) =>
    fetchAPI('/api/vendors', { token, organizationId }),

  getVendor: (id: number, token: string, organizationId: string | number) =>
    fetchAPI(`/api/vendors/${id}`, { token, organizationId }),

  updateVendor: (id: number, data: any, token: string, organizationId: string | number) =>
    fetchAPI(`/api/vendors/${id}`, {
      method: 'PATCH',
      token,
      organizationId,
      body: JSON.stringify(data),
    }),

  deleteVendor: (id: number, token: string, organizationId: string | number) =>
    fetchAPI(`/api/vendors/${id}`, {
      method: 'DELETE',
      token,
      organizationId,
    }),
};

// Billing endpoints
export const billingAPI = {
  getSubscription: (token: string, organizationId: string | number) =>
    fetchAPI('/api/billing/subscription', { token, organizationId }),

  getUsage: (token: string, organizationId: string | number) =>
    fetchAPI('/api/billing/usage', { token, organizationId }),

  createCheckoutSession: (planTier: string, token: string, organizationId: string | number) =>
    fetchAPI('/api/billing/create-checkout-session', {
      method: 'POST',
      token,
      organizationId,
      body: JSON.stringify({ planTier }),
    }),

  createPortalSession: (token: string, organizationId: string | number) =>
    fetchAPI('/api/billing/create-portal-session', {
      method: 'POST',
      token,
      organizationId,
    }),
};
