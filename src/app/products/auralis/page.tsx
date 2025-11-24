
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Lightbulb, Network, TrafficCone, BarChart, Wifi } from 'lucide-react';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const heroImage = PlaceHolderImages.find(img => img.id === 'auralis-hero');
const smartCityImage = PlaceHolderImages.find(img => img.id === 'auralis-hero');
const streetLightImage = PlaceHolderImages.find(img => img.id === 'auralis-features');

const qna = [
    {
        question: "What is the meaning of a Smart City?",
        answer: "The essential smart cities meaning is an urban area that uses IoT technology to collect data. Insights gained from that data are used to manage assets, resources, and services efficiently. The primary goal is to improve the quality of life for its citizens by enhancing urban services like transportation, energy, and public safety, making them more efficient, sustainable, and responsive to residents' needs."
    },
    {
        question: "Which are some of India's smart cities?",
        answer: "Under the Smart Cities Mission India, cities like Bhubaneswar, Pune, Ahmedabad, Chennai, and Indore are often recognized as leaders. They have made significant strides in implementing smart solutions in areas like urban mobility, solid waste management, and digital governance, setting a benchmark for other of India's smart cities."
    },
    {
        question: "What is the Smart Cities Mission launch date and ministry?",
        answer: "The Smart Cities Mission launch date was June 25, 2015. The Smart Cities Mission is under which ministry? It is managed by the Ministry of Housing and Urban Affairs (MoHUA), Government of India."
    },
    {
        question: "How does Auralis help build a #smartcity?",
        answer: "Auralis provides the foundational hardware and software required for a smart city. Our products, like our affordable smart lighting systems for urban streetlights, act as a network backbone that can host various sensors and communication modules. This allows a city to build a scalable and integrated network for collecting data and managing services efficiently, in line with the Smart Cities Mission guidelines."
    }
];

export default function AuralisBrandPage() {
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
                        <Badge variant="default" className="py-1 px-3 text-lg">Auralis</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl text-gradient leading-tight">
                            The Future of Urban Intelligence
                        </h1>
                        <p className="max-w-2xl mx-auto text-white/80 md:text-lg lg:text-xl">
                            Intelligent, efficient, and integrated. Auralis is the smart city brand designed to empower India's future. #smartcities
                        </p>
                    </div>
                </div>
            </section>

            <div className="relative z-10 bg-background">
                {/* What is a Smart City Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 animate-fade-in-up">
                            <Badge variant="outline" className="border-primary/50 text-primary">The Vision</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                                What is the Meaning of a Smart City?
                            </h2>
                            <p className="text-foreground/80 md:text-lg">
                                The smart cities meaning revolves around using IoT (Internet of Things) sensors and technology to collect data. Insights from that data are used to manage assets and services efficiently, with the goal of improving quality of life. A smart city enhances everything from transportation and energy efficiency to public safety and governance.
                            </p>
                            <div className="flex items-center gap-4 pt-4 text-sm text-foreground/70">
                                <Lightbulb className="h-6 w-6 text-primary" /><span>Smarter Infrastructure</span>
                                <Network className="h-6 w-6 text-primary" /><span>Connected Ecosystems</span>
                            </div>
                        </div>
                        <div className="relative aspect-video w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                           {smartCityImage && (
                                <Image
                                    src={smartCityImage.imageUrl}
                                    alt="A futuristic smart city"
                                    fill
                                    className="object-cover rounded-xl shadow-lg shadow-primary/10"
                                    data-ai-hint="smart city"
                                />
                           )}
                        </div>
                    </div>
                </section>
                
                {/* India's Smart Cities Mission Section */}
                <section className="w-full py-16 md:py-24 bg-card">
                    <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
                        <Badge variant="default">National Initiative</Badge>
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl mt-4">
                           Powering the Smart Cities Mission India
                        </h2>
                        <p className="mt-4 text-foreground/80 md:text-lg">
                            The Smart Cities Mission India is a visionary initiative by the Government to drive economic growth and improve quality of life. Adhering to the Smart Cities Mission guidelines, DGEN Technologies is proud to contribute by building the foundational infrastructure that will power the #smartcitiesindia of tomorrow.
                        </p>
                    </div>
                </section>

                {/* Auralis Products Section */}
                <section className="w-full py-16 md:py-24">
                     <div className="container max-w-screen-xl px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                            <Badge variant="outline" className="border-primary/50 text-primary">Our Products</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">The Auralis Ecosystem</h2>
                            <p className="max-w-3xl text-foreground/80 md:text-xl/relaxed">
                                Auralis is a suite of integrated solutions designed to build the intelligent, responsive cities of the future.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Product 1: Smart Street Lighting */}
                            <Card className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                                {streetLightImage && (
                                    <div className="relative aspect-video w-full">
                                        <Image
                                            src={streetLightImage.imageUrl}
                                            alt="Auralis smart street light"
                                            fill
                                            className="object-cover"
                                            data-ai-hint="street light"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <Badge variant="secondary" className="mb-2 w-fit">Product 1</Badge>
                                    <CardTitle className="font-headline text-xl">Smart Street Lighting</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>Our flagship product, offering affordable smart lighting systems for urban streetlights that form the backbone of the Auralis network.</CardDescription>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button asChild className="w-full group">
                                        <Link href="/products/auralis/smart-street-lighting">
                                            Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>

                             {/* Product 2: Automatic Traffic Control */}
                            <Card className="flex flex-col overflow-hidden bg-card/50">
                                <div className="relative aspect-video w-full bg-muted flex items-center justify-center">
                                    <div className="flex items-center gap-6 text-primary/50">
                                        <TrafficCone className="h-10 w-10" />
                                        <BarChart className="h-10 w-10" />
                                        <Wifi className="h-10 w-10" />
                                    </div>
                                </div>
                                <CardHeader>
                                     <Badge variant="default" className="mb-2 w-fit">Coming Soon</Badge>
                                    <CardTitle className="font-headline text-xl">Automatic Traffic Light Control</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>The next evolution in urban mobility. Our upcoming system will use real-time data and AI to optimize traffic flow, reduce congestion, and create safer intersections.</CardDescription>
                                </CardContent>
                                 <div className="p-6 pt-0">
                                    <Button disabled className="w-full">
                                        Stay Tuned
                                    </Button>
                                </div>
                            </Card>
                        </div>
                     </div>
                </section>
                
                 {/* Q&A Section */}
                <section className="w-full py-16 md:py-24 bg-card">
                    <div className="container max-w-screen-lg px-4 md:px-6 animate-fade-in-up">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <Badge variant="outline" className="border-primary/50 text-primary">Learn More</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Common Questions</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {qna.map((item, index) => (
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

                {/* CTA Section */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                  <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
                      <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-gradient">
                          Ready to Modernize Your Infrastructure?
                      </h2>
                      <p className="mt-4 text-foreground/80 md:text-lg">
                          Let's discuss how the Auralis ecosystem can transform your city's infrastructure. Schedule a personalized demo with our smart city experts today.
                      </p>
                      <div className="mt-8">
                          <Button asChild size="lg" className="group">
                              <Link href="/contact?subject=Auralis+Demo+Request">
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
