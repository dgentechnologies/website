import { notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { adminFirestore } from '@/firebase/server';
import { BlogPost } from '@/types/blog';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getPost(slug: string): Promise<BlogPost | null> {
  const postDoc = await adminFirestore.collection('blogPosts').doc(slug).get();
  if (!postDoc.exists) {
    return null;
  }
  return postDoc.data() as BlogPost;
}

export async function generateStaticParams() {
  const postsSnapshot = await adminFirestore.collection('blogPosts').get();
  const slugs = postsSnapshot.docs.map(doc => ({
    slug: doc.id,
  }));
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: {
        index: false,
      },
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://dgentechnologies.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://dgentechnologies.com/blog/${post.slug}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blogPost = await getPost(resolvedParams.slug);

  if (!blogPost) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blogPost.title,
    "description": blogPost.description,
    "author": {
      "@type": "Person",
      "name": blogPost.author
    },
    "datePublished": blogPost.date,
    "image": blogPost.image,
    "mainEntityOfPage": `https://dgentechnologies.com/blog/${blogPost.slug}`,
    "keywords": blogPost.tags.join(', ')
  };

  return (
    <div className="flex flex-col">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <section className="relative w-full h-[50vh] flex items-end justify-start text-left">
        {blogPost.image && (
            <div className="absolute inset-0 z-0">
                 <Image
                    src={blogPost.image}
                    alt={blogPost.title}
                    fill
                    className="object-cover"
                    data-ai-hint={blogPost.imageHint}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            </div>
        )}
        <div className="relative z-10 container max-w-screen-lg px-4 md:px-6 pb-12">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {blogPost.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl lg:text-5xl text-white">
              {blogPost.title}
            </h1>
            <div className="flex items-center text-sm text-foreground/80 space-x-4">
                <div className="flex items-center gap-2 text-white/80">
                    <UserCircle className="h-5 w-5" />
                    <span>{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-5 w-5" />
                    <span>{blogPost.date}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20">
        <div className="container max-w-screen-md px-4 md:px-6">
            <div 
                className="prose prose-invert prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: blogPost.content || '' }}
            />
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
