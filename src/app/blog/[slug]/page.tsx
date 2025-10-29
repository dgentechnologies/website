
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { blogPosts } from '@/app/blog/page';
import { Badge } from '@/components/ui/badge';
import { Calendar, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[50vh] flex items-end justify-start text-left">
        {post.image && (
            <div className="absolute inset-0 z-0">
                 <Image
                    src={post.image.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={post.image.imageHint}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            </div>
        )}
        <div className="relative z-10 container max-w-screen-lg px-4 md:px-6 pb-12">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl lg:text-5xl text-white">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-foreground/80 space-x-4">
                <div className="flex items-center gap-2 text-white/80">
                    <UserCircle className="h-5 w-5" />
                    <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-5 w-5" />
                    <span>{post.date}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20">
        <div className="container max-w-screen-md px-4 md:px-6">
            <div 
                className="prose prose-invert prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}
