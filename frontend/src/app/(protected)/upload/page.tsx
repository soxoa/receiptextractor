"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadAPI } from "@/lib/api";
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [documentType, setDocumentType] = useState<'price_agreement' | 'invoice'>('invoice');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

      const response = await uploadAPI.uploadDocument(file, documentType, token, organizationId);
      setResult(response);

      // Redirect to appropriate page after success
      if (response.type === 'invoice' && response.invoice?.id) {
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
        <h1 className="text-3xl font-bold">Upload Document</h1>
        <p className="text-gray-500 mt-2">Upload pricing agreements or invoices for automatic verification</p>
      </div>

      {/* Document Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>What are you uploading?</CardTitle>
          <CardDescription>Select the type of document you want to process</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant={documentType === 'price_agreement' ? 'default' : 'outline'}
            className="flex-1 h-24"
            onClick={() => setDocumentType('price_agreement')}
            disabled={uploading}
          >
            <div className="flex flex-col items-center">
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-semibold">Pricing Agreement</span>
              <span className="text-xs opacity-75">Contract or price list</span>
            </div>
          </Button>
          <Button
            variant={documentType === 'invoice' ? 'default' : 'outline'}
            className="flex-1 h-24"
            onClick={() => setDocumentType('invoice')}
            disabled={uploading}
          >
            <div className="flex flex-col items-center">
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-semibold">Invoice</span>
              <span className="text-xs opacity-75">Vendor invoice to verify</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
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
                <p className="text-sm text-gray-500 mb-4">Our AI is extracting data from your document</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={66} className="h-2" />
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium">Drop the file here</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drop your {documentType === 'invoice' ? 'invoice' : 'pricing agreement'} here
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
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-green-900">Processing Complete!</CardTitle>
                {result.type === 'price_agreement' && (
                  <CardDescription className="text-green-700 mt-2">
                    Successfully extracted pricing data from {result.vendor?.name}
                    <br />
                    {result.priceAgreement?.itemCount} line items added
                  </CardDescription>
                )}
                {result.type === 'invoice' && (
                  <CardDescription className="text-green-700 mt-2">
                    Invoice from {result.invoice?.vendor} processed
                    <br />
                    {result.invoice?.lineItemCount} line items analyzed
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          {result.type === 'invoice' && result.analysis && (
            <CardContent>
              {result.analysis.hasDiscrepancies ? (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-red-900">⚠️ Discrepancies Found</span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatCurrency(Math.abs(result.analysis.totalImpact))}
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    Found {result.analysis.discrepancyCount} pricing issue(s)
                  </p>
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
                    No discrepancies found. Invoice matches your contracted pricing.
                  </p>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500">
                Processing time: {result.processingTimeMs}ms • Confidence: {result.confidence}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Upload pricing agreements first, then invoices from the same vendor</span>
            </li>
            <li className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Clear, high-resolution images work best (avoid blurry photos)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Our AI automatically extracts all data - no manual entry required!</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

