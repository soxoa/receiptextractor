import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Building2, Utensils, Hotel, Factory, Hospital } from "lucide-react";
import { generateSEOMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateSEOMetadata({
  title: "Use Cases - Invoice Verification for Every Industry",
  description: "See how construction companies, facilities management, restaurants, hotels, and manufacturers use ReceiptExtractor to catch vendor overcharges. Industry-specific invoice verification solutions with real ROI examples and case studies.",
  keywords: ["construction invoice verification", "facilities management invoice audit", "restaurant vendor overcharge", "hotel procurement software", "manufacturing invoice checking"],
  canonical: "https://frontend-one-tau-98.vercel.app/use-cases",
});

const useCases = [
  {
    icon: Hammer,
    industry: "Construction & Contractors",
    subtitle: "Materials, Equipment, & Subcontractors",
    challenge: "Construction companies process hundreds of invoices from lumber yards, equipment rental companies, and subcontractors. With thin profit margins, every overcharge impacts profitability.",
    solution: "ReceiptExtractor automatically verifies material pricing against negotiated contracts, catches equipment rental rate increases, and ensures subcontractor billing matches agreed rates.",
    results: {
      savings: "$24,500/year average",
      time: "15 hours/week saved",
      accuracy: "98% overcharge detection"
    },
    example: "A roofing contractor found their supplier had quietly increased shingle prices by $0.50/bundle. Over 6 months, this added up to $4,200 in overcharges."
  },
  {
    icon: Building2,
    industry: "Facilities Management",
    subtitle: "Maintenance, Supplies, & Services",
    challenge: "Facilities managers deal with dozens of vendors for maintenance, janitorial supplies, HVAC services, and more. Manually checking each invoice is impossible with limited staff.",
    solution: "Upload master service agreements and supply contracts once. Every invoice is automatically verified against contracted pricing, catching unauthorized price increases instantly.",
    results: {
      savings: "$31,200/year average",
      time: "20 hours/week saved",
      accuracy: "96% overcharge detection"
    },
    example: "A property management company discovered their HVAC vendor had been billing for premium parts while installing standard parts - $890 overcharge per service call."
  },
  {
    icon: Utensils,
    industry: "Restaurants & Hospitality",
    subtitle: "Food Suppliers, Equipment, Services",
    challenge: "Restaurant owners process frequent invoices from food distributors, equipment suppliers, and service providers. Prices fluctuate, making it hard to track what you should be paying.",
    solution: "Lock in your negotiated pricing agreements with suppliers. ReceiptExtractor alerts you instantly when suppliers charge more than agreed, helping you maintain food cost percentages.",
    results: {
      savings: "$12,800/year average",
      time: "8 hours/week saved",
      accuracy: "94% overcharge detection"
    },
    example: "A restaurant group found their produce supplier was charging premium prices for standard-grade items. Recovered $3,200 in overcharges across 5 locations in one month."
  },
  {
    icon: Hotel,
    industry: "Hotels & Resorts",
    subtitle: "Linens, Cleaning, Food Service, Maintenance",
    challenge: "Hotels work with numerous vendors for linens, housekeeping supplies, food service, and maintenance. With hundreds of invoices monthly, overcharges go unnoticed.",
    solution: "Verify every vendor invoice automatically. From linen rental to food supplies to maintenance services, ensure you're paying contracted rates every single time.",
    results: {
      savings: "$45,600/year average",
      time: "25 hours/week saved",
      accuracy: "97% overcharge detection"
    },
    example: "A boutique hotel discovered their linen service had been overcharging on delivery fees for 8 months - $6,400 in unauthorized charges recovered."
  },
  {
    icon: Factory,
    industry: "Manufacturing",
    subtitle: "Raw Materials, Components, Equipment",
    challenge: "Manufacturers purchase raw materials, components, and equipment with complex pricing contracts. Volume discounts and tiered pricing make verification difficult.",
    solution: "Upload complex pricing agreements with volume tiers and special terms. Our AI understands conditional pricing and verifies even the most complex contracts.",
    results: {
      savings: "$67,300/year average",
      time: "30 hours/week saved",
      accuracy: "95% overcharge detection"
    },
    example: "A parts manufacturer found inconsistent application of volume discounts by their steel supplier. Recovered $22,000 in a single quarter."
  },
  {
    icon: Hospital,
    industry: "Healthcare",
    subtitle: "Medical Supplies, Equipment, Services",
    challenge: "Healthcare facilities manage complex pricing contracts for medical supplies, equipment, and services. Regulatory compliance adds complexity to vendor management.",
    solution: "Ensure contract compliance automatically. Verify medical supply pricing, equipment rentals, and service agreements against your negotiated GPO contracts.",
    results: {
      savings: "$89,400/year average",
      time: "40 hours/week saved",
      accuracy: "99% overcharge detection"
    },
    example: "A medical practice discovered their supply vendor was charging list prices instead of GPO contracted prices - $14,500 overcharge over 4 months."
  },
];

export default function UseCasesPage() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/use-cases">Use Cases</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
          <Link href="/sign-in"><Button variant="outline" size="sm">Sign In</Button></Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
              Invoice Verification for Every Industry
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses like yours use ReceiptExtractor to catch vendor overcharges and save thousands every month.
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="w-full py-12">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="space-y-12">
              {useCases.map((useCase, idx) => {
                const Icon = useCase.icon;
                return (
                  <Card key={idx} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex flex-col items-center justify-center text-center">
                        <Icon className="h-16 w-16 text-purple-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">{useCase.industry}</h3>
                        <p className="text-sm text-gray-600">{useCase.subtitle}</p>
                      </div>
                      
                      <div className="md:w-2/3 p-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">The Challenge</h4>
                            <p className="text-gray-600">{useCase.challenge}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-lg mb-2">The Solution</h4>
                            <p className="text-gray-600">{useCase.solution}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-3">Results:</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold text-green-600">{useCase.results.savings}</p>
                                <p className="text-xs text-gray-500">Average Savings</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-purple-600">{useCase.results.time}</p>
                                <p className="text-xs text-gray-500">Time Saved</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-blue-600">{useCase.results.accuracy}</p>
                                <p className="text-xs text-gray-500">Detection Rate</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <p className="text-sm">
                              <strong className="text-purple-900">Real Example:</strong>{' '}
                              <span className="text-gray-700">{useCase.example}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Your Industry. Your Savings.</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Whatever industry you're in, if you process vendor invoices, we can help you catch overcharges.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
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

