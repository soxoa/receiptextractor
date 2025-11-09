"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, DollarSign, TrendingUp, Users, AlertCircle } from "lucide-react";

export default function AdminRevenuePage() {
  const { data: session } = useSession();
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadRevenue();
    }
  }, [session]);

  async function loadRevenue() {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      const data = await adminAPI.getRevenue(token);
      setRevenueData(data);
    } catch (error) {
      console.error("Failed to load revenue data:", error);
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

  if (!revenueData) {
    return <div className="p-8">No revenue data available</div>;
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
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-gray-500 mt-2">Track your SaaS revenue and growth</p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(revenueData.mrr.total)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(revenueData.mrr.arr)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Annual Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {revenueData.mrr.byPlan.reduce((sum: number, tier: any) => sum + tier.customerCount, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Paying subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
          <CardDescription>Breakdown of MRR by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.mrr.byPlan
              .filter((tier: any) => tier.plan !== 'free')
              .map((tier: any) => (
                <div key={tier.plan} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold text-lg capitalize">{tier.plan} Plan</p>
                    <p className="text-sm text-gray-500">
                      {tier.customerCount} customer{tier.customerCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(tier.mrr)}
                    </p>
                    <p className="text-sm text-gray-500">per month</p>
                  </div>
                </div>
              ))}

            {revenueData.mrr.byPlan.filter((tier: any) => tier.plan !== 'free').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No paid subscribers yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Churn Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Analysis</CardTitle>
          <CardDescription>Subscription cancellations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total Canceled</p>
                <p className="text-2xl font-bold">{revenueData.churn.totalCanceled}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Canceled (Last 30 Days)</p>
                <p className="text-2xl font-bold">{revenueData.churn.last30Days}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          {revenueData.churn.last30Days > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                <strong>Action needed:</strong> Reach out to recently churned customers for feedback
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue History */}
      {revenueData.history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue History</CardTitle>
            <CardDescription>Monthly subscription revenue (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.history.map((month: any) => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{formatDate(month.month)}</p>
                    <p className="text-sm text-gray-500">
                      {month.new_subscriptions} new subscription{month.new_subscriptions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(parseFloat(month.revenue))}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

