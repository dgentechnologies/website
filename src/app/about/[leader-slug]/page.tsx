import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { teamMembers } from '@/lib/team-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

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

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    image: `https://dgentechnologies.com${member.image}`,
    description: member.bio,
    url: `https://dgentechnologies.com/about/${member.slug}`,
    worksFor: {
      '@type': 'Organization',
      name: 'DGEN Technologies',
      url: 'https://dgentechnologies.com',
    },
    sameAs: [
      member.linkedin !== '#' ? member.linkedin : '',
      member.twitter !== '#' ? member.twitter : '',
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="flex flex-col">
        <section className="w-full py-20 md:py-32 bg-card">
          <div className="container max-w-screen-xl px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                  <AvatarImage src={member.image} alt={member.alt} className="object-cover" />
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
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ 'leader-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const member = teamMembers.find((m) => m.slug === resolvedParams['leader-slug']);

  if (!member) {
    return {
      title: 'Leader Not Found',
      robots: { index: false, follow: false },
    };
  }

  const pageTitle = `${member.name} - ${member.role} | DGEN Technologies`;
  const description = `Learn more about ${member.name}, the ${member.role} at DGEN Technologies. ${member.bio.substring(0, 150)}...`;
  const url = `https://dgentechnologies.com/about/${member.slug}`;

  return {
    title: pageTitle,
    description: description,
    keywords: [
      member.name,
      member.role,
      'DGEN Technologies',
      'leadership',
      'team',
      'smart city',
      'IoT',
    ],
    authors: [{ name: member.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: description,
      type: 'profile',
      url: url,
      images: [
        {
          url: `https://dgentechnologies.com${member.image}`,
          width: 1200,
          height: 630,
          alt: `${member.name} - ${member.role}`,
        },
      ],
      siteName: 'DGEN Technologies',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: description,
      images: [`https://dgentechnologies.com${member.image}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
