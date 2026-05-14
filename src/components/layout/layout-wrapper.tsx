'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageTracker } from '@/components/page-tracker';

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAdamDemoRoute = pathname?.startsWith('/products/adam/demo');
  const hideGlobalChrome = isAdminRoute || isAdamDemoRoute;

  return (
    <>
      <PageTracker />
      {!hideGlobalChrome && <Header />}
      <main className="min-h-screen flex flex-col">{children}</main>
      {!hideGlobalChrome && <Footer />}
    </>
  );
}
