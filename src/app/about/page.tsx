import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const teamMembers = [
  { name: 'Tirthankar Dasgupta', role: 'CEO & CTO', image: '/images/tirthankar-dasgupta.jpg' },
  { name: 'Sukomal Debnath', role: 'CFO', image: '/images/sukomal-debnath.jpg' },
  { name: 'Sagnik Mandal', role: 'CMO', image: '/images/sagnik-mandal.png' },
  { name: 'Arpan Bairagi', role: 'COO', image: '/images/arpan-bairagi.jpg' },
];

const values = [
    { title: 'Innovation', description: 'We constantly push the boundaries of technology to create novel solutions.' },
    { title: 'Integrity', description: 'Our business is built on transparency, honesty, and ethical practices.' },
    { title: 'Excellence', description: 'We are committed to delivering the highest quality in everything we do.' },
    { title: 'Collaboration', description: 'We believe the best results come from working together with our clients.' },
];

const storyImage = PlaceHolderImages.find(img => img.id === 'about-story');

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Our Story</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              Powering India's Future with Technology
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Learn about our journey, our mission, and the values that drive us to innovate.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold tracking-tighter">Our Journey</h2>
            <p className="text-foreground/70">
              Founded in 2025, DGEN Technologies began with a simple mission: to make cutting-edge technology accessible to businesses of all sizes across India. What started as a small team of passionate developers in Bengaluru has grown into a full-service technology consultancy dedicated to solving complex challenges and driving digital transformation. We believe in the power of technology to not only improve business processes but to inspire new possibilities.
            </p>
            <p className="text-foreground/70">
              Our vision is to be a global leader in technology solutions, known for our innovative approach, unwavering commitment to quality, and a client-centric focus that turns partnerships into long-term success stories.
            </p>
          </div>
          <div className="relative h-80 w-full">
            {storyImage && (
              <Image
                src={storyImage.imageUrl}
                alt={storyImage.description}
                fill
                className="object-cover rounded-lg shadow-lg"
                data-ai-hint={storyImage.imageHint}
              />
            )}
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="w-full py-16 md:py-24 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="flex flex-col items-start text-left p-4 rounded-lg transition-all transform hover:-translate-y-1 hover:bg-background/50">
                <CheckCircle className="h-8 w-8 text-primary mb-4"/>
                <h3 className="text-xl font-headline font-bold mb-2">{value.title}</h3>
                <p className="text-foreground/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12">Meet the Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => {
              return (
                <div key={member.name} className="flex flex-col items-center text-center p-6 bg-card rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-primary/10 hover:shadow-lg">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                    <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold font-headline">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
