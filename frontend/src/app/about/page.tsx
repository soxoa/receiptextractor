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
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                We're on a Mission to Stop Vendor Overcharges
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every year, businesses lose billions to vendor pricing errors and overcharges. 
                We built ReceiptExtractor to automatically catch these issues before they cost you money.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
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
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Accuracy First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our AI achieves 95%+ accuracy in extracting pricing data, ensuring you catch every overcharge.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Speed Matters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Process invoices in under 10 seconds. Get results immediately, not days later.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your contracts and invoices are encrypted and secure. Multi-tenant isolation ensures privacy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Customer Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We succeed when you save money. Our goal is to help you catch every overcharge.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                Start Catching Overcharges Today
              </h2>
              <p className="max-w-[700px] text-purple-100 md:text-xl">
                Join hundreds of businesses saving thousands every month.
              </p>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="h-12 px-8">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 ReceiptExtractor. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link className="text-sm text-gray-500 hover:underline" href="/terms">Terms</Link>
            <Link className="text-sm text-gray-500 hover:underline" href="/privacy">Privacy</Link>
            <Link className="text-sm text-gray-500 hover:underline" href="/about">About</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

