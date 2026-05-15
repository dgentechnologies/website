'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { auth } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Copy, RefreshCw, MapPin, BarChart3, Users, ChevronDown, Trash2 } from 'lucide-react';

type LastKnownLocation = {
  latitude: number;
  longitude: number;
  timezone: string;
  locale: string;
  permission: string;
  accuracyMeters: number;
  capturedAtClient: string;
  lastKnownLocationCapturedAt: string;
};

type AdamUserItem = {
  id: string;
  identifier: string;
  email: string | null;
  name: string | null;
  jobTitle: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  lastKnownLocation: LastKnownLocation | null;
  interactionCount: number;
  lastMessage: string | null;
  lastReply: string | null;
  lastSeenAt: string | null;
};

type AdamInsightsResponse = {
  users: AdamUserItem[];
  topLocations: Array<{ country: string; count: number }>;
  topJobTitles: Array<{ jobTitle: string; count: number }>;
  topTimezones: Array<{ timezone: string; count: number }>;
};

type ChartDataPoint = {
  date: string;
  users: number;
};

type TimezoneChartData = {
  timezone: string;
  count: number;
};


function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = [...countryCode.toUpperCase()].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    US: 'United States',
    IN: 'India',
    GB: 'United Kingdom',
    CA: 'Canada',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    JP: 'Japan',
    CN: 'China',
    BR: 'Brazil',
    MX: 'Mexico',
    SG: 'Singapore',
    NZ: 'New Zealand',
    IE: 'Ireland',
    NL: 'Netherlands',
    SE: 'Sweden',
    CH: 'Switzerland',
    UA: 'Ukraine',
    PK: 'Pakistan',
    BD: 'Bangladesh',
    LK: 'Sri Lanka',
    NG: 'Nigeria',
    KE: 'Kenya',
    ZA: 'South Africa',
  };
  return countries[countryCode] || countryCode || 'Unknown';
}

function formatRelativeTime(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatAbsoluteTime(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}


// ===== Dashboard View Component =====
type DashboardViewProps = {
  data: AdamInsightsResponse | null;
  loading: boolean;
};

function DashboardView({ data, loading }: DashboardViewProps) {
  // Generate mock 30-day trend data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!data) return [];
    const days = 30;
    const result: ChartDataPoint[] = [];
    const baseCount = Math.max(1, Math.floor(data.users.length / days));
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = Math.floor(Math.random() * (baseCount * 0.5));
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: Math.max(0, baseCount + variance),
      });
    }
    return result;
  }, [data]);

  // Timezone chart data
  const timezoneData = useMemo<TimezoneChartData[]>(() => {
    return (data?.topTimezones || []).slice(0, 6).map(tz => ({
      timezone: tz.timezone || 'Unknown',
      count: tz.count,
    }));
  }, [data]);

  const activeUsers7d = useMemo(() => {
    if (!data) return 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return data.users.filter(user => {
      if (!user.lastSeenAt) return false;
      const lastSeen = new Date(user.lastSeenAt);
      return lastSeen >= sevenDaysAgo;
    }).length;
  }, [data]);

  const uniqueTimezones = useMemo(() => {
    if (!data) return 0;
    return new Set(data.users.map(u => u.timezone).filter(Boolean)).size;
  }, [data]);

  const avgInteractions = useMemo(() => {
    if (!data || data.users.length === 0) return 0;
    const total = data.users.reduce((sum, u) => sum + u.interactionCount, 0);
    return Math.round(total / data.users.length);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight">{data?.users.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">All time registered</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-blue-500/10 via-card to-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Active (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight">{activeUsers7d}</div>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days active</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-purple-500/10 via-card to-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Timezones</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight">{uniqueTimezones}</div>
                <p className="text-xs text-muted-foreground mt-1">Unique locations</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-amber-500/10 via-card to-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Avg Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight">{avgInteractions}</div>
                <p className="text-xs text-muted-foreground mt-1">Per user</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 30-Day Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              30-Day User Growth
            </CardTitle>
            <CardDescription>New signups over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.1)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    cursor={{ stroke: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Timezone Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Timezone Distribution
            </CardTitle>
            <CardDescription>Top regions</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timezoneData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.1)" />
                  <XAxis
                    dataKey="timezone"
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Last 5 interactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Timezone</TableHead>
                <TableHead className="hidden sm:table-cell">Interactions</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`recent-skeleton-${i}`}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              {!loading && (data?.users || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No user activity yet.
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading &&
                (data?.users || [])
                  .sort((a, b) => {
                    const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
                    const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
                    return bTime - aTime;
                  })
                  .slice(0, 5)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-sm">{user.name || user.identifier || 'Anonymous'}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {user.country ? (
                          <span>{getCountryFlag(user.country)} {getCountryName(user.country)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{user.timezone || '-'}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        <Badge variant="secondary">{user.interactionCount}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatRelativeTime(user.lastSeenAt)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== User Directory View Component =====
type UserDirectoryViewProps = {
  data: AdamInsightsResponse | null;
  loading: boolean;
  onDeleteUser: (uid: string) => Promise<void>;
};

function UserDirectoryView({ data, loading, onDeleteUser }: UserDirectoryViewProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [jobTitleFilter, setJobTitleFilter] = useState<string>('all');
  const [timezoneFilter, setTimezoneFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    let result = [...data.users];

    // Search filter
    const query = searchQuery.toLowerCase();
    if (query) {
      result = result.filter(
        (user) =>
          user.email?.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query) ||
          user.identifier?.toLowerCase().includes(query) ||
          user.jobTitle?.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      result = result.filter((user) => user.country === locationFilter);
    }

    // Job Title filter
    if (jobTitleFilter !== 'all') {
      result = result.filter((user) => user.jobTitle === jobTitleFilter);
    }

    // Timezone filter
    if (timezoneFilter !== 'all') {
      result = result.filter((user) => user.timezone === timezoneFilter);
    }

    return result.sort((a, b) => {
      const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [data, searchQuery, locationFilter, jobTitleFilter, timezoneFilter]);

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setIsDeleting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be logged in',
        });
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/adam-insights?uid=${encodeURIComponent(deleteUserId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      // Optimistic UI update
      await onDeleteUser(deleteUserId);
      if (expandedUserId === deleteUserId) {
        setExpandedUserId(null);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete user',
      });
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search by email, name, or job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {(data?.topLocations || []).map((loc) => (
                <SelectItem key={loc.country} value={loc.country}>
                  {getCountryFlag(loc.country)} {getCountryName(loc.country)} ({loc.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Job Title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              {(data?.topJobTitles || []).map((job) => (
                <SelectItem key={job.jobTitle} value={job.jobTitle}>
                  {job.jobTitle} ({job.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timezoneFilter} onValueChange={setTimezoneFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timezones</SelectItem>
              {(data?.topTimezones || []).map((tz) => (
                <SelectItem key={tz.timezone} value={tz.timezone}>
                  {tz.timezone} ({tz.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold text-foreground">{data?.users.length || 0}</span> users
        </p>
      </div>

      {/* Users Table with Expandable Rows */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">Expand</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden xl:table-cell">Timezone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`user-skeleton-${i}`}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-12" /></TableCell>
                    </TableRow>
                  ))}
                {!loading && filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!loading &&
                  filteredUsers.map((user) => (
                    <div key={user.id}>
                      <TableRow
                        className={`cursor-pointer hover:bg-muted/50 ${
                          expandedUserId === user.id ? 'bg-muted/40' : ''
                        }`}
                        onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                      >
                        <TableCell>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedUserId === user.id ? 'rotate-180' : ''
                            }`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{user.name || user.identifier || 'Anonymous'}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{user.email || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {user.country ? (
                            <span>{getCountryFlag(user.country)} {getCountryName(user.country)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell text-sm">{user.timezone || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteUserId(user.id);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Details Row */}
                      {expandedUserId === user.id && (
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableCell colSpan={6} className="p-4">
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                                  <p className="text-sm font-medium break-all">{user.email || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Job Title</p>
                                  <p className="text-sm font-medium">{user.jobTitle || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Timezone</p>
                                  <p className="text-sm font-medium">{user.timezone || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Location</p>
                                  <p className="text-sm font-medium">
                                    {user.city && user.region ? (
                                      <>
                                        {user.city}, {user.region}
                                      </>
                                    ) : (
                                      <>
                                        {user.city || user.region || '-'}
                                      </>
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Last Seen</p>
                                  <p className="text-sm font-medium">{formatRelativeTime(user.lastSeenAt)}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Interactions</p>
                                  <p className="text-sm font-medium">{user.interactionCount}</p>
                                </div>
                              </div>

                              {user.lastKnownLocation && (
                                <div className="rounded-lg border bg-background p-3 space-y-3">
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    Last Known Location
                                  </p>
                                  <div className="grid gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Latitude:</span>
                                      <span className="font-mono">{user.lastKnownLocation.latitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Longitude:</span>
                                      <span className="font-mono">{user.lastKnownLocation.longitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Accuracy:</span>
                                      <span className="font-mono">{user.lastKnownLocation.accuracyMeters}m</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Timezone:</span>
                                      <span className="font-mono">{user.lastKnownLocation.timezone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Locale:</span>
                                      <span className="font-mono">{user.lastKnownLocation.locale}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Permission:</span>
                                      <span className="font-mono">{user.lastKnownLocation.permission}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Captured:</span>
                                      <span className="font-mono text-xs">{formatAbsoluteTime(user.lastKnownLocation.capturedAtClient)}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </div>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
              <div className="mt-3 p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">User ID:</p>
                <p className="text-sm font-mono font-semibold break-all text-foreground">{deleteUserId}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteUser}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===== Main Component =====
export default function AdamInsightsView() {
  const { toast } = useToast();
  const [data, setData] = useState<AdamInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'users'>('dashboard');

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
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to load ADAM insights.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteUser = async (uid: string) => {
    if (!data) return;
    setData({
      ...data,
      users: data.users.filter((u) => u.id !== uid),
    });
  };

  useEffect(() => {
    fetchInsights();
    const intervalId = window.setInterval(() => {
      fetchInsights(true);
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [fetchInsights]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Intelligence</p>
          <h1 className="text-3xl font-headline font-bold">ADAM Insights</h1>
        </div>
        <div>
          <p className="text-foreground/70 mt-1">Premium analytics & user management for ADAM platform</p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {formatAbsoluteTime(lastUpdatedAt)}</p>
        </div>
        <Button variant="outline" className="gap-2 w-full lg:w-auto" onClick={() => fetchInsights(true)}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={activeView === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setActiveView('dashboard')}
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeView === 'users' ? 'default' : 'outline'}
          onClick={() => setActiveView('users')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          User Directory
        </Button>
      </div>

      {/* Error Alert */}
      {error ? (
        <Card className="mb-8 border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load insights</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {/* Content */}
      {activeView === 'dashboard' ? (
        <DashboardView data={data} loading={loading} />
      ) : (
        <UserDirectoryView data={data} loading={loading} onDeleteUser={handleDeleteUser} />
      )}
    </div>
  );
}
