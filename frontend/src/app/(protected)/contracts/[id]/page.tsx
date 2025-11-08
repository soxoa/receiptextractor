"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contractAPI } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { ArrowLeft, Building, Calendar, Package, FileText, Download, Search, CheckCircle, AlertCircle } from "lucide-react";

export default function ContractDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [contract, setContract] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.organizationId && params?.id) {
      loadContractDetails();
    }
  }, [params?.id, session]);

  useEffect(() => {
    // Filter items based on search
    if (searchTerm) {
      const filtered = items.filter(item =>
        item.item_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  async function loadContractDetails() {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId || !params?.id) return;

      const data = await contractAPI.getContract(Number(params.id), token, organizationId);
      setContract(data.contract);
      setItems(data.items || []);
      setFilteredItems(data.items || []);
      setRecentInvoices(data.recentInvoices || []);
    } catch (error) {
      console.error("Failed to load contract:", error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (!items.length) return;

    const headers = ['Item Code', 'Description', 'Unit Price', 'Unit of Measure', 'Category'];
    const rows = items.map(item => [
      item.item_code || '',
      item.item_description || '',
      item.unit_price || '',
      item.unit_of_measure || '',
      item.category || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract?.vendor_name || 'contract'}_pricing.csv`;
    a.click();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Contract not found</p>
          <Link href="/contracts">
            <Button className="mt-4">Back to Contracts</Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = contract.expiration_date 
    ? Math.ceil((new Date(contract.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contracts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{contract.vendor_name}</h1>
            <p className="text-gray-500 mt-1">Pricing Agreement</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Contract Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendor</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{contract.vendor_name}</div>
            {contract.vendor_email && (
              <p className="text-sm text-gray-500">{contract.vendor_email}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Period</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {contract.effective_date ? formatDate(contract.effective_date) : 'No start'}
            </div>
            {contract.expiration_date && (
              <p className="text-sm text-gray-500">
                Until {formatDate(contract.expiration_date)}
              </p>
            )}
            {daysUntilExpiry && daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
              <p className="text-sm text-yellow-600 font-medium mt-1">
                {daysUntilExpiry} days remaining
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{contract.item_count || 0}</div>
            <p className="text-sm text-gray-500">Contracted prices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{formatCurrency(contract.total_value || 0)}</div>
            <p className="text-sm text-gray-500">Sum of unit prices</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contract Items</CardTitle>
              <CardDescription>
                {filteredItems.length} of {items.length} items
                {searchTerm && ` matching "${searchTerm}"`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item code, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="p-3 font-medium">Item Code</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Unit Price</th>
                  <th className="p-3 font-medium">Unit</th>
                  <th className="p-3 font-medium">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      {searchTerm ? 'No items match your search' : 'No items in this contract'}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="text-sm hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{item.item_code || '-'}</td>
                      <td className="p-3">{item.item_description}</td>
                      <td className="p-3 font-semibold">{formatCurrency(item.unit_price)}</td>
                      <td className="p-3 text-gray-500">{item.unit_of_measure || '-'}</td>
                      <td className="p-3">
                        {item.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {item.category}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      {recentInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>
              Invoices verified against this contract
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        invoice.has_discrepancies ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {invoice.has_discrepancies ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Invoice #{invoice.invoice_number || invoice.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(invoice.invoice_date)} • {formatCurrency(invoice.total_amount)}
                        </p>
                      </div>
                    </div>
                    {invoice.has_discrepancies ? (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">
                          {formatCurrency(Math.abs(invoice.total_discrepancy_amount))}
                        </p>
                        <p className="text-xs text-red-500">overcharged</p>
                      </div>
                    ) : (
                      <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

