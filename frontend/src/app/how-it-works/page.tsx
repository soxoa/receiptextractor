import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, AlertCircle, CheckCircle, Mail, FileText } from "lucide-react";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "How It Works - AI-Powered Invoice Verification in 3 Steps",
  description: "Learn how ReceiptExtractor automatically catches vendor overcharges. Upload your pricing contract, upload invoices, and our AI compares prices instantly. See how businesses save $18,450/year on average. Step-by-step guide with examples.",
  keywords: ["how invoice verification works", "automatic invoice checking process", "AI invoice audit tutorial", "vendor overcharge detection guide"],
  canonical: "https://frontend-one-tau-98.vercel.app/how-it-works",
});

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Upload Your Pricing Agreement",
      description: "Upload your vendor contract or price list (PDF, image, or Excel). Our AI automatically extracts the vendor name, contract dates, and all pricing information.",
      icon: Upload,
      details: [
        "Drag and drop your contract file",
        "AI extracts vendor info and all prices in ~10 seconds",
        "Review extracted items (optional)",
        "Contract saved and ready for verification"
      ],
      time: "~30 seconds"
    },
    {
      number: 2,
      title: "Upload Vendor Invoices",
      description: "Upload invoices from that vendor. Our AI extracts all line items and compares them against your contracted pricing automatically.",
      icon: FileText,
      details: [
        "Upload invoice (PDF, image, or Excel)",
        "AI extracts all line items and prices",
        "Automatic comparison against your contract",
        "Instant verification results"
      ],
      time: "~10 seconds"
    },
    {
      number: 3,
      title: "Review Discrepancies",
      description: "See exactly which items were overcharged, by how much, and get actionable insights to dispute charges with your vendor.",
      icon: AlertCircle,
      details: [
        "See highlighted overcharges in red",
        "Review expected vs actual prices",
        "Calculate total financial impact",
        "Export dispute report for vendor",
        "Get email alerts automatically"
      ],
      time: "~2 minutes"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/how-it-works">How It Works</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
          <Link href="/sign-in"><Button variant="outline" size="sm">Sign In</Button></Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
              Catch Overcharges in 3 Simple Steps
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From upload to savings in under 2 minutes. No manual data entry. No spreadsheets. Just results.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="space-y-16">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-3xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="h-8 w-8 text-purple-600" />
                        <h2 className="text-3xl font-bold">{step.title}</h2>
                      </div>
                      
                      <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">What Happens:</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{detail}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <span className="text-sm text-gray-500">Processing time:</span>
                            <span className="font-semibold text-purple-600">{step.time}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Example */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Real Example</h2>
            
            <div className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    You Upload: Ferguson Supply Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-3">AI Extracts:</p>
                  <div className="bg-white border rounded p-3 font-mono text-sm space-y-1">
                    <div>PVC-100: 1" PVC Pipe - $2.45/ft</div>
                    <div>PVC-150: 1.5" PVC Pipe - $3.89/ft</div>
                    <div>VALVE-001: Ball Valve 1" - $12.50/ea</div>
                    <div className="text-gray-400">... 139 more items</div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-2xl">↓</div>

              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    You Upload: Ferguson Invoice #12345
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-3">AI Extracts & Compares:</p>
                  <div className="bg-white border rounded p-3 font-mono text-sm space-y-1">
                    <div className="text-green-600">✓ PVC-100: $2.45/ft (correct)</div>
                    <div className="text-red-600">✗ PVC-150: $4.25/ft (expected $3.89)</div>
                    <div className="text-green-600">✓ VALVE-001: $12.50/ea (correct)</div>
                    <div className="text-gray-400">... analyzing 23 line items</div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-2xl">↓</div>

              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <AlertCircle className="h-5 w-5" />
                    Result: Overcharge Detected
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-white border border-red-200 rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">Found 1 pricing issue:</span>
                      <span className="text-2xl font-bold text-red-600">$36.00</span>
                    </div>
                    <div className="text-sm text-gray-700 bg-red-50 p-3 rounded">
                      <strong>PVC-150 (1.5" PVC Pipe):</strong><br />
                      Expected: $3.89/ft × 100ft = $389.00<br />
                      Charged: $4.25/ft × 100ft = $425.00<br />
                      <span className="text-red-700 font-semibold">Overcharged by $36.00</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">Dispute with Vendor</Button>
                      <Button size="sm" variant="outline">Download Report</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Mail className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <p className="text-gray-600">
                  <strong>Email alert sent automatically:</strong><br />
                  "🚨 Found $36.00 in overcharges on Ferguson Supply invoice"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join businesses catching overcharges in under 10 seconds per invoice.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8">
                Start Free - 10 Invoices/Month
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">No credit card required • 2-minute setup • Cancel anytime</p>
          </div>
        </section>
      </main>

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

