import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Auralis Ecosystem & Smart City Solutions | Dgen Technologies',
  description: 'Explore Dgen Technologies smart city products: Auralis Ecosystem (Hybrid Wireless Mesh Network with ESP-MESH + 4G LTE), Solar Street Lights, and LED Street Lights. Made in India IoT hardware for modern urban infrastructure.',
  keywords: ['Auralis Ecosystem', 'smart city products', 'ESP-MESH', 'Hybrid Wireless Mesh Network', 'solar street lights', 'LED street lights', 'IoT hardware India', 'smart street lights', 'Made in India', 'Smart Cities Mission'],
  openGraph: {
    title: 'Smart City Products & Auralis Ecosystem | Dgen Technologies',
    description: 'Explore our range of intelligent IoT hardware - the Auralis Ecosystem smart street lighting platform with 80% energy savings and 98% cost reduction.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart City Products & Auralis Ecosystem | Dgen Technologies',
    description: 'Explore our Auralis Ecosystem - smart street lighting with Hybrid Wireless Mesh Network technology. Made in India.',
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
