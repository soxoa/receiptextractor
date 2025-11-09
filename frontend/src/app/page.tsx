"use client";

import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AlertTriangle, ArrowRight, CheckCircle, Zap, Shield, TrendingUp, FileText, DollarSign } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="px-6 lg:px-8 h-20 flex items-center border-b border-stone-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/how-it-works">
            How it Works
          </Link>
          <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/pricing">
            Pricing
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="sm" className="border-stone-300">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Button>
          </Link>
        </nav>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section - Bento Box Layout */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="grid md:grid-cols-12 gap-6">
              {/* Main Hero - Takes 8 columns */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="md:col-span-8"
              >
                <div className="space-y-8">
                  <div className="inline-block">
                    <div className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Your vendors are overcharging you
                    </div>
                  </div>
                  
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                    Catch Vendor
                    <br />
                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                      Overcharges
                    </span>
                    <br />
                    In Seconds
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-stone-600 max-w-2xl leading-relaxed">
                    AI-powered invoice verification catches pricing errors before they cost you thousands. 
                    Upload, verify, save money. <span className="font-semibold text-stone-900">Automatically.</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/sign-up">
                      <Button 
                        size="lg" 
                        className="h-14 px-8 text-lg bg-red-600 hover:bg-red-700 shadow-2xl hover:shadow-red-200 hover:scale-105 transition-all duration-200"
                      >
                        Catch Your First Overcharge
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/how-it-works">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-14 px-8 text-lg border-2 border-stone-300 hover:border-red-600 hover:text-red-600"
                      >
                        See How It Works
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-stone-600">Free tier • No credit card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <span className="text-stone-600">Results in 10 seconds</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid - 4 columns */}
              <div className="md:col-span-4 grid grid-rows-3 gap-6">
                {/* Total Saved */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-2">
                      <DollarSign className="h-4 w-4" />
                      Total Recovered
                    </div>
                    <div className="text-4xl font-black text-green-700">
                      $<AnimatedCounter end={127} suffix="k" />
                    </div>
                    <p className="text-sm text-green-600 mt-1">for 200+ companies</p>
                  </Card>
                </motion.div>

                {/* Accuracy */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-2">
                      <Shield className="h-4 w-4" />
                      AI Accuracy
                    </div>
                    <div className="text-4xl font-black text-blue-700">
                      <AnimatedCounter end={95} suffix="%" />
                    </div>
                    <p className="text-sm text-blue-600 mt-1">overcharge detection</p>
                  </Card>
                </motion.div>

                {/* Speed */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold mb-2">
                      <Zap className="h-4 w-4" />
                      Avg Speed
                    </div>
                    <div className="text-4xl font-black text-amber-700">
                      <AnimatedCounter end={8} decimals={1} />s
                    </div>
                    <p className="text-sm text-amber-600 mt-1">per invoice</p>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section - Bento Grid */}
        <section className="w-full py-20 bg-white">
          <div className="container px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                Stop Losing Money to
                <span className="text-red-600"> "Billing Errors"</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Manual invoice checking catches 30% of overcharges. Our AI catches 95%+.
              </p>
            </motion.div>

            {/* Bento Box Grid */}
            <div className="grid md:grid-cols-12 gap-6">
              {/* Large feature box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-7"
              >
                <Card className="p-10 h-full bg-gradient-to-br from-red-600 to-red-700 border-0 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                        <AlertTriangle className="h-7 w-7" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">The Problem</h3>
                      <p className="text-red-100 text-lg leading-relaxed">
                        Vendors quietly increase prices, charge for items not in your contract, make "calculation errors," 
                        and hope you won't notice among hundreds of line items.
                      </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <div className="text-5xl font-black mb-2">$30,000</div>
                      <p className="text-red-100">Average annual loss from undetected overcharges</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Two stacked boxes */}
              <div className="md:col-span-5 grid grid-rows-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-600 border-0 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">10 Seconds</h3>
                    <p className="text-green-100">
                      vs 5 hours of manual checking. AI processes invoices 1,800x faster.
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-amber-500 to-orange-500 border-0 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">95% Detection</h3>
                    <p className="text-amber-100">
                      vs 30% with manual review. Miss fewer overcharges, save more money.
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Wide stats box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="md:col-span-12"
              >
                <Card className="p-10 bg-white/50 backdrop-blur-sm border-2 border-stone-200 hover:border-red-300 transition-colors">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-black text-stone-900 mb-2">
                        <AnimatedCounter end={18450} prefix="$" />
                      </div>
                      <p className="text-sm text-stone-600 font-medium">Avg annual savings</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-stone-900 mb-2">
                        <AnimatedCounter end={3.2} decimals={1} suffix="%" />
                      </div>
                      <p className="text-sm text-stone-600 font-medium">Avg overcharge rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-stone-900 mb-2">
                        <AnimatedCounter end={8} decimals={1} suffix="s" />
                      </div>
                      <p className="text-sm text-stone-600 font-medium">Processing time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-stone-900 mb-2">
                        <AnimatedCounter end={200} suffix="+" />
                      </div>
                      <p className="text-sm text-stone-600 font-medium">Businesses trust us</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works - Visual Process */}
        <section className="w-full py-20 bg-gradient-to-b from-stone-50 to-white">
          <div className="container px-6 mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-black mb-4">Three Steps to Start Saving</h2>
              <p className="text-xl text-stone-600">From upload to results in under 2 minutes</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Contract",
                  description: "Drop your pricing agreement. AI extracts all prices instantly.",
                  icon: FileText,
                  color: "blue"
                },
                {
                  step: "02",
                  title: "Upload Invoice",
                  description: "Upload vendor invoice. AI compares every line item automatically.",
                  icon: FileText,
                  color: "purple"
                },
                {
                  step: "03",
                  title: "See Savings",
                  description: "Get detailed overcharge report. Dispute with vendor. Recover money.",
                  icon: DollarSign,
                  color: "green"
                }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-stone-200 hover:border-red-300 h-full">
                      <div className="text-sm font-mono font-bold text-stone-400 mb-4">{step.step}</div>
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                        step.color === 'blue' ? 'from-blue-100 to-blue-200' :
                        step.color === 'purple' ? 'from-purple-100 to-purple-200' :
                        'from-green-100 to-green-200'
                      } flex items-center justify-center mb-6`}>
                        <Icon className={`h-7 w-7 ${
                          step.color === 'blue' ? 'text-blue-600' :
                          step.color === 'purple' ? 'text-purple-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-stone-600 leading-relaxed">{step.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full py-20 bg-white">
          <div className="container px-6 mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-8">
                Trusted by businesses catching overcharges daily
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
                {['Ferguson Supply', 'Home Depot Pro', 'Sysco', 'Grainger', 'HD Supply', 'Fastenal'].map((company) => (
                  <div key={company} className="text-2xl font-bold text-stone-400">
                    {company}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              {[
                {
                  quote: "Caught $18k in overcharges in our first 3 months. This tool paid for itself 100x over.",
                  author: "Mike Rodriguez",
                  title: "General Contractor",
                  savings: "$18,450"
                },
                {
                  quote: "Saves our team 15 hours every week. The AI is faster and more accurate than our accountant.",
                  author: "Sarah Chen",
                  title: "Facilities Director",
                  savings: "$31,200"
                },
                {
                  quote: "Found pricing errors we missed for 8 months. Recovered everything and renegotiated our contract.",
                  author: "James Wilson",
                  title: "Procurement Manager",
                  savings: "$24,500"
                }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Card className="p-8 border-2 border-stone-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-stone-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                      <div>
                        <p className="font-semibold text-stone-900">{testimonial.author}</p>
                        <p className="text-sm text-stone-500">{testimonial.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-600">{testimonial.savings}</div>
                        <div className="text-xs text-stone-500">saved/year</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Different Layout */}
        <section className="w-full py-20 bg-stone-50">
          <div className="container px-6 mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-black mb-4">Built for Speed & Accuracy</h2>
              <p className="text-xl text-stone-600">Enterprise-grade features at startup pricing</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Zero Manual Entry", description: "AI extracts everything. No forms. No spreadsheets. Just upload and go.", icon: Zap },
                { title: "Instant Email Alerts", description: "Get notified the second an overcharge is detected. Never miss a billing error.", icon: AlertTriangle },
                { title: "Searchable Contracts", description: "Find any item across all your pricing agreements in seconds. Export to CSV anytime.", icon: FileText },
                { title: "Multi-Vendor Support", description: "Manage unlimited vendors. Each gets their own contract library and verification rules.", icon: CheckCircle },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-8 border-2 border-stone-200 hover:border-red-300 hover:shadow-lg transition-all duration-200 group">
                      <Icon className="h-8 w-8 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-stone-600">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA - Bold */}
        <section className="w-full py-32 bg-gradient-to-br from-red-600 via-red-600 to-orange-600 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="container px-6 mx-auto max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Ready to Stop
                <br />
                Getting Overcharged?
              </h2>
              <p className="text-2xl text-red-100 mb-10 max-w-2xl mx-auto">
                Join 200+ businesses saving thousands every month. Start free, upgrade when you see results.
              </p>
              <Link href="/sign-up">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-xl bg-white text-red-600 hover:bg-red-50 shadow-2xl hover:scale-105 transition-all duration-200 font-bold"
                >
                  Start Free - Catch Overcharges Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <p className="text-red-100 mt-6 text-sm">
                Free plan • 10 invoices/month • No credit card • 2-minute setup
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-6 border-t border-stone-200 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-4 block">
                ReceiptExtractor
              </span>
              <p className="text-sm text-stone-600">
                Stop overpaying vendors with AI-powered invoice verification.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-stone-900">Product</h3>
              <div className="space-y-2 text-sm">
                <Link href="/how-it-works" className="block text-stone-600 hover:text-red-600">How It Works</Link>
                <Link href="/pricing" className="block text-stone-600 hover:text-red-600">Pricing</Link>
                <Link href="/use-cases" className="block text-stone-600 hover:text-red-600">Use Cases</Link>
                <Link href="/faq" className="block text-stone-600 hover:text-red-600">FAQ</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-stone-900">Company</h3>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-stone-600 hover:text-red-600">About</Link>
                <Link href="/blog" className="block text-stone-600 hover:text-red-600">Blog</Link>
                <a href="mailto:support@receiptextractor.com" className="block text-stone-600 hover:text-red-600">Contact</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-stone-900">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="/terms" className="block text-stone-600 hover:text-red-600">Terms</Link>
                <Link href="/privacy" className="block text-stone-600 hover:text-red-600">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-200 text-center text-sm text-stone-500">
            © 2025 ReceiptExtractor. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ReceiptExtractor",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "0",
              "highPrice": "149",
              "priceCurrency": "USD"
            },
            "description": "AI-powered invoice verification software that automatically catches vendor overcharges by comparing invoices against pricing contracts.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })
        }}
      />
    </div>
  );
}
