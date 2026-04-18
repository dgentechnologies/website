'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { CareerListing } from '@/types/career';
import { Briefcase, MapPin, Clock, IndianRupee, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
  'per month': 'month',
  'per year': 'year',
  'per week': 'week',
  'fixed': 'fixed',
};

const COMPENSATION_LABELS: Record<string, string> = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  'intern-paid': 'Intern Paid',
};

export default function CareersPage() {
  const [listings, setListings] = useState<CareerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWorkMode, setFilterWorkMode] = useState<string>('all');
  const [filterCompensation, setFilterCompensation] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(firestore, 'careerListings'),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CareerListing));
        setListings(data);
      } catch (e) {
        console.error('Error fetching career listings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const categories = Array.from(new Set(listings.map((l) => l.category))).filter(Boolean);

  const filtered = listings.filter((l) => {
    if (filterType !== 'all' && l.type !== filterType) return false;
    if (filterWorkMode !== 'all' && l.workMode !== filterWorkMode) return false;
    if (filterCompensation !== 'all' && l.compensation !== filterCompensation) return false;
    if (filterCategory !== 'all' && l.category !== filterCategory) return false;
    return true;
  });

  const resetFilters = () => {
    setFilterType('all');
    setFilterWorkMode('all');
    setFilterCompensation('all');
    setFilterCategory('all');
  };

  const hasFilters =
    filterType !== 'all' ||
    filterWorkMode !== 'all' ||
    filterCompensation !== 'all' ||
    filterCategory !== 'all';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 sm:py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">
              Careers
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient px-2">
              Join DGEN Technologies
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl px-4">
              Be part of a team building the future of smart cities, IoT, and sustainable technology.
              Explore our open positions below.
            </p>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="w-full py-12 md:py-16 lg:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job">Full-Time Job</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterWorkMode} onValueChange={setFilterWorkMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Work Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Modes</SelectItem>
                <SelectItem value="remote">Work From Home</SelectItem>
                <SelectItem value="onsite">Work From Office</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCompensation} onValueChange={setFilterCompensation}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Compensation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="intern-paid">Intern Paid</SelectItem>
              </SelectContent>
            </Select>

            {categories.length > 0 && (
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 space-y-3">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-foreground/70">
                {hasFilters
                  ? 'No listings match your filters. Try adjusting them.'
                  : 'No open positions right now. Check back soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card
                  key={listing.id}
                  className="flex flex-col bg-card/50 hover:bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg font-headline leading-tight">
                          <Link href={`/careers/${listing.id}`} className="hover:text-primary transition-colors">
                            {listing.position}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">{listing.category}</CardDescription>
                      </div>
                      <Badge variant={listing.type === 'job' ? 'default' : 'secondary'} className="shrink-0">
                        {TYPE_LABELS[listing.type]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex flex-wrap gap-2 text-sm text-foreground/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {WORK_MODE_LABELS[listing.workMode]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {listing.duration}
                      </span>
                      {(listing.compensation === 'paid' || listing.compensation === 'intern-paid') && listing.amount ? (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {`${listing.compensation === 'intern-paid' ? 'Fee: ' : ''}${listing.amount}${listing.amountSpan ? ` / ${AMOUNT_SPAN_LABELS[listing.amountSpan] ?? listing.amountSpan}` : ''}`}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-xs font-normal">
                          {COMPENSATION_LABELS[listing.compensation]}
                        </Badge>
                      )}
                    </div>
                    {listing.topic && (
                      <p className="text-xs text-muted-foreground">Topic: {listing.topic}</p>
                    )}
                    <p className="text-sm text-foreground/80 line-clamp-3">{listing.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0 flex flex-col gap-2">
                    <Button asChild className="w-full" size="sm">
                      <Link href={`/careers/${listing.id}`}>View & Apply</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-headline font-bold">
            Don&apos;t see a suitable role?
          </h2>
          <p className="text-foreground/70 max-w-[500px] mx-auto">
            We are always on the lookout for talented people. Send us your resume and we&apos;ll keep
            you in mind for future openings.
          </p>
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
