
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, MessageSquare, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardLayout({
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  if (pathname === '/admin/login') {
      return <div>{children}</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
        <div className='bg-background'>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                        <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={100} height={20} className="h-7 w-auto" />
                        <SidebarTrigger/>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                            <Link href="/admin/dashboard"><LayoutDashboard /> Dashboard</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/blog')}>
                                <Link href="/admin/blog"><FileText /> Blog</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/messages')}>
                            <Link href="/admin/messages"><MessageSquare /> Messages</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <div className="mt-auto p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => signOut(auth)}>
                                <LogOut /> Sign Out
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </Sidebar>
            <SidebarInset>
                <header className="bg-card/50 border-b p-2 md:hidden">
                    <div className="container max-w-screen-lg flex justify-between items-center h-12">
                        <Link href="/admin/dashboard" className="flex items-center space-x-2">
                            <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={100} height={20} className="h-7 w-auto" />
                        </Link>
                        <SidebarTrigger/>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </div>
    </SidebarProvider>
    );
}
