'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText, X, CheckCircle2, Send, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobApplicationDialogProps {
  listingId: string;
  listingTitle: string;
  compensation?: string;
  amount?: string;
  amountSpan?: string;
}

const AMOUNT_SPAN_LABELS: Record<string, string> = {
  'per month': '/month',
  'per year': '/year',
  'per week': '/week',
  fixed: ' (fixed)',
};

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function JobApplicationDialog({
  listingId,
  listingTitle,
  compensation,
  amount,
  amountSpan,
}: JobApplicationDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');

  function resetForm() {
    setName('');
    setEmail('');
    setPhone('');
    setLinkedinUrl('');
    setCoverLetter('');
    setResumeFile(null);
    setResumeError('');
    setSubmitted(false);
  }

  function handleDialogOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setResumeError('');
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setResumeError('Only PDF, DOC, or DOCX files are accepted.');
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setResumeError(`File must be under ${MAX_FILE_SIZE_MB} MB.`);
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setResumeFile(file);
  }

  function removeFile() {
    setResumeFile(null);
    setResumeError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all required fields.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ variant: 'destructive', title: 'Invalid Email', description: 'Please enter a valid email address.' });
      return;
    }
    const phoneRegex = /^[+\d][\d\s\-().]{7,19}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast({ variant: 'destructive', title: 'Invalid Phone', description: 'Please enter a valid phone number.' });
      return;
    }
    if (!resumeFile) {
      setResumeError('Please upload your resume.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('listingId', listingId);
      formData.append('listingTitle', listingTitle);
      formData.append('applicantName', name.trim());
      formData.append('applicantEmail', email.trim().toLowerCase());
      formData.append('applicantPhone', phone.trim());
      if (linkedinUrl.trim()) formData.append('linkedinUrl', linkedinUrl.trim());
      if (coverLetter.trim()) formData.append('coverLetter', coverLetter.trim());
      formData.append('resume', resumeFile, resumeFile.name);

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      toast({ variant: 'destructive', title: 'Submission Failed', description: message });
    } finally {
      setSubmitting(false);
    }
  }

  const isInternPaid = compensation === 'intern-paid';
  const feeText = amount
    ? `₹${amount}${amountSpan ? AMOUNT_SPAN_LABELS[amountSpan] ?? ` ${amountSpan}` : ''}`
    : 'a certification fee';

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-semibold">
          <Send className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {submitted ? (
          /* Success state */
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-headline">Application Submitted!</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Thanks for applying for the <strong>{listingTitle}</strong> role at DGEN
                Technologies. We&apos;ll review your application and get back to you within
                3&ndash;5 business days.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          /* Application form */
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">Apply for {listingTitle}</DialogTitle>
              <DialogDescription>
                Fill in your details below. Fields marked <span className="text-destructive">*</span> are required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-2" noValidate>
              {/* Fee notice for intern-paid listings */}
              {isInternPaid && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                    <strong>Fee-based internship:</strong> A certification fee of{' '}
                    <strong>{feeText}</strong> is applicable for this role. You will be informed
                    about the payment process after shortlisting.
                  </p>
                </div>
              )}
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="app-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="app-name"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="app-email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="app-email"
                  type="email"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="app-phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="app-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  required
                  autoComplete="tel"
                />
              </div>

              {/* LinkedIn / Portfolio */}
              <div className="space-y-1.5">
                <Label htmlFor="app-linkedin">LinkedIn / Portfolio URL</Label>
                <Input
                  id="app-linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  maxLength={500}
                  autoComplete="url"
                />
              </div>

              {/* Cover Letter */}
              <div className="space-y-1.5">
                <Label htmlFor="app-cover">
                  Cover Letter{' '}
                  <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="app-cover"
                  placeholder="Tell us why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {coverLetter.length}/2000
                </p>
              </div>

              {/* Resume Upload */}
              <div className="space-y-1.5">
                <Label>
                  Resume <span className="text-destructive">*</span>
                </Label>
                {resumeFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/40 bg-primary/5">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{resumeFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(resumeFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={removeFile}
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="app-resume"
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
                      resumeError
                        ? 'border-destructive/50 bg-destructive/5'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <Upload className={cn('h-6 w-6', resumeError ? 'text-destructive' : 'text-muted-foreground')} />
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload resume</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PDF, DOC, DOCX — max {MAX_FILE_SIZE_MB} MB
                      </p>
                    </div>
                    <input
                      id="app-resume"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                )}
                {resumeError && (
                  <p className="text-xs text-destructive">{resumeError}</p>
                )}
              </div>

              <Button type="submit" className="w-full font-semibold" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
