"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadAPI, vendorAPI } from "@/lib/api";
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Building, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function UploadInvoicePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVendors();
  }, [session]);

  async function loadVendors() {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) return;

      const data = await vendorAPI.getVendors(token, organizationId);
      const vendorsWithContracts = (data.vendors || []).filter((v: any) => v.price_agreement_count > 0);
      setVendors(vendorsWithContracts);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) {
        throw new Error("Authentication required");
      }

      const response = await uploadAPI.uploadDocument(file, 'invoice', token, organizationId);
      setResult(response);

      // Redirect to invoice details after success
      if (response.invoice?.id) {
        setTimeout(() => {
          router.push(`/invoices/${response.invoice.id}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Upload Invoice</h1>
        <p className="text-gray-500 mt-2">Upload vendor invoices for automatic verification</p>
      </div>

      {/* Vendor Selection */}
      {vendors.length > 0 && !result && (
        <Card>
          <CardHeader>
            <CardTitle>Which vendor is this invoice from?</CardTitle>
            <CardDescription>
              Select a vendor with an existing pricing agreement (optional but recommended)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {vendors.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor.id)}
                  className={`text-left p-4 border rounded-lg transition-all ${
                    selectedVendor === vendor.id
                      ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600'
                      : 'border-gray-200 hover:border-purple-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{vendor.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {vendor.price_agreement_count} contract{vendor.price_agreement_count !== 1 ? 's' : ''} • {vendor.invoice_count || 0} invoices verified
                      </p>
                    </div>
                    {selectedVendor === vendor.id && (
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
              
              <Link href="/contracts/upload">
                <button className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">New Vendor</p>
                      <p className="text-xs text-gray-500">Upload contract first</p>
                    </div>
                  </div>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Vendors Warning */}
      {vendors.length === 0 && !result && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <CardTitle className="text-yellow-900">No Pricing Agreements Found</CardTitle>
                <CardDescription className="text-yellow-700 mt-2">
                  For best results, upload a pricing agreement first. This allows us to verify invoice prices against your contracted rates.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/contracts/upload">
              <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                <Upload className="mr-2 h-4 w-4" />
                Upload Pricing Agreement First
              </Button>
            </Link>
            <p className="text-xs text-yellow-600 mt-3">
              You can still upload invoices, but we won't be able to detect overcharges without a contract to compare against.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Invoice</CardTitle>
          <CardDescription>Drag and drop or click to select (PDF, PNG, JPG, Excel)</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-purple-600 bg-purple-50'
                : uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {uploading ? (
              <div>
                <p className="text-lg font-medium mb-2">Processing...</p>
                <p className="text-sm text-gray-500 mb-4">Our AI is extracting and verifying invoice data</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={66} className="h-2" />
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium">Drop the invoice here</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drop your invoice here
                </p>
                <p className="text-sm text-gray-500">or click to browse files</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <CardTitle className="text-red-900">Upload Failed</CardTitle>
                <CardDescription className="text-red-700">{error}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Success Display */}
      {result && result.type === 'invoice' && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-green-900">Invoice Processed!</CardTitle>
                <CardDescription className="text-green-700 mt-2">
                  Invoice from {result.invoice?.vendor} analyzed
                  <br />
                  {result.invoice?.lineItemCount} line items checked
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {result.analysis?.hasDiscrepancies ? (
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-red-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Discrepancies Found
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatCurrency(Math.abs(result.analysis.totalImpact))}
                  </span>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Found {result.analysis.discrepancyCount} pricing issue(s)
                </p>
                <div className="space-y-2">
                  {result.analysis.discrepancies.slice(0, 3).map((disc: any, idx: number) => (
                    <div key={idx} className="text-xs bg-red-50 p-2 rounded border border-red-100">
                      {disc.message}
                    </div>
                  ))}
                  {result.analysis.discrepancyCount > 3 && (
                    <p className="text-xs text-red-600">
                      +{result.analysis.discrepancyCount - 3} more issue(s)
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Redirecting to invoice details...</p>
                  <Progress value={100} className="h-1" />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">All Prices Match!</span>
                </div>
                <p className="text-sm text-green-700">
                  No discrepancies found. Invoice matches your contracted pricing perfectly.
                </p>
              </div>
            )}
            <div className="mt-3 text-xs text-gray-500">
              Processing time: {result.processingTimeMs}ms • Confidence: {result.confidence}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Upload Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Make sure you have a pricing agreement uploaded for this vendor first</span>
            </li>
            <li className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Our AI automatically extracts all line items and compares prices</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>You'll receive an email alert if any overcharges are detected</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
