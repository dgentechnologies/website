import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Smart City Hardware & IoT Solutions | DGEN Technologies',
  description: 'Explore DGEN Technologies smart city products including Auralis WiFi, Auralis LoRaWAN, and Solar Street Lights. Robust IoT hardware for modern urban infrastructure in India.',
  keywords: ['smart city products', 'Auralis WiFi', 'Auralis LoRaWAN', 'solar street lights', 'IoT hardware India', 'smart street lights', 'urban IoT', 'connected city infrastructure'],
  openGraph: {
    title: 'Smart City Products & IoT Hardware | DGEN Technologies',
    description: 'Explore our range of intelligent IoT hardware - from Auralis smart street lights to solar-powered solutions for modern cities.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart City Products & IoT Hardware | DGEN Technologies',
    description: 'Explore our range of intelligent IoT hardware - from Auralis smart street lights to solar-powered solutions.',
  },
  alternates: {
    canonical: 'https://dgentechnologies.com/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
