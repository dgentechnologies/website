
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3F4F6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' },
  ],
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: {
    default: 'Dgen Technologies | Advanced Hardware & Software Solutions | Auralis Ecosystem',
    template: '%s | Dgen Technologies',
  },
  description: 'Dgen Technologies creates smart, advanced hardware and software solutions to help society. From our Auralis Ecosystem smart street lighting to cutting-edge IoT innovations, Made in India.',
  keywords: ['smart city', 'IoT', 'Auralis Ecosystem', 'hardware solutions', 'software solutions', 'smart street light', 'India', 'Kolkata', 'ESP-MESH', 'Hybrid Wireless Mesh Network', 'Made in India', 'Smart Cities Mission', 'affordable smart lighting', 'predictive maintenance', 'technology for society'],
  authors: [{ name: 'Dgen Technologies Private Limited' }],
  openGraph: {
    title: 'Dgen Technologies | Advanced Technology Solutions & Auralis Ecosystem',
    description: 'Dgen Technologies creates smart, advanced hardware and software solutions to help society, including our Auralis Ecosystem for intelligent street lighting.',
    url: 'https://dgentechnologies.com',
    siteName: 'Dgen Technologies',
    images: [
      {
        url: 'https://dgentechnologies.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dgen Technologies | Advanced Technology Solutions & Auralis Ecosystem',
    description: 'Dgen Technologies creates smart, advanced hardware and software solutions to help society, including our Auralis Ecosystem for intelligent street lighting.',
    images: ['https://dgentechnologies.com/twitter-image.png'],
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DGEN Technologies",
    "alternateName": ["Dgen Technologies Private Limited", "DGEN Technologies", "Dgen Tech"],
    "url": "https://dgentechnologies.com",
    "logo": "https://dgentechnologies.com/logo.png",
    "description": "Dgen Technologies creates smart, advanced hardware and software solutions to help society. We specialize in cutting-edge IoT and AI-powered technologies, including the Auralis Ecosystem for intelligent urban infrastructure.",
    "sameAs": [
      "https://www.linkedin.com/company/dgen-technologies/",
      "https://x.com/DGEN_Tech"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "email": "contact@dgentechnologies.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dgen Technologies",
    "url": "https://dgentechnologies.com/",
    "description": "Dgen Technologies creates smart, advanced hardware and software solutions to help society. We specialize in cutting-edge IoT and AI-powered technologies, including the Auralis Ecosystem for intelligent urban infrastructure.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dgentechnologies.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
