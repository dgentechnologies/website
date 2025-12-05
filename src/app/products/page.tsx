'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParallax, useScrollAnimation, useFloatingAnimation } from '@/hooks/use-scroll-animation';

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
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block h-full"
        aria-label={`View ${product.title} - ${product.category}`}
      >
        <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-2 border-primary/10 hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group cursor-pointer">
          {/* Large Hero Image */}
          {product.images[0] && (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={product.images[0].url}
                alt={`${product.title} - DGEN Technologies`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Category badge positioned on image */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium shadow-lg">
                  {product.category}
                </Badge>
              </div>
              
              {/* Product icon floating on image */}
              <div className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                <product.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>

              {/* Title overlay on image bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-white mb-2 group-hover:text-primary-foreground transition-colors drop-shadow-lg">
                  {product.title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2 leading-relaxed">
                  {product.shortDescription.includes('.') 
                    ? `${product.shortDescription.split('.')[0]}.`
                    : product.shortDescription}
                </p>
              </div>
            </div>
          )}
          
          {/* CTA Section */}
          <div className="p-5 bg-gradient-to-b from-card/50 to-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70 font-medium">Explore Product</span>
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                <span className="text-sm">Learn More</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ProductsPage() {
  const parallaxOffset = useParallax(0.3);
  const floatOffset = useFloatingAnimation(0.8);
  const [productsRef, productsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Full Screen Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center text-center">
        {/* Parallax Background Layer */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="DGEN Technologies Smart City Products"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Floating decorative elements */}
        <div 
          className="absolute top-1/4 left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-primary/20 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${floatOffset}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-accent/15 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${-floatOffset}px)`, animationDelay: '1s' }}
        />

        {/* Hero Content */}
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-4 sm:space-y-6">
            <Badge variant="default" className="py-1.5 px-4 text-sm sm:text-base font-semibold animate-slide-down">
              Our Products
            </Badge>
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-white leading-tight animate-slide-up" 
              style={{ animationDelay: '0.2s' }}
            >
              Smart City Solutions
            </h1>
            <p 
              className="max-w-2xl mx-auto text-white/90 text-lg sm:text-xl md:text-2xl animate-slide-up" 
              style={{ animationDelay: '0.3s' }}
            >
              Made in India IoT Solutions
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/70 text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/70 rounded-full animate-scroll-indicator"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid - Main Focus */}
      <div className="relative z-10 bg-background">
        {/* Subtle decorative background */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

        <section className="w-full py-10 md:py-14 lg:py-20 overflow-hidden relative">
          <div className="container max-w-screen-xl px-4 md:px-6">
            {/* Section Header - Minimal */}
            <div 
              ref={productsRef}
              className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight md:text-4xl">
                Choose Your Solution
              </h2>
              <p className="mt-2 text-foreground/60 text-sm sm:text-base max-w-lg mx-auto">
                Click any product to explore features and specifications
              </p>
            </div>
            
            {/* Products Grid - Larger Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Streamlined */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden relative">
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 relative ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight md:text-4xl">
              Need a Custom Solution?
            </h2>
            <p className="mt-3 text-foreground/70 text-sm sm:text-base max-w-md mx-auto">
              We design custom IoT hardware tailored to your requirements.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="group shadow-lg hover:shadow-primary/30 transition-all duration-300">
                <Link href="/contact?subject=Custom+Hardware+Inquiry">
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
