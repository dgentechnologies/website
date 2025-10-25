import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeXml, CloudCog, BrainCircuit, GanttChartSquare, Palette, ShieldCheck, Check } from 'lucide-react';

const servicesList = [
    {
        icon: <CodeXml className="h-10 w-10 text-primary" />,
        title: 'Custom Software Development',
        description: 'We build scalable, secure, and high-performance applications tailored to your specific business requirements.',
        features: ['Web & Mobile Applications', 'Enterprise Software', 'API Development & Integration', 'Legacy System Modernization']
    },
    {
        icon: <CloudCog className="h-10 w-10 text-primary" />,
        title: 'Cloud Infrastructure Management',
        description: 'Leverage the power of the cloud with our expert management, optimization, and migration services.',
        features: ['Cloud Migration & Strategy', 'DevOps & CI/CD Automation', 'Infrastructure as Code (IaC)', 'Cost Optimization']
    },
    {
        icon: <BrainCircuit className="h-10 w-10 text-primary" />,
        title: 'AI & Machine Learning Solutions',
        description: 'Unlock the potential of your data with our AI and machine learning services for automation and insights.',
        features: ['Predictive Analytics', 'Natural Language Processing (NLP)', 'Computer Vision', 'Custom AI Model Development']
    },
    {
        icon: <GanttChartSquare className="h-10 w-10 text-primary" />,
        title: 'IT Strategy & Consulting',
        description: 'Our expert consultants help you build a technology roadmap that aligns with your business goals and drives growth.',
        features: ['Digital Transformation Strategy', 'Technology Audits', 'Agile & Scrum Consulting', 'Project Management']
    },
    {
        icon: <Palette className="h-10 w-10 text-primary" />,
        title: 'UI/UX Design',
        description: 'Creating intuitive, engaging, and user-friendly digital experiences that delight your users and meet business objectives.',
        features: ['User Research & Personas', 'Wireframing & Prototyping', 'Usability Testing', 'Responsive Design Systems']
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: 'Cybersecurity Services',
        description: 'Protect your digital assets with our comprehensive cybersecurity solutions, from threat detection to compliance.',
        features: ['Security Audits & Penetration Testing', 'Threat Monitoring & Response', 'Compliance & Governance (GDPR, etc.)', 'Employee Security Training']
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
                            We offer a wide range of services to meet your business needs, from development to cybersecurity.
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
