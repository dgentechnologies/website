'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { CareerListing } from '@/types/career';
import CareerForm from '../../career-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCareerPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<CareerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const snap = await getDoc(doc(firestore, 'careerListings', id));
        if (snap.exists()) {
          setListing({ id: snap.id, ...snap.data() } as CareerListing);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 max-w-screen-md mx-auto space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="flex-1 p-8 text-center text-foreground/70">
        Career listing not found.
      </div>
    );
  }

  return (
    <CareerForm
      mode="edit"
      listingId={id}
      defaultValues={{
        position: listing.position,
        category: listing.category,
        topic: listing.topic,
        type: listing.type,
        workMode: listing.workMode,
        compensation: listing.compensation,
        amount: listing.amount ?? '',
        amountSpan: listing.amountSpan,
        duration: listing.duration,
        description: listing.description,
        requirements: listing.requirements,
        isActive: listing.isActive,
      }}
    />
  );
}
