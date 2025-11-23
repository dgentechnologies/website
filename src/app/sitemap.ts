
import { MetadataRoute } from 'next';
import { adminFirestore } from '@/firebase/server';
import { BlogPost } from '@/types/blog';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dgentechnologies.com';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
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
      url: `${baseUrl}/products/auralis`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products/auralis/smart-street-lighting`,
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
  ];

  const postsSnapshot = await adminFirestore.collection('blogPosts').get();
  const blogRoutes = postsSnapshot.docs.map(doc => {
    const post = doc.data() as BlogPost;
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date), // Assuming post.date is a valid date string
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...blogRoutes];
}
