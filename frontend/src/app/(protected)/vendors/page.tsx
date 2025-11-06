"use client";

import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { vendorAPI } from "@/lib/api";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Building, FileText, AlertCircle, TrendingUp, Upload } from "lucide-react";

export default function VendorsPage() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, [organization]);

  async function loadVendors() {
    try {
      const token = await getToken();
      if (!token || !organization?.id) return;

      const data = await vendorAPI.getVendors(token, organization.id);
      setVendors(data.vendors || []);
    } catch (error) {
      console.error("Failed to load vendors:", error);
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

  // Sort vendors by total overcharges (most problematic first)
  const sortedVendors = [...vendors].sort((a, b) => 
    parseFloat(b.total_overcharges) - parseFloat(a.total_overcharges)
  );

  const totalInvoiced = vendors.reduce((sum, v) => sum + parseFloat(v.total_invoiced || 0), 0);
  const totalOvercharges = vendors.reduce((sum, v) => sum + parseFloat(v.total_overcharges || 0), 0);
  const overallAccuracy = totalInvoiced > 0 
    ? Math.max(0, 100 - (totalOvercharges / totalInvoiced * 100))
    : 100;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-gray-500 mt-2">Manage your vendor relationships and track accuracy</p>
        </div>
        <Link href="/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-gray-500">Active vendor relationships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overcharges</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOvercharges)}
            </div>
            <p className="text-xs text-gray-500">Across all vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(overallAccuracy)}
            </div>
            <p className="text-xs text-gray-500">Average vendor accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance</CardTitle>
          <CardDescription>Sorted by total overcharges (highest first)</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedVendors.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No vendors yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Vendors are automatically created when you upload pricing agreements or invoices
              </p>
              <Link href="/upload">
                <Button>Upload Your First Document</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVendors.map((vendor) => (
                <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Building className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {vendor.invoice_count} invoices
                          </span>
                          {vendor.price_agreement_count > 0 && (
                            <span className="text-green-600">
                              ✓ {vendor.price_agreement_count} contract{vendor.price_agreement_count !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatPercentage(vendor.accuracy_percentage)}
                      </div>
                      <p className="text-xs text-gray-500">Accuracy</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Pricing Accuracy</span>
                        <span className={vendor.accuracy_percentage >= 98 ? 'text-green-600' : vendor.accuracy_percentage >= 95 ? 'text-yellow-600' : 'text-red-600'}>
                          {vendor.accuracy_percentage >= 98 ? 'Excellent' : vendor.accuracy_percentage >= 95 ? 'Good' : 'Needs Attention'}
                        </span>
                      </div>
                      <Progress value={vendor.accuracy_percentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Total Invoiced</p>
                        <p className="text-lg font-semibold">{formatCurrency(parseFloat(vendor.total_invoiced))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Overcharges</p>
                        <p className={`text-lg font-semibold ${parseFloat(vendor.total_overcharges) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(parseFloat(vendor.total_overcharges))}
                        </p>
                      </div>
                    </div>

                    {parseFloat(vendor.total_overcharges) > 100 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                        <p className="text-yellow-900">
                          <strong>Action Recommended:</strong> Consider reviewing your pricing agreement with this vendor.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      {vendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Management Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckIcon />
                <span>Upload pricing agreements for all vendors to enable automatic verification</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span>Review vendors with accuracy below 95% and consider renegotiating contracts</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span>Dispute significant overcharges promptly to maintain vendor accountability</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

