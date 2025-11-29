'use client';

import { signOut } from 'firebase/auth';
import { LayoutDashboard, FileText, MessageSquare, LogOut, BarChart2, Settings } from 'lucide-react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { auth } from '@/firebase/client';
import Link from 'next/link';

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
  activeView: 'dashboard' | 'blog' | 'messages' | 'performance' | 'settings';
  setActiveView: (view: 'dashboard' | 'blog' | 'messages' | 'performance' | 'settings') => void;
};

export default function AdminDashboardLayout({ children, activeView, setActiveView }: AdminDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar className="bg-background shadow-xl border-r border-border">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-4">
            <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={120} height={28} className="h-8 w-auto" />
            <SidebarTrigger/>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant={activeView === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start font-semibold" onClick={() => setActiveView('dashboard')}>
                <LayoutDashboard className="mr-2" /> Dashboard
              </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button variant={activeView === 'blog' ? 'secondary' : 'ghost'} className="w-full justify-start font-semibold" onClick={() => setActiveView('blog')}>
                <FileText className="mr-2" /> Blog
              </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button variant={activeView === 'messages' ? 'secondary' : 'ghost'} className="w-full justify-start font-semibold" onClick={() => setActiveView('messages')}>
                <MessageSquare className="mr-2" /> Messages
              </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button variant={activeView === 'performance' ? 'secondary' : 'ghost'} className="w-full justify-start font-semibold" onClick={() => setActiveView('performance')}>
                <BarChart2 className="mr-2" /> Performance
              </Button>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button variant={activeView === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start font-semibold" onClick={() => setActiveView('settings')}>
                <Settings className="mr-2" /> Settings
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOut(auth)}>
                <LogOut className="mr-2" /> Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="bg-card/50 border-b p-4 md:hidden">
          <div className="container max-w-screen-lg flex justify-between items-center h-14">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={120} height={28} className="h-8 w-auto" />
            </Link>
            <SidebarTrigger/>
          </div>
        </header>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
