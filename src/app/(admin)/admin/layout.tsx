'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    // Allow access to create and edit pages without redirecting
    if (!loading && user && pathname === '/admin/login') {
      router.push('/admin');
    }
  }, [user, loading, router, pathname]);

  // Block all admin UI on mobile devices
  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold">Device Not Supported</h1>
          <p className="text-sm text-muted-foreground">
            Please access the Admin Dashboard from a desktop computer.
          </p>
        </div>
      </div>
    );
  }

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
