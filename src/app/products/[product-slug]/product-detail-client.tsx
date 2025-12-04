'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { products, Product, EcosystemDetail } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Shield, Settings } from 'lucide-react';
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
import { Cpu, Combine, GaugeCircle, Network, Router, ToyBrick } from 'lucide-react';

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
  
  // Generic product schema for other products
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
    "image": product.images[0]?.url.startsWith('http') ? product.images[0]?.url : `https://www.dgentechnologies.com${product.images[0]?.url}`,
    "url": `https://www.dgentechnologies.com/products/${product.slug}`
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

function EcosystemProductView({ product }: { product: Product }) {
  const { ecosystem, subProducts, qna } = product;
  const architectureDiagram = PlaceHolderImages.find(img => img.id === 'auralis-architecture-diagram');
  const parallaxOffset = useParallax(0.15);
  const floatOffset = useFloatingAnimation(0.6);
  
  if (!ecosystem || !subProducts) return null;

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 relative">
      {/* Decorative floating elements */}
      <div 
        className="absolute top-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 hidden lg:block"
        style={{ transform: `translateY(${parallaxOffset}px) translateX(-50%)` }}
      />
      <div 
        className="absolute top-1/2 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-x-1/2 hidden lg:block"
        style={{ transform: `translateY(${-parallaxOffset}px) translateX(50%)` }}
      />

      {/* Ecosystem Intro */}
      <div className="relative">
        <p className="text-foreground/80 leading-relaxed max-w-4xl mx-auto text-center text-sm sm:text-base md:text-lg animate-fade-in-up">{product.longDescription}</p>
      </div>
      
      {/* Architecture */}
      <Section title={ecosystem.architecture.title} description={ecosystem.architecture.description}>
        <div className="space-y-6 sm:space-y-8">
          {architectureDiagram && (
            <Card 
              className="max-w-5xl mx-auto overflow-hidden gradient-border"
              style={{ transform: `translateY(${floatOffset * 0.2}px)` }}
            >
              <div className="relative group">
                <Image
                  src={architectureDiagram.imageUrl}
                  alt={architectureDiagram.description}
                  width={1200}
                  height={675}
                  className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Card>
          )}
          <Card className="max-w-4xl mx-auto overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 font-bold text-foreground text-sm sm:text-base">Feature</TableHead>
                  <TableHead className="font-bold text-foreground text-sm sm:text-base">Auralis Core (Worker)</TableHead>
                  <TableHead className="font-bold text-foreground text-sm sm:text-base">Auralis Pro (Gateway)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ecosystem.architecture.comparison.map((spec, index) => {
                    const [coreValue, proValue] = spec.value.split(' vs. ');
                    return (
                        <TableRow key={index} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="font-medium text-sm sm:text-base">{spec.key}</TableCell>
                            <TableCell className="text-sm sm:text-base">{coreValue}</TableCell>
                            <TableCell className="text-sm sm:text-base">{proValue}</TableCell>
                        </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </Section>
      
      {/* Shared Hardware */}
      <Section title={ecosystem.sharedHardware.title} description={ecosystem.sharedHardware.description}>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {ecosystem.sharedHardware.details.map((detail, index) => (
                <EcosystemDetailCard key={detail.title} detail={detail} index={index} />
            ))}
        </div>
      </Section>
      
      {/* Gateway Hardware */}
      <Section title={ecosystem.gatewayHardware.title} description={ecosystem.gatewayHardware.description}>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {ecosystem.gatewayHardware.details.map((detail, index) => (
                <EcosystemDetailCard key={detail.title} detail={detail} index={index} />
            ))}
        </div>
      </Section>
      
      {/* Workflow */}
      <Section title={ecosystem.workflow.title} description={ecosystem.workflow.description}>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {ecosystem.workflow.details.map((detail, index) => (
                <EcosystemDetailCard key={detail.title} detail={detail} index={index} />
            ))}
        </div>
      </Section>

      {/* Sub-Product Section */}
      <Section title="Auralis Hardware Variants" description="The Auralis Ecosystem comprises two hardware variants deployed in a Cluster Head architecture.">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto">
            {subProducts.map((sub, index) => (
              <SubProductCard key={index} sub={sub} index={index} />
            ))}
          </div>
      </Section>
      
      {/* Call to Action Section */}
      <Section title="Ready to upgrade your infrastructure?" className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
          <div className="pt-2 space-y-3 sm:space-y-4 max-w-md mx-auto">
              <Button asChild size="lg" className="w-full group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-primary/25">
                  <Link href={`/contact?subject=Inquiry+about+${product.title}`}>
                    Request a Quote <Sparkles className="ml-2 h-4 w-4 animate-pulse-subtle" />
                  </Link>
              </Button>
              <Button asChild variant="outline" className="w-full group">
                  <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to All Products
                  </Link>
              </Button>
          </div>
      </Section>

       {/* FAQ Section */}
       <Section title="Frequently Asked Questions">
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
            {qna.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-base sm:text-lg font-headline text-left hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-foreground/80">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </Section>
    </div>
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
      
      {/* Hero Section with Enhanced Parallax */}
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

      {/* Main Content */}
      <section className="w-full py-12 sm:py-16 md:py-24 relative">
        <div className="container max-w-screen-xl px-4 md:px-6">
          {isEcosystemProduct ? <EcosystemProductView product={product} /> : <ProductDetailView product={product} />}
        </div>
      </section>
    </div>
  );
}
