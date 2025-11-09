import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy | ReceiptExtractor",
  description: "Learn how ReceiptExtractor protects your data. Our privacy policy explains how we collect, use, and secure your invoice and pricing agreement information. GDPR and CCPA compliant.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            ReceiptExtractor
          </span>
        </Link>
        <nav className="ml-auto">
          <Link href="/"><Button variant="outline" size="sm">Back to Home</Button></Link>
        </nav>
      </header>

      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl prose prose-lg">
          <h1>Privacy Policy</h1>
          <p className="text-gray-500">Last updated: November 9, 2025</p>

          <h2>1. Information We Collect</h2>
          
          <h3>Account Information</h3>
          <p>
            When you create an account, we collect: email address, name, and password (encrypted). 
            We use NextAuth for authentication with industry-standard security practices.
          </p>

          <h3>Document Data</h3>
          <p>
            You upload pricing agreements and invoices for processing. We extract data using AI (Claude by Anthropic) 
            and store: vendor names, item descriptions, prices, and invoice metadata. Original documents may be stored temporarily.
          </p>

          <h3>Usage Data</h3>
          <p>
            We automatically collect: invoice processing counts, feature usage, login timestamps, and browser information 
            for analytics and service improvement.
          </p>

          <h3>Payment Information</h3>
          <p>
            Payment processing is handled by Stripe. We do not store your credit card information. We receive from Stripe: 
            customer ID, subscription status, and billing history.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li><strong>Provide the Service:</strong> Process your documents and detect invoice discrepancies</li>
            <li><strong>Improve AI Accuracy:</strong> Anonymized data may be used to improve our AI models</li>
            <li><strong>Send Notifications:</strong> Email alerts for discrepancies and account updates</li>
            <li><strong>Billing:</strong> Process payments and manage subscriptions</li>
            <li><strong>Support:</strong> Respond to customer service requests</li>
            <li><strong>Analytics:</strong> Understand usage patterns and improve the product</li>
          </ul>

          <h2>3. Data Sharing and Third Parties</h2>
          
          <h3>AI Processing</h3>
          <p>
            Your documents are processed by Anthropic's Claude AI. Data sent to Anthropic is covered by their 
            privacy policy and is not used to train their models (per our enterprise agreement).
          </p>

          <h3>Service Providers</h3>
          <p>We use these third-party services:</p>
          <ul>
            <li><strong>Railway:</strong> Database and API hosting</li>
            <li><strong>Vercel:</strong> Web hosting</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Resend:</strong> Email delivery</li>
            <li><strong>Anthropic:</strong> AI document processing</li>
          </ul>

          <h3>We Never</h3>
          <ul>
            <li>Sell your data to third parties</li>
            <li>Share your pricing agreements or invoices publicly</li>
            <li>Use your data for advertising</li>
            <li>Train AI models on your confidential business data</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures including: HTTPS encryption for all data in transit, 
            password hashing with bcrypt, JWT-based authentication, SQL injection prevention, multi-tenant data isolation, 
            and regular security audits.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your data as long as your account is active. After account deletion, we retain data for 30 days for 
            recovery purposes, then permanently delete it. Some data may be retained longer for legal compliance.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data (account deletion)</li>
            <li>Export your data</li>
            <li>Opt-out of marketing emails</li>
            <li>Restrict data processing</li>
          </ul>

          <h2>7. GDPR Compliance</h2>
          <p>
            If you are in the European Union, you have additional rights under GDPR including data portability 
            and the right to lodge a complaint with a supervisory authority.
          </p>

          <h2>8. CCPA Compliance</h2>
          <p>
            California residents have the right to know what personal information we collect, request deletion of data, 
            and opt-out of the sale of personal information (which we don't do).
          </p>

          <h2>9. Cookies</h2>
          <p>
            We use essential cookies for authentication (NextAuth session cookies). We do not use tracking or advertising cookies.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our Service is not directed to individuals under 18. We do not knowingly collect personal information from children.
          </p>

          <h2>11. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes via email 
            and update the "Last updated" date at the top of this policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            Questions about this Privacy Policy? Contact our privacy team at privacy@receiptextractor.com
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

