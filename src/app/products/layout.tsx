import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Auralis Ecosystem & Smart City Solutions | Dgen Technologies',
  description: 'Discover Auralis Ecosystem - Made in India smart street lighting with 80% energy savings. Hybrid Wireless Mesh Network, cost-effective IoT solutions.',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DGEN Technologies",
    "url": "https://dgentechnologies.com",
    "logo": "https://dgentechnologies.com/logo.png",
    "description": "DGEN Technologies provides smart city solutions and IoT products including Auralis Ecosystem for intelligent street lighting.",
    "sameAs": [
      "https://www.linkedin.com/company/dgen-technologies/",
      "https://x.com/DGEN_Tech"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  );
}
