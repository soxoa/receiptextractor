"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadAPI } from "@/lib/api";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Package, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UploadContractPage() {
  const { data: session } = useSession();
  const router = useRouter();
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

      const response = await uploadAPI.uploadDocument(file, 'price_agreement', token, organizationId);
      setResult(response);

      // Redirect to contract detail after success
      if (response.priceAgreement?.id) {
        setTimeout(() => {
          router.push(`/contracts`);
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
      <div className="flex items-center gap-4">
        <Link href="/contracts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Upload Pricing Agreement</h1>
          <p className="text-gray-500 mt-2">Upload vendor contracts or price lists for automatic invoice verification</p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Contract Document</CardTitle>
          <CardDescription>
            Drag and drop or click to select (PDF, PNG, JPG, Excel)
          </CardDescription>
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
                <p className="text-sm text-gray-500 mb-4">Our AI is extracting pricing data from your contract</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={66} className="h-2" />
                </div>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium">Drop the contract here</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drop your pricing agreement here
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
                <CardTitle className="text-green-900">Contract Processed Successfully!</CardTitle>
                <CardDescription className="text-green-700 mt-2">
                  Extracted pricing data from {result.vendor?.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border border-green-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-semibold">{result.vendor?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Items Extracted</p>
                  <p className="font-semibold">{result.priceAgreement?.itemCount || 0}</p>
                </div>
                {result.priceAgreement?.effectiveDate && (
                  <div>
                    <p className="text-sm text-gray-500">Effective Date</p>
                    <p className="font-semibold">{formatDate(result.priceAgreement.effectiveDate)}</p>
                  </div>
                )}
                {result.priceAgreement?.expirationDate && (
                  <div>
                    <p className="text-sm text-gray-500">Expiration Date</p>
                    <p className="font-semibold">{formatDate(result.priceAgreement.expirationDate)}</p>
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-sm text-green-700">
                  ✓ Contract saved. Redirecting to contracts page...
                </p>
                <Progress value={100} className="h-1 mt-2" />
              </div>
            </div>
          </CardContent>
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
              <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Upload vendor pricing agreements, contracts, or price lists</span>
            </li>
            <li className="flex items-start">
              <Package className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Our AI automatically extracts all item codes, descriptions, and unit prices</span>
            </li>
            <li className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Contract dates are extracted automatically if present in the document</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-600" />
              <span>Clear, high-resolution documents work best (avoid blurry photos)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

