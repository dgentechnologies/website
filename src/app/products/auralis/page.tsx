
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Zap, Wifi, Wrench, BarChart } from 'lucide-react';
import Link from 'next/link';

const heroImage = PlaceHolderImages.find(img => img.id === 'auralis-hero');
const featuresImage = PlaceHolderImages.find(img => img.id === 'auralis-features');

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
                            className="object-cover fixed h-screen w-screen animate-hero-image"
                            data-ai-hint={heroImage.imageHint}
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-black/70"></div>
                </div>
                <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
                    <div className="space-y-4">
                        <Badge variant="default" className="py-1 px-3 text-lg">Auralis</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/70 leading-tight">
                            The Future of Urban Lighting
                        </h1>
                        <p className="max-w-2xl mx-auto text-foreground/80 md:text-lg lg:text-xl">
                            Intelligent, efficient, and reliable. Auralis is the smart street light system designed to illuminate India's future.
                        </p>
                    </div>
                </div>
            </section>

            <div className="relative z-10 bg-background">
                {/* Intro Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 animate-fade-in-up">
                            <Badge variant="outline" className="border-primary/50 text-primary">What is Auralis?</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                                More Than Just Light
                            </h2>
                            <p className="text-foreground/80 md:text-lg">
                                Auralis is DGEN Technologies' flagship B2B smart street light, engineered for the demands of modern Indian cities. It combines robust hardware with an intelligent, AI-powered fault detection and management system. This isn't just about illumination; it's about creating a safer, more efficient, and sustainable urban environment.
                            </p>
                            <Button asChild size="lg" className="group mt-4">
                                <Link href="/contact?subject=Auralis+Inquiry">
                                    Request a Demo <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                        <div className="relative h-80 lg:h-96 w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                           {featuresImage && (
                                <Image
                                    src={featuresImage.imageUrl}
                                    alt={featuresImage.description}
                                    fill
                                    className="object-cover rounded-xl shadow-lg shadow-primary/10"
                                    data-ai-hint={featuresImage.imageHint}
                                />
                           )}
                        </div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="w-full py-16 md:py-24 bg-card">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                            <Badge variant="default">Core Features</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Intelligence Built-In</h2>
                            <p className="max-w-3xl text-foreground/80 md:text-xl/relaxed">
                                Every Auralis unit is packed with technology to maximize efficiency and reliability.
                            </p>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 animate-fade-in-up">
                            {features.map((feature, index) => (
                                <Card key={feature.title} className="bg-background/50 hover:bg-background border-border/50 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
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
                <section className="w-full py-16 md:py-24">
                  <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                        <Badge variant="outline" className="border-primary/50 text-primary">Benefits for Your City</Badge>
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">A Brighter, Smarter Tomorrow</h2>
                        <p className="max-w-3xl text-foreground/80 md:text-xl/relaxed">
                            Auralis delivers tangible benefits for municipalities, private campuses, and infrastructure projects.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center animate-fade-in-up">
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/50">
                            <h3 className="text-5xl font-bold font-headline text-primary">60%</h3>
                            <p className="font-semibold text-lg">Energy Savings</p>
                            <p className="text-sm text-foreground/70">Drastically reduce operational costs and carbon footprint through intelligent energy management.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/50">
                            <h3 className="text-5xl font-bold font-headline text-primary">99%</h3>
                            <p className="font-semibold text-lg">Uptime</p>
                            <p className="text-sm text-foreground/70">Predictive maintenance minimizes downtime, ensuring public spaces remain safe and well-lit.</p>
                        </div>
                        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/50">
                            <h3 className="text-5xl font-bold font-headline text-primary">40%</h3>
                            <p className="font-semibold text-lg">Maintenance Reduction</p>
                            <p className="text-sm text-foreground/70">Proactive fault detection allows for efficient resource allocation and fewer manual inspections.</p>
                        </div>
                    </div>
                  </div>
                </section>


                {/* Technical Specifications Section */}
                <section className="w-full py-16 md:py-24 bg-card">
                    <div className="container px-4 md:px-6">
                         <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
                            <Badge variant="default">Under the Hood</Badge>
                            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Technical Specifications</h2>
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

                {/* CTA Section */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                  <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
                      <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/70">
                          Ready to Modernize Your Infrastructure?
                      </h2>
                      <p className="mt-4 text-foreground/80 md:text-lg">
                          Let's discuss how Auralis can transform your city's lighting network. Schedule a personalized demo with our smart city experts today.
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
