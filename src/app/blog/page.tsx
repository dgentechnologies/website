
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';


export default function BlogPage() {
  const [blogPosts, loading, error] = useCollection(
    collection(firestore, 'blogPosts')
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Insights</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              DGEN Technologies Blog
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Exploring the future of smart cities, IoT, and sustainable technology.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden bg-card/50">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {error && <p className="text-center text-destructive">Error loading blog posts. Please try again later.</p>}
          {!loading && !error && blogPosts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.docs.map((doc) => {
                const post = doc.data() as BlogPost;
                return (
                  <Card key={post.slug} className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                    {post.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                          data-ai-hint={post.image.imageHint}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                      <CardTitle className="font-headline text-xl h-20">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{post.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-4">
                      <div className="flex items-center text-sm text-foreground/70 space-x-4">
                          <div className="flex items-center gap-2">
                              <UserCircle className="h-4 w-4" />
                              <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{post.date}</span>
                          </div>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
