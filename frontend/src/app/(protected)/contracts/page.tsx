"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contractAPI } from "@/lib/api";
import { formatDate, getStatusColor } from "@/lib/utils";
import { FileText, Upload, Calendar, Package, AlertCircle, CheckCircle, Clock, ChevronRight } from "lucide-react";

export default function ContractsPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.organizationId) {
      loadContracts();
    }
  }, [session]);

  async function loadContracts() {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) return;

      const data = await contractAPI.getContracts(token, organizationId);
      setContracts(data.contracts || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to load contracts:", error);
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

  const getContractStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'expiring_soon':
        return { label: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'expired':
        return { label: 'Expired', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Agreements</h1>
          <p className="text-gray-500 mt-2">Manage your negotiated vendor contracts</p>
        </div>
        <Link href="/contracts/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Contract
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts}</div>
              <p className="text-xs text-gray-500">Active agreements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendors</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              <p className="text-xs text-gray-500">With contracts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-gray-500">Contracted prices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiringSoon}</div>
              <p className="text-xs text-gray-500">Next 30 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Contracts</CardTitle>
          <CardDescription>
            {contracts.length} pricing agreement{contracts.length !== 1 ? 's' : ''} on file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2 font-medium">No pricing agreements yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Upload vendor contracts or price lists to start verifying invoices
              </p>
              <Link href="/contracts/upload">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Contract
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => {
                const statusInfo = getContractStatusInfo(contract.status);
                const StatusIcon = statusInfo.icon;
                const daysUntilExpiry = contract.expiration_date 
                  ? Math.ceil((new Date(contract.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <Link key={contract.id} href={`/contracts/${contract.id}`}>
                    <div className="border rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg truncate">
                                {contract.vendor_name || 'Unknown Vendor'}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} flex items-center gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>
                                  {contract.effective_date 
                                    ? `Since ${formatDate(contract.effective_date)}` 
                                    : 'No start date'}
                                </span>
                              </div>
                              
                              {contract.expiration_date && daysUntilExpiry !== null && (
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span>
                                    {daysUntilExpiry > 0 
                                      ? `${daysUntilExpiry} days left`
                                      : 'Expired'}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-gray-400" />
                                <span>{contract.item_count || 0} items</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-gray-400" />
                                <span>{contract.invoices_verified || 0} invoices verified</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1" />
                      </div>

                      {contract.status === 'expiring_soon' && daysUntilExpiry && daysUntilExpiry <= 30 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                          <p className="text-yellow-900">
                            <strong>⚠️ Action Needed:</strong> This contract expires in {daysUntilExpiry} days. 
                            Upload a new version to avoid gaps in pricing verification.
                          </p>
                        </div>
                      )}

                      {contract.status === 'expired' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                          <p className="text-red-900">
                            <strong>❌ Expired:</strong> This contract has expired. 
                            Upload a new version to resume invoice verification.
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Text */}
      {contracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Managing Your Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Upload new contracts before old ones expire to maintain continuous verification</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Each contract shows how many invoices have been verified against it</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Click any contract to see all items and pricing details</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

