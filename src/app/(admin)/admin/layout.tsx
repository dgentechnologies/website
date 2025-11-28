'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    if (!loading && user && pathname === '/admin/login') {
      router.push('/admin');
    }
  }, [user, loading, router, pathname]);

  if (loading && pathname !== '/admin/login') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }
  
  if (!user && pathname !== '/admin/login') {
    return null;
  }

  return <div>{children}</div>;
}