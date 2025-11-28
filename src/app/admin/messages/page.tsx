
'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
}

export default function AdminMessagesPage() {
  const [user, userLoading] = useAuthState(auth);
  const messagesCollection = collection(firestore, 'contactMessages');
  const messagesQuery = user ? query(messagesCollection, orderBy('createdAt', 'desc')) : null;

  const [messages, loading, error] = useCollection(messagesQuery);

  const isLoading = userLoading || loading;

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold">Inbox</h1>
        <p className="text-foreground/70 mt-1">
          Messages submitted through the website contact form.
        </p>
      </div>

      <Card>
         <CardHeader>
            <CardTitle>All Messages</CardTitle>
            <CardDescription>
                {loading ? 'Loading messages...' : `You have received ${messages?.size || 0} messages.`}
            </CardDescription>
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
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                     <TableCell className="text-right">
                      <Skeleton className="h-5 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {error && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-destructive py-10">
                    Error loading messages: {error.message}
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && messages?.docs.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={3} className="text-center text-foreground/70 py-10">
                          Your inbox is empty.
                      </TableCell>
                  </TableRow>
              )}
              {!isLoading &&
                messages?.docs.map((doc) => {
                  const message = { id: doc.id, ...doc.data() } as ContactMessage;
                  const sentDate = message.createdAt
                    ? formatDistanceToNow(new Date(message.createdAt.seconds * 1000), { addSuffix: true })
                    : 'N/A';
                  
                  return (
                    <TableRow key={message.id}>
                      <TableCell className="align-top">
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-foreground/70">{message.email}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="font-medium">{message.subject}</p>
                        <p className="text-sm text-foreground/80 mt-1 max-w-lg truncate">{message.message}</p>
                      </TableCell>
                       <TableCell className="align-top text-right text-sm text-foreground/80">
                        {sentDate}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
