
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Router, BrainCircuit, Home, Lightbulb, ShieldCheck, Check, Network } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const servicesList = [
    {
        icon: <Building2 className="h-10 w-10 text-primary" />,
        title: 'Smart City End-to-End Solutions',
        description: 'We architect and deploy comprehensive solutions for urban environments, from hardware installation to data analytics, helping cities meet the Smart Cities Mission India objectives.',
        features: ['Smart Street Lighting (Auralis)', 'Integrated Traffic Management', 'Public Safety & Surveillance', 'Environmental Monitoring Sensors']
    },
    {
        icon: <Router className="h-10 w-10 text-primary" />,
        title: 'Custom IoT & Connected Devices',
        description: 'From sensors to gateways, we build the bespoke hardware and software for a truly connected world, ensuring interoperability and scalability.',
        features: ['Custom IoT Hardware Design', 'Firmware & Embedded Systems', 'IoT Platform Integration', 'Device Management & Security']
    },
    {
        icon: <BrainCircuit className="h-10 w-10 text-primary" />,
        title: 'AI & Predictive Analytics',
        description: 'Our AI services turn raw data into actionable insights, powering predictive maintenance, optimizing resource allocation, and improving operational efficiency.',
        features: ['Predictive Analytics for Infrastructure', 'Computer Vision for Urban Monitoring', 'AI-Driven Anomaly Detection', 'Custom AI Model Development']
    },
    {
        icon: <Home className="h-10 w-10 text-primary" />,
        title: 'Smart Home (B2C) Products',
        description: 'Expanding our innovation to the consumer market, we are developing a range of smart home products to enhance security, convenience, and energy efficiency.',
        features: ['Intelligent Lighting Systems', 'Home Security & Access Control', 'Energy Management Solutions', 'Seamless Voice Assistant Integration']
    }
];

const ctaImage = PlaceHolderImages.find(img => img.id === 'about-story');

export default function ServicesPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Our Expertise</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
                            Engineering the Connected Future
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                            We provide end-to-end services for smart city infrastructure and are bringing our technological expertise into the smart home.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {servicesList.map((service) => (
                            <Card key={service.title} className="flex flex-col bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                                <CardHeader className="flex flex-col items-start gap-4">
                                    {service.icon}
                                    <div className="space-y-1">
                                      <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                                      <CardDescription>{service.description}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end">
                                    <ul className="space-y-2 text-sm text-foreground/80 mt-4">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <Check className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

             {/* Why Choose Us Section */}
            <section className="w-full py-16 md:py-24 bg-card">
               <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
                  <div className="space-y-6">
                    <Badge variant="outline" className="border-primary/50 text-primary">Our Process</Badge>
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                        From Vision to Reality
                    </h2>
                    <p className="text-foreground/80 md:text-lg">
                      We follow a proven methodology to ensure your project's success. From initial consultation to deployment and support, we are your dedicated partner in building the future of smart technology.
                    </p>
                     <div className="space-y-4 pt-4">
                        <div className="flex items-start gap-4 p-2 rounded-lg">
                            <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                <span className="font-bold text-primary text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold">Discovery & Strategy</h3>
                                <p className="text-sm text-foreground/70 mt-1">We collaborate with you to understand your needs, define project goals, and create a strategic roadmap.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-2 rounded-lg">
                            <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                <span className="font-bold text-primary text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold">Design & Prototyping</h3>
                                <p className="text-sm text-foreground/70 mt-1">Our team designs the system architecture, develops hardware prototypes, and creates user-centric software interfaces.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-2 rounded-lg">
                            <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                <span className="font-bold text-primary text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold">Development & Deployment</h3>
                                <p className="text-sm text-foreground/70 mt-1">We build, test, and deploy the solution, ensuring seamless integration with your existing infrastructure.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-2 rounded-lg">
                            <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                <span className="font-bold text-primary text-lg">4</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-headline font-bold">Support & Optimization</h3>
                                <p className="text-sm text-foreground/70 mt-1">We provide ongoing support and use data analytics to optimize performance and deliver continuous improvement.</p>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div className="relative aspect-video w-full">
                      {ctaImage && (
                          <Image
                              src={ctaImage.imageUrl}
                              alt={ctaImage.description}
                              fill
                              className="object-cover rounded-xl shadow-lg shadow-primary/10"
                              data-ai-hint={ctaImage.imageHint}
                          />
                      )}
                  </div>
                </div>
              </div>
            </section>
        </div>
    );
}
