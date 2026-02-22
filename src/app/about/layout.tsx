import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - DGEN Technologies | Advanced Hardware & Software Solutions',
  description: 'Discover DGEN Technologies, a company that creates smart, advanced hardware and software solutions to help society. Meet our leadership team and learn about Auralis, our flagship IoT ecosystem.',
  keywords: ['DGEN Technologies', 'technology company India', 'hardware software solutions', 'IoT company India', 'Auralis', 'smart street light', 'urban technology', 'Kolkata tech company', 'smart city solutions'],
  openGraph: {
    title: 'About DGEN Technologies - Advanced Technology Solutions',
    description: 'Learn about DGEN Technologies, a company creating smart, advanced hardware and software solutions to help society, including our flagship Auralis product and B2C smart home technology.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DGEN Technologies - Advanced Technology Solutions',
    description: 'Learn about DGEN Technologies, creating smart, advanced hardware and software solutions to help society with innovative IoT products.',
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
    "description": "DGEN Technologies creates smart, advanced hardware and software solutions to help society, including the flagship Auralis IoT ecosystem for intelligent street lighting and smart homes.",
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
