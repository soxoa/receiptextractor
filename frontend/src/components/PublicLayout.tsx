"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="px-6 lg:px-8 h-20 flex items-center border-b border-stone-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
    >
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          ReceiptExtractor
        </span>
      </Link>
      <nav className="ml-auto flex gap-6 items-center">
        <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/how-it-works">
          How it Works
        </Link>
        <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/use-cases">
          Use Cases
        </Link>
        <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/pricing">
          Pricing
        </Link>
        <Link className="text-sm font-medium text-stone-700 hover:text-red-600 transition-colors" href="/blog">
          Blog
        </Link>
        <Link href="/sign-in">
          <Button variant="outline" size="sm" className="border-stone-300">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button 
            size="sm" 
            className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </Button>
        </Link>
      </nav>
    </motion.header>
  );
}

export function PublicFooter() {
  return (
    <footer className="w-full py-12 px-4 md:px-6 border-t border-stone-200 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-4 block">
              ReceiptExtractor
            </span>
            <p className="text-sm text-stone-600">
              Stop overpaying vendors with AI-powered invoice verification.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-stone-900">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="/how-it-works" className="block text-stone-600 hover:text-red-600 transition-colors">How It Works</Link>
              <Link href="/pricing" className="block text-stone-600 hover:text-red-600 transition-colors">Pricing</Link>
              <Link href="/use-cases" className="block text-stone-600 hover:text-red-600 transition-colors">Use Cases</Link>
              <Link href="/faq" className="block text-stone-600 hover:text-red-600 transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-stone-900">Company</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-stone-600 hover:text-red-600 transition-colors">About</Link>
              <Link href="/blog" className="block text-stone-600 hover:text-red-600 transition-colors">Blog</Link>
              <a href="mailto:support@receiptextractor.com" className="block text-stone-600 hover:text-red-600 transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-stone-900">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/terms" className="block text-stone-600 hover:text-red-600 transition-colors">Terms</Link>
              <Link href="/privacy" className="block text-stone-600 hover:text-red-600 transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-stone-200 text-center text-sm text-stone-500">
          © 2025 ReceiptExtractor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

