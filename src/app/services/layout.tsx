import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Advanced Technology & IoT Solutions | Dgen Technologies',
  description: 'Discover advanced hardware and software technology services from Dgen Technologies. Auralis smart street lighting, IoT solutions, and smart home products for India.',
  keywords: ['technology services', 'IoT solutions India', 'Auralis smart street light', 'Smart Cities Mission India', 'urban infrastructure', 'smart home lighting', 'city management systems', 'energy efficient lighting', 'hardware solutions', 'software solutions'],
  openGraph: {
    title: 'Advanced Technology & IoT Services | Dgen Technologies',
    description: 'Explore our comprehensive hardware and software technology services — from Auralis smart street lighting to IoT infrastructure. Powering India\'s future.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Technology & IoT Services | Dgen Technologies',
    description: 'Explore our comprehensive hardware and software technology services — from Auralis smart street lighting to IoT infrastructure.',
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
    "name": "Dgen Technologies Technology Services",
    "description": "Comprehensive hardware and software technology solutions including Auralis smart street lighting, IoT infrastructure, and smart home technology.",
    "provider": {
      "@type": "Organization",
      "name": "Dgen Technologies",
      "url": "https://dgentechnologies.com"
    },
    "serviceType": ["Advanced Technology Solutions", "Hardware & Software Development", "IoT Services", "Smart Street Lighting", "Smart Home Solutions"],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dgen Technologies",
    "alternateName": ["Dgen Technologies Private Limited", "Dgen Tech"],
    "url": "https://dgentechnologies.com",
    "logo": "https://dgentechnologies.com/logo.png",
    "description": "Dgen Technologies creates smart, advanced hardware and software solutions to help society, including the flagship Auralis smart street lighting system.",
    "sameAs": [
      "https://www.linkedin.com/company/dgen-technologies/",
      "https://x.com/Dgen_Tech",
      "https://www.instagram.com/dgentechnologies/",
      "https://www.youtube.com/@DgenTECHNOLOGIES"
    ],    "contactPoint": {
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
