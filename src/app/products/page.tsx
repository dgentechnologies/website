'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, Zap, ShieldCheck, Sun, GaugeCircle, Cpu, Network, Radar } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParallax, useScrollAnimation, useFloatingAnimation } from '@/hooks/use-scroll-animation';

const heroImage = PlaceHolderImages.find(img => img.id === 'about-story');

// Bento Grid Product Cards
function AuralisCard() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const product = products.find(p => p.slug === 'auralis-ecosystem')!;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block h-full"
        aria-label={`View ${product.title}`}
      >
        <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-primary/30 hover:border-primary/60 shadow-2xl hover:shadow-primary/30 transition-all duration-500 group cursor-pointer">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80" />
          </div>

          {/* Glassmorphism Content Overlay */}
          <div className="relative h-full flex flex-col p-8 md:p-10">
            <div className="flex-1">
              <Badge className="bg-primary/20 backdrop-blur-md border border-primary/40 text-primary-foreground px-4 py-1.5 text-sm font-semibold shadow-lg mb-4">
                {product.category}
              </Badge>
              
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-white mb-4 drop-shadow-2xl">
                {product.title}
              </h3>
              
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                Flagship smart city lighting system with Hybrid Wireless Mesh Network technology
              </p>

              {/* Feature Icons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Wifi className="h-7 w-7 text-primary" />
                  <span className="text-white text-xs font-medium">ESP-MESH</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Network className="h-7 w-7 text-primary" />
                  <span className="text-white text-xs font-medium">4G LTE</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Radar className="h-7 w-7 text-primary" />
                  <span className="text-white text-xs font-medium">Radar</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Cpu className="h-7 w-7 text-primary" />
                  <span className="text-white text-xs font-medium">IoT Core</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group-hover:gap-4">
                <span className="text-base">Explore Ecosystem</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function SolarCard() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const product = products.find(p => p.slug === 'solar-street-light')!;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
      style={{ transitionDelay: '150ms' }}
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block h-full"
        aria-label={`View ${product.title}`}
      >
        <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-primary/30 hover:border-primary/60 shadow-2xl hover:shadow-primary/30 transition-all duration-500 group cursor-pointer">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col p-8 md:p-10">
            <div className="flex-1">
              <Badge className="bg-primary/20 backdrop-blur-md border border-primary/40 text-primary-foreground px-4 py-1.5 text-sm font-semibold shadow-lg mb-4">
                {product.category}
              </Badge>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-headline font-extrabold text-white mb-4 drop-shadow-2xl">
                {product.title}
              </h3>
              
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
                Autonomous off-grid lighting powered by green energy
              </p>

              {/* Feature Icons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Sun className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Solar</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <GaugeCircle className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Autonomy</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Cpu className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Smart</span>
                </div>
              </div>

              <div className="space-y-2 text-white/80 text-sm">
                <p>✓ 3-5 nights autonomy</p>
                <p>✓ 8+ years battery life</p>
                <p>✓ Zero grid dependency</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group-hover:gap-4">
                <span className="text-base">Learn More</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function LEDCard() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const product = products.find(p => p.slug === 'led-street-light')!;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-95'
      }`}
      style={{ transitionDelay: '300ms' }}
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block h-full"
        aria-label={`View ${product.title}`}
      >
        <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-primary/30 hover:border-primary/60 shadow-2xl hover:shadow-primary/30 transition-all duration-500 group cursor-pointer">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col p-8 md:p-10">
            <div className="flex-1">
              <Badge className="bg-primary/20 backdrop-blur-md border border-primary/40 text-primary-foreground px-4 py-1.5 text-sm font-semibold shadow-lg mb-4">
                {product.category}
              </Badge>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-headline font-extrabold text-white mb-4 drop-shadow-2xl">
                {product.title}
              </h3>
              
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
                High-efficiency lighting built for durability and performance
              </p>

              {/* Feature Icons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Efficient</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Durable</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                  <GaugeCircle className="h-6 w-6 text-primary" />
                  <span className="text-white text-xs font-medium">Long Life</span>
                </div>
              </div>

              <div className="space-y-2 text-white/80 text-sm">
                <p>✓ 70% energy savings</p>
                <p>✓ 50,000+ hour lifespan</p>
                <p>✓ IP66 weather protection</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group-hover:gap-4">
                <span className="text-base">Learn More</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
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
    <div className="flex flex-col overflow-hidden items-center justify-center">
      {/* Full Screen Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Parallax Video Background Layer */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            src="/videos/product-page-hero.mp4"
          />
          {/* Enhanced dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
        </div>

        {/* Floating decorative elements */}
        <div 
          className="absolute top-1/4 left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-primary/20 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${floatOffset}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-10 w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-primary/15 blur-3xl animate-float hidden sm:block"
          style={{ transform: `translateY(${-floatOffset}px)`, animationDelay: '1s' }}
        />

        {/* Hero Content - Enhanced */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-6">
          <div className="space-y-4 sm:space-y-6 flex flex-col items-center justify-center">
            <Badge variant="default" className="py-1.5 px-4 text-sm sm:text-base font-semibold animate-slide-down mx-auto">
              Our Products
            </Badge>
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-black tracking-tight text-white leading-tight animate-slide-up text-center mx-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]" 
              style={{ 
                animationDelay: '0.2s',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)'
              }}
            >
              Smart City Solutions
            </h1>
            <p 
              className="max-w-2xl mx-auto text-white/90 text-lg sm:text-xl md:text-2xl animate-slide-up text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" 
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

      {/* Products Bento Grid - Main Focus */}
      <div className="relative z-10 bg-black flex flex-col items-center justify-center w-full">
        {/* Subtle decorative background */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

        <section className="w-full py-16 md:py-20 lg:py-24 overflow-hidden relative">
          <div className="container max-w-screen-2xl px-4 md:px-6 lg:px-8">
            {/* Section Header - Minimal */}
            <div 
              ref={productsRef}
              className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight md:text-5xl text-white">
                Choose Your Solution
              </h2>
              <p className="mt-3 text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
                Premium industrial-grade products for modern smart city infrastructure
              </p>
            </div>
            
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {/* Auralis Ecosystem - Full Width on Mobile, Spanning Both Columns on Desktop */}
              <div className="lg:col-span-2">
                <AuralisCard />
              </div>
              
              {/* Solar and LED - Side by Side */}
              <SolarCard />
              <LEDCard />
            </div>
          </div>
        </section>

        {/* CTA Section - Streamlined */}
        <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black overflow-hidden relative border-t border-primary/20">
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 relative ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight md:text-5xl text-white">
              Need a Custom Solution?
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-md mx-auto">
              We design custom IoT hardware tailored to your requirements.
            </p>
            <div className="mt-8">
              <Link href="/contact?subject=Custom+Hardware+Inquiry">
                <div className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-2xl hover:shadow-primary/40 transition-all duration-300 group text-lg">
                  <span>Get in Touch</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
