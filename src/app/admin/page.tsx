
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="container max-w-screen-lg py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold">Welcome, Admin</h1>
                <p className="text-foreground/70 mt-2">Manage your website content and view messages.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Blog Management</CardTitle>
                        <CardDescription>Create, edit, or delete blog posts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/admin/blog/create"><PlusCircle className="mr-2"/> Create New Post</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/admin/blog/manage"><FileText className="mr-2"/> Manage Existing Posts</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Messages</CardTitle>
                        <CardDescription>View messages submitted by your site visitors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/admin/messages"><MessageSquare className="mr-2"/> View Messages</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
