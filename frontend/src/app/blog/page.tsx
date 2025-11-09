import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog - Invoice Verification Tips, Guides & Best Practices",
  description: "Learn how to catch vendor overcharges, negotiate better pricing contracts, and optimize your procurement process. Expert guides on invoice verification, vendor management, and cost savings strategies.",
  keywords: ["invoice verification blog", "vendor management tips", "procurement best practices", "cost savings guides"],
  canonical: "https://frontend-one-tau-98.vercel.app/blog",
});

const blogPosts = [
  {
    title: "10 Common Ways Vendors Overcharge (And How to Catch Them)",
    slug: "10-ways-vendors-overcharge",
    excerpt: "Discover the most common tactics vendors use to increase prices without you noticing. From quiet price increases to unauthorized substitutions, learn what to watch for.",
    author: "ReceiptExtractor Team",
    date: "November 8, 2025",
    category: "Best Practices",
    readTime: "8 min read"
  },
  {
    title: "The True Cost of Manual Invoice Verification",
    slug: "cost-of-manual-verification",
    excerpt: "Manual invoice checking costs more than you think. We break down the hidden costs: labor hours, missed overcharges, delayed payments, and opportunity cost.",
    author: "Sarah Johnson",
    date: "November 5, 2025",
    category: "ROI Analysis",
    readTime: "6 min read"
  },
  {
    title: "How AI is Transforming Invoice Verification",
    slug: "ai-invoice-verification",
    excerpt: "Explore how modern AI technology like Claude can extract data from complex documents with 95%+ accuracy, and why this matters for your business.",
    author: "Tech Team",
    date: "November 1, 2025",
    category: "Technology",
    readTime: "10 min read"
  },
  {
    title: "Negotiating Better Vendor Contracts: A Complete Guide",
    slug: "negotiate-vendor-contracts",
    excerpt: "Learn proven strategies to negotiate better pricing with your vendors. Includes templates, tactics, and real examples from businesses that saved 15-30% on vendor costs.",
    author: "Procurement Expert",
    date: "October 28, 2025",
    category: "Procurement",
    readTime: "12 min read"
  },
  {
    title: "Case Study: How a Contractor Saved $24,500 in 6 Months",
    slug: "contractor-case-study",
    excerpt: "Real story of how a mid-sized construction company used ReceiptExtractor to uncover systematic overcharging by their primary lumber supplier.",
    author: "Customer Success",
    date: "October 25, 2025",
    category: "Case Study",
    readTime: "7 min read"
  },
  {
    title: "Price Agreement Management: Best Practices for 2025",
    slug: "price-agreement-best-practices",
    excerpt: "Master the art of managing vendor pricing agreements. Learn how to organize contracts, track expiration dates, and ensure compliance across your organization.",
    author: "Operations Expert",
    date: "October 20, 2025",
    category: "Best Practices",
    readTime: "9 min read"
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/blog">Blog</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
          <Link href="/sign-in"><Button variant="outline" size="sm">Sign In</Button></Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">ReceiptExtractor Blog</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Invoice verification tips, vendor management guides, and cost savings strategies
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl leading-tight mb-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-2xl">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
                <p className="text-gray-600 mb-6">
                  Get the latest invoice verification tips and vendor management strategies delivered to your inbox.
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">We respect your privacy. Unsubscribe anytime.</p>
              </CardContent>
            </Card>
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

