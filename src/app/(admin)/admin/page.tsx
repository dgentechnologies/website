'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, firestore } from '@/firebase/client';
import { Skeleton } from '@/components/ui/skeleton';
import AdminDashboardLayout from './(dashboard)/layout';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, FileText, ArrowRight, List, MoreHorizontal, Eye, Pencil, Trash2, Activity, Clock, Zap, Server, Globe, Shield, Bell, Palette, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { BlogPost } from '@/types/blog';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// --- Dashboard Activity Chart Data ---
const activityData = [
  { month: 'Jan', visitors: 1200, pageViews: 3400 },
  { month: 'Feb', visitors: 1400, pageViews: 4200 },
  { month: 'Mar', visitors: 1100, pageViews: 3100 },
  { month: 'Apr', visitors: 1600, pageViews: 4800 },
  { month: 'May', visitors: 1800, pageViews: 5200 },
  { month: 'Jun', visitors: 2100, pageViews: 6100 },
];

const chartConfig: ChartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--primary))',
  },
  pageViews: {
    label: 'Page Views',
    color: 'hsl(var(--muted-foreground))',
  },
};

// --- Dashboard View Component ---
const DashboardView = () => {
  const [messages, messagesLoading] = useCollection(collection(firestore, 'contactMessages'));
  const [posts, postsLoading] = useCollection(collection(firestore, 'blogPosts'));
  const messageCount = messages?.size ?? 0;
  const postCount = posts?.size ?? 0;
  const isLoading = messagesLoading || postsLoading;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
          <p className="text-foreground/70 mt-1">An overview of your website's activity.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4 mt-1" /> : <div className="text-2xl font-bold">{postCount}</div>}
            <p className="text-xs text-muted-foreground">Published blog articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4 mt-1" /> : <div className="text-2xl font-bold">{messageCount}</div>}
            <p className="text-xs text-muted-foreground">Submissions from your contact form</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Visits (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Analytics data coming soon</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Website Activity
          </CardTitle>
          <CardDescription>Monthly visitors and page views over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="pageViews" 
                stroke="hsl(var(--muted-foreground))" 
                fillOpacity={1} 
                fill="url(#colorPageViews)" 
                name="pageViews"
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorVisitors)" 
                name="visitors"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Performance View Component ---
const performanceData = [
  { name: 'Mon', responseTime: 120 },
  { name: 'Tue', responseTime: 98 },
  { name: 'Wed', responseTime: 145 },
  { name: 'Thu', responseTime: 110 },
  { name: 'Fri', responseTime: 89 },
  { name: 'Sat', responseTime: 78 },
  { name: 'Sun', responseTime: 95 },
];

const performanceChartConfig: ChartConfig = {
  responseTime: {
    label: 'Response Time (ms)',
    color: 'hsl(var(--primary))',
  },
};

const PerformanceView = () => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Performance</h1>
        <p className="text-foreground/70 mt-1">Monitor your website's speed, uptime, and health metrics.</p>
      </div>
    </div>

    {/* Performance Metrics Cards */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          <Server className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">99.9%</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">105ms</div>
          <p className="text-xs text-muted-foreground">Server response time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Page Load</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.2s</div>
          <p className="text-xs text-muted-foreground">Average load time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Global CDN</CardTitle>
          <Globe className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">Active</div>
          <p className="text-xs text-muted-foreground">Edge locations: 34</p>
        </CardContent>
      </Card>
    </div>

    {/* Response Time Chart */}
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Response Time Trend
        </CardTitle>
        <CardDescription>Average server response time over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={performanceChartConfig} className="h-[250px] w-full">
          <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="responseTime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="responseTime" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>

    {/* Core Web Vitals */}
    <Card>
      <CardHeader>
        <CardTitle>Core Web Vitals</CardTitle>
        <CardDescription>Key performance metrics for user experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Largest Contentful Paint (LCP)</span>
            </div>
            <span className="text-sm font-bold">1.8s</span>
          </div>
          <Progress value={72} className="h-2" />
          <p className="text-xs text-muted-foreground">Good (should be under 2.5s)</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">First Input Delay (FID)</span>
            </div>
            <span className="text-sm font-bold">45ms</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-xs text-muted-foreground">Good (should be under 100ms)</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">Cumulative Layout Shift (CLS)</span>
            </div>
            <span className="text-sm font-bold">0.12</span>
          </div>
          <Progress value={60} className="h-2" />
          <p className="text-xs text-muted-foreground">Needs improvement (should be under 0.1)</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// --- Settings View Component ---
const SettingsView = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-foreground/70 mt-1">Manage your admin preferences and website configuration.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme for the dashboard</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor" className="font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch 
                id="two-factor" 
                checked={twoFactor} 
                onCheckedChange={setTwoFactor} 
              />
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@dgentechnologies.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
const BlogView = () => {
  const [blogPosts, blogLoading, blogError] = useCollection(query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc')));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deleteDoc(doc(firestore, 'blogPosts', postToDelete.slug));
      toast({
        title: 'Post Deleted',
        description: `"${postToDelete.title}" has been successfully deleted.`,
      });
    } catch (e) {
      console.error('Error deleting post: ', e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error deleting the post. Please try again.',
      });
    } finally {
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Blog Management</h1>
          <p className="text-foreground/70 mt-1">Create new AI-powered articles or manage your existing posts.</p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 mb-8">
            <Card className="flex flex-col hover:shadow-lg hover:border-primary/20 transition-all">
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div>
                        <CardTitle className="font-headline text-xl">Create a New Post</CardTitle>
                        <CardDescription className="mt-2">Use our AI assistant to generate a complete blog post from just a topic.</CardDescription>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full group">
                <Link href="/admin/blog/create">
                    Create with AI <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                </Button>
            </CardContent>
            </Card>

            <Card className="flex flex-col bg-card/50 border-dashed">
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div>
                        <CardTitle className="font-headline text-xl">Manage Posts</CardTitle>
                        <CardDescription className="mt-2">View, edit, or delete your posts in the table below.</CardDescription>
                    </div>
                    <List className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
             <CardContent className="flex-grow flex items-end">
                 <Button disabled className="w-full" variant="outline">
                    Currently Viewing
                 </Button>
            </CardContent>
            </Card>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>{blogLoading ? 'Loading posts...' : `You have ${blogPosts?.size || 0} posts.`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogLoading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {blogError && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error: {blogError.message}</TableCell></TableRow>}
              {!blogLoading && blogPosts?.docs.map((doc) => {
                const post = { slug: doc.id, ...doc.data() } as BlogPost;
                return (
                  <TableRow key={post.slug}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                    <TableCell className="hidden sm:table-cell">{post.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild><Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer"><Eye className="h-4 w-4" /> View</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link href={`/admin/blog/edit/${post.slug}`} className="flex items-center gap-2 cursor-pointer"><Pencil className="h-4 w-4" /> Edit</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={() => handleDeleteClick(post)}><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the blog post <span className="font-bold"> "{postToDelete?.title}"</span>.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- Messages View Component ---
interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: { seconds: number; nanoseconds: number; } | null;
}
const MessagesView = () => {
  const [messages, loading, error] = useCollection(query(collection(firestore, 'contactMessages'), orderBy('createdAt', 'desc')));
  const isLoading = loading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold">Inbox</h1>
        <p className="text-foreground/70 mt-1">Messages submitted through the website contact form.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>{loading ? 'Loading messages...' : `You have received ${messages?.size || 0} messages.`}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">From</TableHead>
                <TableHead>Subject & Message</TableHead>
                <TableHead className="text-right w-[150px]">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32 mb-2" /><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48 mb-2" /><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {error && <TableRow><TableCell colSpan={3} className="text-center text-destructive py-10">Error loading messages: {error.message}</TableCell></TableRow>}
              {!isLoading && messages?.docs.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-foreground/70 py-10">Your inbox is empty.</TableCell></TableRow>}
              {!isLoading && messages?.docs.map((doc) => {
                const message = { id: doc.id, ...doc.data() } as ContactMessage;
                const sentDate = message.createdAt ? formatDistanceToNow(new Date(message.createdAt.seconds * 1000), { addSuffix: true }) : 'N/A';
                return (
                  <TableRow key={message.id}>
                    <TableCell className="align-top"><div className="font-medium">{message.name}</div><div className="text-sm text-foreground/70">{message.email}</div></TableCell>
                    <TableCell className="align-top"><p className="font-medium">{message.subject}</p><p className="text-sm text-foreground/80 mt-1 max-w-lg truncate">{message.message}</p></TableCell>
                    <TableCell className="align-top text-right text-sm text-foreground/80">{sentDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


// --- Main Admin Page Component ---
export default function AdminRootPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [activeView, setActiveView] = useState<'dashboard' | 'blog' | 'messages' | 'performance' | 'settings'>('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null; // The layout's useEffect will handle the redirect
  }
  
  const renderContent = () => {
    switch (activeView) {
      case 'blog':
        return <BlogView />;
      case 'messages':
        return <MessagesView />;
      case 'performance':
        return <PerformanceView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <AdminDashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </AdminDashboardLayout>
  );
}
