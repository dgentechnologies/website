
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2, PlusCircle, Eye } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManageBlogPage() {
  const [blogPosts, loading, error] = useCollection(
    query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc'))
  );
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
    <>
      <div className="flex-1 p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-headline font-bold">Manage Blog</h1>
                <p className="text-foreground/70 mt-1">A list of all the posts on your blog. You can edit, view, or delete them.</p>
            </div>
            <Button asChild>
                <Link href="/admin/blog/create"><PlusCircle /> Create New Post</Link>
            </Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>
                    {loading ? 'Loading posts...' : `You have ${blogPosts?.size || 0} posts.`}
                </CardDescription>
            </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                {error && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-destructive">
                      Error loading posts.
                    </TableCell>
                  </TableRow>
                )}
                {!loading && blogPosts?.docs.map((doc) => {
                  const post = {slug: doc.id, ...doc.data()} as BlogPost;
                  return (
                    <TableRow key={post.slug}>
                      <TableCell className="font-medium">
                          {post.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                      <TableCell className="hidden sm:table-cell">{post.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
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
                              onClick={() => handleDeleteClick(post)}
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
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              <span className="font-bold"> "{postToDelete?.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
