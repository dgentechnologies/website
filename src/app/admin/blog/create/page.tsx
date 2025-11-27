
'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
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
import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  author: z.enum(['Tirthankar Dasgupta', 'Sukomal Debnath', 'Sagnik Mandal', 'Arpan Bairagi'], {
    required_error: "You must select an author."
  }),
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
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [suggestionHistory, setSuggestionHistory] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  const selectedAuthor = form.watch('author');

  async function getExistingTitles(): Promise<string[]> {
    const snapshot = await getDocs(collection(firestore, 'blogPosts'));
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => (doc.data() as BlogPost).title);
  }

  async function handleSuggestTopic() {
    if (!selectedAuthor) {
        toast({
            variant: "destructive",
            title: "Author Required",
            description: "Please select an author before suggesting topics.",
        });
        return;
    }
    setIsSuggesting(true);
    setSuggestedTopics([]);
    try {
        const existingTitles = await getExistingTitles();
        const result = await suggestBlogTopic({ author: selectedAuthor, existingTitles, suggestionHistory });
        setSuggestedTopics(result.topics);
        setSuggestionHistory(prev => [...new Set([...prev, ...result.topics])]); // Add new suggestions to history
        toast({
            title: "Topics Suggested!",
            description: "Click a suggestion or write your own topic.",
        });
    } catch (error) {
        console.error("Error suggesting topic:", error);
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: "Could not suggest new topics. Please try again.",
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
    } catch (error: any) {
        console.error("Error generating blog post:", error);
        let description = "Could not generate the blog post. Please try again.";
        if (error.message && error.message.includes('Rate limit exceeded')) {
            description = "Rate limit reached. Please wait a while before generating a new post.";
        }
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: description,
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
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">Create New Blog Post</h1>
            <p className="text-foreground/70 mt-1">Use AI to generate a new blog post based on a topic and author persona.</p>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>1. Select Author Persona</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an author to tailor suggestions" />
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
                                    The AI will suggest topics and write in this person's voice.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>2. Define Blog Post Topic</FormLabel>
                                <div className="flex gap-2">
                                  <FormControl>
                                      <Input placeholder="Enter a topic or let AI suggest one" {...field} />
                                  </FormControl>
                                  <Button type="button" variant="outline" onClick={handleSuggestTopic} disabled={isSuggesting || !selectedAuthor}>
                                    {isSuggesting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                    <span className="sr-only sm:not-sr-only sm:ml-2">Suggest</span>
                                  </Button>
                                </div>
                                <FormDescription>
                                    Select an author first, then get tailored topic suggestions.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {suggestedTopics.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Suggestions for {selectedAuthor}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedTopics.map(topic => (
                                        <Badge
                                            key={topic}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-primary/20"
                                            onClick={() => form.setValue('topic', topic)}
                                        >
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={isGenerating || isSuggesting} className="w-full">
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Post...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Post with this Persona & Topic
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
