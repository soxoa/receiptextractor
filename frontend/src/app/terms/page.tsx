import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service | ReceiptExtractor",
  description: "Read the Terms of Service for ReceiptExtractor's invoice verification platform. Understand your rights and responsibilities when using our AI-powered invoice audit software.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto">
          <Link href="/"><Button variant="outline" size="sm">Back to Home</Button></Link>
        </nav>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl prose prose-lg">
          <h1>Terms of Service</h1>
          <p className="text-gray-500">Last updated: November 9, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ReceiptExtractor ("Service"), you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            ReceiptExtractor is a SaaS platform that provides AI-powered invoice verification services. We compare 
            vendor invoices against your pricing agreements to detect discrepancies, overcharges, and billing errors.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
            responsibility for all activities that occur under your account. You must notify us immediately of any 
            unauthorized use of your account.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Upload malicious files or malware</li>
            <li>Reverse engineer or attempt to extract our source code</li>
            <li>Resell or redistribute our Service without authorization</li>
          </ul>

          <h2>5. Subscription and Billing</h2>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring 
            basis. Billing cycles are monthly. You can cancel your subscription at any time from your account settings.
          </p>

          <h2>6. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. We process your documents using AI technology 
            provided by Anthropic (Claude AI). Document data is processed securely and is not stored longer than necessary.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by ReceiptExtractor and are 
            protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2>8. Disclaimers and Limitations</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. We strive for 95%+ accuracy in AI extraction 
            but do not guarantee 100% accuracy. Users should review AI-extracted data and verification results.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            ReceiptExtractor shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
            resulting from your use of or inability to use the Service.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about the Terms of Service? Contact us at legal@receiptextractor.com
          </p>
        </div>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © 2025 ReceiptExtractor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

