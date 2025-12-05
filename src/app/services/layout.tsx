import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Smart City & IoT Solutions | DGEN Technologies',
  description: 'Discover smart city services & IoT solutions from DGEN Technologies. Auralis smart street lighting and infrastructure for India\'s Smart Cities.',
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

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "DGEN Technologies Smart City Services",
    "description": "Comprehensive smart city and IoT solutions including Auralis smart street lighting, IoT infrastructure, and smart home technology.",
    "provider": {
      "@type": "Organization",
      "name": "DGEN Technologies",
      "url": "https://dgentechnologies.com"
    },
    "serviceType": ["Smart City Solutions", "IoT Services", "Smart Street Lighting", "Smart Home Solutions"],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DGEN Technologies",
    "alternateName": ["Dgen Technologies Private Limited", "DGEN Tech"],
    "url": "https://dgentechnologies.com",
    "logo": "https://dgentechnologies.com/logo.png",
    "description": "DGEN Technologies provides smart city solutions and IoT services in India, including the flagship Auralis smart street lighting system.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  );
}
