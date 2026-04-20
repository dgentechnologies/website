'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { JobApplication } from '@/types/application';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Phone,
  FileText,
  Download,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ApplicationStatus = JobApplication['status'];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
};

const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-700 border-amber-500/25',
  reviewed: 'bg-sky-500/15 text-sky-700 border-sky-500/25',
  shortlisted: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25',
  rejected: 'bg-rose-500/15 text-rose-700 border-rose-500/25',
};

function toDate(value: JobApplication['createdAt']): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && 'seconds' in value) {
    return new Date(value.seconds * 1000);
  }
  return null;
}

function isPdfFile(fileName: string) {
  return fileName.toLowerCase().endsWith('.pdf');
}

export default function JobApplicationsView() {
  const [applicationDocs, loading, error] = useCollection(
    query(collection(firestore, 'jobApplications'), orderBy('createdAt', 'desc'))
  );
  const [selectedId, setSelectedId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [searchText, setSearchText] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const applications = useMemo(() => {
    if (!applicationDocs) return [];
    return applicationDocs.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<JobApplication, 'id'>;
      return { id: docSnap.id, ...data } as JobApplication;
    });
  }, [applicationDocs]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const statusMatches = statusFilter === 'all' || application.status === statusFilter;
      const normalizedSearch = searchText.trim().toLowerCase();
      const searchMatches =
        normalizedSearch.length === 0 ||
        application.applicantName.toLowerCase().includes(normalizedSearch) ||
        application.applicantEmail.toLowerCase().includes(normalizedSearch) ||
        application.listingTitle.toLowerCase().includes(normalizedSearch);

      return statusMatches && searchMatches;
    });
  }, [applications, searchText, statusFilter]);

  const selectedApplication = useMemo(() => {
    if (!selectedId) return null;
    return filteredApplications.find((application) => application.id === selectedId) ?? null;
  }, [filteredApplications, selectedId]);

  const selectedDate = toDate(selectedApplication?.createdAt);

  async function updateApplicationStatus(nextStatus: ApplicationStatus) {
    if (!selectedApplication?.id) return;

    if (selectedApplication.status === nextStatus) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await updateDoc(doc(firestore, 'jobApplications', selectedApplication.id), {
        status: nextStatus,
      });
      toast({
        title: 'Status updated',
        description: `${selectedApplication.applicantName} is now marked as ${STATUS_LABELS[nextStatus]}.`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update application status. Please try again.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  }

  const totalApplications = applications.length;
  const pendingCount = applications.filter((application) => application.status === 'pending').length;
  const shortlistedCount = applications.filter((application) => application.status === 'shortlisted').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Job Applications</h1>
          <p className="text-foreground/70 mt-1">
            Review candidate resumes, evaluate profiles, and respond quickly with one-click actions.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-foreground/70">Total</p>
              <p className="text-xl font-semibold">{totalApplications}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/25 bg-amber-500/10">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-foreground/70">Pending</p>
              <p className="text-xl font-semibold">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/25 bg-emerald-500/10">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-foreground/70">Shortlisted</p>
              <p className="text-xl font-semibold">{shortlistedCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Resume Preview
            </CardTitle>
            <CardDescription>
              {selectedApplication
                ? `${selectedApplication.resumeFileName} - ${selectedApplication.applicantName}`
                : 'Select an application to preview the resume.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 min-h-[660px] bg-gradient-to-b from-muted/30 to-background">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-2/5" />
                <Skeleton className="h-[560px] w-full" />
              </div>
            ) : !selectedApplication ? (
              <div className="h-full flex items-center justify-center p-8 text-center text-foreground/70">
                No application selected.
              </div>
            ) : isPdfFile(selectedApplication.resumeFileName) ? (
              <iframe
                title={`Resume preview for ${selectedApplication.applicantName}`}
                src={selectedApplication.resumeUrl}
                className="w-full h-[660px] border-0"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
                <FileText className="h-14 w-14 text-muted-foreground" />
                <div>
                  <p className="font-medium">Preview unavailable for this format</p>
                  <p className="text-sm text-foreground/70 mt-1">
                    This resume is a Word document. Use download or open actions to review it.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild>
                    <a href={selectedApplication.resumeUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Resume
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedApplication.resumeUrl} download={selectedApplication.resumeFileName}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Queue</CardTitle>
              <CardDescription>Search and filter applications to quickly find candidates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search by name, email, role..."
                />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as 'all' | ApplicationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}

                {!loading && filteredApplications.length === 0 && (
                  <p className="text-sm text-foreground/70 py-6 text-center">No applications found for this filter.</p>
                )}

                {!loading && filteredApplications.map((application) => {
                  const createdAt = toDate(application.createdAt);
                  const isSelected = selectedApplication?.id === application.id;

                  return (
                    <button
                      key={application.id}
                      type="button"
                      onClick={() => setSelectedId(application.id || '')}
                      className={cn(
                        'w-full text-left rounded-lg border px-3 py-2 transition-colors',
                        isSelected
                          ? 'border-primary/40 bg-primary/10'
                          : 'border-border hover:border-primary/30 hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{application.applicantName}</p>
                        <Badge className={cn('font-medium', STATUS_BADGE_CLASS[application.status])}>
                          {STATUS_LABELS[application.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground/70 truncate mt-1">{application.listingTitle}</p>
                      <p className="text-xs text-foreground/60 mt-1">
                        {createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : 'Recently'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
              <CardDescription>
                {selectedApplication ? 'Professional quick actions for outreach and profile review.' : 'Select an application to view details.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedApplication ? (
                <p className="text-sm text-foreground/70">No applicant selected.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{selectedApplication.applicantName}</p>
                      <p className="text-sm text-foreground/70">Applied for {selectedApplication.listingTitle}</p>
                      <p className="text-xs text-foreground/60 mt-1">
                        Submitted {selectedDate ? formatDistanceToNow(selectedDate, { addSuffix: true }) : 'recently'}
                      </p>
                    </div>
                    <Badge className={cn('font-medium', STATUS_BADGE_CLASS[selectedApplication.status])}>
                      {STATUS_LABELS[selectedApplication.status]}
                    </Badge>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button asChild variant="outline" className="justify-start">
                      <a href={`mailto:${selectedApplication.applicantEmail}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Direct Mail
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <a href={`tel:${selectedApplication.applicantPhone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Applicant
                      </a>
                    </Button>
                    {selectedApplication.linkedinUrl && (
                      <Button asChild variant="outline" className="justify-start">
                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {selectedApplication.portfolioUrl && (
                      <Button asChild variant="outline" className="justify-start">
                        <a href={selectedApplication.portfolioUrl} target="_blank" rel="noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                    {selectedApplication.githubUrl && (
                      <Button asChild variant="outline" className="justify-start">
                        <a href={selectedApplication.githubUrl} target="_blank" rel="noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="justify-start">
                      <a href={selectedApplication.resumeUrl} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </div>

                  <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="space-y-1.5">
                      <Label htmlFor="application-status">Application status</Label>
                      <Select
                        value={selectedApplication.status}
                        onValueChange={(value) => updateApplicationStatus(value as ApplicationStatus)}
                      >
                        <SelectTrigger id="application-status" disabled={updatingStatus}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" disabled={updatingStatus} className="justify-start md:justify-center">
                      <RefreshCw className={cn('h-4 w-4 mr-2', updatingStatus && 'animate-spin')} />
                      {updatingStatus ? 'Updating...' : 'Auto-save on change'}
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Applicant email</Label>
                    <Input value={selectedApplication.applicantEmail} readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone number</Label>
                    <Input value={selectedApplication.applicantPhone} readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cover letter</Label>
                    <Textarea
                      value={selectedApplication.coverLetter || 'No cover letter was provided.'}
                      readOnly
                      className="min-h-24"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-destructive">Failed to load applications: {error.message}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
