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

// Expanding Flex Gallery Product Column
interface ProductColumnProps {
  product: typeof products[0];
  icon: React.ReactNode;
  features: Array<{ icon: React.ReactNode; label: string }>;
  keyPoints: string[];
}

function ProductColumn({ product, icon, features, keyPoints }: ProductColumnProps) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="flex-1 min-h-[70vh] md:min-h-0 group relative overflow-hidden transition-all duration-700 ease-in-out md:hover:flex-[1.8] cursor-pointer"
      aria-label={`View ${product.title}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={product.images[0].url}
          alt={product.title}
          fill
          className="object-cover object-center transition-all duration-700 md:group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
        {/* Dark gradient overlay (bottom-to-top) for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        {/* Collapsed State Content - Always Visible */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4 mb-3">
            <div className="p-2.5 md:p-4 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/40">
              {icon}
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-headline font-bold text-white leading-tight">
              {product.title}
            </h3>
          </div>
        </div>

        {/* Expanded State Content - Always visible on mobile, fades in on desktop hover */}
        <div className="md:opacity-0 md:max-h-0 max-h-none md:overflow-hidden transition-all duration-700 md:group-hover:opacity-100 md:group-hover:max-h-[500px]">
          <p className="text-white/90 text-sm md:text-base xl:text-lg leading-relaxed mb-4 md:mb-6">
            {product.shortDescription.split('.')[0]}.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
              >
                {feature.icon}
                <span className="text-white text-xs font-medium text-center">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="space-y-1 md:space-y-2 text-white/80 text-xs md:text-sm mb-4 md:mb-6">
            {keyPoints.map((point, idx) => (
              <p key={idx}>✓ {point}</p>
            ))}
          </div>

          {/* Learn More Button */}
          <div className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-xl transition-all duration-300 group/btn">
            <span className="text-xs md:text-sm">Learn More</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const parallaxOffset = useParallax(0.3);
  const floatOffset = useFloatingAnimation(0.8);
  const [productsRef, productsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  // Get products
  const auralisProduct = products.find(p => p.slug === 'auralis-ecosystem')!;
  const solarProduct = products.find(p => p.slug === 'solar-street-light')!;
  const ledProduct = products.find(p => p.slug === 'led-street-light')!;

  return (
    <div className="flex flex-col overflow-hidden items-center justify-center">
      {/* Full Screen Hero Section - UNCHANGED */}
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
      </section>

      {/* Expanding Flex Gallery - Responsive */}
      <section className="relative w-full bg-black">
        {/* Desktop: Horizontal Flex Gallery (md and up) */}
        <div className="hidden md:flex h-screen">
          <ProductColumn
            product={auralisProduct}
            icon={<Cpu className="h-8 w-8 text-primary" />}
            features={[
              { icon: <Wifi className="h-6 w-6 text-primary" />, label: "ESP-MESH" },
              { icon: <Network className="h-6 w-6 text-primary" />, label: "4G LTE" },
              { icon: <Radar className="h-6 w-6 text-primary" />, label: "Radar" },
            ]}
            keyPoints={[
              "Hybrid Wireless Mesh Network",
              "ESP-MESH + 4G LTE connectivity",
              "98% reduction in SIM costs",
            ]}
          />
          
          <ProductColumn
            product={solarProduct}
            icon={<Sun className="h-8 w-8 text-primary" />}
            features={[
              { icon: <Sun className="h-6 w-6 text-primary" />, label: "Solar" },
              { icon: <GaugeCircle className="h-6 w-6 text-primary" />, label: "Autonomy" },
              { icon: <Cpu className="h-6 w-6 text-primary" />, label: "Smart" },
            ]}
            keyPoints={[
              "3-5 nights autonomy",
              "8+ years battery life",
              "Zero grid dependency",
            ]}
          />
          
          <ProductColumn
            product={ledProduct}
            icon={<Zap className="h-8 w-8 text-primary" />}
            features={[
              { icon: <Zap className="h-6 w-6 text-primary" />, label: "Efficient" },
              { icon: <ShieldCheck className="h-6 w-6 text-primary" />, label: "Durable" },
              { icon: <GaugeCircle className="h-6 w-6 text-primary" />, label: "Long Life" },
            ]}
            keyPoints={[
              "70% energy savings",
              "50,000+ hour lifespan",
              "IP66 weather protection",
            ]}
          />
        </div>

        {/* Mobile: Vertical Stack (below md) */}
        <div className="md:hidden flex flex-col">
          <ProductColumn
            product={auralisProduct}
            icon={<Cpu className="h-7 w-7 text-primary" />}
            features={[
              { icon: <Wifi className="h-5 w-5 text-primary" />, label: "ESP-MESH" },
              { icon: <Network className="h-5 w-5 text-primary" />, label: "4G LTE" },
              { icon: <Radar className="h-5 w-5 text-primary" />, label: "Radar" },
            ]}
            keyPoints={[
              "Hybrid Wireless Mesh Network",
              "ESP-MESH + 4G LTE connectivity",
              "98% reduction in SIM costs",
            ]}
          />
          
          <ProductColumn
            product={solarProduct}
            icon={<Sun className="h-7 w-7 text-primary" />}
            features={[
              { icon: <Sun className="h-5 w-5 text-primary" />, label: "Solar" },
              { icon: <GaugeCircle className="h-5 w-5 text-primary" />, label: "Autonomy" },
              { icon: <Cpu className="h-5 w-5 text-primary" />, label: "Smart" },
            ]}
            keyPoints={[
              "3-5 nights autonomy",
              "8+ years battery life",
              "Zero grid dependency",
            ]}
          />
          
          <ProductColumn
            product={ledProduct}
            icon={<Zap className="h-7 w-7 text-primary" />}
            features={[
              { icon: <Zap className="h-5 w-5 text-primary" />, label: "Efficient" },
              { icon: <ShieldCheck className="h-5 w-5 text-primary" />, label: "Durable" },
              { icon: <GaugeCircle className="h-5 w-5 text-primary" />, label: "Long Life" },
            ]}
            keyPoints={[
              "70% energy savings",
              "50,000+ hour lifespan",
              "IP66 weather protection",
            ]}
          />
        </div>
      </section>

      {/* CTA Section - UNCHANGED */}
      <div className="relative z-10 bg-black flex flex-col items-center justify-center w-full">
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
