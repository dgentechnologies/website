import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Smart City & IoT Solutions | DGEN Technologies',
  description: 'Explore DGEN Technologies smart city services including Auralis smart street lighting, IoT infrastructure, and smart home solutions. Powering India\'s Smart Cities Mission with innovative technology.',
  keywords: ['smart city services', 'IoT solutions India', 'Auralis smart street light', 'Smart Cities Mission India', 'urban infrastructure', 'smart home lighting', 'city management systems', 'energy efficient lighting'],
  openGraph: {
    title: 'Smart City & IoT Services | DGEN Technologies',
    description: 'Explore our comprehensive smart city services - from Auralis smart street lighting to IoT infrastructure. Powering India\'s urban future.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart City & IoT Services | DGEN Technologies',
    description: 'Explore our comprehensive smart city services - from Auralis smart street lighting to IoT infrastructure.',
  },
  alternates: {
    canonical: 'https://dgentechnologies.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
