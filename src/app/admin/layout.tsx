
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  if (pathname === '/admin/login') {
      return <>{children}</>
  }
  
  if (!user) {
    return null;
  }

  return (
    <div>
        <header className="bg-card border-b p-4">
            <div className="container max-w-screen-lg flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <Button variant="outline" onClick={() => signOut(auth)}>Sign Out</Button>
            </div>
        </header>
        {children}
    </div>
    );
}
