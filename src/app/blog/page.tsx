
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { adminFirestore } from '@/firebase/server';
import { BlogPost } from '@/types/blog';

export const dynamic = 'force-dynamic';

async function getBlogPosts(): Promise<BlogPost[]> {
  const snapshot = await adminFirestore.collection('blogPosts').orderBy('createdAt', 'desc').get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => doc.data() as BlogPost);
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 sm:py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Insights</Badge>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient px-2">
              DGEN Technologies Blog
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl px-4">
              Exploring the future of smart cities, IoT, and sustainable technology.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="w-full py-12 md:py-16 lg:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          {blogPosts.length === 0 ? (
            <p className="text-center text-foreground/70 text-sm sm:text-base">No blog posts found. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                  {post.image && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint={post.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                      {post.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                    <CardTitle className="font-headline text-base sm:text-lg lg:text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-3 sm:p-4 lg:p-6 pt-0">
                    <CardDescription className="text-xs sm:text-sm">{post.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 pt-0">
                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-foreground/70 gap-3 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <UserCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
