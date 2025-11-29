
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


const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
const smartCityImage = PlaceHolderImages.find(img => img.id === 'auralis-hero');

const advantages = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Innovative Solutions',
      description: 'We stay at the forefront of technology to deliver future-proof solutions, helping build India\'s smart cities.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Client-Centric Approach',
      description: 'Your goals are our priority. We collaborate closely to ensure project success and build lasting partnerships.'
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
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
        question: "How does Auralis help build a #smartcity?",
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

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-4">
            <Badge variant="default" className="py-1 px-3 text-lg">Our Services</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl text-gradient leading-tight">
              The Future of Urban Intelligence
            </h1>
            <p className="max-w-2xl mx-auto text-white/80 md:text-lg lg:text-xl">
              Intelligent, efficient, and integrated. We provide end-to-end services designed to empower India's future cities.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-background">
        {/* What is a Smart City? */}
        <section className="w-full py-16 md:py-24">
            <div className="container max-w-screen-lg px-4 md:px-6 space-y-8">
                <div className="space-y-4">
                    <Badge variant="outline">The Vision</Badge>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">What is the Meaning of a Smart City?</h2>
                    <p className="max-w-3xl text-foreground/80 md:text-lg">
                        The smart cities meaning revolves around using IoT (Internet of Things) sensors and technology to collect data. Insights from that data are used to manage assets and services efficiently, with the goal of improving quality of life. A smart city enhances everything from transportation and energy efficiency to public safety and governance.
                    </p>
                    <div className="flex gap-6 pt-2">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Zap className="h-5 w-5 text-primary" />
                            <span>Smarter Infrastructure</span>
                        </div>
                         <div className="flex items-center gap-2 text-foreground/80">
                            <Wifi className="h-5 w-5 text-primary" />
                            <span>Connected Ecosystems</span>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-video w-full">
                    {smartCityImage && (
                        <Image
                            src={smartCityImage.imageUrl}
                            alt={smartCityImage.description}
                            fill
                            className="object-cover rounded-xl shadow-lg"
                            data-ai-hint={smartCityImage.imageHint}
                        />
                    )}
                </div>
            </div>
        </section>

        {/* Smart Cities Mission */}
        <section className="w-full py-16 md:py-24">
            <div className="container max-w-screen-lg px-4 md:px-6 text-center space-y-4">
                <Badge variant="default">National Initiative</Badge>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Powering the Smart Cities Mission India</h2>
                <p className="max-w-3xl mx-auto text-foreground/80 md:text-lg">
                   The Smart Cities Mission India is a visionary initiative by the Government to drive economic growth and improve quality of life. Adhering to the Smart Cities Mission guidelines, DGEN Technologies is proud to contribute by building the foundational infrastructure that will power the #smartcitiesindia of tomorrow.
                </p>
            </div>
        </section>

        {/* Our Work Section */}
        <section className="w-full py-16 md:py-24 bg-card">
            <div className="container max-w-screen-xl px-4 md:px-6">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Our Areas of Expertise</h2>
                    <p className="max-w-3xl mx-auto text-foreground/80 md:text-lg">
                        We deliver comprehensive solutions for large-scale infrastructure and are bringing our innovation to the home.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="bg-background/50">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Building2 className="h-10 w-10 text-primary" />
                            <div className="space-y-1">
                                <CardTitle className="font-headline text-xl">Smart City Infrastructure</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-foreground/70">We provide end-to-end services for urban environments, focusing on projects like smart street lighting, traffic management, public safety, and environmental monitoring to contribute to the Smart Cities Mission India.</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-background/50">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Home className="h-10 w-10 text-primary" />
                            <div className="space-y-1">
                                <CardTitle className="font-headline text-xl">Smart Home Lighting</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-foreground/70">We are expanding our expertise into the B2C market with a range of intelligent home lighting products. Our solutions focus on enhancing convenience, security, and energy efficiency for the modern home.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Why Choose DGEN Section */}
        <section className="w-full py-16 md:py-24">
           <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Why Choose DGEN Technologies?</h2>
                <p className="max-w-3xl mx-auto text-foreground/80 md:text-lg">
                  Partner with us for unparalleled quality, innovation, and a steadfast commitment to your success.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {advantages.map((advantage) => (
                    <div key={advantage.title} className="flex flex-col items-center text-center gap-4 p-6 rounded-lg hover:bg-card transition-colors">
                      <div className="p-3 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                        {advantage.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-headline font-bold">{advantage.title}</h3>
                        <p className="text-sm text-foreground/70 mt-1">{advantage.description}</p>
                      </div>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 md:py-24 bg-card">
            <div className="container max-w-screen-lg px-4 md:px-6">
                <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12">Common Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg font-headline text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-foreground/80">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container max-w-screen-md px-4 md:px-6 text-center">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-gradient">
                  Ready to Modernize Your Infrastructure?
              </h2>
              <p className="mt-4 text-foreground/80 md:text-lg">
                  Let's discuss how our services can transform your city or project. Schedule a personalized consultation with our experts today.
              </p>
              <div className="mt-8">
                  <Button asChild size="lg" className="group">
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
