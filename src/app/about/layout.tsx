import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - DGEN Technologies | Smart City Solutions India',
  description: 'Learn about DGEN Technologies, a leading smart city and IoT solutions company in India. Meet our leadership team and discover our mission to power India\'s urban future with innovative products like Auralis.',
  keywords: ['DGEN Technologies', 'smart city India', 'IoT company India', 'Auralis', 'smart street light', 'urban technology', 'Kolkata tech company', 'smart city solutions'],
  openGraph: {
    title: 'About DGEN Technologies - Smart City & IoT Innovators',
    description: 'Learn about DGEN Technologies, pioneering smart city solutions in India with our flagship Auralis product and expanding into B2C smart home technology.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DGEN Technologies - Smart City Solutions India',
    description: 'Learn about DGEN Technologies, pioneering smart city solutions in India with innovative IoT products.',
  },
  alternates: {
    canonical: 'https://dgentechnologies.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
