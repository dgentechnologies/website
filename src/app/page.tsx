import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeXml, CloudCog, BrainCircuit, GanttChartSquare, ArrowRight, ShieldCheck, Users } from 'lucide-react';
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

const advantages = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Innovative Solutions',
      description: 'We stay at the forefront of technology to deliver future-proof solutions that give you a competitive edge.'
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

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-home');
const ctaImage = PlaceHolderImages.find(img => img.id === 'about-story');


export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center">
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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 container max-w-screen-xl px-4 md:px-6">
          <div className="space-y-6">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary text-sm backdrop-blur-sm">Next-Gen Technology Partners</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/70 leading-tight bg-200% animate-hero-gradient">
              Innovate. Integrate. Inspire.
            </h1>
            <p className="max-w-3xl mx-auto text-foreground/80 md:text-lg lg:text-xl">
              Dgen Technologies is transforming India with B2B smart city solutions like "Auralis," our smart street light with a fault detection system. We are now expanding into the B2C market to make every home smarter.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center pt-2">
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
        </div>
      </section>

      <div className="relative z-10 bg-background">
        {/* Services Overview Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in-up">
              <Badge variant="default">Our Core Expertise</Badge>
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">Elevating Your Business with Technology</h2>
              <p className="max-w-3xl text-foreground/80 md:text-xl/relaxed">
                We provide a comprehensive suite of technology services designed to solve complex challenges and drive growth.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 animate-fade-in-up">
              {services.map((service, index) => (
                <Card key={service.title} className="bg-background/50 hover:bg-background border-border/50 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="flex flex-col items-start gap-4">
                    {service.icon}
                    <CardTitle className="font-headline text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-foreground/70">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
           <div className="container px-4 md:px-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="border-primary/50 text-primary">The DGEN Advantage</Badge>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                  Your Partner for Digital Excellence
                </h2>
                <p className="text-foreground/80 md:text-lg">
                  Partner with us for unparalleled quality, innovation, and a steadfast commitment to your success. We don’t just build products; we build partnerships.
                </p>
                 <div className="space-y-6 pt-4">
                  {advantages.map((advantage) => (
                    <div key={advantage.title} className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors">
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
              <div className="relative h-80 lg:h-full w-full">
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
        
        {/* Call to Action Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-card">
          <div className="container max-w-screen-md px-4 md:px-6 text-center animate-fade-in-up">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/70">
                  Ready to Build the Future?
              </h2>
              <p className="mt-4 text-foreground/80 md:text-lg">
                  Let's discuss how DGEN Technologies can help you achieve your business goals. Schedule a free, no-obligation consultation with our experts today.
              </p>
              <div className="mt-8">
                  <Button asChild size="lg" className="group">
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
