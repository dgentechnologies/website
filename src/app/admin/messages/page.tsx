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
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/client';

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
    <div className="container max-w-screen-lg py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Contact Messages</h1>
        <p className="text-foreground/70 mt-2">
          Messages submitted through the website contact form.
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[200px]">From</TableHead>
              <TableHead>Subject & Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {error && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-destructive">
                  Error loading messages: {error.message}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && messages?.docs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-foreground/70 py-10">
                        No messages have been received yet.
                    </TableCell>
                </TableRow>
            )}
            {!isLoading &&
              messages?.docs.map((doc) => {
                const message = { id: doc.id, ...doc.data() } as ContactMessage;
                const sentDate = message.createdAt
                  ? format(new Date(message.createdAt.seconds * 1000), 'MMM d, yyyy')
                  : 'N/A';
                
                return (
                  <TableRow key={message.id}>
                    <TableCell className="align-top text-sm text-foreground/80">
                      {sentDate}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-foreground/70">{message.email}</div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{message.subject}</p>
                      <p className="text-sm text-foreground/80 mt-1">{message.message}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
