import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Router, BrainCircuit, Home, Lightbulb, ShieldCheck, Check } from 'lucide-react';

const servicesList = [
    {
        icon: <Building2 className="h-10 w-10 text-primary" />,
        title: 'Smart City Solutions',
        description: 'We develop and deploy integrated solutions for urban environments, enhancing efficiency and quality of life.',
        features: ['Smart Street Lighting (Auralis)', 'Traffic Management Systems', 'Public Safety Technology', 'Environmental Monitoring']
    },
    {
        icon: <Router className="h-10 w-10 text-primary" />,
        title: 'IoT & Connected Devices',
        description: 'From sensors to gateways, we build the hardware and software for a truly connected world.',
        features: ['Custom IoT Hardware Design', 'Firmware Development', 'IoT Platform Integration', 'Device Management & Security']
    },
    {
        icon: <BrainCircuit className="h-10 w-10 text-primary" />,
        title: 'AI & Machine Learning',
        description: 'Our AI services turn data into actionable insights, powering predictive maintenance and intelligent automation.',
        features: ['Predictive Analytics & Fault Detection', 'Computer Vision for Urban Monitoring', 'Natural Language Processing', 'Custom AI Model Development']
    },
    {
        icon: <Home className="h-10 w-10 text-primary" />,
        title: 'B2C Smart Home Products',
        description: 'As we expand into the B2C market, we are developing a range of products to make homes smarter and more automated.',
        features: ['Smart Lighting & Climate Control', 'Home Security Solutions', 'Energy Management Systems', 'Voice Assistant Integration']
    },
    {
        icon: <Lightbulb className="h-10 w-10 text-primary" />,
        title: 'Product Strategy & Design',
        description: 'We help you navigate the product lifecycle, from initial concept and design to market launch and scaling.',
        features: ['Market Research & Validation', 'UI/UX for IoT & Smart Devices', 'Prototyping & User Testing', 'Go-to-Market Strategy']
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: 'IoT Security',
        description: 'Protect your connected devices and data with our comprehensive cybersecurity solutions for the IoT landscape.',
        features: ['Device & Network Penetration Testing', 'Threat Modeling & Risk Assessment', 'Secure Firmware Development', 'End-to-End Encryption']
    }
];

export default function ServicesPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Our Expertise</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
                            Comprehensive Tech Solutions
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                            From smart cities to smart homes, we offer a wide range of services to build a connected future.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <ul className="space-y-2 text-sm text-foreground/80">
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
        </div>
    );
}
