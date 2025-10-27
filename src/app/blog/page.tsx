
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const blogImage = PlaceHolderImages.find(img => img.id === 'blog-placeholder');

export default function BlogPage() {
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

      {/* Coming Soon Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-lg px-4 md:px-6 text-center">
            <div className="relative h-80 w-full max-w-3xl mx-auto mb-12">
                {blogImage && (
                    <Image
                        src={blogImage.imageUrl}
                        alt={blogImage.description}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                        data-ai-hint={blogImage.imageHint}
                    />
                )}
            </div>
          <h2 className="text-3xl font-headline font-bold tracking-tighter mb-4">Coming Soon!</h2>
          <p className="text-foreground/70 md:text-lg max-w-2xl mx-auto">
            We are busy writing our first series of articles on smart city technology and the impact of IoT. Soon, this space will be filled with insightful posts, case studies, and industry news.
          </p>
          <p className="text-foreground/70 md:text-lg max-w-2xl mx-auto mt-4">
            Stay tuned for articles like "The Benefits of Smart Street Lights," "How IoT is Changing City Infrastructure," and "Case Studies in Street Light Fault Detection."
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/">
                Return to Homepage <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
