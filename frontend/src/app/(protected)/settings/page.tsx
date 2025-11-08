"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { billingAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Users, Bell, User, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'profile');
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'billing' && session?.accessToken && session?.user?.organizationId) {
      loadBillingData();
    }
  }, [session, activeTab]);

  async function loadBillingData() {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) return;

      const [subData, usageData] = await Promise.all([
        billingAPI.getSubscription(token, organizationId),
        billingAPI.getUsage(token, organizationId),
      ]);

      setSubscription(subData);
      setUsage(usageData);
    } catch (error) {
      console.error("Failed to load billing data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planTier: string) {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) return;

      const { url } = await billingAPI.createCheckoutSession(planTier, token, organizationId);
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create checkout:", error);
      alert("Failed to start upgrade process. Please try again.");
    }
  }

  async function handleManageBilling() {
    try {
      const token = session?.accessToken as string;
      const organizationId = session?.user?.organizationId as string;
      
      if (!token || !organizationId) return;

      const { url } = await billingAPI.createPortalSession(token, organizationId);
      window.location.href = url;
    } catch (error) {
      console.error("Failed to open billing portal:", error);
      alert("Failed to open billing portal. Please try again.");
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
  ];

  const plans = [
    { tier: 'free', name: 'Free', price: 0, limit: 10, current: subscription?.planTier === 'free' },
    { tier: 'starter', name: 'Starter', price: 49, limit: 50, current: subscription?.planTier === 'starter' },
    { tier: 'pro', name: 'Pro', price: 149, limit: 300, current: subscription?.planTier === 'pro' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1 text-sm text-gray-600">{session?.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="mt-1 text-sm text-gray-600">{session?.user?.name || 'Not set'}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  To update your profile, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are on the <strong>{subscription?.planTier || 'free'}</strong> plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usage && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Usage</span>
                      <span className="text-sm text-gray-500">
                        {usage.currentMonth.count} / {usage.currentMonth.limit} invoices
                      </span>
                    </div>
                    <Progress value={usage.currentMonth.percentUsed} className="h-2" />
                  </div>

                  {subscription?.stripe_customer_id && (
                    <div className="pt-4 border-t">
                      <Button onClick={handleManageBilling} variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Billing
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Update payment method, view invoices, or cancel subscription
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Options */}
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>Choose a plan that fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.tier}
                    className={`border rounded-lg p-4 ${
                      plan.current ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">
                          {plan.price === 0 ? 'Free' : `$${plan.price}`}
                        </span>
                        {plan.price > 0 && <span className="text-gray-500">/month</span>}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>{plan.limit} invoices/month</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>All features included</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Email alerts</span>
                      </div>
                    </div>

                    {plan.current ? (
                      <Button disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : plan.tier === 'free' ? (
                      <Button variant="outline" disabled className="w-full">
                        Downgrade
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleUpgrade(plan.tier)}
                        className="w-full"
                      >
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage when you receive email alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Discrepancy Alerts</p>
                <p className="text-sm text-gray-500">Get notified when overcharges are found</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-gray-500">Receive a weekly report of your savings</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Processing Complete</p>
                <p className="text-sm text-gray-500">Get notified when invoices finish processing</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="pt-4 border-t">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage team members and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Team management is handled through your organization settings.
            </p>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Organization
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

