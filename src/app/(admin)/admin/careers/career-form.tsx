'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { CareerListing } from '@/types/career';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  position: z.string().min(2, 'Position must be at least 2 characters.'),
  category: z.string().min(2, 'Category is required.'),
  topic: z.string().min(2, 'Topic is required.'),
  type: z.enum(['job', 'internship']),
  workMode: z.enum(['remote', 'onsite', 'hybrid']),
  compensation: z.enum(['paid', 'unpaid']),
  amount: z.string().optional(),
  amountSpan: z.enum(['per month', 'per year', 'per week', 'fixed']).optional(),
  duration: z.string().min(2, 'Duration is required (e.g. "3 months", "Full-time permanent").'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters.'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CareerFormProps {
  mode: 'create' | 'edit';
  listingId?: string;
  defaultValues?: Partial<FormValues>;
}

export default function CareerForm({ mode, listingId, defaultValues }: CareerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: '',
      category: '',
      topic: '',
      type: 'job',
      workMode: 'onsite',
      compensation: 'paid',
      amount: '',
      amountSpan: 'per month',
      duration: '',
      description: '',
      requirements: '',
      isActive: true,
      ...defaultValues,
    },
  });

  const compensation = form.watch('compensation');

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const data: Omit<CareerListing, 'id' | 'createdAt' | 'updatedAt'> & {
        createdAt?: ReturnType<typeof serverTimestamp>;
        updatedAt: ReturnType<typeof serverTimestamp>;
      } = {
        position: values.position,
        category: values.category,
        topic: values.topic,
        type: values.type,
        workMode: values.workMode,
        compensation: values.compensation,
        amount: values.compensation === 'paid' ? values.amount : undefined,
        amountSpan: values.compensation === 'paid' ? values.amountSpan : undefined,
        duration: values.duration,
        description: values.description,
        requirements: values.requirements,
        isActive: values.isActive,
        updatedAt: serverTimestamp(),
      };

      if (mode === 'create') {
        data.createdAt = serverTimestamp();
        await addDoc(collection(firestore, 'careerListings'), data);
        toast({ title: 'Listing Created', description: `"${values.position}" has been published.` });
      } else if (listingId) {
        await setDoc(doc(firestore, 'careerListings', listingId), data, { merge: true });
        toast({ title: 'Listing Updated', description: `"${values.position}" has been updated.` });
      }

      router.push('/admin');
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save the listing. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {mode === 'create' ? 'New Career Listing' : 'Edit Career Listing'}
          </h1>
          <p className="text-foreground/70 mt-1">
            {mode === 'create'
              ? 'Fill in the details to publish a new job or internship opening.'
              : 'Update the details for this listing.'}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category / Department</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic / Area of Work</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. IoT, Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Type & Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="job">Full-Time Job</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="remote">Work From Home</SelectItem>
                          <SelectItem value="onsite">Work From Office</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Compensation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="compensation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compensation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Paid / Unpaid" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {compensation === 'paid' && (
                  <>
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹15,000 or $2,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amountSpan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pay Period</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="per month">Per Month</SelectItem>
                              <SelectItem value="per year">Per Year</SelectItem>
                              <SelectItem value="per week">Per Week</SelectItem>
                              <SelectItem value="fixed">Fixed / One-time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3 months, 6 months, Full-time permanent" {...field} />
                    </FormControl>
                    <FormDescription>How long is this role? For permanent roles, write "Full-time permanent".</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements */}
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements / Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List required skills, qualifications, and experience..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Listing</FormLabel>
                      <FormDescription>
                        When active, this listing will be visible on the public Careers page.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Publish Listing' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
