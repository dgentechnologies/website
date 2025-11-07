
'use client';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';

// This function can be used for generating static pages at build time
// export async function generateStaticParams() {
//   // For now, we will rely on on-demand rendering.
//   // This can be populated from Firestore during a build step in the future.
//   return [];
// }

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const postRef = useMemo(() => doc(firestore, 'blogPosts', params.slug), [params.slug]);
  const [post, loading, error] = useDocumentData(postRef);

  if (loading) {
    return (
       <div className="flex flex-col">
        <section className="relative w-full h-[50vh] bg-card flex items-end justify-start">
            <div className="relative z-10 container max-w-screen-lg px-4 md:px-6 pb-12 space-y-4">
                 <Skeleton className="h-8 w-1/4" />
                 <Skeleton className="h-12 w-3/4" />
                 <Skeleton className="h-6 w-1/2" />
            </div>
        </section>
         <section className="w-full py-12 md:py-20">
            <div className="container max-w-screen-md px-4 md:px-6 space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-full" />
            </div>
        </section>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div>Error loading post.</div>;
  }

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;

  return (
    <div className="flex flex-col">
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

// Metadata can also be generated dynamically if needed
// export async function generateMetadata({ params }: { params: { slug: string } }) { ... }
