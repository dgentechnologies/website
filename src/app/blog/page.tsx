
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const blogPosts = [
  {
    slug: '#',
    title: 'The Future is Bright: How Smart Street Lights are Transforming Our Cities',
    description: 'Dive deep into the technology behind smart street lights like Auralis. Discover how they reduce energy consumption, enhance public safety, and create a connected infrastructure for the cities of tomorrow.',
    author: 'Tirthankar Dasgupta',
    date: 'October 26, 2025',
    image: PlaceHolderImages.find(img => img.id === 'auralis-features'),
    tags: ['Smart Cities', 'IoT', 'Auralis']
  },
  {
    slug: '#',
    title: 'Beyond Connectivity: The Real-World Impact of IoT in Urban India',
    description: 'The Internet of Things (IoT) is more than just a buzzword. We explore how connected devices are solving practical problems in Indian cities, from waste management to real-time traffic monitoring.',
    author: 'Sagnik Mandal',
    date: 'October 20, 2025',
    image: PlaceHolderImages.find(img => img.id === 'hero-home'),
    tags: ['IoT', 'Urban Development', 'Technology']
  },
  {
    slug: '#',
    title: 'Case Study: Predictive Fault Detection with Auralis in Kolkata',
    description: 'A look at the successful pilot program of our Auralis system. This case study examines how our AI-powered predictive maintenance saved the city thousands in operational costs and improved lighting uptime by over 40%.',
    author: 'Arpan Bairagi',
    date: 'October 15, 2025',
    image: PlaceHolderImages.find(img => img.id === 'auralis-hero'),
    tags: ['Case Study', 'AI', 'Maintenance']
  }
];

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

      {/* Blog Posts Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.title} className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
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
                  <Button asChild variant="outline" className="w-full" disabled={post.slug === '#'}>
                    <Link href={post.slug}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
