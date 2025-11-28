
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, MessageSquare, PlusCircle, ArrowRight, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query, limit } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/client';

export default function AdminDashboardPage() {
    const [user] = useAuthState(auth);
    const [blogPosts, blogLoading] = useCollection(
        query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc'), limit(5))
    );
    const [messages, messagesLoading] = useCollection(
        collection(firestore, 'contactMessages')
    );

    const postCount = blogPosts?.size ?? 0;
    const messageCount = messages?.size ?? 0;
    const isLoading = blogLoading || messagesLoading;

    return (
        <div className="flex-1 p-4 md:p-8 space-y-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
                    <p className="text-foreground/70 mt-1">Welcome back, {user?.displayName || user?.email || 'Admin'}. Here's a snapshot of your site.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/create"><PlusCircle /> Create New Post</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/4 mt-1" /> : <div className="text-2xl font-bold">{postCount}</div>}
                        <p className="text-xs text-muted-foreground">
                            Published articles on your blog
                        </p>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/4 mt-1" /> : <div className="text-2xl font-bold">{messageCount}</div>}
                        <p className="text-xs text-muted-foreground">
                           Total submissions from your contact form
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Quick Action</CardTitle>
                        <PlusCircle className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">Generate a Post</div>
                        <p className="text-xs text-muted-foreground">
                            Use AI to create a new blog post in minutes.
                        </p>
                    </CardContent>
                     <CardFooter>
                        <Button asChild size="sm" className="w-full">
                           <Link href="/admin/blog/create">Create with AI <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>A list of your most recently created blog posts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {blogLoading && Array.from({length: 3}).map((_, i) => (
                           <div key={i} className="flex items-center">
                             <div className="space-y-1">
                               <Skeleton className="h-5 w-48" />
                               <Skeleton className="h-4 w-32" />
                             </div>
                             <Skeleton className="ml-auto h-8 w-20" />
                           </div>
                        ))}
                        {!blogLoading && blogPosts?.docs.map(doc => {
                             const post = { slug: doc.id, ...doc.data() } as BlogPost;
                             return (
                                 <div key={post.slug} className="flex items-center">
                                     <div>
                                         <p className="font-medium">{post.title}</p>
                                         <p className="text-sm text-muted-foreground">
                                             By {post.author} on {post.date}
                                         </p>
                                     </div>
                                     <div className="ml-auto flex gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/blog/edit/${post.slug}`}><Pencil className="h-4 w-4" /></Link>
                                        </Button>
                                     </div>
                                 </div>
                             )
                        })}
                         {!blogLoading && blogPosts?.empty && (
                             <p className="text-sm text-center text-muted-foreground py-4">No recent posts found. Time to create one!</p>
                         )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/blog/manage">Manage All Posts</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
