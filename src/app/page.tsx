'use client';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Router, BrainCircuit, Home as HomeIcon, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useParallax, useScrollAnimation, useFloatingAnimation } from '@/hooks/use-scroll-animation';

// LocalBusiness Schema for Dgen Technologies - Kolkata HQ
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.dgentechnologies.com/#organization",
  "name": "Dgen Technologies Private Limited",
  "alternateName": ["Dgen Technologies", "DGEN Technologies", "Dgen Tech"],
  "description": "Dgen Technologies is a pioneering smart city solutions company based in Kolkata, India. We specialize in the Auralis Ecosystem, a smart street lighting platform utilizing Hybrid Wireless Mesh Network technology with ESP-MESH and 4G LTE connectivity for intelligent urban infrastructure.",
  "url": "https://www.dgentechnologies.com",
  "logo": "https://www.dgentechnologies.com/images/logo.png",
  "image": "https://www.dgentechnologies.com/images/auralis-product-shot.png",
  "telephone": "+91-9064606348",
  "email": "contact@dgentechnologies.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1A, First Floor, Star Residency, Mondalpara,Ghosh Para Road, Salua Bazar, Rajarhat, PS - Airport",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "postalCode": "700136",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "22.632070",
    "longitude": "88.451032"
  },
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "foundingDate": "2020",
  "founder": {
    "@type": "Person",
    "name": "Dgen Technologies Team"
  },
  "knowsAbout": [
    "Smart City Solutions",
    "IoT Street Lighting",
    "Hybrid Wireless Mesh Networks",
    "ESP-MESH Technology",
    "Predictive Maintenance",
    "Urban Infrastructure"
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Auralis Ecosystem",
        "description": "A scalable smart city lighting system using Hybrid-Mesh Topology"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Solar Street Light",
        "description": "Autonomous, off-grid lighting solutions powered by the sun"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "LED Street Light",
        "description": "High-efficiency standard lighting solutions"
      }
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/dgentechnologies",
    "https://twitter.com/dgentechnologies"
  ]
};

const services = [
  {
    icon: <Building2 className="h-8 w-8 text-primary" />,
    title: 'Smart City Solutions',
    description: 'Pioneering smart city infrastructure and contributing to the Smart Cities Mission in India with our "Auralis Ecosystem" smart street lighting platform.',
  },
  {
    icon: <Router className="h-8 w-8 text-primary" />,
    title: 'IoT & Connected Devices',
    description: 'Developing and integrating IoT devices for large-scale urban projects, including affordable smart lighting systems using Hybrid Wireless Mesh Networks.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Analytics',
    description: 'Leveraging AI to provide intelligent fault detection and predictive maintenance, central to smart cities efficiency and reliability.',
  },
  {
    icon: <HomeIcon className="h-8 w-8 text-primary" />,
    title: 'Smart Home Integration',
    description: 'Expanding our innovation from smart cities to the B2C market with a new range of smart home products to make every home smarter.',
  },
];

const advantages = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Innovative Technology',
      description: "We deliver future-proof solutions using Hybrid Wireless Mesh Networks (ESP-MESH + 4G LTE), helping you build India's next generation of smart cities."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Made in India Manufacturing',
      description: 'Our products are proudly designed and manufactured in India, supporting the Smart Cities Mission and local economic growth in Kolkata and beyond.'
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Proven Deployment Architecture',
      description: 'Our Cluster Head architecture (1 Gateway per ~50 lights) delivers 80% energy savings while reducing hardware and cellular costs by 98%.'
    }
];

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
const ctaImage = PlaceHolderImages.find(img => img.id === 'about-story');

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
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
      <Card className="bg-background/50 hover:bg-background border-border/50 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full group">
        <CardHeader className="flex flex-col items-start gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {service.icon}
          </div>
          <CardTitle className="font-headline text-base sm:text-lg">{service.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-4 sm:p-6 pt-0">
          <p className="text-xs sm:text-sm text-foreground/70">{service.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdvantageItem({ advantage, index }: { advantage: typeof advantages[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-card transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="p-2 sm:p-3 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0 transform transition-transform duration-300 hover:scale-110">
        {advantage.icon}
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-headline font-bold">{advantage.title}</h3>
        <p className="text-xs sm:text-sm text-foreground/70 mt-1">{advantage.description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const parallaxOffset = useParallax(0.3);
  const [servicesRef, servicesVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [advantagesImageRef, advantagesImageVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* LocalBusiness Schema for SEO */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {/* Hero Section with Parallax */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center text-center">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${parallaxOffset}px) scale(1.1)` }}
        >
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Dgen Technologies smart city infrastructure - Auralis Ecosystem IoT street lighting technology background"
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        
        {/* Hero Content with Fade-in Animation */}
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6 animate-hero-content">
          <div className="space-y-4 md:space-y-6">
            <Badge 
              variant="outline" 
              className="py-1 px-3 border-primary/50 text-primary text-xs sm:text-sm backdrop-blur-sm animate-slide-down"
              style={{ animationDelay: '0.2s' }}
            >
              Next-Gen Technology Partners
            </Badge>
            <h1 
              className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gradient leading-tight animate-slide-up px-2"
              style={{ animationDelay: '0.4s' }}
            >
              Build Smart Cities with Integrated Solutions
            </h1>
            <p 
              className="max-w-3xl mx-auto text-white/90 text-sm sm:text-base md:text-lg lg:text-xl animate-slide-up px-4"
              style={{ animationDelay: '0.6s' }}
            >
              Dgen Technologies helps you build the future with intelligent, connected solutions. From pioneering smart city infrastructure with the Auralis Ecosystem to bringing innovation into the consumer smart home, we deliver Made in India technology that powers a smarter tomorrow.
            </p>
            <div 
              className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center pt-2 animate-slide-up px-4"
              style={{ animationDelay: '0.8s' }}
            >
              <Button asChild size="lg" className="group hover:scale-105 transition-transform w-full sm:w-auto">
                <Link href="/services">
                  Explore Our Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover:scale-105 transition-transform w-full sm:w-auto">
                <Link href="/contact">
                  Request a Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on very small screens */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-background">
        {/* Services Overview Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-card overflow-hidden">
          <div className="container px-4 md:px-6">
            <div 
              ref={servicesRef}
              className={`flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center mb-8 md:mb-12 transition-all duration-700 ${
                servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Badge variant="default" className="animate-pulse-subtle">Our Core Capabilities</Badge>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl px-2">
                Engineering the Connected Future
              </h2>
              <p className="max-w-3xl text-foreground/80 text-sm sm:text-base md:text-xl/relaxed px-2">
                We provide end-to-end technology services designed to solve complex urban and residential challenges. Our expertise transforms your smart city and smart home visions into reality.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
              <div className="space-y-4 md:space-y-6">
                <Badge variant="outline" className="border-primary/50 text-primary">The Dgen Advantage</Badge>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">
                  Your Strategic Partner in Smart City Transformation
                </h2>
                <p className="text-foreground/80 text-sm sm:text-base md:text-lg">
                  Choosing Dgen Technologies means partnering with India&apos;s pioneers in Hybrid Wireless Mesh Networks. Our Auralis Ecosystem delivers 80% energy savings and 98% reduction in cellular costs.
                </p>
                <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                  {advantages.map((advantage, index) => (
                    <AdvantageItem key={advantage.title} advantage={advantage} index={index} />
                  ))}
                </div>
              </div>
              <div 
                ref={advantagesImageRef}
                className={`relative aspect-video w-full transition-all duration-1000 ${
                  advantagesImageVisible
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-20 scale-95'
                }`}
              >
                {ctaImage && (
                  <Image
                    src={ctaImage.imageUrl}
                    alt="Dgen Technologies Auralis smart street light system - Made in India urban IoT infrastructure"
                    fill
                    className="object-cover rounded-xl shadow-lg shadow-primary/10 transition-transform duration-500 hover:scale-105"
                    data-ai-hint={ctaImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 bg-card overflow-hidden">
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl text-gradient px-2">
              Ready to Build a Smarter Tomorrow?
            </h2>
            <p className="mt-3 md:mt-4 text-foreground/80 text-sm sm:text-base md:text-lg px-2">
              Let&apos;s discuss how Dgen Technologies can elevate your smart city and residential projects. Schedule a free, no-obligation consultation with our engineering experts today to explore the possibilities.
            </p>
            <div className="mt-6 md:mt-8">
              <Button asChild size="lg" className="group hover:scale-105 transition-transform w-full sm:w-auto">
                <Link href="/contact">
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
