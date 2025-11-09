"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Building, Users, FileText, Package, DollarSign, Calendar } from "lucide-react";

export default function AdminOrganizationsPage() {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadOrganizations();
    }
  }, [session]);

  async function loadOrganizations() {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      const data = await adminAPI.getOrganizations(token);
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.error("Failed to load organizations:", error);
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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-gray-500 mt-2">{organizations.length} organizations registered</p>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Owner: {org.owner_name || org.owner_email}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    org.plan_tier === 'pro' ? 'bg-purple-100 text-purple-800' :
                    org.plan_tier === 'starter' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {org.plan_tier || 'free'} plan
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs">Members</span>
                  </div>
                  <p className="text-lg font-semibold">{org.member_count}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="text-xs">Invoices</span>
                  </div>
                  <p className="text-lg font-semibold">{org.invoice_count}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs">Vendors</span>
                  </div>
                  <p className="text-lg font-semibold">{org.vendor_count}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-xs">Savings Found</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(parseFloat(org.total_savings))}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Created</span>
                  </div>
                  <p className="text-sm font-medium">{formatDate(org.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

