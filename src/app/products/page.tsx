
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

export default function ProductsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-4">
            <Badge variant="default" className="py-1 px-3 text-lg">Our Products</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl text-gradient leading-tight">
              Hardware for a Smarter World
            </h1>
            <p className="max-w-2xl mx-auto text-white/80 md:text-lg lg:text-xl">
              Robust, reliable, and intelligent hardware engineered for the demands of modern smart infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="relative z-10 bg-background">
        <section className="w-full py-16 md:py-24">
          <div className="container max-w-screen-xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.slug} className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                  {product.images[0] && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        fill
                        className="object-cover"
                        data-ai-hint={product.images[0].hint}
                      />
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-start gap-4">
                    <product.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                      <CardTitle className="font-headline text-xl">{product.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{product.shortDescription}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full group">
                      <Link href={`/products/${product.slug}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

         {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
          <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-gradient">
                  Have a Custom Hardware Need?
              </h2>
              <p className="mt-4 text-foreground/80 md:text-lg">
                  Beyond our standard products, we offer custom hardware design and engineering services to meet your unique project requirements.
              </p>
              <div className="mt-8">
                  <Button asChild size="lg" className="group">
                      <Link href="/contact?subject=Custom+Hardware+Inquiry">
                          Discuss Your Project <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </Button>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
