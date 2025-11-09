"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Database, Clock, Mail, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminHealthPage() {
  const { data: session } = useSession();
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadHealth();
    }
  }, [session]);

  async function loadHealth() {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      const data = await adminAPI.getHealth(token);
      setHealthData(data);
    } catch (error) {
      console.error("Failed to load health data:", error);
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

  if (!healthData) {
    return <div className="p-8">No health data available</div>;
  }

  const hasErrors = healthData.errors.failedEmails.length > 0;

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
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-gray-500 mt-2">Monitor performance and errors</p>
        </div>
      </div>

      {/* Health Status */}
      <Card className={hasErrors ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {hasErrors ? (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            <div>
              <CardTitle className={hasErrors ? "text-yellow-900" : "text-green-900"}>
                {hasErrors ? 'System Running (Minor Issues)' : 'All Systems Operational'}
              </CardTitle>
              <CardDescription className={hasErrors ? "text-yellow-700" : "text-green-700"}>
                {hasErrors ? 'Some emails failed to send' : 'No issues detected'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Database Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-600" />
            <CardTitle>Database</CardTitle>
          </div>
          <CardDescription>PostgreSQL storage and table counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500 mb-2">Database Size</p>
              <p className="text-2xl font-bold">{healthData.database.size}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Table Row Counts:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Users:</span>
                  <span className="font-medium">{healthData.database.counts.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Orgs:</span>
                  <span className="font-medium">{healthData.database.counts.organizations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Invoices:</span>
                  <span className="font-medium">{healthData.database.counts.invoices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vendors:</span>
                  <span className="font-medium">{healthData.database.counts.vendors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contracts:</span>
                  <span className="font-medium">{healthData.database.counts.priceAgreements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Emails:</span>
                  <span className="font-medium">{healthData.database.counts.emails}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <CardTitle>Performance</CardTitle>
          </div>
          <CardDescription>AI processing times (last 7 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Average Time</span>
              </div>
              <p className="text-2xl font-bold">
                {(healthData.performance.avgProcessingTime / 1000).toFixed(1)}s
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Fastest</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {(healthData.performance.minProcessingTime / 1000).toFixed(1)}s
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Slowest</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {(healthData.performance.maxProcessingTime / 1000).toFixed(1)}s
              </p>
            </div>
          </div>

          {healthData.performance.avgProcessingTime > 15000 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Average processing time is high. Consider optimizing or scaling Claude API usage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Errors */}
      {healthData.errors.failedEmails.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-900">Failed Emails</CardTitle>
            </div>
            <CardDescription>Recent email delivery failures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthData.errors.failedEmails.map((email: any, idx: number) => (
                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-red-900">{email.recipient_email}</span>
                    <span className="text-xs text-red-600">{email.status}</span>
                  </div>
                  <p className="text-xs text-red-700">{email.subject}</p>
                  <p className="text-xs text-red-500 mt-1">{formatDate(email.sent_at)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://resend.com/logs" target="_blank" rel="noopener noreferrer">
                  Open Resend Logs
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

