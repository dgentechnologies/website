
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
import { LayoutDashboard, FileText, MessageSquare, PlusCircle, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is resolved and there's no user,
    // and we are not already on the login page, redirect.
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  // While loading, show a skeleton screen to prevent flicker.
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

  // If the user is on the login page, just render the page content without the layout.
  if (pathname === '/admin/login') {
      return <div>{children}</div>;
  }
  
  // If not loading and still no user, we are about to redirect.
  // Return null to prevent rendering the admin layout for a split second.
  if (!user) {
    return null;
  }

  // If we have a user, render the full admin layout.
  return (
    <SidebarProvider>
        <div>
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
                            <SidebarMenuButton asChild isActive={pathname.endsWith('/blog/manage')}>
                            <Link href="/admin/blog/manage"><LayoutDashboard /> Dashboard</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.includes('/blog/create')}>
                                <Link href="/admin/blog/create"><PlusCircle /> Create Post</Link>
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
                        <Link href="/admin/blog/manage" className="flex items-center space-x-2">
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
