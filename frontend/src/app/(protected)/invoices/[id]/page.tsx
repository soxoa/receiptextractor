"use client";

import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invoiceAPI } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor, getDiscrepancyTypeLabel } from "@/lib/utils";
import { ArrowLeft, AlertCircle, CheckCircle, FileText, Building, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [invoice, setInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoiceDetails();
  }, [params?.id, organization]);

  async function loadInvoiceDetails() {
    try {
      const token = await getToken();
      if (!token || !organization?.id || !params?.id) return;

      const data = await invoiceAPI.getInvoice(Number(params.id), token, organization.id);
      setInvoice(data.invoice);
      setLineItems(data.lineItems || []);
      setDiscrepancies(data.discrepancies || []);
    } catch (error) {
      console.error("Failed to load invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscrepancyAction(discrepancyId: number, status: string, notes?: string) {
    try {
      const token = await getToken();
      if (!token || !organization?.id) return;

      await invoiceAPI.updateDiscrepancy(discrepancyId, { status, notes }, token, organization.id);
      await loadInvoiceDetails(); // Reload data
    } catch (error) {
      console.error("Failed to update discrepancy:", error);
      alert("Failed to update. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Invoice not found</p>
          <Link href="/invoices">
            <Button className="mt-4">Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  const openDiscrepancies = discrepancies.filter(d => d.status === 'open');
  const totalImpact = discrepancies.reduce((sum, d) => sum + (d.impact_amount || 0), 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Invoice #{invoice.invoice_number || invoice.id}</h1>
            <p className="text-gray-500 mt-1">{invoice.vendor_name || 'Unknown Vendor'}</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
          {invoice.status}
        </span>
      </div>

      {/* Alert Banner */}
      {openDiscrepancies.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <CardTitle className="text-red-900">
                  {openDiscrepancies.length} Discrepanc{openDiscrepancies.length !== 1 ? 'ies' : 'y'} Found
                </CardTitle>
                <CardDescription className="text-red-700">
                  Total impact: <span className="font-semibold">{formatCurrency(Math.abs(totalImpact))}</span>
                  {totalImpact > 0 ? ' overcharged' : ' undercharged'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Invoice Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendor</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{invoice.vendor_name}</div>
            {invoice.vendor_email && (
              <p className="text-sm text-gray-500">{invoice.vendor_email}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Date</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatDate(invoice.invoice_date || invoice.created_at)}
            </div>
            {invoice.due_date && (
              <p className="text-sm text-gray-500">Due: {formatDate(invoice.due_date)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatCurrency(invoice.total_amount)}</div>
            <p className="text-sm text-gray-500">{lineItems.length} line items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {invoice.processing_time_ms ? `${(invoice.processing_time_ms / 1000).toFixed(1)}s` : 'N/A'}
            </div>
            <p className="text-sm text-gray-500">AI extraction</p>
          </CardContent>
        </Card>
      </div>

      {/* Discrepancies */}
      {discrepancies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Discrepancies</CardTitle>
            <CardDescription>Pricing issues found on this invoice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discrepancies.map((discrepancy) => (
                <div key={discrepancy.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          discrepancy.discrepancy_type === 'price_mismatch' ? 'bg-red-100 text-red-800' :
                          discrepancy.discrepancy_type === 'item_not_in_contract' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getDiscrepancyTypeLabel(discrepancy.discrepancy_type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(discrepancy.status)}`}>
                          {discrepancy.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{discrepancy.description}</p>
                      {discrepancy.discrepancy_type === 'price_mismatch' && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Expected: <span className="font-medium">{formatCurrency(discrepancy.expected_value)}</span></p>
                          <p>Actual: <span className="font-medium">{formatCurrency(discrepancy.actual_value)}</span></p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${discrepancy.impact_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {discrepancy.impact_amount > 0 ? '+' : ''}{formatCurrency(discrepancy.impact_amount)}
                      </p>
                      <p className="text-xs text-gray-500">Impact</p>
                    </div>
                  </div>
                  
                  {discrepancy.status === 'open' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDiscrepancyAction(discrepancy.id, 'disputed', 'Disputed with vendor')}
                      >
                        Dispute
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDiscrepancyAction(discrepancy.id, 'accepted', 'Accepted as valid charge')}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDiscrepancyAction(discrepancy.id, 'resolved', 'Issue resolved')}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}

                  {discrepancy.notes && (
                    <div className="text-sm text-gray-600 pt-2 border-t">
                      <strong>Notes:</strong> {discrepancy.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>{lineItems.length} items on this invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium text-right">Qty</th>
                  <th className="pb-3 font-medium text-right">Unit Price</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lineItems.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="py-3 text-gray-500">{item.line_number}</td>
                    <td className="py-3">{item.item_description}</td>
                    <td className="py-3 text-gray-500">{item.item_code || '-'}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t">
                <tr className="font-semibold">
                  <td colSpan={5} className="py-3 text-right">Total:</td>
                  <td className="py-3 text-right">{formatCurrency(invoice.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

