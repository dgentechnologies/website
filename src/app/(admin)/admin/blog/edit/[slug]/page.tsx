'use client';

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';

import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { BlogEditor } from '@/components/blog-editor';

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const [post, loading, error] = useDocumentData(doc(firestore, 'blogPosts', slug));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (postData: Partial<BlogPost>) => {
    setIsSaving(true);
    try {
      const postRef = doc(firestore, 'blogPosts', slug);
      await updateDoc(postRef, {
        ...postData,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: "Post Updated!",
        description: "Your blog post has been successfully updated.",
      });
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not save changes." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8"><Skeleton className="h-screen w-full" /></div>;
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
    <div className="flex flex-col h-[calc(100vh-64px)] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold">Edit Blog Post</h1>
            <p className="text-foreground/70 text-sm mt-1">
              Edit your content with live preview on the right.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/blog/${slug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" /> View Live
          </Link>
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <BlogEditor
          initialTitle={blogPost.title}
          initialContent={blogPost.content}
          initialDescription={blogPost.description}
          initialImage={blogPost.image}
          initialImageHint={blogPost.imageHint}
          initialAuthor={blogPost.author}
          initialTags={blogPost.tags}
          onSave={handleSave}
          isSaving={isSaving}
          mode="edit"
        />
      </div>
    </div>
  );
}
