'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParallax, useScrollAnimation } from '@/hooks/use-scroll-animation';
import { teamMembers } from '@/lib/team-data';

const values = [
    { title: 'Innovation', description: 'We constantly push the boundaries of technology to create novel solutions for smart cities and homes.' },
    { title: 'Integrity', description: 'Our business is built on transparency, honesty, and ethical practices in all our dealings.' },
    { title: 'Excellence', description: 'We are committed to delivering the highest quality in everything we do for our clients.' },
    { title: 'Collaboration', description: 'We believe the best results come from working together with our clients and partners.' },
];

const storyImage = PlaceHolderImages.find(img => img.id === 'about-story');

function ValueCard({ value, index }: { value: typeof values[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-start text-left p-3 sm:p-4 rounded-lg transition-all duration-700 transform hover:-translate-y-2 hover:bg-background/50 hover:shadow-primary/10 hover:shadow-lg ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-3 sm:mb-4" aria-hidden="true" />
      <h3 className="text-lg sm:text-xl font-headline font-bold mb-1 sm:mb-2">{value.title}</h3>
      <p className="text-foreground/70 text-sm sm:text-base">{value.description}</p>
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: typeof teamMembers[0]; index: number }) {
  const [ref, isVisible] = useScrollAnimation<HTMLAnchorElement>({ threshold: 0.2 });

  return (
    <Link 
      ref={ref}
      href={`/about/${member.slug}`} 
      className={`block group transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      aria-label={`Learn more about ${member.name}, ${member.role} at DGEN Technologies`}
    >
      <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-lg transition-all transform group-hover:-translate-y-2 group-hover:shadow-primary/10 group-hover:shadow-lg h-full">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-3 sm:mb-4 border-2 border-primary">
          <AvatarImage 
            src={member.image} 
            alt={`Professional headshot of ${member.name}, ${member.role} at DGEN Technologies`} 
            className="object-cover" 
          />
          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg sm:text-xl font-bold font-headline">{member.name}</h3>
        <p className="text-primary text-sm sm:text-base">{member.role}</p>
      </div>
    </Link>
  );
}

export default function AboutPage() {
  const parallaxOffset = useParallax(0.3);
  const [heroRef, heroVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [storyRef, storyVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [storyImageRef, storyImageVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const [valuesRef, valuesVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [teamRef, teamVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative w-full py-16 sm:py-20 md:py-32 bg-card overflow-hidden">
        <div 
          className="absolute inset-0 z-0 will-change-transform opacity-10"
          style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent"></div>
        </div>
        <div className="container max-w-screen-xl px-4 md:px-6 relative z-10">
          <div 
            ref={heroRef}
            className={`flex flex-col items-center space-y-3 sm:space-y-4 text-center transition-all duration-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary animate-slide-down">Our Story</Badge>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
              Powering India&apos;s Future with Smart Technology
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
              Learn about our journey building smart city solutions, our mission to innovate India&apos;s urban infrastructure, and the values that drive us forward.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
        <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div 
            ref={storyRef}
            className={`space-y-3 sm:space-y-4 transition-all duration-700 ${
              storyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter">Our Journey in Smart City Innovation</h2>
            <p className="text-foreground/70 text-sm sm:text-base">
              Founded in 2025, DGEN Technologies began with a mission to pioneer smart city solutions in India. Our flagship B2B product, &quot;Auralis,&quot; a smart street light with an advanced fault detection system, set the standard for urban innovation. From our headquarters in Kolkata, we have been dedicated to solving complex urban challenges through IoT technology.
            </p>
            <p className="text-foreground/70 text-sm sm:text-base">
              As we continue to transform cityscapes across India, we are also expanding our vision to the B2C market. Our goal is to bring the same level of intelligence and connectivity to every home, making daily life smarter and more efficient. We are committed to leading India&apos;s technological revolution, one smart device at a time.
            </p>
          </div>
          <div 
            ref={storyImageRef}
            className={`relative aspect-video w-full transition-all duration-1000 ${
              storyImageVisible
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 translate-x-20 scale-95'
            }`}
          >
            {storyImage && (
              <Image
                src={storyImage.imageUrl}
                alt="DGEN Technologies team working on smart city infrastructure - Auralis smart street light development"
                fill
                className="object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-card overflow-hidden">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div 
            ref={valuesRef}
            className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
              valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter">Our Core Values</h2>
            <p className="mt-3 md:mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
              The principles that guide DGEN Technologies in building smart solutions for India&apos;s cities and homes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-16 lg:py-24 overflow-hidden">
        <div className="container max-w-screen-lg px-4 md:px-6">
          <div 
            ref={teamRef}
            className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
              teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tighter">Meet the Leadership Team</h2>
            <p className="mt-3 md:mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
              The experienced leaders driving DGEN Technologies&apos; vision for smart cities and IoT innovation in India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.slug} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
