'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  ListChecks,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Trash2,
  XCircle,
} from 'lucide-react';

import { firestore } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';
import { CareerListing } from '@/types/career';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface FirestoreTimestampLike {
  seconds: number;
  nanoseconds: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: FirestoreTimestampLike | null;
}

type CMSFilter = 'all' | 'blog' | 'careers' | 'messages';

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    const timestamp = value as FirestoreTimestampLike;
    return new Date(timestamp.seconds * 1000);
  }

  return null;
}

export default function CMSView() {
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CMSFilter>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ slug: string; title: string } | null>(null);

  const [blogPosts, blogLoading, blogError] = useCollection(
    query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc'))
  );
  const [careers, careersLoading, careersError] = useCollection(
    query(collection(firestore, 'careerListings'), orderBy('createdAt', 'desc'))
  );
  const [messages, messagesLoading, messagesError] = useCollection(
    query(collection(firestore, 'contactMessages'), orderBy('createdAt', 'desc'))
  );

  const blogRows = useMemo(
    () =>
      (blogPosts?.docs.map((docSnap) => {
        const data = docSnap.data() as BlogPost;
        return {
          ...data,
          slug: docSnap.id,
        };
      }) ?? []) as Array<BlogPost & { slug: string }>,
    [blogPosts]
  );

  const careerRows = useMemo(
    () =>
      (careers?.docs.map((docSnap) => ({
        ...(docSnap.data() as CareerListing),
        id: docSnap.id,
      })) ?? []) as Array<CareerListing & { id: string }>,
    [careers]
  );

  const messageRows = useMemo(
    () =>
      (messages?.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ContactMessage, 'id'>),
      })) ?? []) as ContactMessage[],
    [messages]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredBlogRows = useMemo(() => {
    if (!normalizedSearch) return blogRows;
    return blogRows.filter((post) => {
      const tagsText = (post.tags ?? []).join(' ');
      return (
        post.title?.toLowerCase().includes(normalizedSearch) ||
        post.author?.toLowerCase().includes(normalizedSearch) ||
        post.description?.toLowerCase().includes(normalizedSearch) ||
        tagsText.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [blogRows, normalizedSearch]);

  const filteredCareerRows = useMemo(() => {
    if (!normalizedSearch) return careerRows;
    return careerRows.filter((career) =>
      [career.position, career.category, career.topic]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [careerRows, normalizedSearch]);

  const filteredMessageRows = useMemo(() => {
    if (!normalizedSearch) return messageRows;
    return messageRows.filter((message) =>
      [message.name, message.email, message.subject, message.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [messageRows, normalizedSearch]);

  const seoReadyPosts = useMemo(
    () =>
      blogRows.filter(
        (post) =>
          Boolean(post.image) &&
          Boolean(post.description) &&
          post.description.trim().length >= 110 &&
          (post.tags?.length ?? 0) > 0
      ).length,
    [blogRows]
  );

  const activeListings = useMemo(
    () => careerRows.filter((listing) => Boolean(listing.isActive)).length,
    [careerRows]
  );

  const totalContentItems = blogRows.length + careerRows.length;
  const isLoading = blogLoading || careersLoading || messagesLoading;

  const openDeleteDialog = (slug: string, title: string) => {
    setPostToDelete({ slug, title });
    setShowDeleteDialog(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await deleteDoc(doc(firestore, 'blogPosts', postToDelete.slug));
      toast({
        title: 'Post deleted',
        description: `"${postToDelete.title}" has been removed from CMS.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Unable to delete the post right now. Please try again.',
      });
    } finally {
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleToggleListing = async (listing: CareerListing & { id: string }) => {
    try {
      await updateDoc(doc(firestore, 'careerListings', listing.id), {
        isActive: !listing.isActive,
      });

      toast({
        title: listing.isActive ? 'Listing archived' : 'Listing published',
        description: `${listing.position} is now ${listing.isActive ? 'inactive' : 'active'}.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update listing status. Please try again.',
      });
    }
  };

  const shouldShowBlog = filter === 'all' || filter === 'blog';
  const shouldShowCareers = filter === 'all' || filter === 'careers';
  const shouldShowMessages = filter === 'all' || filter === 'messages';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">CMS Studio</h1>
          <p className="text-foreground/70 mt-1">
            Professional content operations for blog, careers, and communication workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/blog/create">
              <PlusCircle className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/careers/create">
              <Briefcase className="mr-2 h-4 w-4" /> New Listing
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <CardDescription>Blog posts + career listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{totalContentItems}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SEO Ready Posts</CardTitle>
            <CardDescription>With image, description, and tags</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {blogLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{seoReadyPosts}</div>}
            <BadgeCheck className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <CardDescription>Visible on careers page</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {careersLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{activeListings}</div>}
            <ListChecks className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inbox Queue</CardTitle>
            <CardDescription>Contact form submissions</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {messagesLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{messageRows.length}</div>}
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Operations</CardTitle>
          <CardDescription>Filter by module and quickly locate items across your CMS.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, email, category..."
              className="pl-9"
            />
          </div>
          <div className="w-full lg:w-56">
            <Select value={filter} onValueChange={(value) => setFilter(value as CMSFilter)}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="careers">Careers</SelectItem>
                <SelectItem value="messages">Messages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {shouldShowBlog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Blog Content
            </CardTitle>
            <CardDescription>
              {blogLoading ? 'Loading posts...' : `${filteredBlogRows.length} result(s) in blog module.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Quality</TableHead>
                  <TableHead className="hidden sm:table-cell">Published</TableHead>
                  <TableHead className="w-[70px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogLoading && Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={`blog-skeleton-${idx}`}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
                {blogError && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive py-8">
                      Failed to load blog content.
                    </TableCell>
                  </TableRow>
                )}
                {!blogLoading && !blogError && filteredBlogRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No blog posts match this filter.
                    </TableCell>
                  </TableRow>
                )}
                {!blogLoading && !blogError && filteredBlogRows.map((post) => {
                  const createdAtDate = toDate(post.createdAt);
                  const qualityPass = Boolean(post.image) && Boolean(post.description) && (post.tags?.length ?? 0) > 0;

                  return (
                    <TableRow key={post.slug}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          {qualityPass ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Ready</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-amber-600" />
                              <span>Needs review</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {createdAtDate ? formatDistanceToNow(createdAtDate, { addSuffix: true }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open post actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blog/edit/${post.slug}`} className="flex items-center gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                              onClick={() => openDeleteDialog(post.slug, post.title)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
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
      )}

      {shouldShowCareers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" /> Careers CMS
            </CardTitle>
            <CardDescription>
              {careersLoading ? 'Loading listings...' : `${filteredCareerRows.length} listing(s) in careers module.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Updated</TableHead>
                  <TableHead className="w-[70px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careersLoading && Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={`career-skeleton-${idx}`}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
                {careersError && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-destructive py-8">
                      Failed to load career listings.
                    </TableCell>
                  </TableRow>
                )}
                {!careersLoading && !careersError && filteredCareerRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No career listings match this filter.
                    </TableCell>
                  </TableRow>
                )}
                {!careersLoading && !careersError && filteredCareerRows.map((listing) => {
                  const updatedAtDate = toDate(listing.updatedAt) ?? toDate(listing.createdAt);
                  return (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.position}</TableCell>
                      <TableCell className="hidden md:table-cell">{listing.category}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${listing.isActive ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                          {listing.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {updatedAtDate ? formatDistanceToNow(updatedAtDate, { addSuffix: true }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open listing actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href="/careers" target="_blank" className="flex items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View page
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/careers/edit/${listing.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleToggleListing(listing)}
                            >
                              {listing.isActive ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                              {listing.isActive ? 'Set Inactive' : 'Set Active'}
                            </DropdownMenuItem>
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
      )}

      {shouldShowMessages && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Communication Queue
            </CardTitle>
            <CardDescription>
              {messagesLoading ? 'Loading messages...' : `${filteredMessageRows.length} message(s) in inbox.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead className="hidden lg:table-cell">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messagesLoading && Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={`msg-skeleton-${idx}`}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-56" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))}
                {messagesError && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-destructive py-8">
                      Failed to load messages.
                    </TableCell>
                  </TableRow>
                )}
                {!messagesLoading && !messagesError && filteredMessageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No messages match this filter.
                    </TableCell>
                  </TableRow>
                )}
                {!messagesLoading && !messagesError && filteredMessageRows.slice(0, 12).map((message) => {
                  const createdAt = toDate(message.createdAt);
                  return (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-xs text-muted-foreground">{message.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-md">{message.message}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4" /> Premium Workflow Checklist
          </CardTitle>
          <CardDescription>Daily practices for reliable and professional CMS operations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
          <div className="rounded-md border p-3 bg-card/50 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
            <span>Review blog quality status before publishing.</span>
          </div>
          <div className="rounded-md border p-3 bg-card/50 flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-primary" />
            <span>Maintain a weekly publishing cadence for SEO momentum.</span>
          </div>
          <div className="rounded-md border p-3 bg-card/50 flex items-start gap-2">
            <Briefcase className="h-4 w-4 mt-0.5 text-primary" />
            <span>Keep stale career listings inactive to protect candidate trust.</span>
          </div>
          <div className="rounded-md border p-3 bg-card/50 flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 text-primary" />
            <span>Respond to inbound messages within 24 hours.</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post "{postToDelete?.title}" will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
