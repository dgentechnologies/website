
import { MetadataRoute } from 'next';
import { adminFirestore } from '@/firebase/server';
import { BlogPost } from '@/types/blog';
import { products } from '@/lib/products-data';
import { teamMembers } from '@/lib/team-data';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dgentechnologies.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic routes for blog posts
  const postsSnapshot = await adminFirestore.collection('blogPosts').get();
  const blogRoutes = postsSnapshot.docs.map(doc => {
    const post = doc.data() as BlogPost & { updatedAt?: { toDate: () => Date } };
    
    // Check for a valid updatedAt timestamp, otherwise use current date.
    const lastModified = post.updatedAt && typeof post.updatedAt.toDate === 'function'
      ? post.updatedAt.toDate()
      : new Date();

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: lastModified,
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.7,
    };
  });

  // Dynamic routes for products
  const productRoutes: MetadataRoute.Sitemap = products.map(product => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic routes for team members
  const leaderRoutes: MetadataRoute.Sitemap = teamMembers.map(member => ({
    url: `${baseUrl}/about/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  // Image sitemap entries
  const imageRoutes: MetadataRoute.Sitemap = [
    // Team member images
    ...teamMembers.map(member => ({
      url: `${baseUrl}${member.image}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
    // Product images
    ...products.flatMap(product => 
      product.images
        .filter(img => img.url.startsWith('/images/'))
        .map(img => ({
          url: `${baseUrl}${img.url}`,
          lastModified: new Date(),
          changeFrequency: 'yearly' as const,
          priority: 0.5,
        }))
    ),
    // Static images
    {
      url: `${baseUrl}/images/logo.png`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/images/auralis-architecture-diagram.png`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Video sitemap entries
  const videoRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/videos/product-page-hero.mp4`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...blogRoutes, ...productRoutes, ...leaderRoutes, ...imageRoutes, ...videoRoutes];
}
