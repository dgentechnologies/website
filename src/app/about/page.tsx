
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const teamMembers = [
  { 
    name: 'Tirthankar Dasgupta', 
    role: 'CEO & CTO', 
    image: '/images/tirthankar-dasgupta.jpg',
    slug: 'tirthankar-dasgupta',
    bio: 'Tirthankar is a visionary leader with a background in Electronics and Communication Engineering (ECE). As the founder of DGEN Technologies, he drives the company\'s technical strategy and innovation. His passion for smart city solutions led to the creation of "Auralis," our flagship product. He has been instrumental in shaping the future of urban technology in India, and his expertise in IoT and AI is the cornerstone of our company\'s success.',
    linkedin: 'https://www.linkedin.com/in/tirthankardasguptaprofile',
    twitter: '#',
  },
  { 
    name: 'Sukomal Debnath', 
    role: 'CFO', 
    image: '/images/sukomal-debnath.jpg',
    slug: 'sukomal-debnath',
    bio: 'Sukomal manages the financial strategy and operations at DGEN Technologies, ensuring the company\'s sustainable growth. With a background in corporate finance and investment banking, he brings a wealth of experience in financial planning and risk management. He is dedicated to aligning our financial goals with our mission to innovate and expand into new markets, including the upcoming B2C smart home sector.',
    linkedin: '#',
    twitter: '#',
  },
  { 
    name: 'Sagnik Mandal', 
    role: 'CMO', 
    image: '/images/sagnik-mandal.png',
    slug: 'sagnik-mandal',
    bio: 'Sagnik leads our marketing and communication efforts, building the DGEN brand and driving market adoption of our products. His creative approach and deep understanding of the tech landscape have been vital in positioning "Auralis" as a leading smart city solution. He is now focused on crafting the go-to-market strategy for our new line of B2C smart home devices, bringing our innovation to a wider audience.',
    linkedin: '#',
    twitter: '#',
  },
  { 
    name: 'Arpan Bairagi', 
    role: 'COO', 
    image: '/images/arpan-bairagi.jpg',
    slug: 'arpan-bairagi',
    bio: 'Arpan oversees the day-to-day operations at DGEN Technologies, ensuring excellence in product delivery and client satisfaction. His expertise in supply chain management and operational efficiency has been crucial in scaling our B2B solutions. Arpan is committed to maintaining the highest standards of quality as we expand our manufacturing capabilities for the B2C market.',
    linkedin: '#',
    twitter: '#',
  },
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
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
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
              Founded in 2025, DGEN Technologies began with a mission to pioneer smart city solutions in India. Our flagship B2B product, "Auralis," a smart street light with an advanced fault detection system, set the standard for urban innovation. From our headquarters in Bengaluru, we have been dedicated to solving complex urban challenges through technology.
            </p>
            <p className="text-foreground/70">
              As we continue to transform cityscapes, we are also expanding our vision to the B2C market. Our goal is to bring the same level of intelligence and connectivity to every home, making daily life smarter and more efficient. We are committed to leading India's technological revolution, one smart device at a time.
            </p>
          </div>
          <div className="relative aspect-video w-full">
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
              <div key={value.title} className="flex flex-col items-start text-left p-4 rounded-lg transition-all transform hover:-translate-y-2 hover:bg-background/50 hover:shadow-primary/10 hover:shadow-lg">
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
        <div className="container max-w-screen-lg px-4 md:px-6">
          <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12">Meet the Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {teamMembers.map((member) => (
              <Link key={member.slug} href={`/about/${member.slug}`} className="block group">
                <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg transition-all transform group-hover:-translate-y-2 group-hover:shadow-primary/10 group-hover:shadow-lg h-full">
                  <Avatar className="w-32 h-32 mb-4 border-2 border-primary">
                    <AvatarImage src={member.image} alt={`${member.name} - ${member.role}`} className="object-cover" />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
