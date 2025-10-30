'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BlogPostInput, generateBlogPost } from "@/ai/flows/generate-blog-post";
import { suggestBlogTopic } from '@/ai/flows/suggest-blog-topic';
import { firestore } from '@/firebase/client';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { BlogPostOutput } from '@/ai/flows/generate-blog-post';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  author: z.enum(['Tirthankar Dasgupta', 'Sukomal Debnath', 'Sagnik Mandal', 'Arpan Bairagi']),
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }),
});

export default function CreateBlogPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<BlogPostOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function handleSuggestTopic() {
    setIsSuggesting(true);
    try {
        const topic = await suggestBlogTopic();
        form.setValue('topic', topic);
        toast({
            title: "Topic Suggested!",
            description: "A new topic has been added to the form.",
        });
    } catch (error) {
        console.error("Error suggesting topic:", error);
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: "Could not suggest a new topic. Please try again.",
        });
    } finally {
        setIsSuggesting(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setGeneratedPost(null);
    try {
      const post = await generateBlogPost(values as BlogPostInput);
      setGeneratedPost(post);
      toast({
        title: "Blog Post Generated!",
        description: "Review the post below and save it to publish.",
      });
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate the blog post. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSavePost() {
    if (!generatedPost) return;

    try {
      const postRef = doc(firestore, 'blogPosts', generatedPost.slug);
      await setDoc(postRef, generatedPost);
      toast({
        title: "Post Saved!",
        description: "Your new blog post is now live.",
      });
      router.push(`/blog/${generatedPost.slug}`);
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the blog post. Please try again.",
      });
    }
  }


  return (
    <div className="container max-w-screen-md py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Create a New Blog Post</h1>
            <p className="text-foreground/70 mt-2">Use AI to generate a new blog post based on a topic and author persona.</p>
        </div>
        <Card className="mb-8">
            <CardContent className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Blog Post Topic</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                      <Input placeholder="e.g., 'The role of 5G in smart cities'" {...field} />
                                  </FormControl>
                                  <Button type="button" variant="outline" onClick={handleSuggestTopic} disabled={isSuggesting}>
                                    {isSuggesting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                    <span className="sr-only sm:not-sr-only sm:ml-2">Suggest</span>
                                  </Button>
                                </div>
                                <FormDescription>
                                    Enter a topic or let AI suggest a trending one for you.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Author</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an author persona" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Tirthankar Dasgupta">Tirthankar Dasgupta (CEO & CTO)</SelectItem>
                                        <SelectItem value="Sukomal Debnath">Sukomal Debnath (CFO)</SelectItem>
                                        <SelectItem value="Sagnik Mandal">Sagnik Mandal (CMO)</SelectItem>
                                        <SelectItem value="Arpan Bairagi">Arpan Bairagi (COO)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    The AI will write in this person's voice and style.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isGenerating || isSuggesting} className="w-full">
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Post
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

      {generatedPost && (
        <Card>
            <CardHeader>
                <CardTitle>Generated Post Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold font-headline">{generatedPost.title}</h2>
                    <p className="text-muted-foreground">{generatedPost.description}</p>
                    <div 
                        className="prose prose-invert prose-lg"
                        dangerouslySetInnerHTML={{ __html: generatedPost.content }}
                    />
                    <Button onClick={handleSavePost} className="w-full" size="lg">
                        Save and Publish Post
                    </Button>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}