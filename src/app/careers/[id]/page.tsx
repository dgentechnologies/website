import { adminFirestore } from '@/firebase/server';
import { notFound } from 'next/navigation';
import { CareerListing } from '@/types/career';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Clock,
  IndianRupee,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Users,
  Lightbulb,
  Globe,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import JobApplicationDialog from '@/components/job-application-dialog';

export const dynamic = 'force-dynamic';

const WORK_MODE_LABELS: Record<string, string> = {
  remote: 'Work From Home',
  onsite: 'Work From Office',
  hybrid: 'Hybrid',
};

const TYPE_LABELS: Record<string, string> = {
  job: 'Full-Time Job',
  internship: 'Internship',
};

const AMOUNT_SPAN_LABELS: Record<string, string> = {
  'per month': '/month',
  'per year': '/year',
  'per week': '/week',
  fixed: ' (Fixed)',
};

const COMPENSATION_LABELS: Record<string, string> = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  'intern-paid': 'Certification Fee',
};

const ABOUT_DGEN_PERKS = [
  {
    icon: Lightbulb,
    title: 'Innovation-First Culture',
    description:
      'Work on cutting-edge IoT, AI, and smart-city products that solve real-world urban problems.',
  },
  {
    icon: Users,
    title: 'Collaborative Team',
    description:
      'Join a close-knit team of engineers, designers, and strategists who believe in building together.',
  },
  {
    icon: Globe,
    title: 'Impact at Scale',
    description:
      'Our flagship product Auralis is deployed across smart-city infrastructure — your work ships to the real world.',
  },
  {
    icon: Building2,
    title: 'Startup Agility',
    description:
      'Move fast, own your domain, and grow your career with direct mentorship from founding leadership.',
  },
];

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const docRef = adminFirestore.collection('careerListings').doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists || !docSnap.data()?.isActive) {
    notFound();
  }

  const listing = { id: docSnap.id, ...docSnap.data() } as CareerListing;
  const requirements = listing.requirements
    ? listing.requirements.split('\n').filter((r) => r.trim())
    : [];

  const isInternPaid = listing.compensation === 'intern-paid';
  const compensationText =
    listing.compensation === 'paid' || isInternPaid
      ? listing.amount
        ? `${isInternPaid ? 'Fee: ' : ''}₹${listing.amount}${listing.amountSpan ? AMOUNT_SPAN_LABELS[listing.amountSpan] ?? `/${listing.amountSpan}` : ''}`
        : COMPENSATION_LABELS[listing.compensation]
      : COMPENSATION_LABELS[listing.compensation];

  return (
    <div className="flex flex-col">
      {/* Back navigation */}
      <div className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-screen-xl px-4 md:px-6 py-3">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground -ml-2">
            <Link href="/careers">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All Openings
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={listing.type === 'job' ? 'default' : 'secondary'}>
                {TYPE_LABELS[listing.type]}
              </Badge>
              {listing.category && (
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {listing.category}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-gradient mb-4">
              {listing.position}
            </h1>
            {listing.topic && (
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                Domain: {listing.topic}
              </p>
            )}

            {/* Key info pills */}
            <div className="flex flex-wrap gap-3 text-sm text-foreground/80">
              <span className="flex items-center gap-1.5 bg-background/60 border border-border/50 rounded-full px-3 py-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {WORK_MODE_LABELS[listing.workMode]}
              </span>
              <span className="flex items-center gap-1.5 bg-background/60 border border-border/50 rounded-full px-3 py-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {listing.duration}
              </span>
              {isInternPaid ? (
                <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 text-amber-700 dark:text-amber-400">
                  <Receipt className="h-3.5 w-3.5" />
                  {compensationText}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-background/60 border border-border/50 rounded-full px-3 py-1">
                  <IndianRupee className="h-3.5 w-3.5 text-primary" />
                  {compensationText}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-background/60 border border-border/50 rounded-full px-3 py-1">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                {listing.category || 'Technology'}
              </span>
            </div>

            <div className="mt-8">
              <JobApplicationDialog
                listingId={listing.id!}
                listingTitle={listing.position}
                compensation={listing.compensation}
                amount={listing.amount}
                amountSpan={listing.amountSpan}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full py-12 md:py-16">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Left: JD content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About the Role */}
              <div>
                <h2 className="text-2xl font-headline font-bold mb-4">About the Role</h2>
                <p className="text-foreground/80 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {requirements.length > 0 && (
                <>
                  <Separator />
                  {/* Requirements */}
                  <div>
                    <h2 className="text-2xl font-headline font-bold mb-5">
                      {listing.type === 'job' ? 'Requirements & Skills' : 'What We\'re Looking For'}
                    </h2>
                    <ul className="space-y-3">
                      {requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/80 leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Separator />

              {/* What you'll do / role overview */}
              <div>
                <h2 className="text-2xl font-headline font-bold mb-4">What We Offer</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      Direct mentorship from DGEN&apos;s founding team and domain experts.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      Hands-on ownership of real production systems — not toy projects.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      Exposure to IoT hardware, cloud infrastructure, and AI integrations.
                    </span>
                  </li>
                  {listing.type === 'internship' && (
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/80">
                        Certificate of completion and a strong referral letter upon successful internship.
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      Flexible working hours with a results-oriented environment.
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              {/* About DGEN */}
              <div>
                <h2 className="text-2xl font-headline font-bold mb-4">About DGEN Technologies</h2>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    DGEN Technologies is an Indian deep-tech startup building next-generation solutions
                    at the intersection of IoT, Artificial Intelligence, and Smart City infrastructure.
                    Founded by a team of engineers and strategists passionate about sustainable urban
                    technology, we are on a mission to transform how cities operate, communicate, and grow.
                  </p>
                  <p>
                    Our flagship product, <strong className="text-foreground">Auralis</strong>, is a
                    comprehensive smart-city ecosystem designed for real-world deployment — bridging
                    hardware sensors, cloud analytics, and AI-driven insights in a single unified platform.
                    Beyond B2B infrastructure, we are expanding into the B2C smart-home space, bringing
                    intelligent living to everyday households across India.
                  </p>
                  <p>
                    We are a lean, high-ownership team where every person&apos;s contribution directly
                    shapes the product and the company. If you want to build things that matter and see
                    your work deployed at scale, DGEN is the place to do it.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ABOUT_DGEN_PERKS.map((perk) => (
                    <div
                      key={perk.title}
                      className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50"
                    >
                      <perk.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm mb-1">{perk.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {perk.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sticky sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 space-y-5">
                {/* Apply card */}
                <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
                  <h3 className="font-headline font-bold text-lg">Ready to apply?</h3>
                  <div className="space-y-2 text-sm text-foreground/70">
                    <div className="flex justify-between">
                      <span>Role</span>
                      <span className="font-medium text-foreground text-right max-w-[60%]">
                        {listing.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span className="font-medium text-foreground">{TYPE_LABELS[listing.type]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work Mode</span>
                      <span className="font-medium text-foreground">{WORK_MODE_LABELS[listing.workMode]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span className="font-medium text-foreground">{listing.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isInternPaid ? 'Certification Fee' : 'Compensation'}</span>
                      <span className={`font-medium ${isInternPaid ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>{compensationText}</span>
                    </div>
                  </div>
                  <JobApplicationDialog
                    listingId={listing.id!}
                    listingTitle={listing.position}
                    compensation={listing.compensation}
                    amount={listing.amount}
                    amountSpan={listing.amountSpan}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    We typically respond within 3-5 business days.
                  </p>
                </div>

                {/* Company quick facts */}
                <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
                  <h3 className="font-headline font-bold text-base">Company</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <span>DGEN Technologies Pvt. Ltd.</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <a
                        href="https://dgentechnologies.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        dgentechnologies.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span>India</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      <span>IoT · AI · Smart Cities</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full py-12 bg-card border-t border-border/50">
        <div className="container max-w-screen-xl px-4 md:px-6 text-center space-y-4">
          <h2 className="text-2xl font-headline font-bold">Interested in joining us?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Submit your application below. We review every submission carefully and get back to promising candidates within a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <JobApplicationDialog
              listingId={listing.id!}
              listingTitle={listing.position}
              compensation={listing.compensation}
              amount={listing.amount}
              amountSpan={listing.amountSpan}
            />
            <Button variant="outline" asChild>
              <Link href="/careers">Browse All Openings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
