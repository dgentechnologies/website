'use client';

import { signOut } from 'firebase/auth';
import { LayoutDashboard, FileText, MessageSquare, LogOut } from 'lucide-react';
import Image from 'next/image';
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
import { auth } from '@/firebase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  // We can derive the active view from the pathname, making the state management simpler.
  const activeView = pathname.includes('/blog') ? 'blog' : pathname.includes('/messages') ? 'messages' : 'dashboard';

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
                            <Button variant={activeView === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                                <Link href="/admin">
                                    <LayoutDashboard /> Dashboard
                                </Link>
                            </Button>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                             <Button variant={activeView === 'blog' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                                <Link href="/admin/blog">
                                    <FileText /> Blog
                                </Link>
                            </Button>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                             <Button variant={activeView === 'messages' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                                <Link href="/admin/messages">
                                    <MessageSquare /> Messages
                                </Link>
                            </Button>
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
                        <Link href="/" className="flex items-center space-x-2">
                            <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={100} height={20} className="h-7 w-auto" />
                        </Link>
                        <SidebarTrigger/>
                    </div>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
