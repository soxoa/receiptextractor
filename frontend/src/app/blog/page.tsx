"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

const blogPosts = [
  { title: "10 Common Ways Vendors Overcharge", slug: "10-ways-vendors-overcharge", excerpt: "Discover sneaky tactics vendors use and how to catch them.", author: "ReceiptExtractor Team", date: "Nov 8, 2025", category: "Best Practices", readTime: "8 min" },
  { title: "The True Cost of Manual Invoice Verification", slug: "cost-of-manual-verification", excerpt: "Hidden costs: labor hours, missed overcharges, delayed payments.", author: "Sarah Johnson", date: "Nov 5, 2025", category: "ROI Analysis", readTime: "6 min" },
  { title: "How AI is Transforming Invoice Verification", slug: "ai-invoice-verification", excerpt: "Why modern AI achieves 95%+ accuracy and what it means for you.", author: "Tech Team", date: "Nov 1, 2025", category: "Technology", readTime: "10 min" },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
        <div className="container px-6 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-stone-600">
              Invoice verification tips and vendor management strategies
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-stone-200 hover:border-red-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-medium">
                        {post.category}
                      </span>
                      <span className="text-stone-500">• {post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl leading-tight mb-2">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-stone-500 mb-4">
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
                      <Button variant="outline" className="w-full border-2 hover:border-red-600 hover:text-red-600">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
