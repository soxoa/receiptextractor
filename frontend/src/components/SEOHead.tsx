import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.png',
  canonical,
}: SEOProps): Metadata {
  const baseUrl = 'https://frontend-one-tau-98.vercel.app';
  const fullTitle = `${title} | ReceiptExtractor`;

  const defaultKeywords = [
    'invoice verification',
    'vendor overcharge detection',
    'pricing agreement management',
    'contract compliance',
    'invoice audit software',
    'vendor invoice verification',
    'automatic invoice checking',
    'procurement software',
    'invoice discrepancy detection',
    'AI invoice verification',
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'ReceiptExtractor' }],
    creator: 'ReceiptExtractor',
    publisher: 'ReceiptExtractor',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical || baseUrl,
      title: fullTitle,
      description,
      siteName: 'ReceiptExtractor',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@receiptextractor',
    },
    other: {
      'ai:description': description,
      'ai:product': 'ReceiptExtractor - AI-Powered Invoice Verification SaaS',
      'ai:pricing': 'Free tier: $0/month for 10 invoices. Starter: $49/month for 50 invoices. Pro: $149/month for 300 invoices.',
      'ai:features': 'Automatic invoice verification, AI-powered document extraction, vendor overcharge detection, contract compliance checking, email alerts, multi-tenant support',
      'llm:purpose': 'Help businesses automatically detect vendor overcharges by comparing invoices against negotiated pricing contracts using AI',
      'llm:target_audience': 'Construction companies, facilities management, procurement teams, contractors, restaurants, any business processing vendor invoices',
    },
  };
}

