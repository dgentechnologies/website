
'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/client';

export default function AdminDashboardPage() {
  const [user] = useAuthState(auth);
  const [messages, messagesLoading] = useCollection(
    collection(firestore, 'contactMessages')
  );
  const [blogPosts, blogLoading] = useCollection(
    collection(firestore, 'blogPosts')
  );

  const messageCount = messages?.size ?? 0;
  const postCount = blogPosts?.size ?? 0;
  const isLoading = messagesLoading || blogLoading;

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
          <p className="text-foreground/70 mt-1">
            Welcome back, {user?.displayName || user?.email || 'Admin'}. Here's a snapshot of your site.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4 mt-1" /> : <div className="text-2xl font-bold">{messageCount}</div>}
            <p className="text-xs text-muted-foreground">
              Submissions from your contact form
            </p>
          </CardContent>
        </Card>
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
            <CardTitle className="text-sm font-medium">User Visits (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Analytics data coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
