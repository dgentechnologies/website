'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Users, ShieldCheck, Zap, Wifi } from 'lucide-react';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, Home } from 'lucide-react';
import { useParallax, useScrollAnimation } from '@/hooks/use-scroll-animation';

const heroImage = PlaceHolderImages.find(img => img.id === 'auralis-hero');
const smartCityImage = PlaceHolderImages.find(img => img.id === 'auralis-features');

const advantages = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: 'Innovative Solutions',
      description: "We stay at the forefront of technology to deliver future-proof solutions, helping build India's smart cities."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: 'Client-Centric Approach',
      description: 'Your goals are our priority. We collaborate closely to ensure project success and build lasting partnerships.'
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: 'Quality & Reliability',
      description: 'We are committed to delivering high-quality, reliable solutions with a focus on robust engineering and security.'
    }
];

const faqs = [
    {
        question: "What is the meaning of a Smart City?",
        answer: "A smart city uses IoT (Internet of Things) technology to collect data. This data provides insights that are used to manage assets, resources, and services efficiently. The primary goal is to improve the quality of life for citizens by enhancing urban services like transportation, energy, and public safety."
    },
    {
        question: "Which are some of India's smart cities?",
        answer: "Under the Smart Cities Mission India, cities like Bhubaneswar, Pune, Ahmedabad, Chennai, and Indore have made significant progress in implementing smart solutions, setting a benchmark for other cities."
    },
    {
        question: "What is the Smart Cities Mission launch date and ministry?",
        answer: "The Smart Cities Mission was launched on June 25, 2015, by the Ministry of Housing and Urban Affairs (MoHUA), Government of India. Its objective is to promote sustainable and inclusive cities that provide core infrastructure and give a decent quality of life to its citizens."
    },
    {
        question: "How does Auralis help build a smart city?",
        answer: "Auralis is more than just a street light. It's a powerful IoT platform with AI-driven fault detection, energy monitoring, and environmental sensing capabilities. By creating a connected and intelligent lighting grid, Auralis provides city administrators with the data and control needed to improve efficiency, reduce costs, and enhance public safety, which are core goals of any smart city project."
    },
    {
        question: "How does Auralis's predictive maintenance work?",
        answer: "Our AI-powered platform analyzes real-time operational data from each Auralis device. By identifying patterns that precede a failure, the system can issue a maintenance alert, allowing teams to fix problems proactively before an outage occurs."
    },
    {
        question: "Is Auralis compatible with existing city infrastructure?",
        answer: "Yes. Auralis is designed for seamless integration. Our smart street lights can replace existing fixtures with minimal retrofitting, and the platform can integrate with other city management systems via standard APIs."
    }
];

function AdvantageCard({ advantage, index }: { advantage: typeof advantages[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg hover:bg-card transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
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

function ServiceCard({ icon: Icon, title, description, index }: { icon: typeof Building2; title: string; description: string; index: number }) {
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
      <Card className="bg-background/50 h-full hover:shadow-lg hover:shadow-primary/10 transition-all transform hover:-translate-y-2">
        <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 p-4 sm:p-6">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <CardTitle className="font-headline text-lg sm:text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-foreground/70 text-sm sm:text-base">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ServicesPage() {
  const parallaxOffset = useParallax(0.3);
  const [visionRef, visionVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [smartCityImageRef, smartCityImageVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [missionRef, missionVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [workRef, workVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [whyRef, whyVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [faqRef, faqVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
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
              alt="DGEN Technologies smart city services - Auralis smart street light infrastructure"
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
            <Badge variant="default" className="py-1 px-3 text-sm sm:text-lg animate-slide-down">Our Services</Badge>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient leading-tight animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
              The Future of Urban Intelligence
            </h1>
            <p className="max-w-2xl mx-auto text-white/80 text-sm sm:text-base md:text-lg lg:text-xl animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
              Intelligent, efficient, and integrated smart city services designed to empower India&apos;s future cities with IoT and AI technology.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-background">
        {/* What is a Smart City? */}
        <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="container max-w-screen-lg px-4 md:px-6 space-y-6 md:space-y-8">
                <div 
                  ref={visionRef}
                  className={`space-y-3 sm:space-y-4 transition-all duration-700 ${
                    visionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                    <Badge variant="outline">The Vision</Badge>
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">What is the Meaning of a Smart City?</h2>
                    <p className="max-w-3xl text-foreground/80 text-sm sm:text-base md:text-lg">
                        The smart cities meaning revolves around using IoT (Internet of Things) sensors and technology to collect data. Insights from that data are used to manage assets and services efficiently, with the goal of improving quality of life. A smart city enhances everything from transportation and energy efficiency to public safety and governance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-sm sm:text-base">Smarter Infrastructure</span>
                        </div>
                         <div className="flex items-center gap-2 text-foreground/80">
                            <Wifi className="h-5 w-5 text-primary" aria-hidden="true" />
                            <span className="text-sm sm:text-base">Connected Ecosystems</span>
                        </div>
                    </div>
                </div>
                <div 
                  ref={smartCityImageRef}
                  className={`relative aspect-video w-full transition-all duration-1000 ${
                    smartCityImageVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-10 scale-95'
                  }`}
                >
                    {smartCityImage && (
                        <Image
                            src={smartCityImage.imageUrl}
                            alt="Smart city infrastructure showing connected IoT devices and intelligent urban management systems"
                            fill
                            className="object-cover rounded-xl shadow-lg transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            loading="lazy"
                        />
                    )}
                </div>
            </div>
        </section>

        {/* Smart Cities Mission */}
        <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
            <div 
              ref={missionRef}
              className={`container max-w-screen-lg px-4 md:px-6 text-center space-y-3 sm:space-y-4 transition-all duration-700 ${
                missionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
                <Badge variant="default">National Initiative</Badge>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl px-2">Powering the Smart Cities Mission India</h2>
                <p className="max-w-3xl mx-auto text-foreground/80 text-sm sm:text-base md:text-lg px-2">
                   The Smart Cities Mission India is a visionary initiative by the Government to drive economic growth and improve quality of life. Adhering to the Smart Cities Mission guidelines, DGEN Technologies is proud to contribute by building the foundational infrastructure that will power the smart cities of tomorrow.
                </p>
            </div>
        </section>

        {/* Our Work Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 bg-card overflow-hidden">
            <div className="container max-w-screen-xl px-4 md:px-6">
                <div 
                  ref={workRef}
                  className={`text-center space-y-3 sm:space-y-4 mb-8 md:mb-12 transition-all duration-700 ${
                    workVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">Our Areas of Expertise</h2>
                    <p className="max-w-3xl mx-auto text-foreground/80 text-sm sm:text-base md:text-lg px-2">
                        We deliver comprehensive IoT solutions for large-scale smart city infrastructure and are bringing our innovation to smart homes.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <ServiceCard 
                      icon={Building2}
                      title="Smart City Infrastructure"
                      description="We provide end-to-end services for urban environments, focusing on projects like smart street lighting, traffic management, public safety, and environmental monitoring to contribute to the Smart Cities Mission India."
                      index={0}
                    />
                    <ServiceCard 
                      icon={Home}
                      title="Smart Home Lighting"
                      description="We are expanding our expertise into the B2C market with a range of intelligent home lighting products. Our solutions focus on enhancing convenience, security, and energy efficiency for the modern home."
                      index={1}
                    />
                </div>
            </div>
        </section>

        {/* Why Choose DGEN Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
           <div className="container px-4 md:px-6">
            <div 
              ref={whyRef}
              className={`text-center space-y-3 sm:space-y-4 mb-8 md:mb-12 transition-all duration-700 ${
                whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
                <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">Why Choose DGEN Technologies?</h2>
                <p className="max-w-3xl mx-auto text-foreground/80 text-sm sm:text-base md:text-lg px-2">
                  Partner with us for unparalleled quality, innovation, and a steadfast commitment to your smart city success.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                {advantages.map((advantage, index) => (
                    <AdvantageCard key={advantage.title} advantage={advantage} index={index} />
                ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 bg-card overflow-hidden">
            <div className="container max-w-screen-lg px-4 md:px-6">
                <div 
                  ref={faqRef}
                  className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
                    faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl">Frequently Asked Questions About Smart Cities</h2>
                  <p className="mt-3 md:mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
                    Common questions about smart city technology, the Smart Cities Mission India, and our Auralis product.
                  </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-base sm:text-lg font-headline text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-sm sm:text-base text-foreground/80">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 xl:py-32 overflow-hidden">
          <div 
            ref={ctaRef}
            className={`container max-w-screen-md px-4 md:px-6 text-center transition-all duration-700 ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
              <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter md:text-4xl text-gradient px-2">
                  Ready to Modernize Your City Infrastructure?
              </h2>
              <p className="mt-3 md:mt-4 text-foreground/80 text-sm sm:text-base md:text-lg px-2">
                  Let&apos;s discuss how our smart city services can transform your urban infrastructure. Schedule a personalized consultation with our experts today.
              </p>
              <div className="mt-6 md:mt-8">
                  <Button asChild size="lg" className="group hover:scale-105 transition-transform w-full sm:w-auto">
                      <Link href="/contact">
                          Schedule a Demo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </Button>
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
