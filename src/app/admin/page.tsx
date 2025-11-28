
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
import { MessageSquare, Users, FileText, ArrowRight, List, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

// --- Blog View Component ---
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
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [activeView, setActiveView] = useState<'dashboard' | 'blog' | 'messages'>('dashboard');

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
    return null; // Or a login redirect component
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'blog':
        return <BlogView />;
      case 'messages':
        return <MessagesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AdminDashboardLayout activeView={activeView} setActiveView={setActiveView}>
      <div className="flex-1 p-4 md:p-8">
        {renderContent()}
      </div>
    </AdminDashboardLayout>
  );
}

    