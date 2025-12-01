'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParallax, useScrollAnimation } from '@/hooks/use-scroll-animation';

const heroImage = PlaceHolderImages.find(img => img.id === 'about-story');

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2 h-full group">
        {product.images[0] && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={`${product.title} - ${product.shortDescription} - DGEN Technologies smart city product`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        )}
        <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">
          <product.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <CardTitle className="font-headline text-base sm:text-lg lg:text-xl">{product.title}</CardTitle>
            <Badge variant="outline" className="text-xs">{product.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-3 sm:p-4 lg:p-6 pt-0">
          <CardDescription className="text-foreground/70 text-xs sm:text-sm">{product.shortDescription}</CardDescription>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 lg:p-6 pt-0">
          <Button asChild variant="outline" className="w-full group/btn">
            <Link 
              href={`/products/${product.slug}`}
              aria-label={`View details for ${product.title} - ${product.category}`}
            >
              View Details <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ProductsPage() {
  const parallaxOffset = useParallax(0.3);
  const [productsRef, productsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center text-center">
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="DGEN Technologies smart city products - Auralis smart street lighting and IoT hardware solutions"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-3 sm:space-y-4">
            <Badge variant="default" className="py-1 px-3 text-sm sm:text-lg animate-slide-down">Our Products</Badge>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient leading-tight animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
              Hardware for a Smarter World
            </h1>
            <p className="max-w-2xl mx-auto text-white/80 text-sm sm:text-base md:text-lg lg:text-xl animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
              Robust, reliable, and intelligent IoT hardware engineered for the demands of modern smart city infrastructure and connected homes.
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator - Hidden on small screens */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="relative z-10 bg-background">
        <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
          <div className="container max-w-screen-xl px-4 md:px-6">
            <div 
              ref={productsRef}
              className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">Smart City & IoT Product Range</h2>
              <p className="mt-3 md:mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
                Explore our range of intelligent hardware solutions designed for urban infrastructure and smart connectivity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

         {/* CTA Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-card overflow-hidden">
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl text-gradient px-2">
                  Have a Custom Hardware Need?
              </h2>
              <p className="mt-3 md:mt-4 text-foreground/80 text-sm sm:text-base md:text-lg px-2">
                  Beyond our standard smart city products, we offer custom hardware design and IoT engineering services to meet your unique project requirements.
              </p>
              <div className="mt-6 md:mt-8">
                  <Button asChild size="lg" className="group hover:scale-105 transition-transform w-full sm:w-auto">
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
