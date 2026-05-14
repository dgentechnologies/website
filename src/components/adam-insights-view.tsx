'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { auth } from '@/firebase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Copy, MapPin, RefreshCw } from 'lucide-react';

type AdamUserItem = {
  id: string;
  identifier: string;
  email: string | null;
  name: string | null;
  interactionCount: number;
  lastMessage: string | null;
  lastReply: string | null;
  lastSeenAt: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
};

type WaitlistItem = {
  id: string;
  email: string;
  feedback: string | null;
  source: string | null;
  createdAt: string | null;
};

type FeedbackItem = {
  id: string;
  source: string;
  identifier: string | null;
  email: string | null;
  name: string | null;
  feedback: string;
  createdAt: string | null;
};

type AdamInsightsResponse = {
  users: AdamUserItem[];
  waitlist: WaitlistItem[];
  feedback: FeedbackItem[];
  totals: {
    users: number;
    waitlist: number;
    feedback: number;
    waitlistFeedback?: number;
    chatFeedback?: number;
  };
  topLocations: { country: string; count: number }[];
};

type WaitlistDetail = WaitlistItem & {
  allFeedback: FeedbackItem[];
  uniqueFeedbackCount: number;
};

const countryNames: Record<string, string> = {
  Unknown: 'Unknown',
  US: 'United States',
  IN: 'India',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  BR: 'Brazil',
  CN: 'China',
  RU: 'Russia',
  SG: 'Singapore',
  AE: 'UAE',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  SE: 'Sweden',
  CH: 'Switzerland',
  KR: 'South Korea',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  NG: 'Nigeria',
  ZA: 'South Africa',
  MX: 'Mexico',
  ID: 'Indonesia',
  PH: 'Philippines',
  MY: 'Malaysia',
  TH: 'Thailand',
  VN: 'Vietnam',
};

function getCountryName(code: string): string {
  return countryNames[code] ?? code;
}

function getCountryFlag(code: string): string {
  try {
    if (!code || code === 'Unknown' || code.length !== 2) return '🌍';
    const upper = code.toUpperCase();
    if (!/^[A-Z]{2}$/.test(upper)) return '🌍';
    return String.fromCodePoint(...upper.split('').map((c) => 127397 + c.charCodeAt(0)));
  } catch {
    return '🌍';
  }
}

function normalizeText(value: string | null): string {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function formatRelativeTime(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

function formatAbsoluteTime(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString();
}

export default function AdamInsightsView() {
  const [data, setData] = useState<AdamInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackSourceFilter, setFeedbackSourceFilter] = useState<'all' | 'waitlist' | 'chat'>('all');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [selectedWaitlistId, setSelectedWaitlistId] = useState<string | null>(null);

  const fetchInsights = useCallback(async (isManualRefresh = false) => {
    try {
      if (!isManualRefresh) {
        setLoading(true);
      }
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to view ADAM insights.');
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/admin/adam-insights', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Failed to load ADAM insights.');
      }

      const parsedData = payload as AdamInsightsResponse;
      setData(parsedData);
      setLastUpdatedAt(new Date().toISOString());
      if (!selectedWaitlistId && parsedData.waitlist.length > 0) {
        setSelectedWaitlistId(parsedData.waitlist[0].id);
      }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to load ADAM insights.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedWaitlistId]);

  useEffect(() => {
    fetchInsights();
    const intervalId = window.setInterval(() => {
      fetchInsights(true);
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [fetchInsights]);

  const waitlistDetails = useMemo<WaitlistDetail[]>(() => {
    if (!data) {
      return [];
    }

    return data.waitlist.map((entry) => {
      const normalizedEmail = entry.email.toLowerCase();
      const normalizedWaitlistNote = normalizeText(entry.feedback);
      const matchedFeedback = data.feedback
        .filter((item) => item.source === 'waitlist')
        .filter((item) => {
          const byEmail = typeof item.email === 'string' && item.email.toLowerCase() === normalizedEmail;
          const byIdentifier = typeof item.identifier === 'string' && item.identifier.toLowerCase() === normalizedEmail;
          return byEmail || byIdentifier;
        })
        .filter((item) => normalizeText(item.feedback) !== normalizedWaitlistNote)
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });

      const uniqueFeedbackCount = matchedFeedback.length + (normalizedWaitlistNote ? 1 : 0);

      return {
        ...entry,
        allFeedback: matchedFeedback,
        uniqueFeedbackCount,
      };
    });
  }, [data]);

  const filteredWaitlist = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return waitlistDetails;
    }

    return waitlistDetails.filter((entry) => {
      return (
        entry.email.toLowerCase().includes(query)
        || entry.id.toLowerCase().includes(query)
        || (entry.feedback ?? '').toLowerCase().includes(query)
      );
    });
  }, [searchQuery, waitlistDetails]);

  const selectedWaitlistEntry = useMemo(() => {
    if (!selectedWaitlistId) {
      return filteredWaitlist[0] ?? null;
    }

    return filteredWaitlist.find((entry) => entry.id === selectedWaitlistId) ?? filteredWaitlist[0] ?? null;
  }, [filteredWaitlist, selectedWaitlistId]);

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // ignore clipboard failures
    }
  };

  const filteredFeedback = useMemo(() => {
    if (!data) {
      return [];
    }

    if (feedbackSourceFilter === 'all') {
      return data.feedback;
    }

    return data.feedback.filter((item) => item.source === feedbackSourceFilter);
  }, [data, feedbackSourceFilter]);

  const waitlistFeedbackTotal = data?.totals.waitlistFeedback ?? data?.feedback.filter((item) => item.source === 'waitlist').length ?? 0;
  const chatFeedbackTotal = data?.totals.chatFeedback ?? data?.feedback.filter((item) => item.source === 'chat').length ?? 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Intelligence Panel</p>
          <h1 className="text-3xl font-headline font-bold">ADAM Insights</h1>
        </div>
        <div>
          <p className="text-foreground/70 mt-1">Track ADAM users, waitlist entries, and product feedback in one place.</p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {formatAbsoluteTime(lastUpdatedAt)}</p>
        </div>
        <Button variant="outline" className="gap-2 w-full lg:w-auto" onClick={() => fetchInsights(true)}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active ADAM Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.users ?? 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Unified view across main and demo datasets</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Waitlist</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.waitlist ?? 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Combined from website and demo experience</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{data?.totals.feedback ?? 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Waitlist {waitlistFeedbackTotal} • Chat {chatFeedbackTotal}</p>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Card className="mb-8 border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load insights</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>ADAM Users</CardTitle>
            <CardDescription>Recent users who interacted with ADAM.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Interactions</TableHead>
                  <TableHead className="hidden xl:table-cell">Last Seen</TableHead>
                  <TableHead>Last Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`adam-user-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  </TableRow>
                ))}
                {!loading && (data?.users.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No ADAM usage records yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || user.identifier}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.email || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.country ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <span>{getCountryFlag(user.country)}</span>
                          <span>{user.city ? `${user.city}, ` : ''}{getCountryName(user.country)}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.interactionCount > 0 ? (
                        <Badge variant="secondary">{user.interactionCount}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">No sessions yet</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{formatRelativeTime(user.lastSeenAt)}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{user.lastMessage || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>User Locations</CardTitle>
              <CardDescription>Geographic distribution of ADAM users by country.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={`loc-sk-${i}`} className="h-14 rounded-lg" />
                ))}
              </div>
            ) : !data?.topLocations?.length || data.topLocations.every((l) => l.country === 'Unknown') ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No location data recorded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {data.topLocations.filter((l) => l.country !== 'Unknown').map((loc) => (
                  <div
                    key={loc.country}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-card p-3 text-center hover:border-primary/40 transition-colors"
                  >
                    <span className="text-2xl">{getCountryFlag(loc.country)}</span>
                    <span className="text-xs font-medium leading-tight">{getCountryName(loc.country)}</span>
                    <Badge variant="secondary" className="text-xs px-1.5">{loc.count}</Badge>
                  </div>
                ))}
                {data.topLocations.filter((l) => l.country === 'Unknown').map((loc) => (
                  <div
                    key="unknown"
                    className="flex flex-col items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-3 text-center"
                  >
                    <span className="text-2xl">🌍</span>
                    <span className="text-xs text-muted-foreground">Unknown</span>
                    <Badge variant="outline" className="text-xs px-1.5">{loc.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waitlist</CardTitle>
            <CardDescription>Premium waitlist console with complete user details and feedback context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <Input
                placeholder="Search by email, id, or note..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="sm:max-w-sm"
              />
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredWaitlist.length}</span> of {data?.waitlist.length ?? 0}
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Source</TableHead>
                    <TableHead className="hidden md:table-cell">Joined</TableHead>
                    <TableHead className="hidden lg:table-cell">Feedback Items</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`waitlist-skeleton-${index}`}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))}
                  {!loading && filteredWaitlist.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No waitlist entries match your search.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {!loading && filteredWaitlist.map((entry) => (
                    <TableRow key={entry.id} className={selectedWaitlistEntry?.id === entry.id ? 'bg-muted/40' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.email}</span>
                          <button
                            type="button"
                            onClick={() => copyEmail(entry.email)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Copy email"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="capitalize">{entry.source || 'unknown'}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatRelativeTime(entry.createdAt)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{entry.uniqueFeedbackCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedWaitlistId(entry.id)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedWaitlistEntry ? (
              <div className="rounded-xl border bg-muted/20 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected Waitlist User</p>
                    <p className="text-lg font-semibold break-all">{selectedWaitlistEntry.email}</p>
                    <p className="text-sm text-muted-foreground">Joined {formatAbsoluteTime(selectedWaitlistEntry.createdAt)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Entry ID: {selectedWaitlistEntry.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Feedback {selectedWaitlistEntry.uniqueFeedbackCount}</Badge>
                    <Badge variant="outline" className="capitalize">{selectedWaitlistEntry.source || 'unknown'}</Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {selectedWaitlistEntry.feedback ? (
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Waitlist Note</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{selectedWaitlistEntry.feedback}</p>
                    </div>
                  ) : null}

                  {selectedWaitlistEntry.allFeedback.length > 0 ? (
                    selectedWaitlistEntry.allFeedback.map((item) => (
                      <div key={item.id} className="rounded-lg border bg-background p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Feedback Entry</p>
                          <span className="text-xs text-muted-foreground">{formatAbsoluteTime(item.createdAt)}</span>
                        </div>
                        <p className="text-sm mt-2 whitespace-pre-wrap break-words">{item.feedback || '-'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No additional feedback recorded for this waitlist user.</p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Collected feedback from ADAM users and waitlist forms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <div className="px-6 pt-4 flex flex-wrap gap-2">
              <Button
                variant={feedbackSourceFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedbackSourceFilter('all')}
              >
                All ({data?.feedback.length ?? 0})
              </Button>
              <Button
                variant={feedbackSourceFilter === 'waitlist' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedbackSourceFilter('waitlist')}
              >
                Waitlist ({waitlistFeedbackTotal})
              </Button>
              <Button
                variant={feedbackSourceFilter === 'chat' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFeedbackSourceFilter('chat')}
              >
                Chat ({chatFeedbackTotal})
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`feedback-skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))}
                {!loading && filteredFeedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No feedback submitted yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading && filteredFeedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium capitalize">{item.source}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.email || item.name || item.identifier || '-'}</TableCell>
                    <TableCell className="max-w-[520px] whitespace-normal break-words">{item.feedback || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatRelativeTime(item.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
