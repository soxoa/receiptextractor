"use client";

import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, TrendingUp, Crown } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out ReceiptExtractor",
      features: [
        "10 invoices per month",
        "All features unlocked",
        "Email support",
        "AI-powered extraction",
        "Discrepancy detection",
        "Email alerts",
      ],
      cta: "Get Started",
      href: "/sign-up",
      popular: false,
      icon: Zap,
      color: "from-stone-100 to-stone-200",
      textColor: "text-stone-700"
    },
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "For small businesses and contractors",
      features: [
        "50 invoices per month",
        "All Free features",
        "Priority email support",
        "Advanced analytics",
        "Export to CSV",
        "Vendor management",
      ],
      cta: "Start Free Trial",
      href: "/sign-up",
      popular: true,
      icon: TrendingUp,
      color: "from-blue-50 to-indigo-100",
      textColor: "text-blue-700"
    },
    {
      name: "Pro",
      price: "$149",
      period: "/month",
      description: "For growing businesses with multiple locations",
      features: [
        "300 invoices per month",
        "All Starter features",
        "Multi-user access",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Priority processing",
      ],
      cta: "Start Free Trial",
      href: "/sign-up",
      popular: false,
      icon: Crown,
      color: "from-purple-50 to-purple-100",
      textColor: "text-purple-700"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited invoices",
        "All Pro features",
        "Dedicated account manager",
        "Custom integrations",
        "QuickBooks/NetSuite sync",
        "White-label option",
        "99.9% uptime SLA",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@receiptextractor.com",
      popular: false,
      icon: Crown,
      color: "from-amber-50 to-orange-100",
      textColor: "text-amber-700"
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
        <div className="container px-6 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              Simple, Transparent Pricing
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Savings Plan
              </span>
            </h1>
            
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Start free, upgrade when you see results. No contracts. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full py-12 pb-20 bg-stone-50">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card 
                    className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full ${
                      plan.popular ? "border-2 border-red-500 shadow-lg" : "border-2 border-stone-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </div>
                    )}
                    
                    <CardHeader className="pb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                        <Icon className={`h-7 w-7 ${plan.textColor}`} />
                      </div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-stone-600">{plan.description}</CardDescription>
                      <div className="mt-6">
                        <span className="text-5xl font-black">{plan.price}</span>
                        {plan.period && <span className="text-stone-500 text-lg">{plan.period}</span>}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-8">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-stone-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter>
                      <Link href={plan.href} className="w-full">
                        <Button 
                          className={`w-full h-12 font-semibold transition-all duration-200 ${
                            plan.popular 
                              ? "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl hover:scale-105" 
                              : "bg-stone-100 hover:bg-stone-200 text-stone-900"
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black mb-6">Every Plan Includes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "95% Accuracy", description: "AI catches overcharges you'd miss manually" },
                { title: "10s Processing", description: "Results in seconds, not hours of work" },
                { title: "$18k Avg Savings", description: "Customers save this much per year" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 border-2 border-stone-200 hover:border-green-300 transition-colors">
                    <div className="text-3xl font-black text-stone-900 mb-2">{item.title}</div>
                    <p className="text-sm text-stone-600">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-black text-center mb-12">Pricing FAQs</h2>
            
            {[
              {
                q: "What counts as an invoice?",
                a: "Each uploaded invoice document counts as one invoice, regardless of how many line items it contains."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes! You can upgrade or downgrade your plan at any time from your settings. Changes take effect immediately."
              },
              {
                q: "What happens if I exceed my monthly limit?",
                a: "You'll be prompted to upgrade your plan. We'll never process invoices beyond your limit without your permission."
              },
              {
                q: "Is there a free trial?",
                a: "The Free plan includes 10 invoices per month with all features unlocked. No credit card required to start."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 border-2 border-stone-200 hover:border-red-200 transition-colors">
                  <h3 className="font-bold text-lg mb-2 text-stone-900">{faq.q}</h3>
                  <p className="text-stone-600">{faq.a}</p>
                </Card>
              </motion.div>
            ))}

            <div className="text-center mt-8">
              <Link href="/faq" className="text-red-600 hover:underline font-medium">
                View All FAQs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-gradient-to-br from-red-600 via-red-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container px-6 mx-auto max-w-4xl relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Start Saving Money Today
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of companies recovering thousands in overcharges every month.
            </p>
            <Link href="/sign-up">
              <Button 
                size="lg" 
                className="h-16 px-12 text-xl bg-white text-red-600 hover:bg-red-50 shadow-2xl hover:scale-105 transition-all duration-200 font-bold"
              >
                Get Started Free
              </Button>
            </Link>
            <p className="text-red-100 mt-6 text-sm">
              Free plan • 10 invoices/month • No credit card • 2-minute setup
            </p>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
