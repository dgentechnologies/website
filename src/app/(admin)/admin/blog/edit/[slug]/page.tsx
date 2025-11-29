'use client';

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Loader2, UserCircle, Eye } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(160, "Description should be less than 160 characters for SEO."),
  content: z.string().min(100, "Content must be at least 100 characters."),
  image: z.string().url("Must be a valid URL."),
  imageHint: z.string(),
  tags: z.array(z.string()),
});

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const router = useRouter();
  const [post, loading, error] = useDocumentData(doc(firestore, 'blogPosts', slug));
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: '',
        description: '',
        content: '',
        image: '',
        imageHint: '',
        tags: [],
    }
  });
  
  const watchedData = useWatch({ control: form.control });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
        imageHint: post.imageHint,
        tags: post.tags,
      });
    }
  }, [post, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const postRef = doc(firestore, 'blogPosts', slug);
      await updateDoc(postRef, {
        ...values,
        updatedAt: serverTimestamp(),
        // Ensure tags are saved correctly if they are manipulated as strings
        tags: Array.isArray(values.tags) ? values.tags : (values.tags as any).split(',').map((t: string) => t.trim()),
      });
      toast({
        title: "Post Updated!",
        description: "Your blog post has been successfully updated.",
      });
      router.refresh();
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not save changes." });
    } finally {
      setIsSaving(false);
    }
  }

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
  const previewData = { ...blogPost, ...watchedData };

  return (
    <div className="flex-1 max-h-screen overflow-hidden">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 h-screen">
                {/* Left Panel: Editor */}
                <div className="flex flex-col p-4 md:p-6 bg-card border-r">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon" asChild>
                                <Link href="/admin">
                                <ArrowLeft className="h-4 w-4"/>
                                <span className="sr-only">Back to Blog</span>
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-xl font-headline font-bold">Post Editor</h1>
                                <p className="text-sm text-foreground/70">Editing: {post.title}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" asChild>
                                <Link href={`/blog/${slug}`} target="_blank">
                                    <Eye className="mr-2 h-4 w-4" /> View Live
                                </Link>
                            </Button>
                            <Button type="submit" disabled={isSaving} size="sm">
                                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                         <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem><FormLabel>Content (HTML)</FormLabel><FormControl><Textarea {...field} rows={25} className="font-mono text-xs" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="image" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="tags" render={({ field }) => (
                             <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))} value={Array.isArray(field.value) ? field.value.join(', ') : ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageHint" render={({ field }) => (
                            <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="hidden md:flex flex-col bg-background overflow-y-auto">
                    <div className="p-4 bg-card/50 border-b sticky top-0 z-10">
                        <h2 className="font-semibold text-center text-foreground/80">Live Preview</h2>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <section className="relative w-full h-[40vh] flex items-end justify-start text-left">
                            {previewData.image && (
                                <>
                                    <Image src={previewData.image} alt={previewData.title || 'Blog post image'} fill className="object-cover" data-ai-hint={previewData.imageHint} priority />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                                </>
                            )}
                            <div className="relative z-10 container max-w-screen-lg px-4 md:px-6 pb-8">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {previewData.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                    </div>
                                    <h1 className="text-2xl font-headline font-bold tracking-tight text-white">
                                    {previewData.title}
                                    </h1>
                                    <div className="flex items-center text-sm space-x-4">
                                        <div className="flex items-center gap-2 text-white/80"><UserCircle className="h-5 w-5" /><span>{previewData.author}</span></div>
                                        <div className="flex items-center gap-2 text-white/80"><Calendar className="h-5 w-5" /><span>{previewData.date}</span></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="w-full py-10 md:py-12">
                            <div className="container max-w-screen-md px-4 md:px-6">
                                <div className="prose prose-invert prose-lg mx-auto" dangerouslySetInnerHTML={{ __html: previewData.content || '' }} />
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  );
}

    