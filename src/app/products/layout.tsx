import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Auralis Ecosystem, ADAM AI & Smart City Solutions | Dgen Technologies',
  description: 'Discover Dgen Technologies products: Auralis Ecosystem smart street lighting (80% energy savings) and ADAM — a compact desktop AI companion. Made in India hardware and AI innovations.',
  keywords: ['Auralis Ecosystem', 'smart city products', 'ADAM AI', 'desktop AI companion', 'AI hardware India', 'ESP-MESH', 'Hybrid Wireless Mesh Network', 'solar street lights', 'LED street lights', 'IoT hardware India', 'smart street lights', 'Made in India', 'Smart Cities Mission', 'autonomous desktop AI module'],
  openGraph: {
    title: 'Products - Auralis Ecosystem, ADAM AI & Smart City Solutions | Dgen Technologies',
    description: 'Explore Dgen Technologies products: Auralis Ecosystem smart street lighting with 80% energy savings, and ADAM — a Made in India desktop AI companion.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Auralis Ecosystem & ADAM AI | Dgen Technologies',
    description: 'Explore Dgen Technologies products: Auralis Ecosystem smart street lighting and ADAM desktop AI companion. Made in India.',
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
    "description": "DGEN Technologies provides smart city solutions and AI products including Auralis Ecosystem for intelligent street lighting and ADAM desktop AI companion.",
    "sameAs": [
      "https://www.linkedin.com/company/dgen-technologies/",
      "https://x.com/DGEN_Tech",
      "https://www.instagram.com/dgentechnologies/",
      "https://www.youtube.com/@DGENTECHNOLOGIES"
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
