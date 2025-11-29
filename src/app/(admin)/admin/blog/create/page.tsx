'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo } from "react";
import { collection, query, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
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
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { firestore } from '@/firebase/client';
import { suggestBlogTopic } from '@/ai/flows/suggest-blog-topic';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { BlogPost } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  author: z.enum(['Tirthankar Dasgupta', 'Sukomal Debnath', 'Sagnik Mandal', 'Arpan Bairagi'], { required_error: "Please select an author." }),
  topic: z.string().min(10, "Topic must be at least 10 characters long."),
});

const authorsList = [
    'Tirthankar Dasgupta', 
    'Sukomal Debnath', 
    'Sagnik Mandal', 
    'Arpan Bairagi'
];

export default function CreateBlogPostPage() {
  const [blogPosts] = useCollection(query(collection(firestore, 'blogPosts')));
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [suggestionHistory, setSuggestionHistory] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  const authorPostCounts = useMemo(() => {
    if (!blogPosts) return {};
    const counts: { [key: string]: number } = {};
    blogPosts.docs.forEach(doc => {
        const post = doc.data() as BlogPost;
        if (post.author) {
            counts[post.author] = (counts[post.author] || 0) + 1;
        }
    });
    return counts;
  }, [blogPosts]);

  const authorsWithCount = authorsList.map(name => ({
    name,
    count: authorPostCounts[name] || 0,
  }));

  const handleSuggestTopics = async () => {
    const author = form.getValues("author");
    if (!author) {
        form.setError("author", { type: "manual", message: "Please select an author first." });
        return;
    }
    
    setIsSuggesting(true);
    setSuggestedTopics([]);

    const existingTitles = blogPosts?.docs.map(doc => (doc.data() as BlogPost).title) || [];

    try {
        const result = await suggestBlogTopic({ 
            author,
            existingTitles,
            suggestionHistory
        });
        setSuggestedTopics(result.topics);
        setSuggestionHistory(prev => [...prev, ...result.topics]);
    } catch (error) {
        console.error("Error suggesting topics:", error);
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: "Could not get AI topic suggestions. Please try again.",
        });
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    form.setValue("topic", topic);
    form.clearErrors("topic");
    setSuggestedTopics([]);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const generatedPost = await generateBlogPost(values);
      
      const postWithTimestamp = {
        ...generatedPost,
        createdAt: serverTimestamp(),
      };
      
      const postRef = doc(firestore, 'blogPosts', generatedPost.slug);
      await setDoc(postRef, postWithTimestamp);
      
      toast({
        title: "Post Generated!",
        description: "Your new blog post has been created and saved.",
      });

      router.push(`/admin/blog/edit/${generatedPost.slug}`);

    } catch (error) {
      console.error("Error generating or saving blog post:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI failed to generate a post. Please try a different topic.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4"/>
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-headline font-bold">Create New Blog Post</h1>
            <p className="text-foreground/70 mt-1">Start by defining the author and topic for the AI to generate.</p>
          </div>
        </div>
        <Card>
            <CardContent className="p-6 md:p-8">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Author Persona</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select an author to set the writing style" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {authorsWithCount.map(author => (
                                      <SelectItem key={author.name} value={author.name}>
                                          {author.name} ({author.count} {author.count === 1 ? 'post' : 'posts'})
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          <FormDescription>
                              The AI will adapt its writing style to match this author's persona.
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
                          <div className="flex items-center justify-between">
                              <FormLabel>Blog Post Topic</FormLabel>
                              <Button type="button" variant="outline" size="sm" onClick={handleSuggestTopics} disabled={isSuggesting || !form.watch('author')}>
                                  {isSuggesting ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                      <Sparkles className="mr-2 h-4 w-4" />
                                  )}
                                  Suggest Topics
                              </Button>
                          </div>
                          <FormControl>
                              <Input placeholder="e.g., 'The Role of 5G in Smart City Infrastructure'" {...field} />
                          </FormControl>
                          {suggestedTopics.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                  {suggestedTopics.map((topic, index) => (
                                      <Button key={index} type="button" variant="secondary" size="sm" onClick={() => handleTopicClick(topic)}>
                                          {topic}
                                      </Button>
                                  ))}
                              </div>
                          )}
                          <FormDescription>
                              This is the primary subject the AI will write about. Be specific or use AI suggestions.
                          </FormDescription>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isGenerating} size="lg" className="w-full">
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Post...
                        </>
                      ) : (
                        'Generate Post & Continue to Editor'
                      )}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
