
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Zap, Wifi, Wrench, BarChart, Lightbulb, TrafficCone, Network } from 'lucide-react';
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


const features = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: 'Energy Efficient',
        description: 'Utilizes advanced LED technology and smart dimming to reduce energy consumption by up to 60%.',
    },
    {
        icon: <Wifi className="h-8 w-8 text-primary" />,
        title: 'Wireless Connectivity',
        description: 'LoRaWAN and 4G/5G ready for seamless integration into your smart city network infrastructure.',
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: 'Predictive Maintenance',
        description: 'AI-powered fault detection alerts you to potential issues before they cause an outage, saving time and money.',
    },
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        title: 'Centralized Control',
        description: 'A powerful dashboard allows for remote monitoring and control of your entire street light network.',
    }
];

const techSpecs = {
    "General": {
        "Model": "Auralis-SL-2025",
        "Dimensions": "650mm x 250mm x 100mm",
        "Weight": "7.5 kg",
        "IP Rating": "IP66",
        "Housing Material": "Die-cast Aluminum"
    },
    "Electrical": {
        "Input Voltage": "100-277V AC, 50/60Hz",
        "Power Consumption": "30W - 150W (configurable)",
        "Power Factor": ">0.95",
        "Surge Protection": "10kV/10kA"
    },
    "Connectivity": {
        "Primary": "LoRaWAN 865-867 MHz (IN)",
        "Secondary": "4G LTE / 5G NR (Optional)",
        "Protocols": "MQTT, CoAP"
    },
    "Optical": {
        "Luminous Efficacy": ">160 lm/W",
        "CCT": "4000K (Neutral White)",
        "CRI": ">70",
        "Optics": "Type II, III, IV, V (customizable)"
    }
};

const qna = [
    {
        question: "What is Auralis?",
        answer: "Auralis is DGEN Technologies' umbrella brand for all our smart city solutions. It represents a unified ecosystem of connected devices, starting with intelligent street lighting and expanding to include traffic management, environmental sensors, and public safety technology."
    },
    {
        question: "How does the predictive maintenance feature work?",
        answer: "Our AI-powered platform analyzes real-time operational data (like power consumption and voltage levels) from each Auralis device. By identifying patterns and anomalies that precede a failure, the system can issue a maintenance alert, allowing your team to fix the problem proactively before an outage occurs."
    },
    {
        question: "Is Auralis compatible with our city's existing infrastructure?",
        answer: "Yes, Auralis is designed for seamless integration. Our smart street lights can replace existing fixtures with minimal retrofitting. The platform can also integrate with other city management systems and IoT devices through standard APIs and protocols."
    },
    {
        question: "What kind of security measures are in place?",
        answer: "Security is a top priority. The Auralis network uses end-to-end encryption for all data transmission. We implement robust IoT security best practices, including secure boot, encrypted firmware updates, and access control policies to protect the network from cyber threats."
    },
    {
        question: "Can Auralis be customized for our specific needs?",
        answer: "Absolutely. Auralis is a flexible platform. We can customize sensor packages, lighting optics, and connectivity options to meet the unique requirements of your project, whether it's a large municipality, a private campus, or an industrial park."
    }
];

export default function AuralisPage() {
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
                            Intelligent, efficient, and integrated. Auralis is the smart city brand designed to empower India's future.
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
                                What is a Smart City?
                            </h2>
                            <p className="text-foreground/80 md:text-lg">
                                A smart city is an urban area that uses IoT (Internet of Things) sensors and technology to collect data. Insights gained from that data are used to manage assets, resources, and services efficiently. The goal is to improve the quality of life for citizens by enhancing everything from transportation and energy efficiency to public safety and governance.
                            </p>
                            <div className="flex items-center gap-4 pt-4 text-sm text-foreground/70">
                                <Lightbulb className="h-6 w-6 text-primary" /><span>Smarter Infrastructure</span>
                                <Network className="h-6 w-6 text-primary" /><span>Connected Ecosystems</span>
                            </div>
                        </div>
                        <div className="relative h-80 lg:h-96 w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
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
                           Powering India's Smart Cities Mission
                        </h2>
                        <p className="mt-4 text-foreground/80 md:text-lg">
                            India's Smart Cities Mission is a visionary initiative by the Government of India to drive economic growth and improve quality of life by enabling local area development and harnessing technology. DGEN Technologies is proud to contribute to this mission by building the foundational infrastructure that will power the smart cities of tomorrow.
                        </p>
                    </div>
                </section>

                {/* Auralis Brand Intro */}
                <section className="w-full py-16 md:py-24">
                     <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
                        <Badge variant="outline" className="border-primary/50 text-primary">Our Solution</Badge>
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl mt-4">
                           Introducing Auralis: Our Smart City Brand
                        </h2>
                        <p className="mt-4 text-foreground/80 md:text-lg">
                            Auralis is the brand under which DGEN Technologies delivers its entire suite of smart city solutions. It represents a unified ecosystem of connected devices—from smart street lights to traffic control systems—all managed through a central, intelligent platform.
                        </p>
                    </div>
                </section>

                {/* Product 1: Smart Street Light */}
                <section className="w-full pb-16 md:pb-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                            <h3 className="text-2xl font-headline font-bold tracking-tighter sm:text-3xl">Product 1: Smart Street Lighting</h3>
                            <p className="max-w-3xl text-foreground/80 md:text-xl/relaxed">
                                Our flagship product is an intelligent street lighting system that forms the backbone of the Auralis network.
                            </p>
                        </div>
                         <div className="relative h-80 lg:h-[450px] w-full animate-fade-in-up mb-12" style={{ animationDelay: '200ms' }}>
                           {streetLightImage && (
                                <Image
                                    src={streetLightImage.imageUrl}
                                    alt="Auralis smart street light"
                                    fill
                                    className="object-cover rounded-xl shadow-lg shadow-primary/10"
                                    data-ai-hint="street light"
                                />
                           )}
                        </div>

                        {/* Features Section */}
                        <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 animate-fade-in-up">
                            {features.map((feature, index) => (
                                <Card key={feature.title} className="bg-card/50 hover:bg-card border-border/50 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
                                    <CardHeader className="flex flex-col items-start gap-4">
                                        {feature.icon}
                                        <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-foreground/70">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                <section className="w-full py-16 md:py-24 bg-card">
                  <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                        <Badge variant="default">Tangible Benefits</Badge>
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">A Brighter, Smarter Tomorrow</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center animate-fade-in-up">
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-background">
                            <h3 className="text-5xl font-bold font-headline text-primary">60%</h3>
                            <p className="font-semibold text-lg">Energy Savings</p>
                            <p className="text-sm text-foreground/70">Drastically reduce operational costs and carbon footprint through intelligent energy management.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-background">
                            <h3 className="text-5xl font-bold font-headline text-primary">99%</h3>
                            <p className="font-semibold text-lg">Uptime</p>
                            <p className="text-sm text-foreground/70">Predictive maintenance minimizes downtime, ensuring public spaces remain safe and well-lit.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-background">
                            <h3 className="text-5xl font-bold font-headline text-primary">40%</h3>
                            <p className="font-semibold text-lg">Maintenance Reduction</p>
                            <p className="text-sm text-foreground/70">Proactive fault detection allows for efficient resource allocation and fewer manual inspections.</p>
                        </div>
                    </div>
                  </div>
                </section>

                {/* Technical Specifications Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                         <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                            <Badge variant="outline" className="border-primary/50 text-primary">Under the Hood</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Smart Street Light Specifications</h2>
                        </div>
                        <div className="mx-auto max-w-4xl animate-fade-in-up">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Object.entries(techSpecs).map(([category, specs]) => (
                              <div key={category}>
                                <h3 className="text-xl font-headline font-bold mb-4 text-primary">{category}</h3>
                                <ul className="space-y-2 text-sm">
                                  {Object.entries(specs).map(([key, value]) => (
                                    <li key={key} className="flex justify-between border-b border-border/50 pb-2">
                                      <span className="font-semibold text-foreground/80">{key}</span>
                                      <span className="text-foreground/70">{value}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                    </div>
                </section>

                {/* Product 2: Coming Soon */}
                 <section className="w-full py-16 md:py-24 bg-card">
                    <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
                        <Badge variant="default">Coming Soon</Badge>
                        <h3 className="text-2xl font-headline font-bold tracking-tighter sm:text-3xl mt-4">Product 2: Automatic Traffic Light Control System</h3>
                        <p className="mt-4 text-foreground/80 md:text-lg">
                           Get ready for the next evolution in urban mobility. Our upcoming Automatic Traffic Light Control System will leverage real-time data and AI to optimize traffic flow, reduce congestion, and create safer intersections. Stay tuned for more details.
                        </p>
                        <div className="flex justify-center items-center gap-6 mt-6 text-primary">
                            <TrafficCone className="h-8 w-8" />
                            <BarChart className="h-8 w-8" />
                             <Wifi className="h-8 w-8" />
                        </div>
                    </div>
                </section>

                {/* Q&A Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container max-w-screen-lg px-4 md:px-6 animate-fade-in-up">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <Badge variant="outline" className="border-primary/50 text-primary">Have Questions?</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
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
                <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
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

    