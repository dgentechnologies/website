import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Dgen Technologies',
  description: 'Frequently Asked Questions about Dgen Technologies and the Auralis Ecosystem. Learn about our Hybrid Wireless Mesh Network technology, ESP-MESH + 4G LTE connectivity, and Made in India smart city solutions.',
  keywords: ['Dgen Technologies FAQ', 'Auralis Ecosystem FAQ', 'smart city questions', 'ESP-MESH technology', 'Hybrid Wireless Mesh Network', 'Made in India IoT'],
  openGraph: {
    title: 'FAQ | Dgen Technologies',
    description: 'Frequently Asked Questions about Dgen Technologies and the Auralis Ecosystem smart city solutions.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Dgen Technologies',
    description: 'Frequently Asked Questions about Dgen Technologies and the Auralis Ecosystem smart city solutions.',
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
