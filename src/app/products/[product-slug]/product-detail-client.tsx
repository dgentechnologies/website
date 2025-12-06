'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { products, Product, EcosystemDetail } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Shield, Settings, Wifi, AlertTriangle, Check, CircuitBoard, Signal, Cpu, Combine, GaugeCircle, Network, Router, ToyBrick, Radar } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
    TableHead
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParallax, useScrollAnimation, useFloatingAnimation } from '@/hooks/use-scroll-animation';
import { notFound } from 'next/navigation';

// Generate Product Schema for SEO
function generateProductSchema(product: Product) {
  if (product.slug === 'auralis-ecosystem') {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Auralis Ecosystem - Smart City Lighting System",
      "alternateName": ["Auralis Smart City Solutions", "Auralis Smart Street Light"],
      "description": "A scalable, industrial-grade smart city lighting system using Hybrid Wireless Mesh Network technology (ESP-MESH + 4G LTE) for cost-effective urban infrastructure modernization. Achieves 80% energy savings and 98% reduction in cellular costs through Cluster Head architecture.",
      "brand": {
        "@type": "Brand",
        "name": "Auralis"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Dgen Technologies Private Limited",
        "url": "https://www.dgentechnologies.com"
      },
      "category": "Smart City Solutions",
      "image": `https://www.dgentechnologies.com${product.images[0]?.url}`,
      "url": `https://www.dgentechnologies.com/products/${product.slug}`,
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://www.dgentechnologies.com/contact",
        "offerCount": "1",
        "offers": [{
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Auralis Ecosystem"
          },
          "availability": "https://schema.org/InStock",
          "priceCurrency": "INR",
          "url": "https://www.dgentechnologies.com/contact"
        }]
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Network Topology",
          "value": "Hybrid Wireless Mesh Network (ESP-MESH + 4G LTE)"
        },
        {
          "@type": "PropertyValue",
          "name": "Protocol",
          "value": "MQTT / JSON packets"
        },
        {
          "@type": "PropertyValue",
          "name": "Energy Savings",
          "value": "Up to 80%"
        },
        {
          "@type": "PropertyValue",
          "name": "Cluster Ratio",
          "value": "1 Gateway (Auralis Pro) per 50 Worker Nodes (Auralis Core)"
        },
        {
          "@type": "PropertyValue",
          "name": "Hardware Components",
          "value": "Auralis Pro (Gateway Node), Auralis Core (Worker Node)"
        },
        {
          "@type": "PropertyValue",
          "name": "Features",
          "value": "Fault Detection, Predictive Maintenance, Intelligent Dimming"
        },
        {
          "@type": "PropertyValue",
          "name": "Manufacturing",
          "value": "Made in India"
        }
      ]
    };
  }
  
  // Generic product schema for other products (Solar Street Light, LED Street Light)
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.shortDescription,
    "brand": {
      "@type": "Brand",
      "name": "Dgen Technologies"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Dgen Technologies Private Limited",
      "url": "https://www.dgentechnologies.com"
    },
    "category": product.category,
    "image": product.images[0]?.url 
      ? (product.images[0].url.startsWith('http') ? product.images[0].url : `https://www.dgentechnologies.com${product.images[0].url}`)
      : 'https://www.dgentechnologies.com/og-image.png',
    "url": `https://www.dgentechnologies.com/products/${product.slug}`,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://www.dgentechnologies.com/contact",
      "offerCount": "1",
      "offers": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": product.title
        },
        "availability": "https://schema.org/InStock",
        "priceCurrency": "INR",
        "url": "https://www.dgentechnologies.com/contact"
      }]
    }
  };
}

function Section({ title, description, children, className = '' }: { title: string, description?: string, children: React.ReactNode, className?: string }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  
  return (
    <div 
      ref={ref}
      className={`space-y-6 sm:space-y-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-headline font-bold">{title}</h2>
        {description && <p className="mt-3 sm:mt-4 text-foreground/80 text-sm sm:text-base md:text-lg">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function EcosystemDetailCard({ detail, index }: { detail: EcosystemDetail, index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  
  return (
    <div 
      ref={ref}
      className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-primary/20 transition-all duration-500 interactive-card ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="p-2 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <detail.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
      </div>
      <div>
        <h4 className="font-bold text-base sm:text-lg">{detail.title}</h4>
        <p className="text-foreground/70 text-sm sm:text-base mt-1">{detail.description}</p>
      </div>
    </div>
  );
}

function SubProductCard({ sub, index }: { sub: Product['subProducts'] extends (infer T)[] | undefined ? T : never, index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  
  if (!sub) return null;
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="flex flex-col bg-card/50 border-2 border-transparent hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 h-full interactive-card gradient-border">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            {index === 0 ? <Settings className="h-6 w-6 text-primary" /> : <Zap className="h-6 w-6 text-primary" />}
            <Badge variant="outline" className="text-xs">{index === 0 ? 'Standard' : 'Advanced'}</Badge>
          </div>
          <CardTitle className="font-headline text-xl sm:text-2xl">{sub.title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{sub.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 flex-grow p-4 sm:p-6 pt-0">
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-foreground text-sm sm:text-base">Key Features:</h4>
            <ul className="space-y-3 sm:space-y-4">
              {sub.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1 rounded bg-primary/10 mt-0.5">
                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-sm sm:text-base">{feature.title}:</span>
                    <span className="text-foreground/80 ml-1 text-sm sm:text-base">{feature.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductDetailView({ product }: { product: Product }) {
  const floatOffset = useFloatingAnimation(0.5);
  const [overviewRef, overviewVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [featuresRef, featuresVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [specsRef, specsVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [faqRef, faqVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Image Carousel with enhanced effects */}
      <div className="sticky top-24">
        <div 
          className="relative"
          style={{ transform: `translateY(${floatOffset * 0.3}px)` }}
        >
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden gradient-border">
                    <div className="relative aspect-video w-full group">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        data-ai-hint={image.hint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
          
          {/* Decorative glow effect */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10 animate-pulse-subtle" />
        </div>
      </div>

      {/* Product Details with scroll animations */}
      <div className="space-y-10 sm:space-y-12">
        <div 
          ref={overviewRef}
          className={`transition-all duration-700 ${
            overviewVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-3 sm:mb-4">Overview</h2>
          <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{product.longDescription}</p>
        </div>

        <div 
          ref={featuresRef}
          className={`transition-all duration-700 ${
            featuresVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-4 sm:mb-6">Key Features</h2>
          <div className="space-y-4 sm:space-y-6">
            {product.features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-primary/20 transition-all duration-300 interactive-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          ref={specsRef}
          className={`transition-all duration-700 ${
            specsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-3 sm:mb-4">Specifications</h2>
          <Card className="overflow-hidden">
            <Table>
              <TableBody>
                {product.specifications.map((spec, index) => (
                  <TableRow key={index} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium w-1/3 text-sm sm:text-base">{spec.key}</TableCell>
                    <TableCell className="text-sm sm:text-base">{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div 
          ref={faqRef}
          className={`transition-all duration-700 ${
            faqVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {product.qna.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base sm:text-lg font-headline text-left hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-foreground/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="pt-6 sm:pt-8 space-y-3 sm:space-y-4">
          <Button asChild size="lg" className="w-full group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-primary/25">
            <Link href={`/contact?subject=Inquiry+about+${product.title}`}>
              Request a Quote <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full group">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AURALIS ECOSYSTEM - APPLE-STYLE REDESIGN
// ============================================

// Retrofit Section: Plug & Play animation
function RetrofitSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isVisible) {
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container max-w-screen-xl px-4 md:px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight mb-6">
            <span className="text-gradient">Plug & Play</span>
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-2xl mx-auto">
            Retrofit any street pole in minutes. No rewiring. No hassle.
          </p>
        </div>

        {/* Animation Container */}
        <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative aspect-[16/10] bg-gradient-to-br from-card to-background rounded-3xl border border-primary/10 overflow-hidden shadow-2xl">
            {/* Street Pole SVG Animation */}
            <svg viewBox="0 0 400 250" className="w-full h-full" aria-label="Retrofit installation animation">
              {/* Sky gradient */}
              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect fill="url(#skyGradient)" width="400" height="250"/>
              
              {/* Street Pole */}
              <rect x="195" y="80" width="10" height="170" fill="hsl(var(--foreground))" opacity="0.3" rx="2"/>
              
              {/* Existing Light Fixture */}
              <ellipse cx="200" cy="85" rx="25" ry="8" fill="hsl(var(--foreground))" opacity="0.4"/>
              <rect x="188" y="75" width="24" height="15" fill="hsl(var(--foreground))" opacity="0.3" rx="3"/>
              
              {/* Auralis Device - animated attachment */}
              <g 
                className="transition-all duration-1000"
                style={{ 
                  transform: animationStep >= 1 ? 'translateY(0)' : 'translateY(-60px)',
                  opacity: animationStep >= 1 ? 1 : 0.3
                }}
              >
                <rect 
                  x="175" y="95" width="50" height="25" 
                  fill="hsl(var(--primary))" 
                  rx="4"
                  className={animationStep >= 2 ? 'animate-pulse-subtle' : ''}
                  filter={animationStep >= 2 ? 'url(#glow)' : ''}
                />
                <circle cx="185" cy="107" r="3" fill="white" opacity="0.8"/>
                <circle cx="200" cy="107" r="3" fill="white" opacity="0.8"/>
                <circle cx="215" cy="107" r="3" fill="white" opacity="0.8"/>
                <text x="200" y="115" fontSize="6" fill="white" textAnchor="middle" fontWeight="bold">AURALIS</text>
              </g>
              
              {/* Connection indicator */}
              {animationStep >= 3 && (
                <g className="animate-pulse-subtle">
                  <circle cx="200" cy="60" r="8" fill="hsl(var(--primary))" opacity="0.3"/>
                  <circle cx="200" cy="60" r="5" fill="hsl(var(--primary))" opacity="0.5"/>
                  <circle cx="200" cy="60" r="2" fill="hsl(var(--primary))"/>
                  {/* Signal waves */}
                  <path d="M180 50 Q200 35 220 50" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.6"/>
                  <path d="M170 40 Q200 20 230 40" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" opacity="0.4"/>
                </g>
              )}

              {/* Ground */}
              <rect x="0" y="245" width="400" height="5" fill="hsl(var(--foreground))" opacity="0.1"/>
            </svg>
            
            {/* Step Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              {['Position', 'Attach', 'Power On', 'Connected'].map((step, i) => (
                <div 
                  key={step}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    animationStep >= i 
                      ? 'bg-primary text-white' 
                      : 'bg-foreground/10 text-foreground/50'
                  }`}
                >
                  {animationStep > i && <Check className="w-3 h-3" />}
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features below animation */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { icon: Zap, title: '5 Minutes', desc: 'Installation time per unit' },
            { icon: Settings, title: 'Zero Rewiring', desc: 'Works with existing infrastructure' },
            { icon: Shield, title: 'IP66 Rated', desc: 'Weather-resistant design' }
          ].map((item, i) => (
            <div key={item.title} className="text-center p-6 rounded-2xl bg-card/50 border border-primary/10 hover:border-primary/30 transition-all">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1">{item.title}</h3>
              <p className="text-foreground/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Mesh Network Section: Hybrid Mesh Visualization
function MeshNetworkSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-card to-background py-20 relative overflow-hidden">
      <div className="container max-w-screen-xl px-4 md:px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight mb-6">
            <span className="text-gradient">Hybrid Mesh Network</span>
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto">
            50 nodes. 1 SIM card. Infinite possibilities.
          </p>
        </div>

        {/* Network Visualization */}
        <div className={`relative max-w-5xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative aspect-[16/9] bg-gradient-to-br from-card to-background rounded-3xl border border-primary/10 overflow-hidden shadow-2xl p-8">
            {/* SVG Network Visualization */}
            <svg viewBox="0 0 500 280" className="w-full h-full" aria-label="Hybrid mesh network topology visualization">
              <defs>
                <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1"/>
                </linearGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background */}
              <rect fill="url(#meshGradient)" width="500" height="280" rx="20"/>

              {/* Cloud Icon */}
              <g transform="translate(420, 30)">
                <ellipse cx="25" cy="25" rx="30" ry="20" fill="hsl(var(--primary))" opacity="0.2"/>
                <text x="25" y="30" fontSize="10" fill="hsl(var(--primary))" textAnchor="middle" fontWeight="bold">CLOUD</text>
              </g>

              {/* LTE Connection from Gateway to Cloud */}
              <path 
                d="M250 80 Q350 50 420 50" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="5,5"
                className={isVisible ? 'animate-pulse-subtle' : ''}
              />
              <text x="330" y="45" fontSize="8" fill="hsl(var(--primary))" fontWeight="bold">4G LTE</text>

              {/* Gateway (Auralis Pro) - Center */}
              <g 
                transform="translate(230, 90)"
                onMouseEnter={() => setActiveNode(0)}
                onMouseLeave={() => setActiveNode(null)}
                className="cursor-pointer"
              >
                <rect 
                  x="0" y="0" width="40" height="40" 
                  fill="hsl(var(--primary))" 
                  rx="8"
                  filter={activeNode === 0 ? 'url(#nodeGlow)' : ''}
                  className="transition-all duration-300"
                />
                <text x="20" y="25" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">PRO</text>
                {/* Signal indicator */}
                <g transform="translate(20, -10)">
                  <circle r="4" fill="hsl(var(--primary))" className="animate-pulse-subtle"/>
                </g>
              </g>

              {/* Worker Nodes (Auralis Core) - Mesh Formation */}
              {[
                { x: 80, y: 60 }, { x: 120, y: 120 }, { x: 80, y: 180 },
                { x: 160, y: 60 }, { x: 180, y: 150 }, { x: 140, y: 210 },
                { x: 320, y: 60 }, { x: 360, y: 120 }, { x: 320, y: 180 },
                { x: 280, y: 150 }, { x: 300, y: 210 }, { x: 380, y: 60 },
              ].map((pos, i) => (
                <g key={i}>
                  {/* Connection lines to gateway */}
                  <line 
                    x1={pos.x + 15} y1={pos.y + 15} 
                    x2="250" y2="110"
                    stroke="hsl(var(--primary))" 
                    strokeWidth="1" 
                    opacity="0.3"
                    strokeDasharray={activeNode === i + 1 ? '0' : '3,3'}
                    className="transition-all duration-300"
                  />
                  {/* Node */}
                  <g 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onMouseEnter={() => setActiveNode(i + 1)}
                    onMouseLeave={() => setActiveNode(null)}
                    className="cursor-pointer"
                  >
                    <rect 
                      x="0" y="0" width="30" height="30" 
                      fill={activeNode === i + 1 ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'} 
                      opacity={activeNode === i + 1 ? 1 : 0.3}
                      rx="6"
                      className="transition-all duration-300"
                    />
                    <text x="15" y="20" fontSize="6" fill="white" textAnchor="middle">CORE</text>
                  </g>
                </g>
              ))}

              {/* Wi-Fi Symbol near Gateway */}
              <g transform="translate(255, 145)">
                <path d="M-15 8 Q0 -5 15 8" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.8"/>
                <path d="M-10 5 Q0 -2 10 5" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.6"/>
                <path d="M-5 2 Q0 0 5 2" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4"/>
                <text x="0" y="22" fontSize="8" fill="hsl(var(--primary))" textAnchor="middle">ESP-MESH</text>
              </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"/>
                <span className="text-foreground/70">Auralis Pro (Gateway)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-foreground/30"/>
                <span className="text-foreground/70">Auralis Core (Worker)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Topology Explanation */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-8 rounded-2xl bg-card border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">Local Mesh</h3>
            </div>
            <p className="text-foreground/70">
              Workers communicate via ESP-MESH Wi-Fi. Self-healing topology automatically reroutes if any node fails.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <Signal className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">Cloud Backhaul</h3>
            </div>
            <p className="text-foreground/70">
              One Gateway connects to the cloud via 4G LTE. MQTT protocol ensures reliable data delivery.
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className={`flex flex-wrap justify-center gap-8 mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { value: '50:1', label: 'Node to Gateway Ratio' },
            { value: '98%', label: 'SIM Cost Reduction' },
            { value: '<100ms', label: 'Network Latency' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-gradient">{stat.value}</div>
              <div className="text-foreground/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Hardware Section: Auralis Core vs Pro Comparison
function HardwareSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });
  const [activeMode, setActiveMode] = useState<'core' | 'pro'>('core');

  const coreSpecs = [
    { icon: Cpu, title: 'Processor', desc: 'Dual-Core Mesh Logic Unit' },
    { icon: Radar, title: 'Sensing', desc: 'Microwave Doppler Radar (Motion Detection)' },
    { icon: Zap, title: 'Power', desc: 'Isolated High-Efficiency AC/DC Module' },
    { icon: GaugeCircle, title: 'Control', desc: 'Industrial Phase-Cut Dimming Engine' }
  ];

  const proSpecs = [
    { icon: Signal, title: 'Connectivity', desc: '4G LTE Cat 1 Cellular Module' },
    { icon: Cpu, title: 'Architecture', desc: 'High-Throughput Aggregation Processor' },
    { icon: Zap, title: 'Power', desc: 'Enhanced 10W Power Subsystem (Burst Support)' },
    { icon: Wifi, title: 'Antenna', desc: 'Dual-Band External Array (Mesh + LTE)' }
  ];

  const specs = activeMode === 'core' ? coreSpecs : proSpecs;

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card py-20 relative overflow-hidden">
      <div className="container max-w-screen-xl px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight mb-6">
            <span className="text-gradient">Inside the Brain</span>
          </h2>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-card border border-primary/20 rounded-full p-1.5 shadow-lg">
              <button
                onClick={() => setActiveMode('core')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeMode === 'core'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Auralis Core
              </button>
              <button
                onClick={() => setActiveMode('pro')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeMode === 'pro'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Auralis Pro
              </button>
            </div>
          </div>
        </div>

        <div className={`grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* PCB Visualization */}
          <div className="relative aspect-square max-w-lg mx-auto w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl"/>
            
            {/* PCB Board SVG - Abstract Design */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-8 transition-all duration-500" aria-label={`Auralis ${activeMode === 'core' ? 'Core' : 'Pro'} PCB visualization`}>
              {/* PCB Base */}
              <rect x="10" y="15" width="80" height="70" fill="#1a472a" rx="3" opacity="0.9"/>
              
              {/* Circuit traces - more dense for Pro */}
              <g stroke="#3a7d4a" strokeWidth="0.5" fill="none" opacity="0.6">
                <path d="M25 30 L40 30 L40 50 L60 50"/>
                <path d="M65 25 L65 45 L45 45"/>
                <path d="M20 60 L35 60 L35 75 L55 75"/>
                <path d="M70 65 L50 65 L50 55"/>
                {activeMode === 'pro' && (
                  <>
                    <path d="M30 35 L50 35 L50 25"/>
                    <path d="M75 40 L75 60 L60 60"/>
                    <path d="M35 70 L65 70"/>
                    <path d="M40 45 L55 45 L55 65"/>
                  </>
                )}
              </g>

              {/* Abstract Components - Core: simpler layout */}
              {activeMode === 'core' && (
                <g className="transition-all duration-500">
                  {/* Main processor chip */}
                  <rect x="35" y="35" width="20" height="15" fill="#2a2a2a" rx="2"/>
                  <rect x="33" y="38" width="2" height="3" fill="#666"/>
                  <rect x="33" y="44" width="2" height="3" fill="#666"/>
                  <rect x="55" y="38" width="2" height="3" fill="#666"/>
                  <rect x="55" y="44" width="2" height="3" fill="#666"/>
                  
                  {/* Radar sensor */}
                  <rect x="20" y="55" width="15" height="12" fill="#333" rx="1"/>
                  
                  {/* Power module */}
                  <rect x="65" y="55" width="18" height="14" fill="#2a2a2a" rx="2"/>
                  
                  {/* Dimmer circuit */}
                  <rect x="25" y="25" width="12" height="10" fill="#333" rx="1"/>
                  
                  {/* Single antenna connector (for local Mesh) */}
                  <circle cx="75" cy="25" r="4" fill="#444" stroke="#666" strokeWidth="1"/>
                  <circle cx="75" cy="25" r="2" fill="#888"/>
                </g>
              )}

              {/* Abstract Components - Pro: denser layout with dual antennas and SIM */}
              {activeMode === 'pro' && (
                <g className="transition-all duration-500">
                  {/* Main processor chip - larger */}
                  <rect x="32" y="33" width="24" height="18" fill="#2a2a2a" rx="2"/>
                  <rect x="29" y="36" width="3" height="3" fill="#666"/>
                  <rect x="29" y="42" width="3" height="3" fill="#666"/>
                  <rect x="56" y="36" width="3" height="3" fill="#666"/>
                  <rect x="56" y="42" width="3" height="3" fill="#666"/>
                  
                  {/* LTE Modem chip */}
                  <rect x="18" y="55" width="18" height="14" fill="#333" rx="1"/>
                  
                  {/* Enhanced power module */}
                  <rect x="62" y="55" width="22" height="16" fill="#2a2a2a" rx="2"/>
                  <rect x="64" y="57" width="4" height="4" fill="#444"/>
                  <rect x="70" y="57" width="4" height="4" fill="#444"/>
                  
                  {/* SIM slot visualization */}
                  <rect x="18" y="25" width="14" height="10" fill="#444" rx="1" stroke="#666" strokeWidth="0.5"/>
                  <rect x="20" y="27" width="10" height="6" fill="#333" rx="0.5"/>
                  
                  {/* Dual antenna connectors (Mesh + LTE) */}
                  <circle cx="70" cy="23" r="4" fill="#444" stroke="#666" strokeWidth="1"/>
                  <circle cx="70" cy="23" r="2" fill="#888"/>
                  <circle cx="82" cy="23" r="4" fill="#444" stroke="#666" strokeWidth="1"/>
                  <circle cx="82" cy="23" r="2" fill="#888"/>
                  
                  {/* Additional components for density */}
                  <rect x="40" y="58" width="8" height="6" fill="#333" rx="1"/>
                  <rect x="50" y="58" width="8" height="6" fill="#333" rx="1"/>
                </g>
              )}

              {/* Decorative glow effect */}
              <defs>
                <filter id="pcbGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10"/>
          </div>

          {/* Specs Content */}
          <div className="space-y-6">
            {/* Header for selected mode */}
            <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h3 className="text-2xl sm:text-3xl font-headline font-bold mb-2">
                {activeMode === 'core' ? 'The Worker Node' : 'The Cluster Gateway'}
              </h3>
              <p className="text-lg text-foreground/70">
                {activeMode === 'core' 
                  ? 'The sensory network. Sensing, dimming, and relaying data on every pole.'
                  : 'The bridge to the cloud. Aggregating data for entire street clusters.'
                }
              </p>
            </div>

            {/* Specs List */}
            <div className="space-y-4">
              {specs.map((spec, i) => (
                <div 
                  key={spec.title}
                  className="p-5 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  style={{ 
                    transitionDelay: `${i * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(20px)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <spec.icon className="w-5 h-5 text-primary"/>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{spec.title}</div>
                      <div className="text-foreground/60 text-sm">{spec.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hybrid Mesh Note */}
            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground/70">
                <span className="font-semibold text-primary">Hybrid Wireless Mesh:</span> Core nodes communicate with Pro gateways via ESP-MESH. Pro aggregates data and connects to the cloud via 4G LTE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Fault Detection Section: Alert Simulation
function FaultDetectionSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [simulationStep, setSimulationStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isVisible) {
      interval = setInterval(() => {
        setSimulationStep((prev) => (prev + 1) % 5);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-card to-background py-20 relative overflow-hidden">
      <div className="container max-w-screen-xl px-4 md:px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight mb-6">
            <span className="text-gradient">Instant Fault Detection</span>
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-2xl mx-auto">
            Know before citizens complain. Fix before darkness spreads.
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Street Light Grid Visualization */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden relative">
              {/* Night sky effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"/>
              
              {/* Street lights grid */}
              <div className="absolute inset-8 grid grid-cols-4 grid-rows-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const isFailing = simulationStep >= 1 && i === 5;
                  const isFixed = simulationStep >= 4 && i === 5;
                  
                  return (
                    <div key={i} className="relative flex items-center justify-center">
                      {/* Light pole */}
                      <div className="w-1 h-full bg-slate-600 absolute bottom-0"/>
                      {/* Light */}
                      <div 
                        className={`w-8 h-8 rounded-full transition-all duration-500 ${
                          isFailing && !isFixed
                            ? 'bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                            : 'bg-yellow-200/80 shadow-[0_0_30px_rgba(253,224,71,0.6)]'
                        }`}
                      />
                      {/* Failure indicator */}
                      {isFailing && !isFixed && (
                        <div className="absolute -top-2 -right-2">
                          <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status badge */}
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                simulationStep >= 1 && simulationStep < 4 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {simulationStep >= 1 && simulationStep < 4 ? '1 Fault Detected' : 'All Systems Normal'}
              </div>
            </div>
          </div>

          {/* Phone Alert Mockup */}
          <div className="relative max-w-xs mx-auto">
            {/* Phone frame */}
            <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden">
                {/* Phone notch */}
                <div className="h-8 bg-slate-900 flex items-center justify-center">
                  <div className="w-20 h-5 bg-slate-800 rounded-full"/>
                </div>
                
                {/* Phone screen */}
                <div className="p-4 min-h-[400px] bg-gradient-to-b from-slate-800 to-slate-900">
                  {/* App header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white"/>
                    </div>
                    <div>
                      <div className="text-white font-bold">Auralis Dashboard</div>
                      <div className="text-slate-400 text-xs">Smart City Monitoring</div>
                    </div>
                  </div>

                  {/* Alert notification */}
                  <div 
                    className={`transition-all duration-500 ${
                      simulationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"/>
                        <div>
                          <div className="text-white font-medium text-sm">Fault Alert</div>
                          <div className="text-slate-400 text-xs mt-1">
                            Light #247 - Sector 5<br/>
                            LED Driver Failure Detected
                          </div>
                          <div className="text-slate-500 text-xs mt-2">Just now</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance dispatched */}
                  <div 
                    className={`transition-all duration-500 ${
                      simulationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="bg-primary/20 border border-primary/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"/>
                        <div>
                          <div className="text-white font-medium text-sm">Maintenance Dispatched</div>
                          <div className="text-slate-400 text-xs mt-1">
                            Technician assigned<br/>
                            ETA: 25 minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issue resolved */}
                  <div 
                    className={`transition-all duration-500 ${
                      simulationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"/>
                        <div>
                          <div className="text-white font-medium text-sm">Issue Resolved</div>
                          <div className="text-slate-400 text-xs mt-1">
                            Light #247 back online<br/>
                            Total downtime: 28 minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-2xl -z-10"/>
          </div>
        </div>

        {/* Timeline steps */}
        <div className={`flex flex-wrap justify-center gap-4 mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { step: 0, label: 'Normal Operation' },
            { step: 1, label: 'Failure Occurs' },
            { step: 2, label: 'Alert Sent' },
            { step: 3, label: 'Maintenance Dispatched' },
            { step: 4, label: 'Issue Resolved' }
          ].map((item) => (
            <div 
              key={item.step}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                simulationStep >= item.step 
                  ? 'bg-primary text-white' 
                  : 'bg-foreground/10 text-foreground/50'
              }`}
            >
              {simulationStep > item.step && <Check className="w-4 h-4" />}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ product }: { product: Product }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
      <div className="container max-w-screen-lg px-4 md:px-6 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight mb-6">
            Ready to illuminate your city?
          </h2>
          <p className="text-xl text-foreground/70 max-w-xl mx-auto mb-8">
            Join hundreds of municipalities transforming their infrastructure with Auralis.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-primary/25 text-lg px-8">
              <Link href={`/contact?subject=Inquiry+about+${product.title}`}>
                Get Started <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group text-lg px-8">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                All Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section for Ecosystem
function EcosystemFAQSection({ qna }: { qna: Product['qna'] }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container max-w-screen-lg px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Accordion type="single" collapsible className="w-full">
            {qna.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-headline text-left hover:text-primary transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

// Main Ecosystem Product View - Apple Style
function EcosystemProductView({ product }: { product: Product }) {
  const { qna } = product;

  return (
    <div className="space-y-0">
      {/* Retrofit Section */}
      <RetrofitSection />
      
      {/* Mesh Network Section */}
      <MeshNetworkSection />
      
      {/* Hardware Section */}
      <HardwareSection />
      
      {/* Fault Detection Section */}
      <FaultDetectionSection />
      
      {/* CTA Section */}
      <CTASection product={product} />
      
      {/* FAQ Section */}
      <EcosystemFAQSection qna={qna} />
    </div>
  );
}

interface HeroSectionProps {
  product: Product;
  parallaxOffset: number;
  floatOffset: number;
}

interface ScrollTransformState {
  progress: number;
  isComplete: boolean;
}

function useScrollTransform(): ScrollTransformState {
  const [state, setState] = useState<ScrollTransformState>({
    progress: 0,
    isComplete: false
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setState({ progress: 0, isComplete: false });
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress from 0 to 1 based on scroll within first viewport
      // Complete the animation when scrolled 70% of viewport
      const progress = Math.min(Math.max(scrollY / (viewportHeight * 0.7), 0), 1);
      const isComplete = progress >= 1;
      
      setState({ progress, isComplete });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return state;
}

// New Apple-style Hero Section for Auralis Ecosystem
function EcosystemHeroSection({ product, parallaxOffset, floatOffset }: HeroSectionProps) {
  const heroImage = product.images[0];
  const { progress } = useScrollTransform();
  
  // Easing function for smoother animation
  const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
  const easedProgress = easeOutCubic(progress);
  
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-background via-card to-background overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      {/* Parallax decorative elements */}
      <div 
        className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      />
      <div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${-parallaxOffset * 0.5}px)` }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl hidden lg:block"
        style={{ transform: `translateY(${floatOffset}px)` }}
      />

      <div className="container max-w-screen-xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div 
            className="mb-8 animate-slide-down"
            style={{ 
              opacity: 1 - easedProgress * 2,
              transform: `translateY(${easedProgress * -20}px)`
            }}
          >
            <Badge variant="outline" className="py-2 px-5 text-sm font-medium border-primary/30 text-primary bg-primary/5 backdrop-blur-sm">
              Smart City Solutions
            </Badge>
          </div>

          {/* Main Title - Large Typography */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-headline font-bold tracking-tighter mb-6 animate-slide-up"
            style={{ 
              opacity: 1 - easedProgress * 1.5,
              transform: `translateY(${easedProgress * -40}px) scale(${1 - easedProgress * 0.1})`
            }}
          >
            <span className="text-gradient">Auralis</span>
          </h1>

          {/* Subtitle */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline font-medium tracking-tight text-foreground/90 mb-8 animate-slide-up"
            style={{ 
              animationDelay: '0.1s',
              opacity: 1 - easedProgress * 1.5,
              transform: `translateY(${easedProgress * -30}px)`
            }}
          >
            The Brain of the Smart City
          </h2>

          {/* Short description */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 animate-slide-up"
            style={{ 
              animationDelay: '0.2s',
              opacity: 1 - easedProgress * 2,
              transform: `translateY(${easedProgress * -20}px)`
            }}
          >
            Industrial-grade intelligence for modern urban infrastructure.
          </p>

          {/* Hero Product Image with 3D effect */}
          <div 
            className="relative w-full max-w-3xl mx-auto animate-scale-in"
            style={{ 
              animationDelay: '0.3s',
              transform: `perspective(1000px) rotateX(${easedProgress * 15}deg) translateY(${easedProgress * 50}px) scale(${1 - easedProgress * 0.2})`,
              opacity: 1 - easedProgress * 0.8
            }}
          >
            <div className="relative group">
              {/* 3D shadow effect */}
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 to-transparent rounded-3xl blur-2xl transform translate-y-4 group-hover:translate-y-6 transition-transform duration-500" />
              
              {/* Main image card */}
              <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl group-hover:border-primary/30 transition-all duration-500">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    data-ai-hint={heroImage.hint}
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Floating stats on image */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-center gap-4">
                    {[
                      { value: '80%', label: 'Energy Savings' },
                      { value: '98%', label: 'Cost Reduction' },
                      { value: '50:1', label: 'Node Ratio' }
                    ].map((stat) => (
                      <div 
                        key={stat.label}
                        className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10"
                      >
                        <div className="text-white text-xl sm:text-2xl font-bold">{stat.value}</div>
                        <div className="text-white/70 text-xs sm:text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap justify-center gap-4 mt-12 animate-slide-up"
            style={{ 
              animationDelay: '0.4s',
              opacity: 1 - easedProgress * 3,
              transform: `translateY(${easedProgress * -10}px)`
            }}
          >
            <Button asChild size="lg" className="text-lg px-8 py-6 group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-primary/25">
              <Link href={`/contact?subject=Inquiry+about+${product.title}`}>
                Get Started <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 group">
              <Link href="#features">
                Learn More
                <Zap className="ml-2 h-5 w-5 group-hover:text-primary transition-colors" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
        style={{ opacity: 1 - progress * 3 }}
      >
        <span className="text-foreground/50 text-sm font-medium">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}

function DefaultHeroSection({ product, parallaxOffset, floatOffset }: HeroSectionProps) {
  return (
    <section className="w-full py-16 sm:py-20 md:py-32 bg-card relative overflow-hidden">
      {/* Decorative background elements */}
      <div 
        className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-accent/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${-parallaxOffset}px)` }}
      />
      
      {/* Floating icons */}
      <div 
        className="absolute top-1/4 right-10 text-primary/10 hidden lg:block"
        style={{ transform: `translateY(${floatOffset}px)` }}
      >
        <Shield className="w-16 h-16" />
      </div>
      <div 
        className="absolute bottom-1/4 left-10 text-primary/10 hidden lg:block"
        style={{ transform: `translateY(${-floatOffset}px)` }}
      >
        <Zap className="w-12 h-12" />
      </div>

      <div className="container max-w-screen-xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
          <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary animate-slide-down animate-glow-pulse">{product.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
            {product.title}
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
            {product.shortDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProductDetailClient({ productSlug }: { productSlug: string }) {
  const parallaxOffset = useParallax(0.2);
  const floatOffset = useFloatingAnimation(0.7);

  const product = products.find((p) => p.slug === productSlug);
  
  if (!product) {
    notFound();
  }

  const isEcosystemProduct = !!product.ecosystem;
  const productSchema = generateProductSchema(product);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Product Schema for SEO */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Hero Section - Different for Ecosystem vs Regular Products */}
      {isEcosystemProduct ? (
        <EcosystemHeroSection product={product} parallaxOffset={parallaxOffset} floatOffset={floatOffset} />
      ) : (
        <DefaultHeroSection product={product} parallaxOffset={parallaxOffset} floatOffset={floatOffset} />
      )}

      {/* Main Content - Ecosystem has full-width sections, others have contained layout */}
      {isEcosystemProduct ? (
        <div id="features">
          <EcosystemProductView product={product} />
        </div>
      ) : (
        <section id="features" className="w-full py-12 sm:py-16 md:py-24 relative">
          <div className="container max-w-screen-xl px-4 md:px-6">
            <ProductDetailView product={product} />
          </div>
        </section>
      )}
    </div>
  );
}
