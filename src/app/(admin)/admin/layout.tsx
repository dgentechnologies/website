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
    // Allow access to create and edit pages without redirecting
    if (!loading && user && pathname === '/admin/login') {
      router.push('/admin');
    }
  }, [user, loading, router, pathname]);

  // Show skeleton loader for all admin pages except login while authenticating
  if (loading && pathname !== '/admin/login') {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-4 w-full max-w-md p-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }
  
  // If not authenticated and not on the login page, return null to prevent content flash
  if (!user && pathname !== '/admin/login') {
    return null;
  }

  // Render children for login, create, edit, and main admin pages
  return <div>{children}</div>;
}
