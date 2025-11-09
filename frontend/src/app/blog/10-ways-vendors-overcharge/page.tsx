import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "10 Common Ways Vendors Overcharge Businesses (2025 Guide)",
  description: "Discover the sneaky tactics vendors use to overcharge businesses. Learn how to catch quiet price increases, unauthorized substitutions, incorrect calculations, and more. Real examples and solutions included.",
  keywords: ["vendor overcharging tactics", "invoice fraud detection", "vendor billing errors", "price increase detection", "invoice audit checklist"],
  canonical: "https://frontend-one-tau-98.vercel.app/blog/10-ways-vendors-overcharge",
});

export default function BlogPost() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <article className="prose prose-lg max-w-none">
            <h1>10 Common Ways Vendors Overcharge (And How to Catch Them)</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 not-prose mb-8">
              <span>By ReceiptExtractor Team</span>
              <span>•</span>
              <span>November 8, 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>

            <p className="lead">
              Every year, businesses lose billions to vendor overcharges. Most aren't fraud - they're "mistakes" 
              that quietly inflate your costs. Here are the 10 most common tactics and how to catch them.
            </p>

            <h2>1. Quiet Price Increases</h2>
            <p>
              <strong>The Tactic:</strong> Vendors gradually increase prices on individual items without notification, 
              hoping you won't notice amidst dozens of line items.
            </p>
            <p>
              <strong>Real Example:</strong> A facilities company's HVAC supplier increased filter prices from $12.50 
              to $14.75 each. Over 240 filters per year, that's $540 in unexpected costs.
            </p>
            <p>
              <strong>How to Catch:</strong> Compare every invoice line item against your pricing agreement. 
              ReceiptExtractor does this automatically, flagging any price that doesn't match your contract.
            </p>

            <h2>2. Unauthorized Substitutions</h2>
            <p>
              <strong>The Tactic:</strong> Charging premium prices for standard products, or billing for brand-name 
              items while delivering generic alternatives.
            </p>
            <p>
              <strong>Real Example:</strong> A restaurant ordered "Grade A eggs" at $3.20/dozen but received standard 
              eggs worth $2.40/dozen. Over a year: $4,160 in overcharges.
            </p>
            <p>
              <strong>How to Catch:</strong> Match item codes exactly. Flag when descriptions don't align with codes. 
              Verify unit of measure matches what you ordered.
            </p>

            <h2>3. Calculation Errors</h2>
            <p>
              <strong>The Tactic:</strong> "Accidentally" miscalculating line totals, subtotals, or applying incorrect tax rates.
            </p>
            <p>
              <strong>Real Example:</strong> 24 units × $45.00 should equal $1,080.00, but invoice shows $1,180.00. 
              That's $100 in a single line item. Multiply across invoices...
            </p>
            <p>
              <strong>How to Catch:</strong> Verify that quantity × unit price = line total on every single line. 
              AI can do this in milliseconds while humans miss errors in complex invoices.
            </p>

            <h2>4. Expired Contract Pricing</h2>
            <p>
              <strong>The Tactic:</strong> After your pricing agreement expires, vendors charge higher "list prices" 
              without notification, banking on you not tracking contract renewal dates.
            </p>
            <p>
              <strong>Real Example:</strong> A contractor's supplier contract expired in December. In January, prices 
              increased 8% across the board - $1,200 extra per month.
            </p>
            <p>
              <strong>How to Catch:</strong> Track contract expiration dates. Set reminders 60 days before expiry. 
              Verify invoices against the currently active contract only.
            </p>

            <h2>5. Duplicate Charges</h2>
            <p>
              <strong>The Tactic:</strong> Billing for the same item or service twice, either on the same invoice or 
              across multiple invoices.
            </p>
            <p>
              <strong>How to Catch:</strong> Cross-reference invoice numbers and dates. Flag suspiciously similar 
              line items. ReceiptExtractor can detect patterns across multiple invoices.
            </p>

            <h2>6. Unit of Measure Games</h2>
            <p>
              <strong>The Tactic:</strong> Switching from "per case" pricing to "per unit" or "per foot" to "per yard" 
              without adjusting the price proportionally.
            </p>
            <p>
              <strong>Real Example:</strong> Vendor switches from $24.00/case (12 units) to $2.50/unit. Looks similar, 
              but that's $30.00/case - a 25% increase!
            </p>
            <p>
              <strong>How to Catch:</strong> Always verify unit of measure matches your contract. Our AI flags 
              unit mismatches automatically.
            </p>

            <h2>7. Quantity Discrepancies</h2>
            <p>
              <strong>The Tactic:</strong> Billing for quantities you didn't receive. Invoice says 100 units, 
              you received 95.
            </p>
            <p>
              <strong>How to Catch:</strong> Count delivered items (or at least spot-check). Compare invoice quantities 
              against delivery receipts. Our system can integrate with receiving processes.
            </p>

            <h2>8. Hidden Fees</h2>
            <p>
              <strong>The Tactic:</strong> Adding delivery charges, fuel surcharges, processing fees, or other charges 
              not specified in your agreement.
            </p>
            <p>
              <strong>Real Example:</strong> A $15 "fuel surcharge" on every delivery. 20 deliveries/month = $300/month 
              in unauthorized fees = $3,600/year.
            </p>
            <p>
              <strong>How to Catch:</strong> Review your pricing agreement for fee terms. Flag any charges not 
              explicitly authorized in your contract.
            </p>

            <h2>9. Minimum Order Penalties</h2>
            <p>
              <strong>The Tactic:</strong> Charging minimum order fees when your contract says otherwise, or applying 
              fees at incorrect thresholds.
            </p>
            <p>
              <strong>How to Catch:</strong> Know your contract terms. Verify minimum order amounts. Track when fees 
              are applied and ensure they match agreed terms.
            </p>

            <h2>10. Outdated Volume Discounts</h2>
            <p>
              <strong>The Tactic:</strong> Not applying volume discounts you've earned, or using old discount tiers 
              when you've negotiated better rates.
            </p>
            <p>
              <strong>Real Example:</strong> Contract says 5% discount on orders over $1,000. Your $1,500 order doesn't 
              get the discount. That's $75 lost per order.
            </p>
            <p>
              <strong>How to Catch:</strong> Ensure volume discounts are applied correctly. ReceiptExtractor can handle 
              tiered pricing and conditional discounts.
            </p>

            <h2>The Bottom Line</h2>
            <p>
              These "small" overcharges add up fast. A business processing 50 invoices per month, with an average of 
              $50 in overcharges per invoice, loses <strong>$30,000 per year</strong>.
            </p>
            <p>
              Manual verification catches maybe 20-30% of these issues. AI-powered verification catches 95%+.
            </p>

            <Card className="not-prose my-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-3">Stop Getting Overcharged</h3>
                <p className="text-gray-700 mb-6">
                  ReceiptExtractor automatically catches all 10 of these tactics (and more) in under 10 seconds per invoice.
                </p>
                <Link href="/sign-up">
                  <Button size="lg">
                    Start Free - Catch Your First Overcharge
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <h2>How ReceiptExtractor Helps</h2>
            <ul>
              <li><strong>Automatic Comparison:</strong> Every line item checked against your contract</li>
              <li><strong>Instant Alerts:</strong> Email notification within seconds of finding overcharges</li>
              <li><strong>Detailed Reports:</strong> Exactly what was wrong and how much it cost you</li>
              <li><strong>Dispute Templates:</strong> Professional reports to send your vendor</li>
              <li><strong>Trend Analysis:</strong> See which vendors overcharge most frequently</li>
            </ul>

            <p>
              Don't let vendors take advantage of manual review limitations. <Link href="/sign-up">Try ReceiptExtractor free</Link> 
              and start catching overcharges today.
            </p>
          </article>
        </div>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 ReceiptExtractor. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link className="text-sm text-gray-500 hover:underline" href="/terms">Terms</Link>
            <Link className="text-sm text-gray-500 hover:underline" href="/privacy">Privacy</Link>
            <Link className="text-sm text-gray-500 hover:underline" href="/blog">Blog</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

