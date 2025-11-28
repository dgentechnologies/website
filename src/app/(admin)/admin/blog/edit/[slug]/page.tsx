'use client';

import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { notFound } from 'next/navigation';

import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { EditBlogForm } from '@/app/(admin)/admin/blog/edit-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const [post, loading, error] = useDocumentData(
    doc(firestore, 'blogPosts', params.slug)
  );

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
        <div className="mb-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2 mt-4" />
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
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Edit Blog Post</h1>
            <p className="text-foreground/70 mt-1">Make changes to your existing blog post.</p>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                <EditBlogForm post={blogPost} />
            </CardContent>
        </Card>
    </div>
  );
}
