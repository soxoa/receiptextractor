"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Building, FileText, DollarSign, TrendingUp, AlertCircle, Clock, Mail, Shield } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadAdminData();
    }
  }, [session]);

  async function loadAdminData() {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      const [dashboard, activityData] = await Promise.all([
        adminAPI.getDashboard(token),
        adminAPI.getActivity(token, 20),
      ]);

      setDashboardData(dashboard);
      setActivity(activityData.activity || []);
    } catch (error: any) {
      console.error("Failed to load admin data:", error);
      if (error.message.includes('Admin') || error.message.includes('403')) {
        alert('Admin access required. You are not an admin.');
        router.push('/dashboard');
      }
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

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-500">Access Denied - Admin Only</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return Users;
      case 'invoice': return FileText;
      case 'subscription': return DollarSign;
      default: return Clock;
    }
  };

  const getActivityMessage = (item: any) => {
    switch (item.type) {
      case 'signup':
        return `${item.name || item.email} signed up`;
      case 'invoice':
        return `${item.organization_name} uploaded invoice from ${item.vendor_name || 'unknown vendor'}${item.has_discrepancies ? ' (issues found)' : ''}`;
      case 'subscription':
        return `${item.organization_name} upgraded to ${item.plan_tier}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-500 mt-2">Monitor your SaaS metrics and user activity</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/revenue">
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users.total}</div>
            <p className="text-xs text-gray-500">
              +{dashboardData.users.last7Days} last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.organizations.total}</div>
            <p className="text-xs text-gray-500">
              +{dashboardData.organizations.last7Days} last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(dashboardData.revenue.mrr)}
            </div>
            <p className="text-xs text-gray-500">
              {formatCurrency(dashboardData.revenue.arr)} ARR
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Processed</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.invoices.total}</div>
            <p className="text-xs text-gray-500">
              +{dashboardData.invoices.last7Days} last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Monthly recurring revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.revenue.subscriptionBreakdown.map((tier: any) => (
                <div key={tier.plan} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{tier.plan}</p>
                    <p className="text-sm text-gray-500">{tier.customerCount} customer{tier.customerCount !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(tier.mrr)}/mo</p>
                    <p className="text-xs text-gray-500">{formatCurrency(tier.mrr * 12)}/yr</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total MRR</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(dashboardData.revenue.mrr)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Processing</CardTitle>
            <CardDescription>Document processing statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Processed</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
              <p className="text-2xl font-bold">{dashboardData.invoices.total}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">With Discrepancies</p>
                <p className="text-sm text-gray-500">Overcharges found</p>
              </div>
              <p className="text-lg font-semibold text-red-600">{dashboardData.invoices.withIssues}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <p className="font-medium">Total Savings</p>
                <p className="text-sm text-gray-500">Customer value delivered</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(dashboardData.invoices.totalSavings)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed & System Health */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 20 events across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activity.map((item: any, idx: number) => {
                const Icon = getActivityIcon(item.type);
                return (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === 'signup' ? 'bg-blue-100' :
                      item.type === 'subscription' ? 'bg-green-100' :
                      item.has_discrepancies ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        item.type === 'signup' ? 'text-blue-600' :
                        item.type === 'subscription' ? 'text-green-600' :
                        item.has_discrepancies ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700">{getActivityMessage(item)}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Performance and error monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Processing Queue</span>
              </div>
              <span className="font-semibold">
                {dashboardData.system.processingInvoices || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Avg Processing Time</span>
              </div>
              <span className="font-semibold">
                {(dashboardData.system.avgProcessingTime / 1000).toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Failed Emails</span>
              </div>
              <span className={`font-semibold ${dashboardData.system.failedEmails > 0 ? 'text-red-600' : ''}`}>
                {dashboardData.system.failedEmails || 0}
              </span>
            </div>

            {dashboardData.system.failedEmails > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Some emails failed to send. Check Resend logs.
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Link href="/admin/health">
                <Button variant="outline" size="sm" className="w-full">
                  View Detailed Health Report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Sign Ups</CardTitle>
              <CardDescription>Newest users on the platform</CardDescription>
            </div>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">View All Users</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData.recentUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Link href="/admin/users">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
          </Link>
          <Link href="/admin/organizations">
            <Button variant="outline" className="w-full justify-start">
              <Building className="mr-2 h-4 w-4" />
              Organizations
            </Button>
          </Link>
          <Link href="/admin/revenue">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue Analytics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

