import { notFound } from 'next/navigation';
import { products } from '@/lib/products-data';
import { ProductDetailClient } from './product-detail-client';

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

export async function generateMetadata({ params }: { params: Promise<{ 'product-slug': string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams['product-slug']);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | DGEN Technologies`,
    description: product.shortDescription,
  };
}
