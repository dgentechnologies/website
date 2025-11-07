'use client';

import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { notFound } from 'next/navigation';

import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { EditBlogForm } from '../edit-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const [post, loading, error] = useDocumentData(
    doc(firestore, 'blogPosts', params.slug)
  );

  if (loading) {
    return (
      <div className="container max-w-screen-md py-12">
        <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
        </div>
        <Card>
            <CardContent className="p-8 space-y-6">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div className="text-center py-12 text-destructive">Error loading post. Please try again.</div>;
  }

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;

  return (
    <div className="container max-w-screen-md py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Edit Blog Post</h1>
            <p className="text-foreground/70 mt-2">Make changes to your existing blog post.</p>
        </div>
        <Card>
            <CardContent className="p-8">
                <EditBlogForm post={blogPost} />
            </CardContent>
        </Card>
    </div>
  );
}
