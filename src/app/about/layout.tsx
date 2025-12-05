import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - DGEN Technologies | Smart City Solutions India',
  description: 'Discover DGEN Technologies, India\'s leading smart city innovators. Meet our leadership team and learn about Auralis, our flagship IoT ecosystem.',
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
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DGEN Technologies",
    "alternateName": ["Dgen Technologies Private Limited", "DGEN Tech"],
    "url": "https://dgentechnologies.com",
    "logo": "https://dgentechnologies.com/logo.png",
    "description": "DGEN Technologies pioneers smart city solutions in India with the flagship Auralis IoT ecosystem for intelligent street lighting and smart homes.",
    "foundingDate": "2025",
    "foundingLocation": {
      "@type": "Place",
      "name": "Kolkata, India"
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  );
}
