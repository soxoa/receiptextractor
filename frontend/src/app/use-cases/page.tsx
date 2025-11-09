"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Building2, Utensils, Hotel, Factory, Hospital } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

const useCases = [
  {
    icon: Hammer,
    industry: "Construction & Contractors",
    subtitle: "Materials, Equipment, & Subcontractors",
    savings: "$24,500/year",
    color: "from-orange-100 to-orange-200",
    iconColor: "text-orange-600"
  },
  {
    icon: Building2,
    industry: "Facilities Management",
    subtitle: "Maintenance, Supplies, & Services",
    savings: "$31,200/year",
    color: "from-blue-100 to-blue-200",
    iconColor: "text-blue-600"
  },
  {
    icon: Utensils,
    industry: "Restaurants & Hospitality",
    subtitle: "Food Suppliers, Equipment, Services",
    savings: "$12,800/year",
    color: "from-green-100 to-green-200",
    iconColor: "text-green-600"
  },
  {
    icon: Hotel,
    industry: "Hotels & Resorts",
    subtitle: "Linens, Cleaning, Maintenance",
    savings: "$45,600/year",
    color: "from-purple-100 to-purple-200",
    iconColor: "text-purple-600"
  },
  {
    icon: Factory,
    industry: "Manufacturing",
    subtitle: "Raw Materials, Components",
    savings: "$67,300/year",
    color: "from-red-100 to-red-200",
    iconColor: "text-red-600"
  },
  {
    icon: Hospital,
    industry: "Healthcare",
    subtitle: "Medical Supplies, Equipment",
    savings: "$89,400/year",
    color: "from-teal-100 to-teal-200",
    iconColor: "text-teal-600"
  },
];

export default function UseCasesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-stone-50">
        <div className="container px-6 mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Invoice Verification for
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Every Industry
              </span>
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              See how businesses like yours use ReceiptExtractor to catch vendor overcharges and save thousands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="w-full py-20 bg-white">
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-8 border-2 border-stone-200 hover:border-red-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6`}>
                      <Icon className={`h-8 w-8 ${useCase.iconColor}`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{useCase.industry}</CardTitle>
                    <p className="text-sm text-stone-500 mb-6">{useCase.subtitle}</p>
                    <div className="pt-6 border-t border-stone-200">
                      <div className="text-3xl font-black text-green-600 mb-1">{useCase.savings}</div>
                      <p className="text-xs text-stone-500">Average Savings</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 bg-gradient-to-br from-red-600 via-red-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container px-6 mx-auto max-w-4xl relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Your Industry. Your Savings.
            </h2>
            <p className="text-xl text-red-100 mb-10">
              Whatever industry you're in, if you process vendor invoices, we can help you catch overcharges.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="h-16 px-12 text-xl bg-white text-red-600 hover:bg-red-50 shadow-2xl hover:scale-105 transition-all duration-200 font-bold">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
