
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { PageTracker } from '@/components/page-tracker';

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
    default: 'DGEN Technologies | Smart City & IoT Solutions',
    template: '%s | DGEN Technologies',
  },
  description: 'DGEN Technologies pioneers B2B smart city solutions in India with our flagship product "Auralis," a smart street light with advanced fault detection. We build integrated IoT systems and are expanding into the B2C smart home market.',
  keywords: ['smart city', 'IoT', 'Auralis', 'smart street light', 'India', 'technology solutions', 'B2B technology', 'urban innovation', 'smart home', 'smart cities mission', 'smart cities india', 'affordable smart lighting'],
  authors: [{ name: 'DGEN Technologies' }],
  openGraph: {
    title: 'DGEN Technologies | Smart City & IoT Solutions',
    description: 'Pioneering smart city solutions in India with our flagship product "Auralis" and expanding into smart home technology.',
    url: 'https://dgentechnologies.com',
    siteName: 'DGEN Technologies',
    images: [
      {
        url: 'https://dgentechnologies.com/og-image.png', // It's good practice to have an OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DGEN Technologies | Smart City & IoT Solutions',
    description: 'Pioneering smart city solutions in India with our flagship product "Auralis" and expanding into smart home technology.',
    // site: '@dgen_tech', // Add your twitter handle
    // creator: '@dgen_tech',
    images: ['https://dgentechnologies.com/twitter-image.png'], // It's good practice to have a twitter image
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
    "name": "DGEN Technologies",
    "alternateName": ["Dgen Tech", "Dgen Technologies Pvt Ltd"],
    "url": "https://www.dgentechnologies.com/"
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
        <PageTracker />
        <Header />
        <main className="min-h-screen flex flex-col">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
