import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: {
    default: 'DGEN Technologies | Smart City & IoT Solutions in India',
    template: '%s | DGEN Technologies',
  },
  description: 'DGEN Technologies pioneers B2B smart city solutions in India, featuring our flagship product "Auralis," a smart street light with advanced fault detection. We are expanding into the B2C market to make every home smarter.',
  keywords: ['smart city', 'IoT', 'Auralis', 'smart street light', 'India', 'technology solutions', 'B2B technology', 'urban innovation', 'smart home'],
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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
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
