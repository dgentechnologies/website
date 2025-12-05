import { notFound } from 'next/navigation';
import { products } from '@/lib/products-data';
import { ProductDetailClient } from './product-detail-client';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return products.map((product) => ({
    'product-slug': product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ 'product-slug': string }> }) {
  const resolvedParams = await params;
  const productExists = products.some((p) => p.slug === resolvedParams['product-slug']);

  if (!productExists) {
    notFound();
  }

  // Pass only the slug to the client component - it will look up the product data client-side
  return <ProductDetailClient productSlug={resolvedParams['product-slug']} />;
}

export async function generateMetadata({ params }: { params: Promise<{ 'product-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams['product-slug']);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const productUrl = `https://dgentechnologies.com/products/${product.slug}`;
  const imageUrl = product.images[0]?.url || 'https://dgentechnologies.com/og-image.png';

  return {
    title: `${product.title} | Smart City Solutions | DGEN Technologies`,
    description: product.shortDescription,
    keywords: [
      product.title,
      product.category,
      'smart city',
      'IoT',
      'DGEN Technologies',
      'Made in India',
    ],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} | DGEN Technologies`,
      description: product.shortDescription,
      type: 'product',
      url: productUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      siteName: 'DGEN Technologies',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | DGEN Technologies`,
      description: product.shortDescription,
      images: [imageUrl],
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
}
