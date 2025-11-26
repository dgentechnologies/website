
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, MessageSquare, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 p-4 md:p-8 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
                <p className="text-foreground/70 mt-1">Manage your website content and view messages.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Manage Content</div>
                        <p className="text-xs text-muted-foreground">
                            Create, edit, or delete blog posts.
                        </p>
                    </CardContent>
                     <CardFooter>
                        <Button asChild size="sm" className="w-full">
                           <Link href="/admin/blog/manage">View Posts <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Create New Post</CardTitle>
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Generate with AI</div>
                         <p className="text-xs text-muted-foreground">
                            Use AI to generate a new post from a topic.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="sm" className="w-full">
                           <Link href="/admin/blog/create">Create Post <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">View Messages</div>
                        <p className="text-xs text-muted-foreground">
                           Read submissions from your site visitors.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild size="sm" className="w-full">
                           <Link href="/admin/messages">View Messages <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
