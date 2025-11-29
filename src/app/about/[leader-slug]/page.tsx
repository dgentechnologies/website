
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { teamMembers } from '@/lib/team-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return teamMembers.map((member) => ({
    'leader-slug': member.slug,
  }));
}

export default async function LeaderDetailPage({ params }: { params: Promise<{ 'leader-slug': string }> }) {
  const resolvedParams = await params;
  const member = teamMembers.find((m) => m.slug === resolvedParams['leader-slug']);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                <AvatarImage src={member.image} alt={`${member.name} - ${member.role} at DGEN Technologies`} className="object-cover" />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
              {member.name}
            </h1>
            <Badge variant="default" className="py-1 px-3 text-lg">{member.role}</Badge>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-lg px-4 md:px-6 grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 space-y-6 prose prose-invert prose-lg">
            <h2 className="text-3xl font-headline font-bold">About {member.name.split(' ')[0]}</h2>
            <p>{member.bio}</p>
          </div>
          <aside className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Connect</h3>
            <div className="flex flex-col space-y-3">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span>LinkedIn</span>
              </a>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
                <span>Twitter</span>
              </a>
            </div>
            <div className="pt-6">
              <Button asChild variant="outline">
                <Link href="/about">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Team
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ 'leader-slug': string }> }) {
  const resolvedParams = await params;
  const member = teamMembers.find((m) => m.slug === resolvedParams['leader-slug']);

  if (!member) {
    return {
      title: 'Leader Not Found',
    };
  }

  return {
    title: `${member.name} - ${member.role} | DGEN Technologies`,
    description: `Learn more about ${member.name}, the ${member.role} at DGEN Technologies.`,
  };
}
