"use client";

import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invoiceAPI } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { FileText, AlertCircle, CheckCircle, Clock, ChevronRight } from "lucide-react";

export default function InvoicesPage() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const searchParams = useSearchParams();
  const statusFilter = searchParams?.get('status');
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [organization, statusFilter]);

  async function loadInvoices() {
    try {
      const token = await getToken();
      if (!token || !organization?.id) return;

      const params: any = { limit: 50 };
      if (statusFilter) params.status = statusFilter;

      const data = await invoiceAPI.getInvoices(token, organization.id, params);
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Failed to load invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const statusCounts = {
    all: invoices.length,
    flagged: invoices.filter(i => i.status === 'flagged').length,
    completed: invoices.filter(i => i.status === 'completed').length,
    processing: invoices.filter(i => i.status === 'processing').length,
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-500 mt-2">View and manage all uploaded invoices</p>
        </div>
        <Link href="/upload">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Upload Invoice
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Link href="/invoices">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm">
            All ({statusCounts.all})
          </Button>
        </Link>
        <Link href="/invoices?status=flagged">
          <Button variant={statusFilter === 'flagged' ? "default" : "outline"} size="sm">
            Issues ({statusCounts.flagged})
          </Button>
        </Link>
        <Link href="/invoices?status=completed">
          <Button variant={statusFilter === 'completed' ? "default" : "outline"} size="sm">
            Completed ({statusCounts.completed})
          </Button>
        </Link>
        <Link href="/invoices?status=processing">
          <Button variant={statusFilter === 'processing' ? "default" : "outline"} size="sm">
            Processing ({statusCounts.processing})
          </Button>
        </Link>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === 'flagged' && 'Invoices with Issues'}
            {statusFilter === 'completed' && 'Completed Invoices'}
            {statusFilter === 'processing' && 'Processing'}
            {!statusFilter && 'All Invoices'}
          </CardTitle>
          <CardDescription>
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No invoices found</p>
              <Link href="/upload">
                <Button>Upload Your First Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        invoice.status === 'flagged' ? 'bg-red-100' :
                        invoice.status === 'completed' ? 'bg-green-100' :
                        invoice.status === 'processing' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {invoice.status === 'flagged' && <AlertCircle className="h-5 w-5 text-red-600" />}
                        {invoice.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {invoice.status === 'processing' && <Clock className="h-5 w-5 text-blue-600" />}
                        {!['flagged', 'completed', 'processing'].includes(invoice.status) && <FileText className="h-5 w-5 text-gray-600" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{invoice.vendor_name || 'Unknown Vendor'}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>#{invoice.invoice_number || invoice.id}</span>
                          <span>•</span>
                          <span>{formatDate(invoice.invoice_date || invoice.created_at)}</span>
                          {invoice.open_discrepancy_count > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-red-600 font-medium">
                                {invoice.open_discrepancy_count} issue{invoice.open_discrepancy_count !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold">{formatCurrency(invoice.total_amount)}</p>
                        {invoice.has_discrepancies && (
                          <p className="text-sm text-red-600 font-medium">
                            {formatCurrency(Math.abs(invoice.total_discrepancy_amount))} overcharged
                          </p>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

