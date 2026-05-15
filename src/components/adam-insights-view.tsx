'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, MapPin, BarChart3, Users, ChevronDown, TrendingUp, Download, RotateCcw, Archive } from 'lucide-react';

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
  uid: string | null;
  identifier: string;
  email: string | null;
  name: string | null;
  jobTitle: string | null;
  whereHeard: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  dob: string | null;
  age: number | null;
  intent: string | null;
  useCase: string | null;
  accountCreatedAt: string | null;
  lastKnownLocation: LastKnownLocation | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
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
  ageGroups?: Array<{ ageGroup: string; count: number }>;
  whereHeard?: Array<{ whereHeard: string; count: number }>;
  professions?: Array<{ jobTitle: string; count: number }>;
  activeUsers?: AdamUserItem[];
  archivedUsers?: AdamUserItem[];
  totals?: {
    users: number;
    activeUsers?: number;
    archivedUsers?: number;
    timezones: number;
    jobTitles: number;
  };
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

function toTimezoneValue(user: AdamUserItem): string {
  return user.timezone || user.lastKnownLocation?.timezone || 'Unknown';
}

function toAgeBand(age: number | null): string {
  if (age === null) return 'Unknown';
  if (age < 18) return '<18';
  if (age <= 24) return '18-24';
  if (age <= 34) return '25-34';
  if (age <= 44) return '35-44';
  if (age <= 54) return '45-54';
  return '55+';
}

function formatStatusLabel(isDeleted: boolean): string {
  return isDeleted ? 'Archived' : 'Active';
}

function escapeCsvValue(value: string): string {
  const normalized = value.replace(/"/g, '""');
  return /[",\n\r]/.test(normalized) ? `"${normalized}"` : normalized;
}

function toCsv(users: AdamUserItem[]): string {
  const headers = [
    'Name',
    'Email',
    'Profession',
    'Where Heard',
    'Country',
    'City',
    'Region',
    'Timezone',
    'Age',
    'Intent',
    'Use Case',
    'Status',
    'Interactions',
    'Last Seen',
    'Account Created',
  ];

  const rows = users.map((user) => [
    user.name || user.identifier || 'Anonymous',
    user.email || '',
    user.jobTitle || '',
    user.whereHeard || '',
    user.country || '',
    user.city || '',
    user.region || '',
    user.timezone || user.lastKnownLocation?.timezone || '',
    user.age?.toString() || '',
    user.intent || '',
    user.useCase || '',
    formatStatusLabel(user.isDeleted),
    user.interactionCount.toString(),
    user.lastSeenAt || '',
    user.accountCreatedAt || '',
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
}

// ===== Dashboard View Component =====
type DashboardViewProps = {
  data: AdamInsightsResponse | null;
  loading: boolean;
};

function DashboardView({ data, loading }: DashboardViewProps) {
  // Build a real 30-day cumulative signup trend from account creation timestamps.
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!data) return [];

    const days = 30;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days);

    const dailyNewUsers = new Map<string, number>();
    data.users.forEach((user) => {
      const sourceDate = user.accountCreatedAt || user.lastSeenAt;
      if (!sourceDate) {
        return;
      }

      const parsed = new Date(sourceDate);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }

      parsed.setHours(0, 0, 0, 0);
      const key = parsed.toISOString().slice(0, 10);
      dailyNewUsers.set(key, (dailyNewUsers.get(key) ?? 0) + 1);
    });

    let cumulativeUsers = 0;
    const result: ChartDataPoint[] = [];

    for (let offset = 0; offset <= days; offset += 1) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + offset);
      const key = current.toISOString().slice(0, 10);
      cumulativeUsers += dailyNewUsers.get(key) ?? 0;

      result.push({
        date: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: cumulativeUsers,
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
    return new Set(data.users.map((u) => toTimezoneValue(u)).filter((tz) => tz !== 'Unknown')).size;
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
              <TrendingUp className="h-4 w-4" />
              30-Day User Growth
            </CardTitle>
            <CardDescription>Cumulative signups over time</CardDescription>
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
                      <TableCell className="hidden lg:table-cell text-sm">{toTimezoneValue(user)}</TableCell>
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
  onRefreshUsers: () => Promise<void>;
};

function UserDirectoryView({ data, loading, onRefreshUsers }: UserDirectoryViewProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [jobTitleFilter, setJobTitleFilter] = useState<string>('all');
  const [timezoneFilter, setTimezoneFilter] = useState<string>('all');
  const [ageBandFilter, setAgeBandFilter] = useState<string>('all');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [whereHeardFilter, setWhereHeardFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'mostInteractions' | 'oldestAccount' | 'newestAccount'>('recent');

  const users = useMemo(() => data?.users ?? [], [data]);

  const visibleUsers = useMemo(() => {
    if (statusFilter === 'active') {
      return users.filter((user) => !user.isDeleted);
    }
    if (statusFilter === 'archived') {
      return users.filter((user) => user.isDeleted);
    }
    return users;
  }, [users, statusFilter]);

  const locationOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = user.country || 'Unknown';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }, [visibleUsers]);

  const jobOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = user.jobTitle || 'Unknown';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([jobTitle, count]) => ({ jobTitle, count }))
      .sort((a, b) => b.count - a.count || a.jobTitle.localeCompare(b.jobTitle));
  }, [visibleUsers]);

  const timezoneOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = toTimezoneValue(user);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([timezone, count]) => ({ timezone, count }))
      .sort((a, b) => b.count - a.count || a.timezone.localeCompare(b.timezone));
  }, [visibleUsers]);

  const ageBandOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = toAgeBand(user.age);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([ageBand, count]) => ({ ageBand, count }))
      .sort((a, b) => b.count - a.count || a.ageBand.localeCompare(b.ageBand));
  }, [visibleUsers]);

  const intentOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = user.intent || user.useCase || 'Unknown';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count || a.intent.localeCompare(b.intent));
  }, [visibleUsers]);

  const whereHeardOptions = useMemo(() => {
    const counts = new Map<string, number>();
    visibleUsers.forEach((user) => {
      const value = user.whereHeard || 'Unknown';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([whereHeard, count]) => ({ whereHeard, count }))
      .sort((a, b) => b.count - a.count || a.whereHeard.localeCompare(b.whereHeard));
  }, [visibleUsers]);

  const filteredUsers = useMemo(() => {
    let result = [...visibleUsers];

    // Search filter
    const query = searchQuery.toLowerCase();
    if (query) {
      result = result.filter(
        (user) =>
          user.email?.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query) ||
          user.identifier?.toLowerCase().includes(query) ||
          user.jobTitle?.toLowerCase().includes(query) ||
          user.intent?.toLowerCase().includes(query) ||
          user.useCase?.toLowerCase().includes(query)
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
      result = result.filter((user) => toTimezoneValue(user) === timezoneFilter);
    }

    // Age filter
    if (ageBandFilter !== 'all') {
      result = result.filter((user) => toAgeBand(user.age) === ageBandFilter);
    }

    // Intent filter
    if (intentFilter !== 'all') {
      result = result.filter((user) => (user.intent || user.useCase || 'Unknown') === intentFilter);
    }

    if (whereHeardFilter !== 'all') {
      result = result.filter((user) => (user.whereHeard || 'Unknown') === whereHeardFilter);
    }

    return result.sort((a, b) => {
      const aRecent = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const bRecent = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      const aCreated = a.accountCreatedAt ? new Date(a.accountCreatedAt).getTime() : 0;
      const bCreated = b.accountCreatedAt ? new Date(b.accountCreatedAt).getTime() : 0;

      switch (sortBy) {
        case 'mostInteractions':
          return b.interactionCount - a.interactionCount || bRecent - aRecent;
        case 'oldestAccount':
          return aCreated - bCreated || bRecent - aRecent;
        case 'newestAccount':
          return bCreated - aCreated || bRecent - aRecent;
        case 'recent':
        default:
          return bRecent - aRecent || bCreated - aCreated;
      }
    });
  }, [visibleUsers, searchQuery, locationFilter, jobTitleFilter, timezoneFilter, ageBandFilter, intentFilter, whereHeardFilter, sortBy]);

  const exportCsv = () => {
    if (filteredUsers.length === 0) {
      toast({
        title: 'No users to export',
        description: 'Apply a broader filter set to export users.',
      });
      return;
    }

    const blob = new Blob([toCsv(filteredUsers)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adam-users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
        description: 'User archived successfully',
      });

      if (expandedUserId === deleteUserId) {
        setExpandedUserId(null);
      }

      await onRefreshUsers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to archive user',
      });
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  const handleRestoreUser = async (uid: string) => {
    setIsRestoring(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in');
      }

      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/adam-insights?uid=${encodeURIComponent(uid)}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(typeof payload.error === 'string' ? payload.error : 'Failed to restore user');
      }

      toast({
        title: 'Success',
        description: 'User restored successfully',
      });

      await onRefreshUsers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to restore user',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4 rounded-2xl border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-5">
        <Input
          placeholder="Search by email, name, profession, intent, or use case..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-primary/20 bg-background/70"
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active users</SelectItem>
              <SelectItem value="archived">Archived users</SelectItem>
              <SelectItem value="all">All users</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locationOptions.map((loc) => (
                <SelectItem key={loc.country} value={loc.country}>
                  {getCountryFlag(loc.country)} {getCountryName(loc.country)} ({loc.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Job Title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Professions</SelectItem>
              {jobOptions.map((job) => (
                <SelectItem key={job.jobTitle} value={job.jobTitle}>
                  {job.jobTitle} ({job.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timezoneFilter} onValueChange={setTimezoneFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timezones</SelectItem>
              {timezoneOptions.map((tz) => (
                <SelectItem key={tz.timezone} value={tz.timezone}>
                  {tz.timezone} ({tz.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ageBandFilter} onValueChange={setAgeBandFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              {ageBandOptions.map((group) => (
                <SelectItem key={group.ageBand} value={group.ageBand}>
                  {group.ageBand} ({group.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={intentFilter} onValueChange={setIntentFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Intent / Use Case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intent</SelectItem>
              {intentOptions.map((entry) => (
                <SelectItem key={entry.intent} value={entry.intent}>
                  {entry.intent} ({entry.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={whereHeardFilter} onValueChange={setWhereHeardFilter}>
            <SelectTrigger className="border-primary/20 bg-background/80">
              <SelectValue placeholder="Where heard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {whereHeardOptions.map((entry) => (
                <SelectItem key={entry.whereHeard} value={entry.whereHeard}>
                  {entry.whereHeard} ({entry.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-primary/20 bg-primary/5">
              {statusFilter === 'active' ? 'Active only' : statusFilter === 'archived' ? 'Archived only' : 'All users'}
            </Badge>
            <Badge variant="outline" className="border-primary/20 bg-primary/5">
              Sort: {sortBy === 'recent' ? 'Most recent' : sortBy === 'mostInteractions' ? 'Most interactions' : sortBy === 'oldestAccount' ? 'Oldest account' : 'Newest account'}
            </Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="border-primary/20 bg-background/80 sm:w-[220px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="mostInteractions">Most interactions</SelectItem>
                <SelectItem value="oldestAccount">Oldest account</SelectItem>
                <SelectItem value="newestAccount">Newest account</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" className="gap-2 w-full sm:w-auto" onClick={exportCsv}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold text-foreground">{visibleUsers.length}</span> visible users
        </p>
      </div>

      {/* Users Table with Expandable Rows */}
      <Card className="border-primary/15 bg-gradient-to-b from-card via-card to-primary/5 shadow-[0_12px_40px_-24px_hsl(var(--primary)/0.5)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-xl border border-primary/15">
            <Table>
              <TableHeader className="bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/20">
                <TableRow>
                  <TableHead className="w-[40px]">Expand</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Timezone</TableHead>
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
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
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
                    <Fragment key={user.id}>
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
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <span>{user.name || user.identifier || 'Anonymous'}</span>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant={user.isDeleted ? 'secondary' : 'outline'} className={user.isDeleted ? 'bg-muted text-muted-foreground' : 'border-primary/30 bg-primary/5'}>
                                {formatStatusLabel(user.isDeleted)}
                              </Badge>
                              {user.whereHeard ? <span>Heard via {user.whereHeard}</span> : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{user.email || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {user.country ? (
                            <span>{getCountryFlag(user.country)} {getCountryName(user.country)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          <Badge variant="outline" className="border-primary/30 bg-primary/5">
                            {toTimezoneValue(user)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {user.isDeleted ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isRestoring}
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleRestoreUser(user.uid || user.id);
                              }}
                              className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restore
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteUserId(user.uid || user.id);
                              }}
                              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Archive className="h-4 w-4" />
                              Archive
                            </Button>
                          )}
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
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Where Heard</p>
                                  <p className="text-sm font-medium">{user.whereHeard || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Timezone</p>
                                  <p className="text-sm font-medium">{toTimezoneValue(user)}</p>
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
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Age</p>
                                  <p className="text-sm font-medium">{user.age ?? '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Intent</p>
                                  <p className="text-sm font-medium">{user.intent || user.useCase || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Last Seen</p>
                                  <p className="text-sm font-medium">{formatRelativeTime(user.lastSeenAt)}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Interactions</p>
                                  <p className="text-sm font-medium">{user.interactionCount}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Account Created</p>
                                  <p className="text-sm font-medium">{formatAbsoluteTime(user.accountCreatedAt)}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                                  <p className="text-sm font-medium">{formatStatusLabel(user.isDeleted)}</p>
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
                    </Fragment>
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
            <AlertDialogTitle>Archive User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this user? You can restore it later from the archived users filter.
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
            {isDeleting ? 'Archiving...' : 'Archive User'}
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

  const refreshUsers = useCallback(async () => {
    await fetchInsights(true);
  }, [fetchInsights]);

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
        <UserDirectoryView data={data} loading={loading} onRefreshUsers={refreshUsers} />
      )}
    </div>
  );
}
