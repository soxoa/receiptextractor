import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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
    },
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "For small businesses and contractors",
      features: [
        "100 invoices per month",
        "All Free features",
        "Priority email support",
        "Advanced analytics",
        "Export to CSV",
        "Vendor management",
      ],
      cta: "Start Free Trial",
      href: "/sign-up",
      popular: true,
    },
    {
      name: "Pro",
      price: "$299",
      period: "/month",
      description: "For growing businesses with multiple locations",
      features: [
        "500 invoices per month",
        "All Starter features",
        "Multi-user access",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      cta: "Start Free Trial",
      href: "/sign-up",
      popular: false,
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
    },
  ];

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

      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Choose the plan that fits your business. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={plan.popular ? "border-purple-600 border-2 relative" : ""}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={plan.href} className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">What counts as an invoice?</h3>
              <p className="text-gray-500">
                Each uploaded invoice document counts as one invoice, regardless of how many line items it contains.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-500">
                Yes! You can upgrade or downgrade your plan at any time from your settings. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What happens if I exceed my monthly limit?</h3>
              <p className="text-gray-500">
                You'll be prompted to upgrade your plan. We'll never process invoices beyond your limit without your permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-500">
                The Free plan includes 10 invoices per month with all features unlocked. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What file formats do you support?</h3>
              <p className="text-gray-500">
                We support PDF, PNG, JPG, and Excel files. Our AI can extract data from scanned documents, photos, and digital files.
              </p>
            </div>
          </div>
        </div>
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

