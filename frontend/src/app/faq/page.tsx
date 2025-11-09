"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicLayout } from "@/components/PublicLayout";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "How does ReceiptExtractor work?", a: "ReceiptExtractor uses AI to extract pricing data from your vendor contracts and invoices. We then automatically compare every line item to catch price mismatches, unauthorized charges, and calculation errors. The entire process takes less than 10 seconds per invoice." },
      { q: "What file formats do you support?", a: "We support PDF, PNG, JPG, and Excel files (.xlsx, .xls). Our AI can extract data from scanned documents, photos of paper invoices, and digital files." },
      { q: "How accurate is the AI extraction?", a: "Our AI achieves 95%+ accuracy using Claude by Anthropic. We provide a confidence score with every extraction." },
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      { q: "What counts as an invoice?", a: "Each uploaded invoice document counts as one invoice, regardless of how many line items it contains." },
      { q: "Can I upgrade or downgrade my plan anytime?", a: "Yes! Changes take effect immediately. No long-term contracts." },
      { q: "Is there a free trial?", a: "Our Free plan includes 10 invoices per month with all features - it's a permanent trial. No credit card required." },
    ]
  },
  {
    category: "Features & Security",
    questions: [
      { q: "What types of discrepancies can you detect?", a: "We detect: Price Mismatches, Items Not in Contract, Calculation Errors, and Unit of Measure Mismatches." },
      { q: "How secure is my data?", a: "Very secure. All data encrypted in transit and at rest, JWT authentication, password hashing with bcrypt, multi-tenant isolation." },
      { q: "Can multiple team members use one account?", a: "Yes! All plans support multi-user organization access." },
    ]
  },
];

export default function FAQPage() {
  return (
    <PublicLayout>
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
        <div className="container px-6 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-stone-600">
              Everything you need to know about ReceiptExtractor
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-3xl font-black mb-6 text-red-600">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-2 border-stone-200 hover:border-red-300 transition-colors">
                        <CardHeader>
                          <CardTitle className="text-lg">{faq.q}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-stone-600">{faq.a}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-black mb-2">Still have questions?</h3>
              <p className="text-stone-600 mb-6">We're here to help!</p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <a href="mailto:support@receiptextractor.com">Email Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
