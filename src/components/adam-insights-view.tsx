'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdamUserItem = {
  id: string;
  identifier: string;
  email: string | null;
  name: string | null;
  interactionCount: number;
  lastMessage: string | null;
  lastReply: string | null;
  lastSeenAt: string | null;
};

type WaitlistItem = {
  id: string;
  email: string;
  createdAt: string | null;
};

type FeedbackItem = {
  id: string;
  source: string;
  identifier: string | null;
  email: string | null;
  name: string | null;
  feedback: string;
  createdAt: string | null;
};

type AdamInsightsResponse = {
  users: AdamUserItem[];
  waitlist: WaitlistItem[];
  feedback: FeedbackItem[];
  totals: {
    users: number;
    waitlist: number;
    feedback: number;
  };
};

function formatRelativeTime(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export default function AdamInsightsView() {
  const [data, setData] = useState<AdamInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = auth.currentUser;
        if (!user) {
          throw new Error('You must be logged in to view ADAM insights.');
        }

        const token = await user.getIdToken();
        const response = await fetch('/api/admin/adam-insights', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(typeof payload.error === 'string' ? payload.error : 'Failed to load ADAM insights.');
        }

        setData(payload as AdamInsightsResponse);
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Failed to load ADAM insights.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold">ADAM Insights</h1>
        <p className="text-foreground/70 mt-1">Track ADAM users, waitlist entries, and product feedback in one place.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ADAM Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.users ?? 0}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waitlist Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.waitlist ?? 0}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.feedback ?? 0}</div>}
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Card className="mb-8 border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load insights</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>ADAM Users</CardTitle>
            <CardDescription>Recent users who interacted with ADAM.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Interactions</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Seen</TableHead>
                  <TableHead>Last Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`adam-user-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  </TableRow>
                ))}
                {!loading && (data?.users.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No ADAM usage records yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || user.identifier}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{user.interactionCount}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatRelativeTime(user.lastSeenAt)}</TableCell>
                    <TableCell className="max-w-[380px] truncate">{user.lastMessage || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waitlist</CardTitle>
            <CardDescription>Latest ADAM waitlist signups.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`waitlist-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))}
                {!loading && (data?.waitlist.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No waitlist entries yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && data?.waitlist.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.email}</TableCell>
                    <TableCell>{formatRelativeTime(entry.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Collected feedback from ADAM users and waitlist forms.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`feedback-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))}
                {!loading && (data?.feedback.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No feedback submitted yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && data?.feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium capitalize">{item.source}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.email || item.name || item.identifier || '-'}</TableCell>
                    <TableCell className="max-w-[520px] whitespace-normal break-words">{item.feedback || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatRelativeTime(item.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
