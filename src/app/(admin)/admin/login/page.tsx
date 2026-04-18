'use client';

import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/client';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function AdminLoginPage() {
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSignIn(values: z.infer<typeof formSchema>) {
    signInWithEmailAndPassword(values.email, values.password);
  }

  useEffect(() => {
    if (user) {
      toast({ title: 'Login Successful', description: 'Redirecting to admin dashboard.' });
      router.push('/admin');
    }
  }, [user, router, toast]);

  useEffect(() => {
    if (error) {
      const code = (error as { code?: string }).code;
      let description = 'An unexpected error occurred. Please try again.';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        description = 'Invalid email or password. Please check your credentials.';
      } else if (code === 'auth/operation-not-allowed') {
        description = 'Email/password sign-in is not enabled. Contact the developer.';
      } else if (code === 'auth/too-many-requests') {
        description = 'Too many failed attempts. Please wait a few minutes and try again.';
      } else if (code === 'auth/user-disabled') {
        description = 'This account has been disabled. Contact the developer.';
      } else if (code === 'auth/network-request-failed') {
        description = 'Network error. Check your internet connection and try again.';
      }
      toast({ variant: 'destructive', title: 'Login Failed', description });
    }
  }, [error, toast]);


  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="admin@example.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input placeholder="••••••••" {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                    </Button>
                </div>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
