'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParallax, useScrollAnimation, useFloatingAnimation, useHorizontalParallax } from '@/hooks/use-scroll-animation';

const heroImage = PlaceHolderImages.find(img => img.id === 'about-story');

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 perspective-container ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        className="flex flex-col overflow-hidden bg-card/50 hover:bg-card interactive-card h-full group border-2 border-transparent hover:border-primary/30"
      >
        {product.images[0] && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={`${product.title} - ${product.shortDescription} - DGEN Technologies smart city product`}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Featured badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Badge className="bg-primary/90 backdrop-blur-sm animate-pulse-subtle">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </Badge>
            </div>
          </div>
        )}
        <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <product.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-headline text-base sm:text-lg lg:text-xl group-hover:text-primary transition-colors duration-300">{product.title}</CardTitle>
            <Badge variant="outline" className="text-xs">{product.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-3 sm:p-4 lg:p-6 pt-0">
          <CardDescription className="text-foreground/70 text-xs sm:text-sm">{product.shortDescription}</CardDescription>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 lg:p-6 pt-0">
          <Button asChild variant="outline" className="w-full group/btn overflow-hidden relative">
            <Link 
              href={`/products/${product.slug}`}
              aria-label={`View details for ${product.title} - ${product.category}`}
            >
              <span className="relative z-10 flex items-center">
                View Details <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-primary/10 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ProductsPage() {
  const parallaxOffset = useParallax(0.3);
  const horizontalOffset = useHorizontalParallax(0.05);
  const floatOffset = useFloatingAnimation(0.8);
  const [productsRef, productsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Enhanced Parallax */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center text-center">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Dgen Technologies Smart City Products - Auralis Ecosystem smart street lighting with Hybrid Wireless Mesh Network technology"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>

        {/* Floating decorative elements */}
        <div 
          className="absolute top-1/4 left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-primary/10 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${floatOffset}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-accent/10 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${-floatOffset}px)`, animationDelay: '1s' }}
        />

        {/* Content */}
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-3 sm:space-y-4">
            <Badge variant="default" className="py-1 px-3 text-sm sm:text-lg animate-slide-down animate-glow-pulse">Our Products</Badge>
            <h1 
              className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient leading-tight animate-slide-up px-2" 
              style={{ animationDelay: '0.2s' }}
            >
              Smart City Solutions Made in India
            </h1>
            <p 
              className="max-w-2xl mx-auto text-white/80 text-sm sm:text-base md:text-lg lg:text-xl animate-slide-up px-4" 
              style={{ animationDelay: '0.4s' }}
            >
              Explore our Auralis Ecosystem and IoT hardware solutions—robust, reliable technology engineered for modern urban infrastructure using Hybrid Wireless Mesh Networks.
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator with enhanced animation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div 
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 animate-bounce"
            style={{ transform: `translateY(${floatOffset * 0.5}px)` }}
          >
            <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* Products Grid with Enhanced Animations */}
      <div className="relative z-10 bg-background">
        {/* Decorative background elements */}
        <div 
          className="absolute top-40 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2"
          style={{ transform: `translateX(${horizontalOffset}px)` }}
        />
        <div 
          className="absolute bottom-40 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2"
          style={{ transform: `translateX(${-horizontalOffset}px)` }}
        />

        <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden relative">
          <div className="container max-w-screen-xl px-4 md:px-6">
            <div 
              ref={productsRef}
              className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl animate-fade-in-up">
                Auralis Smart City Product Range
              </h2>
              <p className="mt-3 md:mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
                Explore our three product lines: the flagship Auralis Ecosystem, Solar Street Lights, and LED Street Lights—all designed for India&apos;s Smart Cities Mission.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

         {/* CTA Section with Enhanced Effects */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-card overflow-hidden relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 relative ${
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
                  <Button asChild size="lg" className="group hover:scale-105 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-primary/25">
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
