import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeXml, CloudCog, BrainCircuit, GanttChartSquare, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    icon: <CodeXml className="h-8 w-8 text-primary" />,
    title: 'Custom Software Development',
    description: 'Bespoke solutions tailored to your unique business needs, from web apps to enterprise software.',
  },
  {
    icon: <CloudCog className="h-8 w-8 text-primary" />,
    title: 'Cloud Infrastructure',
    description: 'Scalable and secure cloud solutions on AWS, Azure, and Google Cloud to power your business.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI & Machine Learning',
    description: 'Integrate intelligent automation and data-driven insights into your operations.',
  },
  {
    icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
    title: 'IT Strategy & Consulting',
    description: 'Expert guidance to align your technology roadmap with your long-term business goals.',
  },
];

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Next-Gen Technology Partners</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              Innovate. Integrate. Inspire.
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              DGEN Technologies delivers cutting-edge solutions to propel your business into the future. From custom software to AI integration, we are your partners in digital transformation.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start">
              <Button asChild size="lg" className="group">
                <Link href="/services">
                  Explore Our Services <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  Request a Consultation
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-full w-full">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover rounded-lg shadow-2xl shadow-primary/20"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Our Core Expertise</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide a comprehensive suite of technology services designed to elevate your business.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
            {services.map((service, index) => (
              <Card key={index} className="bg-card/50 hover:bg-card transition-all transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-start gap-4">
                  {service.icon}
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
         <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-bold tracking-tighter md:text-4xl/tight">
              The DGEN Advantage
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Partner with us for unparalleled quality, innovation, and a commitment to your success.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-headline">Innovative Solutions</h3>
              <p className="text-sm text-foreground/70">We stay at the forefront of technology to deliver future-proof solutions.</p>
            </div>
             <div className="flex flex-col items-center space-y-2 p-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
              </div>
              <h3 className="text-lg font-bold font-headline">Client-Centric Approach</h3>
              <p className="text-sm text-foreground/70">Your goals are our priority. We collaborate closely to ensure project success.</p>
            </div>
             <div className="flex flex-col items-center space-y-2 p-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 15l-3-3-3 3"/><path d="M12 9l-3-3-3 3"/><path d="M21 9a9 9 0 0 0-13.86 6.86"/><path d="M3 15a9 9 0 0 0 13.86-6.86"/></svg>
              </div>
              <h3 className="text-lg font-bold font-headline">Agile Delivery</h3>
              <p className="text-sm text-foreground/70">We employ agile methodologies for rapid, iterative, and high-quality delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
