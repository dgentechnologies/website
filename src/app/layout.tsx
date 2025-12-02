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
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
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
    default: 'Dgen Technologies | Smart City Solutions & IoT | Auralis Ecosystem',
    template: '%s | Dgen Technologies',
  },
  description: 'Dgen Technologies is a pioneering smart city solutions company based in Kolkata, India. Our flagship product, the Auralis Ecosystem, uses Hybrid Wireless Mesh Network technology (ESP-MESH + 4G LTE) for intelligent street lighting with 80% energy savings. Made in India.',
  keywords: ['smart city', 'IoT', 'Auralis Ecosystem', 'Auralis Smart City Solutions', 'smart street light', 'India', 'Kolkata', 'ESP-MESH', 'Hybrid Wireless Mesh Network', 'Made in India', 'Smart Cities Mission', 'affordable smart lighting', 'predictive maintenance'],
  authors: [{ name: 'Dgen Technologies Private Limited' }],
  openGraph: {
    title: 'Dgen Technologies | Smart City Solutions & Auralis Ecosystem',
    description: 'Pioneering smart city solutions in India with our flagship Auralis Ecosystem using Hybrid Wireless Mesh Network technology for intelligent street lighting.',
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
    title: 'Dgen Technologies | Smart City Solutions & Auralis Ecosystem',
    description: 'Pioneering smart city solutions in India with our flagship Auralis Ecosystem using Hybrid Wireless Mesh Network technology.',
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dgen Technologies",
    "alternateName": ["Dgen Technologies Private Limited", "DGEN Technologies", "Dgen Tech"],
    "url": "https://www.dgentechnologies.com/",
    "description": "Pioneering smart city solutions in India with the Auralis Ecosystem using Hybrid Wireless Mesh Network technology",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.dgentechnologies.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
