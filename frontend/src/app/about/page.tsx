import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, Shield, Heart } from "lucide-react";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us - Stop Vendor Overcharges with AI",
  description: "ReceiptExtractor was built to help businesses automatically catch vendor overcharges. Our AI-powered platform has saved customers over $127,000 by comparing invoices against contracted pricing. Learn our story and mission.",
  keywords: ["invoice verification company", "vendor audit software", "procurement automation", "invoice compliance"],
  canonical: "https://frontend-one-tau-98.vercel.app/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
          <div className="container px-6 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                We're on a Mission to
                <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Stop Vendor Overcharges
                </span>
              </h1>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Every year, businesses lose billions to vendor pricing errors and overcharges. 
                We built ReceiptExtractor to automatically catch these issues before they cost you money.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="w-full py-20 bg-white">
          <div className="container px-6 mx-auto max-w-4xl">
            <h2 className="text-4xl font-black mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-stone-600 space-y-4">
              <p>
                ReceiptExtractor was born from a frustrating discovery: A facilities management company found they'd been 
                overcharged $18,000 by a trusted vendor over just six months. The vendor had quietly increased prices on 
                dozens of items, hoping no one would notice.
              </p>
              <p>
                Manual invoice verification is tedious, error-prone, and time-consuming. Even with a dedicated team, 
                it's nearly impossible to check every line item on every invoice against your pricing agreements.
              </p>
              <p>
                We knew there had to be a better way. Using advanced AI technology, we built ReceiptExtractor to 
                automatically extract pricing data from contracts and invoices, then compare them instantly. 
                What used to take hours now takes seconds.
              </p>
              <p>
                Today, we help hundreds of businesses catch overcharges before they become losses. Our customers have 
                recovered over $127,000 in vendor overcharges, with an average savings of $18,450 per year.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="w-full py-20 bg-stone-50">
          <div className="container px-6 mx-auto max-w-6xl">
            <h2 className="text-4xl font-black mb-12 text-center">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Target, title: "Accuracy First", description: "Our AI achieves 95%+ accuracy in extracting pricing data, ensuring you catch every overcharge.", color: "from-red-100 to-red-200", iconColor: "text-red-600" },
                { icon: Zap, title: "Speed Matters", description: "Process invoices in under 10 seconds. Get results immediately, not days later.", color: "from-amber-100 to-amber-200", iconColor: "text-amber-600" },
                { icon: Shield, title: "Data Security", description: "Your contracts and invoices are encrypted and secure. Multi-tenant isolation ensures privacy.", color: "from-blue-100 to-blue-200", iconColor: "text-blue-600" },
                { icon: Heart, title: "Customer Success", description: "We succeed when you save money. Our goal is to help you catch every overcharge.", color: "from-green-100 to-green-200", iconColor: "text-green-600" }
              ].map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-8 border-2 border-stone-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 h-full">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6`}>
                        <Icon className={`h-7 w-7 ${value.iconColor}`} />
                      </div>
                      <CardTitle className="text-xl mb-3">{value.title}</CardTitle>
                      <p className="text-stone-600">{value.description}</p>
                    </Card>
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
                Start Catching Overcharges Today
              </h2>
              <p className="text-xl text-red-100 mb-10">
                Join hundreds of businesses saving thousands every month.
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="h-16 px-12 text-xl bg-white text-red-600 hover:bg-red-50 shadow-2xl hover:scale-105 transition-all duration-200 font-bold">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

