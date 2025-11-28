'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


const formSchema = z.object({
  author: z.string().min(1, "Please select an author."),
  topic: z.string().min(10, "Topic must be at least 10 characters long."),
});

const authors = [
    'Tirthankar Dasgupta', 
    'Sukomal Debnath', 
    'Sagnik Mandal', 
    'Arpan Bairagi'
];

export default function CreateBlogPostPage() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      topic: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // For now, do nothing as requested.
    console.log(values);
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
                                {authors.map(author => (
                                    <SelectItem key={author} value={author}>{author}</SelectItem>
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
                        <FormLabel>Blog Post Topic</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 'The Role of 5G in Smart City Infrastructure'" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is the primary subject the AI will write about. Be specific.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={true} size="lg">
                        Create
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
