
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
  SidebarMenuButton,
  SidebarRail
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
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="bg-background shadow-xl border-r border-border">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
            <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={120} height={28} className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
            <LayoutDashboard className="h-6 w-6 text-primary hidden group-data-[collapsible=icon]:block" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeView === 'blog'} 
                onClick={() => setActiveView('blog')}
                tooltip="Blog"
              >
                <FileText className="h-4 w-4" />
                <span>Blog</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeView === 'messages'} 
                onClick={() => setActiveView('messages')}
                tooltip="Messages"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeView === 'performance'} 
                onClick={() => setActiveView('performance')}
                tooltip="Performance"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Performance</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeView === 'settings'} 
                onClick={() => setActiveView('settings')}
                tooltip="Settings"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto p-4 group-data-[collapsible=icon]:p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOut(auth)} tooltip="Sign Out">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="bg-card/50 border-b p-4 flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1" />
        </header>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
