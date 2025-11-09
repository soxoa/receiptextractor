"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, DollarSign, CheckCircle, Clock } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Pricing Agreement",
      description: "Upload your vendor contract or price list. Our AI extracts all pricing automatically.",
      icon: FileText,
      color: "from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      time: "~30 seconds"
    },
    {
      number: "02",
      title: "Upload Vendor Invoices",
      description: "Upload invoices from that vendor. AI compares every line item instantly.",
      icon: Upload,
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      time: "~10 seconds"
    },
    {
      number: "03",
      title: "Review & Recover Savings",
      description: "See overcharges highlighted, dispute with vendor, recover your money.",
      icon: DollarSign,
      color: "from-green-100 to-green-200",
      iconColor: "text-green-600",
      time: "~2 minutes"
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
        <div className="container px-6 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Catch Overcharges in
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              From upload to savings in under 2 minutes. No manual data entry. No spreadsheets. Just results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="w-full py-20 bg-white">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="grid md:grid-cols-2 gap-12 items-center"
                >
                  <div className={idx % 2 === 1 ? "md:order-2" : ""}>
                    <div className="text-sm font-mono font-bold text-stone-400 mb-4">{step.number}</div>
                    <h2 className="text-4xl font-black mb-4">{step.title}</h2>
                    <p className="text-xl text-stone-600 mb-6">{step.description}</p>
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Clock className="h-4 w-4" />
                      <span>Processing time: <strong className="text-red-600">{step.time}</strong></span>
                    </div>
                  </div>
                  
                  <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                    <Card className="p-8 border-2 border-stone-200 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                        <Icon className={`h-8 w-8 ${step.iconColor}`} />
                      </div>
                      <CardTitle className="text-2xl mb-4">What Happens:</CardTitle>
                      <ul className="space-y-3">
                        {[
                          "Drag and drop your file",
                          "AI extracts data instantly",
                          idx === 0 ? "Contract saved for verification" : idx === 1 ? "Automatic comparison" : "Get detailed report",
                          idx === 2 ? "Email alert sent" : "Review results"
                        ].map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-stone-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-red-100 mb-10">
              Join businesses catching overcharges in under 10 seconds per invoice.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-16 px-12 text-xl bg-white text-red-600 hover:bg-red-50 shadow-2xl hover:scale-105 transition-all duration-200 font-bold">
                Start Free - Catch Overcharges Now
              </Button>
            </Link>
            <p className="text-red-100 mt-6 text-sm">
              No credit card required • 2-minute setup • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
