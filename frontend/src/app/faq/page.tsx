import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "Frequently Asked Questions - Invoice Verification Software",
  description: "Get answers to common questions about ReceiptExtractor's AI-powered invoice verification platform. Learn about pricing, features, security, integrations, and how we help businesses catch vendor overcharges automatically.",
  keywords: ["invoice verification FAQ", "vendor audit questions", "pricing agreement software help", "invoice checking how-to"],
  canonical: "https://frontend-one-tau-98.vercel.app/faq",
});

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How does ReceiptExtractor work?",
        a: "ReceiptExtractor uses AI to extract pricing data from your vendor contracts and invoices. We then automatically compare every line item to catch price mismatches, unauthorized charges, and calculation errors. The entire process takes less than 10 seconds per invoice."
      },
      {
        q: "What file formats do you support?",
        a: "We support PDF, PNG, JPG, and Excel files (.xlsx, .xls). Our AI can extract data from scanned documents, photos of paper invoices, and digital files. For best results, use clear, high-resolution images."
      },
      {
        q: "Do I need to manually enter pricing data?",
        a: "No! That's the beauty of ReceiptExtractor. Simply upload your pricing agreement or contract, and our AI automatically extracts all item codes, descriptions, and unit prices. Zero manual data entry required."
      },
      {
        q: "How accurate is the AI extraction?",
        a: "Our AI achieves 95%+ accuracy in extracting pricing data. We use Claude by Anthropic, one of the most advanced AI models available. For every extraction, we provide a confidence score so you know when to double-check results."
      },
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        q: "What counts as an invoice?",
        a: "Each uploaded invoice document counts as one invoice, regardless of how many line items it contains. A 100-line invoice counts the same as a 5-line invoice."
      },
      {
        q: "What happens if I exceed my monthly limit?",
        a: "You'll be prompted to upgrade your plan. We never process invoices beyond your limit without your permission. You can upgrade instantly and continue processing."
      },
      {
        q: "Can I upgrade or downgrade my plan anytime?",
        a: "Yes! Upgrade instantly through our Stripe integration. Downgrades take effect at the end of your current billing period. No long-term contracts or commitments."
      },
      {
        q: "Is there a free trial of paid plans?",
        a: "Our Free plan includes 10 invoices per month with all features unlocked - it's essentially a permanent trial. No credit card required to start."
      },
      {
        q: "Do you offer annual billing discounts?",
        a: "Not yet, but we're working on it! Annual plans will save you approximately 15-20% compared to monthly billing."
      },
    ]
  },
  {
    category: "Features & Capabilities",
    questions: [
      {
        q: "What types of discrepancies can you detect?",
        a: "We detect four main types: (1) Price Mismatches - when invoice prices don't match contracted rates, (2) Items Not in Contract - charges for items not in your agreement, (3) Calculation Errors - incorrect line total math, and (4) Unit of Measure Mismatches - when quantities don't align."
      },
      {
        q: "Can you handle multiple vendors?",
        a: "Absolutely! Upload pricing agreements for as many vendors as you work with. We'll automatically match invoices to the correct vendor and verify against their specific contract."
      },
      {
        q: "Do you send email alerts when discrepancies are found?",
        a: "Yes! You'll receive instant email alerts when overcharges are detected, including the total impact and a link to review details. You can also get weekly summary reports of your savings."
      },
      {
        q: "Can multiple team members use one account?",
        a: "Yes! Our organization feature allows multiple users to collaborate. All plans support multi-user access. Different team members can upload documents and review discrepancies."
      },
      {
        q: "Can I export my data?",
        a: "Yes! Export contract pricing to CSV, download discrepancy reports, and export invoice verification results. You own your data."
      },
    ]
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        q: "How secure is my data?",
        a: "Very secure. All data is encrypted in transit (HTTPS) and at rest. We use industry-standard security practices including JWT authentication, password hashing with bcrypt, and SQL injection prevention. Your data is isolated in a multi-tenant architecture."
      },
      {
        q: "Who can see my pricing agreements and invoices?",
        a: "Only you and your team members. Data is completely isolated per organization. Not even our support team can access your documents without explicit permission."
      },
      {
        q: "Where is data stored?",
        a: "Data is stored in secure PostgreSQL databases hosted on Railway's infrastructure in the United States. We use industry-standard backup and recovery procedures."
      },
      {
        q: "Do you sell or share data with third parties?",
        a: "Never. Your pricing agreements and invoices are confidential business information. We don't sell, rent, or share your data with anyone."
      },
    ]
  },
  {
    category: "Technical & Integration",
    questions: [
      {
        q: "Do you integrate with QuickBooks or other accounting software?",
        a: "Not yet, but it's on our roadmap! Currently, you can export data to CSV and import into your accounting system. API access is available on Pro and Enterprise plans."
      },
      {
        q: "Can I forward invoices via email?",
        a: "This feature is coming soon! You'll be able to forward invoices to forward@receiptextractor.com for automatic processing."
      },
      {
        q: "Do you have an API?",
        a: "Yes! API access is available on Pro ($149/month) and Enterprise plans. Integrate invoice verification into your existing workflows."
      },
      {
        q: "What AI model do you use?",
        a: "We use Claude by Anthropic, one of the most advanced AI models for document understanding. It excels at extracting structured data from complex documents like invoices and contracts."
      },
    ]
  },
  {
    category: "Billing & Support",
    questions: [
      {
        q: "How do I cancel my subscription?",
        a: "You can cancel anytime from Settings → Billing → Manage Subscription. Your account will remain active until the end of your current billing period, then automatically downgrade to the Free plan."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and Discover. We do not currently accept PayPal or cryptocurrency."
      },
      {
        q: "Do you offer refunds?",
        a: "We offer a 14-day money-back guarantee on your first paid month. If you're not satisfied, contact support for a full refund."
      },
      {
        q: "How can I contact support?",
        a: "Email us at support@receiptextractor.com. Starter plan customers get priority support with <24 hour response times. Pro customers get <12 hour response times."
      },
    ]
  },
];

export default function FAQPage() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/faq">FAQ</Link>
          <Link href="/sign-in"><Button variant="outline" size="sm">Sign In</Button></Link>
        </nav>
      </header>

      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">
              Everything you need to know about ReceiptExtractor
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold mb-6 text-purple-600">{category.category}</h2>
                <div className="space-y-6">
                  {category.questions.map((faq, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <Card className="mt-12 bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-4">
                  We're here to help! Contact our support team.
                </p>
                <Button asChild>
                  <a href="mailto:support@receiptextractor.com">Email Support</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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

