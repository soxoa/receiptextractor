"use client";

import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { invoiceAPI, billingAPI } from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { TrendingUp, AlertCircle, CheckCircle, Clock, Upload } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [stats, setStats] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [organization]);

  async function loadDashboardData() {
    try {
      const token = await getToken();
      if (!token || !organization?.id) return;

      const [statsData, usageData] = await Promise.all([
        invoiceAPI.getDashboardStats(token, organization.id),
        billingAPI.getUsage(token, organization.id),
      ]);

      setStats(statsData);
      setUsage(usageData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
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

  const usagePercent = usage?.currentMonth?.percentUsed || 0;
  const showUpgradeWarning = usagePercent >= 80;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your invoice verification overview.</p>
      </div>

      {/* Usage Alert */}
      {showUpgradeWarning && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
                <div>
                  <CardTitle className="text-yellow-900">Usage Limit Warning</CardTitle>
                  <CardDescription className="text-yellow-700">
                    You've used {usage.currentMonth.count} of {usage.currentMonth.limit} invoices this month ({usagePercent}%)
                  </CardDescription>
                </div>
              </div>
              <Link href="/settings?tab=billing">
                <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            {usage?.currentMonth.count || 0} of {usage?.currentMonth.limit || 10} invoices processed this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercent} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{usage?.currentMonth.remaining || 0} remaining</span>
            <span>{usage?.planTier || 'free'} plan</span>
          </div>
        </CardContent>
      </Card>

      {/* Savings Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats?.totalSavings || 0)}
            </div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.monthSavings || 0)}
            </div>
            <p className="text-xs text-gray-500">Saved this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.statusCounts?.find((s: any) => s.status === 'flagged')?.count || 0}
            </div>
            <p className="text-xs text-gray-500">Requiring review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.statusCounts?.reduce((sum: number, s: any) => sum + parseInt(s.count), 0) || 0}
            </div>
            <p className="text-xs text-gray-500">Total invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Invoices with discrepancies requiring attention</CardDescription>
            </div>
            <Link href="/invoices?status=flagged">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentIssues?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentIssues.map((issue: any) => (
                <Link key={issue.id} href={`/invoices/${issue.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{issue.vendor_name || 'Unknown Vendor'}</p>
                        <p className="text-sm text-gray-500">
                          Invoice #{issue.invoice_number || issue.id} • {formatDate(issue.invoice_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {formatCurrency(Math.abs(issue.total_discrepancy_amount))}
                      </p>
                      <p className="text-xs text-gray-500">overcharged</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-500">No issues found! All invoices match your contracts.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/upload" className="flex-1">
            <Button className="w-full" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Invoice
            </Button>
          </Link>
          <Link href="/invoices" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <Clock className="mr-2 h-5 w-5" />
              View History
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

