'use client';

import { useState, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { firestore } from '@/firebase/client';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { BlogPost } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { BlogEditor } from '@/components/blog-editor';

export default function CreateBlogPostPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Partial<BlogPost>>({});
  const router = useRouter();
  const { toast } = useToast();

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleGenerateWithAI = useCallback(async (title: string, author: string) => {
    if (!title || !author) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter a title/topic and select an author before generating.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBlogPost({ 
        topic: title, 
        author: author as 'Tirthankar Dasgupta' | 'Sukomal Debnath' | 'Sagnik Mandal' | 'Arpan Bairagi'
      });
      setGeneratedContent({
        title: result.title,
        content: result.content,
        description: result.description,
        image: result.image,
        imageHint: result.imageHint,
        tags: result.tags,
        slug: result.slug,
        author,
      });
      toast({
        title: 'Content Generated!',
        description: 'AI has generated the blog content. Review and edit as needed.',
      });
    } catch (error) {
      console.error('Error generating blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'The AI failed to generate content. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const handleSave = async (post: Partial<BlogPost>) => {
    if (!post.title || !post.author) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Title and author are required.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const slug = generatedContent.slug || generateSlug(post.title);
      const postData = {
        ...post,
        slug,
        createdAt: serverTimestamp(),
      };

      const postRef = doc(firestore, 'blogPosts', slug);
      await setDoc(postRef, postData);

      toast({
        title: 'Post Published!',
        description: 'Your blog post has been successfully published.',
      });

      router.push(`/blog/${slug}`);
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the blog post. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Create New Blog Post</h1>
          <p className="text-foreground/70 text-sm mt-1">
            Write your content or use AI to generate. Preview appears on the right.
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <BlogEditor
          initialTitle={generatedContent.title || ''}
          initialContent={generatedContent.content || ''}
          initialDescription={generatedContent.description || ''}
          initialImage={generatedContent.image || ''}
          initialImageHint={generatedContent.imageHint || ''}
          initialAuthor={generatedContent.author || ''}
          initialTags={generatedContent.tags || []}
          onSave={handleSave}
          isSaving={isSaving}
          onGenerateWithAI={handleGenerateWithAI}
          isGenerating={isGenerating}
          mode="create"
        />
      </div>
    </div>
  );
}
