'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { firestore } from '@/firebase/client';
import { BlogPost } from "@/types/blog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(160, "Description should be less than 160 characters for SEO."),
  content: z.string().min(100, "Content must be at least 100 characters."),
  image: z.string().url("Must be a valid URL."),
  imageHint: z.string(),
});

type EditBlogFormProps = {
  post: BlogPost;
};

export function EditBlogForm({ post }: EditBlogFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      content: post.content,
      image: post.image,
      imageHint: post.imageHint,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const postRef = doc(firestore, 'blogPosts', post.slug);
      await updateDoc(postRef, values);
      toast({
        title: "Post Updated!",
        description: "Your blog post has been successfully updated.",
      });
      router.push(`/blog/${post.slug}`);
      router.refresh(); // Refresh to show updated content
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the blog post. Please try again.",
      });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the blog post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter a short, SEO-friendly description" {...field} rows={3} />
              </FormControl>
              <FormDescription>
                This will be used for search engine previews. Keep it concise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the full blog content in HTML format" {...field} rows={15} />
              </FormControl>
              <FormDescription>
                You can use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, etc. for formatting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'technology abstract'" {...field} />
              </FormControl>
              <FormDescription>
                A two-word hint for the image content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving} className="w-full" size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
}