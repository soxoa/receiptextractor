import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Upload, Search, AlertTriangle } from "lucide-react";

export default function LandingPage() {
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
          <Link href="/sign-in">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Stop Overpaying Vendors.
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Automatically.
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  AI-powered invoice verification that catches overcharges by comparing invoices against your negotiated pricing contracts.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8">
                    Start Free - 10 Invoices/Month
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-purple-600">$127k</span> recovered for <span className="font-semibold">200+</span> companies
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                How It Works
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Three simple steps to start saving money
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>1. Upload Your Contract</CardTitle>
                  <CardDescription>
                    Drag in your vendor pricing agreement or price list. Our AI extracts all pricing data automatically.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>2. Upload Invoices</CardTitle>
                  <CardDescription>
                    Upload vendor invoices. We compare every line item against your contracted pricing in seconds.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>3. See Instant Results</CardTitle>
                  <CardDescription>
                    Get detailed reports of overcharges, email alerts, and dispute templates. Recover your money fast.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Why ReceiptExtractor?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Zero Manual Data Entry</p>
                      <p className="text-sm text-gray-500">AI extracts everything. No forms, no spreadsheets.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Catch 95%+ of Overcharges</p>
                      <p className="text-sm text-gray-500">Advanced AI compares every item, every price.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Process in Seconds</p>
                      <p className="text-sm text-gray-500">Results in under 10 seconds per invoice.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Instant Email Alerts</p>
                      <p className="text-sm text-gray-500">Get notified immediately when overcharges are found.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Team Collaboration</p>
                      <p className="text-sm text-gray-500">Invite your team, manage vendors together.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-2xl">Real Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-4xl font-bold text-purple-600">$18,450</p>
                      <p className="text-sm text-gray-600">Average annual savings per customer</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-purple-600">3.2%</p>
                      <p className="text-sm text-gray-600">Average overcharge rate found</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-purple-600">8 sec</p>
                      <p className="text-sm text-gray-600">Average processing time per invoice</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                Start Saving Money Today
              </h2>
              <p className="max-w-[700px] text-purple-100 md:text-xl">
                Join hundreds of companies recovering thousands in overcharges every month.
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
            <Link className="text-sm text-gray-500 hover:underline" href="#">
              Terms
            </Link>
            <Link className="text-sm text-gray-500 hover:underline" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-gray-500 hover:underline" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

