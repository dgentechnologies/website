import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Dgen Technologies',
  description: 'Frequently Asked Questions about Dgen Technologies, the Auralis Ecosystem, and ADAM AI companion. Learn about our Hybrid Wireless Mesh Network technology, ESP-MESH + 4G LTE connectivity, and Made in India smart city solutions and AI hardware.',
  keywords: ['Dgen Technologies FAQ', 'Auralis Ecosystem FAQ', 'ADAM AI FAQ', 'smart city questions', 'ESP-MESH technology', 'Hybrid Wireless Mesh Network', 'Made in India IoT', 'desktop AI companion', 'AI hardware India', 'Kolkata tech'],
  openGraph: {
    title: 'FAQ | Dgen Technologies',
    description: 'Frequently Asked Questions about Dgen Technologies, the Auralis Ecosystem smart city solutions, and ADAM AI companion.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Dgen Technologies',
    description: 'Frequently Asked Questions about Dgen Technologies, the Auralis Ecosystem smart city solutions, and ADAM AI companion.',
  },
  alternates: {
    canonical: 'https://dgentechnologies.com/faq',
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
