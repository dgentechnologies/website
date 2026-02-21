'use client';

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { products, Product, EcosystemDetail } from '@/lib/products-data';

// Dynamically import the custom Model3DViewer component with SSR disabled
// This uses Google's model-viewer for better performance and no watermarks
const Model3DViewer = dynamic(
  () => import('@/components/model-3d-viewer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-foreground/30">Loading 3D Model...</div>
      </div>
    )
  }
);
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Shield, Settings, Wifi, AlertTriangle, Check, CircuitBoard, Signal, Cpu, Combine, GaugeCircle, Network, Router, ToyBrick, Radar, MapPin, BarChart3 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
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
// Animated Mesh Network Visualization Component
function MeshNetworkAnimation() {
  const [animationStep, setAnimationStep] = useState(0);
  const filterId = `glow-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Grid of 20 core nodes positioned in a grid pattern
  const coreNodes = [
    { x: 60, y: 60 }, { x: 120, y: 60 }, { x: 180, y: 60 }, { x: 240, y: 60 }, { x: 300, y: 60 },
    { x: 60, y: 120 }, { x: 120, y: 120 }, { x: 180, y: 120 }, { x: 240, y: 120 }, { x: 300, y: 120 },
    { x: 60, y: 180 }, { x: 120, y: 180 }, { x: 240, y: 180 }, { x: 300, y: 180 },
    { x: 60, y: 240 }, { x: 120, y: 240 }, { x: 180, y: 240 }, { x: 240, y: 240 }, { x: 300, y: 240 },
    { x: 360, y: 150 }
  ];

  const centerGateway = { x: 180, y: 180 };

  // Generate mesh connections (connecting nodes to nearby neighbors)
  const meshConnections = coreNodes.map((node, i) => {
    const connections: Array<{ from: typeof node; to: typeof node }> = [];
    coreNodes.forEach((otherNode, j) => {
      if (i < j) {
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
        );
        // Connect to nearby nodes (within 80 units)
        if (distance < 80 && distance > 0) {
          connections.push({ from: node, to: otherNode });
        }
      }
    });
    return connections;
  }).flat();

  return (
    <svg viewBox="0 0 400 320" className="w-full h-full">
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Step 1: Draw mesh connections (grey lines forming web) */}
      {animationStep >= 1 && meshConnections.map((conn, i) => (
        <motion.line
          key={`mesh-${i}`}
          x1={conn.from.x}
          y1={conn.from.y}
          x2={conn.to.x}
          y2={conn.to.y}
          stroke="#6b7280"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1, delay: i * 0.02 }}
        />
      ))}

      {/* Core Nodes (Grey Dots) */}
      {coreNodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={node.x}
          cy={node.y}
          r="4"
          fill="#6b7280"
          opacity="0.6"
        />
      ))}

      {/* Center Gateway (Larger Green Dot) */}
      <circle
        cx={centerGateway.x}
        cy={centerGateway.y}
        r="10"
        fill="#19b35c"
        filter={`url(#${filterId})`}
      />

      {/* Step 2: Packets traveling from outer nodes to center */}
      {animationStep >= 2 && [0, 4, 10, 14, 18].map((nodeIndex) => {
        const node = coreNodes[nodeIndex];
        const dx = centerGateway.x - node.x;
        const dy = centerGateway.y - node.y;
        
        return (
          <motion.g
            key={`packet-${nodeIndex}`}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: [0, dx],
              y: [0, dy],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: nodeIndex * 0.2,
              ease: "easeInOut"
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="3"
              fill="#19b35c"
            />
          </motion.g>
        );
      })}

      {/* Step 3: Cloud icon and connection */}
      {animationStep >= 3 && (
        <>
          {/* Dashed line from gateway to cloud */}
          <motion.line
            x1={centerGateway.x}
            y1={centerGateway.y}
            x2={centerGateway.x}
            y2="40"
            stroke="#19b35c"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Cloud icon */}
          <g transform={`translate(${centerGateway.x - 25}, 10)`}>
            <motion.path
              d="M10 25 Q10 15 20 15 Q20 10 25 10 Q30 10 30 15 Q40 15 40 25 Q40 30 35 30 L15 30 Q10 30 10 25"
              fill="#19b35c"
              opacity="0.3"
              stroke="#19b35c"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />
            <text x="25" y="23" fontSize="8" fill="#19b35c" textAnchor="middle" fontWeight="bold">
              CLOUD
            </text>
          </g>

          {/* Data packet to cloud */}
          <motion.g
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: [0, -(centerGateway.y - 40)],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <circle
              cx={centerGateway.x}
              cy={centerGateway.y}
              r="2.5"
              fill="#19b35c"
            />
          </motion.g>
        </>
      )}
    </svg>
  );
}

// Mesh Network Section: Hybrid Mesh Architecture with Split Layout
function MeshNetworkSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gray-100">
      <div className="container max-w-screen-xl px-4 md:px-6">
        {/* Split Layout: Vertical on mobile, Horizontal on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Headline - Responsive sizing */}
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-headline font-bold tracking-tight text-gray-900">
              50 Nodes. 1 SIM Card.{' '}
              <span className="block mt-2">Zero Dead Zones.</span>
            </h2>

            {/* Sub-headline - Responsive sizing */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-headline font-semibold text-primary">
              The Hybrid Wireless Mesh Network.
            </h3>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Auralis drastically reduces cellular costs. A single Auralis Pro Gateway acts as the cluster head for up to 50 Auralis Core streetlights. If one node fails, the mesh instantly self-heals, rerouting data to keep the network live.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  50:1
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Node Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  98%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                  &lt;100ms
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Latency</div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Animation in Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* White Glass Card Container */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl border-2 border-white bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative">
              <div className="aspect-[4/3] w-full">
                <MeshNetworkAnimation />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Hardware Section: Unified Interactive Stage with Hover-Reveal Overlays
function HardwareSection() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredDevice, setHoveredDevice] = useState<'core' | 'pro' | null>(null);

  const coreSpecs = [
    { title: 'Role', value: 'Distributed Intelligence Node' },
    { title: 'Network', value: 'Self-Healing Hybrid Mesh' },
    { title: 'Sensing', value: 'Adaptive Volumetric Motion' },
    { title: 'Efficiency', value: 'Ultra-Low Power Architecture' }
  ];

  const proSpecs = [
    { title: 'Role', value: 'Intelligent Edge Gateway' },
    { title: 'Uplink', value: 'Secure Cellular IoT (LTE)' },
    { title: 'Compute', value: 'Real-Time Edge Analytics' },
    { title: 'Reliability', value: 'Industrial-Grade Surge Protection' }
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gray-100">
      <div className="container max-w-screen-xl px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-headline font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Inside the Brain
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Industrial-grade intelligence. Engineered for reliability.
          </p>
        </motion.div>

        {/* Unified Interactive Showcase Stage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {/* Single Wide Display Container - Showcase Stage */}
          <div className="p-6 sm:p-8 lg:p-12 rounded-3xl bg-white/60 backdrop-blur-xl border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            
            {/* Devices: Vertical Stack on Mobile, Side-by-Side on Desktop */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 relative">
              
              {/* Auralis Core Device */}
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredDevice('core')}
                onMouseLeave={() => setHoveredDevice(null)}
              >
                {/* Device Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300">
                  <Image
                    src="/images/auralis-core.png"
                    alt="Auralis Core - Worker Node"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover-Reveal Frosted Glass Overlay - Desktop Only */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredDevice === 'core' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:flex absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl p-6 flex-col justify-center pointer-events-none z-10"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h4>
                    <div className="space-y-3">
                      {coreSpecs.map((spec) => (
                        <div key={spec.title} className="flex justify-between items-start">
                          <span className="font-semibold text-gray-700 text-sm">{spec.title}:</span>
                          <span className="text-gray-900 text-sm text-right ml-2">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Device Title */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl sm:text-2xl font-headline font-bold text-gray-900">
                    Auralis Core
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The Worker Node
                  </p>
                </div>

                {/* Mobile: Permanent Tech Specs Below Image */}
                <div className="lg:hidden mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <h4 className="text-base font-bold text-gray-900 mb-3">Technical Specifications</h4>
                  <div className="space-y-2">
                    {coreSpecs.map((spec) => (
                      <div key={spec.title} className="flex justify-between items-start text-sm">
                        <span className="font-semibold text-gray-700">{spec.title}:</span>
                        <span className="text-gray-900 text-right ml-2">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtle Divider - Desktop Only */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

              {/* Auralis Pro Device */}
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredDevice('pro')}
                onMouseLeave={() => setHoveredDevice(null)}
              >
                {/* Device Image */}
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl flex items-center justify-center relative overflow-hidden border border-primary/10 transition-all duration-300">
                  <Image
                    src="/images/auralis-pro.png"
                    alt="Auralis Pro - Gateway Node"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover-Reveal Frosted Glass Overlay - Desktop Only */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredDevice === 'pro' ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:flex absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl p-6 flex-col justify-center pointer-events-none z-10"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <h4 className="text-xl font-bold text-gray-900">Technical Specifications</h4>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                        Gateway
                      </span>
                    </div>
                    <div className="space-y-3">
                      {proSpecs.map((spec) => (
                        <div key={spec.title} className="flex justify-between items-start">
                          <span className="font-semibold text-gray-700 text-sm">{spec.title}:</span>
                          <span className="text-gray-900 text-sm text-right ml-2 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Subtle pulsing border on hover - Desktop Only */}
                  {hoveredDevice === 'pro' && (
                    <div className="hidden lg:block absolute inset-0 rounded-2xl border-2 border-primary/40 animate-pulse pointer-events-none" />
                  )}
                </div>

                {/* Device Title */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl sm:text-2xl font-headline font-bold text-gray-900">
                    Auralis Pro
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The Gateway
                  </p>
                </div>

                {/* Mobile: Permanent Tech Specs Below Image */}
                <div className="lg:hidden mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-base font-bold text-gray-900">Technical Specifications</h4>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                      Gateway
                    </span>
                  </div>
                  <div className="space-y-2">
                    {proSpecs.map((spec) => (
                      <div key={spec.title} className="flex justify-between items-start text-sm">
                        <span className="font-semibold text-gray-700">{spec.title}:</span>
                        <span className="text-gray-900 text-right ml-2 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Command Center Section: AuralisView Software Interface
function CommandCenterSection() {
  const [activeFeature, setActiveFeature] = useState<'map' | 'analytics' | 'fault'>('map');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-driven background transition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  // Transform scroll progress to background color (from light grey to dark)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgb(243, 244, 246)", "rgb(30, 30, 30)", "rgb(10, 10, 10)"]
  );

  // Dashboard configuration constants
  const TOTAL_MAP_NODES = 15;
  const NODE_DATA = [
    { id: 1, status: 'active' },
    { id: 2, status: 'active' },
    { id: 3, status: 'warning' },
    { id: 4, status: 'active' },
    { id: 5, status: 'active' },
  ];
  const ENERGY_CHART_DATA = [65, 80, 55, 90, 70, 85, 60];

  const features = [
    {
      id: 'map' as const,
      name: 'Live Map',
      icon: MapPin,
      description: 'Real-time monitoring of all nodes',
      focus: 'Live city-wide node status visualization'
    },
    {
      id: 'analytics' as const,
      name: 'Energy Analytics',
      icon: BarChart3,
      description: 'Power consumption insights',
      focus: 'Energy graphs and consumption trends'
    },
    {
      id: 'fault' as const,
      name: 'Fault Management',
      icon: AlertTriangle,
      description: 'Instant fault detection & alerts',
      focus: 'Alert system and maintenance tracking'
    }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      style={{ backgroundColor }}
      className="flex min-h-screen w-full overflow-hidden bg-[#0a0a0a] py-12 lg:py-0"
    >
      {/* Flexbox Layout: Stacks vertically on mobile, Horizontal on desktop */}
      <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden">
        
        {/* Monitor Panel: Full width on mobile, 70% on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[70%] flex items-center justify-center p-4 lg:p-0"
        >
          {/* Desktop Monitor Mockup */}
          <div className="relative w-full h-auto lg:max-h-[90vh] flex items-center justify-center">
            {/* Bezel-less Monitor Frame */}
            <div className="relative bg-gray-900 rounded-2xl p-2 sm:p-4 shadow-2xl w-full max-h-[60vh] lg:max-h-none">
              {/* Screen with minimal bezel */}
              <div className="bg-black rounded-xl overflow-hidden border-2 lg:border-4 border-gray-800 shadow-inner">
                {/* Screen Content - Dashboard UI */}
                <div className="w-full bg-[#0f0f0f] relative overflow-hidden aspect-video">
                    {/* Dashboard Content */}
                  <motion.div
                    className="absolute inset-0 p-2 sm:p-4 lg:p-8 flex flex-col w-full h-full"
                    animate={{
                      opacity: activeFeature === 'map' ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-2 lg:mb-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center">
                          <Radar className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-xs lg:text-base">AuralisView Dashboard</h3>
                          <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">Smart City Monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-2">
                        <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-500 text-xs lg:text-sm font-medium">Live</span>
                      </div>
                    </div>

                    {/* Main Dashboard Area */}
                    <div className="flex-1 grid grid-cols-3 gap-2 lg:gap-4">
                      {/* Sidebar - Node List */}
                      <div className="col-span-1 bg-gray-900/50 rounded-lg p-2 lg:p-4 border border-gray-800">
                        <h4 className="text-white text-xs lg:text-sm font-semibold mb-2 lg:mb-3">Active Nodes</h4>
                        <div className="space-y-1 lg:space-y-2">
                          {NODE_DATA.map((node) => (
                            <div key={node.id} className="flex items-center gap-1 lg:gap-2 bg-gray-800/50 p-1 lg:p-2 rounded text-xs">
                              <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${node.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                              <span className="text-gray-300 flex-1 text-xs">Node #{node.id}47</span>
                              <span className="text-gray-500 hidden sm:inline">{node.status === 'warning' ? '⚠️' : '✓'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Center - Map/Chart Area */}
                      <div className="col-span-2 bg-gray-900/30 rounded-lg p-2 lg:p-4 border border-gray-800 relative overflow-hidden">
                        {/* Highlight based on active feature */}
                        <motion.div
                          className="absolute inset-0 bg-primary/5 rounded-lg"
                          animate={{
                            opacity: activeFeature === 'map' ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Map visualization */}
                        <div className="relative h-full flex items-center justify-center">
                          <div className="grid grid-cols-5 gap-1.5 lg:gap-3">
                            {Array.from({ length: TOTAL_MAP_NODES }).map((_, i) => (
                              <motion.div
                                key={i}
                                className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                                  i === 7 ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                                animate={{
                                  scale: activeFeature === 'map' ? [1, 1.2, 1] : 1,
                                  opacity: activeFeature === 'fault' && i === 7 ? [1, 0.5, 1] : 1,
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Energy Analytics Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
                          animate={{
                            opacity: activeFeature === 'analytics' ? 1 : 0,
                            pointerEvents: activeFeature === 'analytics' ? 'auto' : 'none',
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-full px-4 lg:px-8">
                            {/* Simple bar chart visualization */}
                            <div className="flex items-end justify-around h-32 lg:h-48 gap-1.5 lg:gap-3">
                              {ENERGY_CHART_DATA.map((height, i) => (
                                <motion.div
                                  key={i}
                                  className="flex-1 bg-primary/80 rounded-t"
                                  style={{ height: `${height}%` }}
                                  initial={{ height: 0 }}
                                  animate={{ height: activeFeature === 'analytics' ? `${height}%` : 0 }}
                                  transition={{ duration: 0.5, delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Fault Alert Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
                          animate={{
                            opacity: activeFeature === 'fault' ? 1 : 0,
                            pointerEvents: activeFeature === 'fault' ? 'auto' : 'none',
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 lg:p-5 max-w-md">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 lg:w-6 lg:h-6 text-amber-500" />
                              <span className="text-white font-semibold text-sm lg:text-base">Fault Detected</span>
                            </div>
                            <p className="text-gray-300 text-xs lg:text-sm mb-2 lg:mb-3">Light #247 - LED Driver Failure</p>
                            <div className="flex gap-2">
                              <div className="px-2 lg:px-3 py-1 lg:py-1.5 bg-primary/20 text-primary text-xs lg:text-sm rounded">Dispatched</div>
                              <div className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gray-700 text-gray-300 text-xs lg:text-sm rounded">ETA: 12 min</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Bottom Stats Bar */}
                    <div className="mt-2 lg:mt-4 flex items-center justify-around bg-gray-900/50 rounded-lg p-2 lg:p-3 border border-gray-800">
                      <div className="text-center">
                        <p className="text-primary text-xs lg:text-sm font-bold">247</p>
                        <p className="text-gray-500 text-xs hidden sm:block">Active Nodes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-500 text-xs lg:text-sm font-bold">98.7%</p>
                        <p className="text-gray-500 text-xs hidden sm:block">Uptime</p>
                      </div>
                      <div className="text-center">
                        <p className="text-blue-400 text-xs lg:text-sm font-bold">2.4 kW</p>
                        <p className="text-gray-500 text-xs hidden sm:block">Power Draw</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Monitor Stand - Hidden on mobile */}
              <div className="hidden lg:flex flex-col items-center mt-3">
                <div className="w-20 h-4 bg-gray-800 rounded-t" />
                <div className="w-32 h-2 bg-gray-900 rounded-b-lg shadow-lg" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Panel: Full width on mobile, 30% on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[30%] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 space-y-4 sm:space-y-6"
        >
          {/* Text Content */}
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-headline font-bold tracking-tight text-white mb-2 sm:mb-3">
              Command Center.
            </h2>
            <p className="text-sm lg:text-base text-gray-400 max-w-md">
              Global control from a single pane of glass. Schedule dimming, analyze power, and manage assets remotely.
            </p>
          </div>

          {/* Control Buttons: 2x2 Grid on mobile, Vertical List on desktop */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;

              return (
                <motion.div
                  key={feature.id}
                  onMouseEnter={() => setActiveFeature(feature.id)} // Desktop hover
                  onClick={() => setActiveFeature(feature.id)} // Mobile tap
                  className={`py-3 px-3 lg:px-4 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? 'bg-primary/10 border border-primary shadow-[0_0_20px_rgba(25,179,92,0.2)]'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className={`p-1.5 lg:p-2 rounded-md transition-colors ${
                      isActive ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <span className={`text-xs lg:text-sm font-semibold transition-colors ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                  <div className={`hidden lg:block transition-colors ${
                    isActive ? 'text-primary' : 'text-gray-600'
                  }`}>
                    →
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Fault Detection Section: Alert Simulation
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
      {/* Mesh Network Section */}
      <MeshNetworkSection />
      
      {/* Hardware Section */}
      <HardwareSection />
      
      {/* Command Center Section */}
      <CommandCenterSection />
      
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

interface Scene3DDesktopProps {
  onLoad?: () => void;
  onError?: () => void;
  scale?: string;
  startRotX: number;
  startRotY: number;
  startRotZ: number;
  section2RotationX: number;
  section2RotationY: number;
  section2RotationZ: number;
  section2TranslateX: number;
  section2Scale: number;
}

// Desktop Scene3D Component for 3D Background
// Uses Google's model-viewer for better performance and no watermarks
function Scene3DDesktop({ onLoad, onError, scale, startRotX, startRotY, startRotZ, section2RotationX, section2RotationY, section2RotationZ, section2TranslateX, section2Scale }: Scene3DDesktopProps) {
  const { progress } = useScrollTransform();

  // Interpolate CSS transform values driven by scroll progress
  const translateX = -20 + progress * (section2TranslateX - (-20)); // -20% → section2TranslateX
  const scaleFactor = 0.9 - progress * (0.9 - section2Scale);       // 0.9 → section2Scale

  // Interpolate model orientation (X/Y/Z) between section 1 start and section 2 end
  const rotX = startRotX + progress * (section2RotationX - startRotX);
  const rotY = startRotY + progress * (section2RotationY - startRotY);
  const rotZ = startRotZ + progress * (section2RotationZ - startRotZ);
  const interpolatedOrientation = `${rotX}deg ${rotY}deg ${rotZ}deg`;

  return (
    // Outer: viewport-sized fixed frame — transformOrigin '50% 50%' = exact viewport center
    <div 
      className="fixed top-0 left-0 w-full h-screen hidden lg:block"
      style={{ 
        zIndex: -1,
        transform: `translateX(${translateX}%) scale(${scaleFactor})`,
        transformOrigin: '50% 50%',
        willChange: 'transform',
        overflow: 'visible',
      }}
    >
      {/* Inner: oversized canvas so 3D model has room to render without bottom clip */}
      <div style={{
        position: 'absolute',
        top: '-30vh',
        left: 0,
        width: '100%',
        height: '160vh',
      }}>
        <Model3DViewer
          src="/models/auralis-desktop.glb"
          alt="Auralis Ecosystem 3D Model"
          onLoad={onLoad}
          onError={onError}
          autoRotate={false}
          cameraControls={false}
          orientation={interpolatedOrientation}
          scale={scale}
          lazy={false}
          style={{ 
            width: '100%', 
            height: '100%',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
}

// Mobile Scene3D Component - Optimized for smaller screens
function Scene3DMobile({ onLoad, onError, orientation, scale }: { onLoad?: () => void; onError?: () => void; orientation?: string; scale?: string }) {
  return (
    <div className="block lg:hidden w-full h-[50vh] relative overflow-hidden">
      <div className="w-full h-full" style={{ touchAction: 'none' }}>
        <Model3DViewer
          src="/models/auralis-mobile.glb"
          alt="Auralis Ecosystem 3D Model"
          onLoad={onLoad}
          onError={onError}
          autoRotate={false}
          cameraControls={true}
          orientation={orientation}
          scale={scale}
          lazy={false}
          style={{ 
            width: '100%', 
            height: '100%',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
}

// New Apple-style Hero Section for Auralis Ecosystem with Framer Motion
// Device-specific 3D rendering with separate mobile and desktop scenes
function EcosystemHeroSection({ product, parallaxOffset, floatOffset }: HeroSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [desktopSplineLoaded, setDesktopSplineLoaded] = useState(false);
  const [mobileSplineLoaded, setMobileSplineLoaded] = useState(false);
  const [desktopSplineError, setDesktopSplineError] = useState(false);
  const [mobileSplineError, setMobileSplineError] = useState(false);
  const [orientation, setOrientation] = useState<string>("0deg 0deg -60deg");
  const [scale, setScale] = useState<string>("1 1 1");
  const [startRotX, setStartRotX] = useState<number>(0);
  const [startRotY, setStartRotY] = useState<number>(0);
  const [startRotZ, setStartRotZ] = useState<number>(-60);
  const [section2RotationX, setSection2RotationX] = useState<number>(0);
  const [section2RotationY, setSection2RotationY] = useState<number>(0);
  const [section2RotationZ, setSection2RotationZ] = useState<number>(-120);
  const [section2TranslateX, setSection2TranslateX] = useState<number>(30);
  const [section2Scale, setSection2Scale] = useState<number>(0.45);
  
  // Fetch model settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(firestore, 'product-settings', product.slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const rotX = data.rotationX ?? 0;
          const rotY = data.rotationY ?? 0;
          const rotZ = data.rotationZ ?? -60;
          setOrientation(`${rotX}deg ${rotY}deg ${rotZ}deg`);
          setStartRotX(rotX);
          setStartRotY(rotY);
          setStartRotZ(rotZ);
          const scX = data.scaleX ?? 1;
          const scY = data.scaleY ?? 1;
          const scZ = data.scaleZ ?? 1;
          setScale(`${scX} ${scY} ${scZ}`);
          setSection2RotationX(data.section2RotationX ?? 0);
          setSection2RotationY(data.section2RotationY ?? 0);
          setSection2RotationZ(data.section2RotationZ ?? -120);
          setSection2TranslateX(data.section2TranslateX ?? 30);
          setSection2Scale(data.section2Scale ?? 0.45);
        }
      } catch {
        // Use default values on error
      }
    };
    fetchSettings();
  }, [product.slug]);
  
  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Show fallback gradient if appropriate spline not loaded or error occurred
  const showFallback = isMobile 
    ? (!mobileSplineLoaded || mobileSplineError)
    : (!desktopSplineLoaded || desktopSplineError);
  
  return (
    <>
      {/* Desktop Spline 3D Background - Fixed position, visible only on lg+ screens */}
      {!desktopSplineError && (
        <Scene3DDesktop 
          onLoad={() => setDesktopSplineLoaded(true)} 
          onError={() => setDesktopSplineError(true)}
          scale={scale}
          startRotX={startRotX}
          startRotY={startRotY}
          startRotZ={startRotZ}
          section2RotationX={section2RotationX}
          section2RotationY={section2RotationY}
          section2RotationZ={section2RotationZ}
          section2TranslateX={section2TranslateX}
          section2Scale={section2Scale}
        />
      )}
      
      {/* Section 1: Hero (0% - 100% Viewport) - 2-column grid layout */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Fallback gradient background when spline isn't loaded */}
        <div className={`absolute inset-0 bg-gradient-to-b from-background via-card to-background ${showFallback ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} />
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent ${showFallback ? 'opacity-50' : 'opacity-0'} transition-opacity duration-1000`} />
        
        {/* Mobile: flex-col (3D top, text bottom), Desktop: grid */}
        <div className="relative h-screen flex flex-col lg:grid lg:grid-cols-2 items-center">
          {/* Mobile 3D Container (Top on mobile) */}
          {!mobileSplineError ? (
            <Scene3DMobile
              onLoad={() => setMobileSplineLoaded(true)}
              onError={() => setMobileSplineError(true)}
              orientation={orientation}
              scale={scale}
            />
          ) : (
            <div className="block lg:hidden w-full h-[50vh] bg-gradient-to-b from-primary/20 via-background to-background" />
          )}
          
          {/* Desktop: Left Column (3D Space) - Empty spacer for fixed Spline background */}
          <div className="hidden lg:block" aria-hidden="true" />
          
          {/* Text Content (Below 3D on mobile, Right on desktop) - auto height */}
          <div className="z-10 flex flex-col justify-center items-start px-4 sm:px-6 lg:pl-10 lg:pr-20 py-8 lg:py-0 h-auto lg:h-full">
            {/* Main Title - Responsive sizing */}
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-7xl font-headline font-bold leading-tight text-white text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="text-gradient">The Brain</span>
              <span className="block text-foreground/90">of the Smart City</span>
            </motion.h1>

            {/* Subtitle - Responsive sizing */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-400 mt-4 lg:mt-6 max-w-lg text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              Intelligent. Autonomous. Mesh-Connected. Transform legacy infrastructure into smart, responsive networks.
            </motion.p>

            {/* CTA Buttons - Responsive sizing */}
            <motion.div 
              className="flex gap-3 sm:gap-4 mt-6 lg:mt-8 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            >
              <Button asChild size="lg" className="text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-5 group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-primary/25">
                <Link href={`/contact?subject=Inquiry+about+${product.title}`}>
                  Get Started <Sparkles className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-5 group">
                <Link href="#retrofit">
                  Learn More
                  <Zap className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:text-primary transition-colors" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: The Retrofit Solution (100% - 200% Viewport) */}
      <section id="retrofit" className="relative w-full min-h-screen flex items-center justify-start overflow-hidden">
        {/* Background stays transparent to show Spline 3D behind */}
        
        {/* Content - Glassmorphism card on the left */}
        <div className="container max-w-screen-xl px-4 md:px-6 relative z-10 pointer-events-none">
          <motion.div 
            className="max-w-xl ml-0 md:ml-8 lg:ml-16"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Glassmorphism Card - Enhanced with brand green border and glow */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl border-2 border-[#19b35c] bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06),0_0_60px_rgba(25,179,92,0.3)] pointer-events-auto">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-6xl font-headline font-bold tracking-tight mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="text-gradient">Revitalize</span>
                <span className="block text-gray-900">Existing Infrastructure.</span>
              </motion.h2>
              
              <motion.p 
                className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Don't replace your poles. Upgrade them. Auralis attaches to any NEMA or wired setup in minutes, transforming legacy lights into intelligent assets.
              </motion.p>

              {/* Quick stats */}
              <motion.div 
                className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {[
                  { value: '5 min', label: 'Install Time' },
                  { value: 'Zero', label: 'Rewiring' },
                  { value: 'IP66', label: 'Weather Rated' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
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
