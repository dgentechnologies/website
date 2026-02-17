'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Wifi, Zap, ShieldCheck, Sun, GaugeCircle, Cpu, Network, Radar } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParallax, useScrollAnimation, useFloatingAnimation } from '@/hooks/use-scroll-animation';

const heroImage = PlaceHolderImages.find(img => img.id === 'about-story');

// Premium Product Card
interface ProductCardProps {
  product: typeof products[0];
  icon: React.ReactNode;
  features: Array<{ icon: React.ReactNode; label: string }>;
  keyPoints: string[];
  index: number;
}

function ProductCard({ product, icon, features, keyPoints, index }: ProductCardProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block group"
        aria-label={`View ${product.title}`}
      >
        <Card className="bg-card backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-primary/20 h-[450px] md:h-[500px] rounded-3xl group-hover:scale-105 group-hover:-translate-y-2">
          {/* Image Section - Full Card Height */}
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover object-center transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Bottom blur gradient - Always visible with more emphasis at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/95 group-hover:via-black/80 group-hover:to-black/60" />
            
            {/* Icon Badge - positioned on image */}
            <div className="absolute top-4 right-4 p-3 md:p-4 rounded-2xl bg-primary/90 backdrop-blur-md border-2 border-primary shadow-lg shadow-primary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>

            {/* Product Title - Always visible at bottom on blur */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-headline font-bold text-white leading-tight mb-2">
                {product.title}
              </h3>
              
              {/* Details - Hidden by default, shown on hover */}
              <div className="opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-[500px] space-y-4">
                {/* Description */}
                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                  {product.shortDescription.split('.')[0]}.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30"
                    >
                      <div className="shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-xs md:text-sm font-medium text-white">{feature.label}</span>
                    </div>
                  ))}
                </div>

                {/* Key Points */}
                <div className="space-y-1.5">
                  {keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-white/90">
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
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

      {/* Products Grid Section - Premium Card Layout */}
      <section className="relative w-full bg-background py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          {/* Section Header */}
          <div 
            ref={productsRef}
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge variant="default" className="mb-4">Premium Solutions</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4">
              Our Product Lineup
            </h2>
            <p className="text-foreground/70 text-base md:text-lg max-w-2xl mx-auto">
              Choose from our range of smart lighting solutions designed for modern cities
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ProductCard
              product={auralisProduct}
              icon={<Cpu className="h-7 w-7 md:h-8 md:w-8 text-white" />}
              features={[
                { icon: <Wifi className="h-4 w-4 text-primary" />, label: "ESP-MESH" },
                { icon: <Network className="h-4 w-4 text-primary" />, label: "4G LTE" },
                { icon: <Radar className="h-4 w-4 text-primary" />, label: "Radar" },
              ]}
              keyPoints={[
                "Hybrid Wireless Mesh Network",
                "ESP-MESH + 4G LTE connectivity",
                "98% reduction in SIM costs",
              ]}
              index={0}
            />
            
            <ProductCard
              product={solarProduct}
              icon={<Sun className="h-7 w-7 md:h-8 md:w-8 text-white" />}
              features={[
                { icon: <Sun className="h-4 w-4 text-primary" />, label: "Solar" },
                { icon: <GaugeCircle className="h-4 w-4 text-primary" />, label: "Autonomy" },
                { icon: <Cpu className="h-4 w-4 text-primary" />, label: "Smart" },
              ]}
              keyPoints={[
                "3-5 nights autonomy",
                "8+ years battery life",
                "Zero grid dependency",
              ]}
              index={1}
            />
            
            <ProductCard
              product={ledProduct}
              icon={<Zap className="h-7 w-7 md:h-8 md:w-8 text-white" />}
              features={[
                { icon: <Zap className="h-4 w-4 text-primary" />, label: "Efficient" },
                { icon: <ShieldCheck className="h-4 w-4 text-primary" />, label: "Durable" },
                { icon: <GaugeCircle className="h-4 w-4 text-primary" />, label: "Long Life" },
              ]}
              keyPoints={[
                "70% energy savings",
                "50,000+ hour lifespan",
                "IP66 weather protection",
              ]}
              index={2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 lg:py-24 bg-card overflow-hidden relative border-t border-border/50">
        <div 
          ref={ctaRef}
          className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 relative ${
            ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight md:text-5xl">
            Need a Custom Solution?
          </h2>
          <p className="mt-4 text-foreground/70 text-base sm:text-lg max-w-md mx-auto">
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
  );
}
