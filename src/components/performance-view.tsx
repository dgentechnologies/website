'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart2, Globe, Eye, Users, FileText, TrendingUp, MapPin } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
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
import { AnalyticsSummary, DateRange } from '@/types/analytics';
import { auth } from '@/firebase/client';

// Country code to name mapping
const countryNames: Record<string, string> = {
  'Unknown': 'Unknown',
  'US': 'United States',
  'IN': 'India',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'JP': 'Japan',
  'BR': 'Brazil',
  'CN': 'China',
  'RU': 'Russia',
  'SG': 'Singapore',
  'AE': 'UAE',
  'NL': 'Netherlands',
  'IT': 'Italy',
  'ES': 'Spain',
  'SE': 'Sweden',
  'CH': 'Switzerland',
  'KR': 'South Korea',
};

const getCountryName = (code: string): string => {
  return countryNames[code] || code;
};

const getCountryFlag = (code: string): string => {
  try {
    if (!code || code === 'Unknown' || code.length !== 2) return '🌍';
    const upperCode = code.toUpperCase();
    // Validate that we have valid ASCII letters
    if (!/^[A-Z]{2}$/.test(upperCode)) return '🌍';
    const codePoints = upperCode
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
};

const dateRangeLabels: Record<DateRange, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '365': 'Last 1 year',
};

export default function PerformanceView() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('30');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Get the current user's ID token for authentication
        const user = auth.currentUser;
        if (!user) {
          setError('Not authenticated. Please log in.');
          setLoading(false);
          return;
        }
        
        const token = await user.getIdToken();
        const response = await fetch(`/api/analytics/track?range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Performance</h1>
            <p className="text-foreground/70 mt-1">Website analytics and visitor insights.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Performance</h1>
            <p className="text-foreground/70 mt-1">Website analytics and visitor insights.</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure Firebase is properly configured and analytics tracking is enabled.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasData = analytics && analytics.totalPageViews > 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Performance</h1>
          <p className="text-foreground/70 mt-1">Website analytics and visitor insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="365">Last 1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalPageViews || 0}</div>
            <p className="text-xs text-muted-foreground">{dateRangeLabels[dateRange]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uniqueVisitors || 0}</div>
            <p className="text-xs text-muted-foreground">{dateRangeLabels[dateRange]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.topCountries?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Unique countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.topPages?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Pages visited</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Page Views
            </CardTitle>
            <CardDescription>Website traffic over the {dateRangeLabels[dateRange].toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData && analytics.dailyViews.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={analytics.dailyViews}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available yet</p>
                  <p className="text-sm">Page views will appear here as visitors browse your site.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Countries Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Visitors by Country
            </CardTitle>
            <CardDescription>Geographic distribution of visitors</CardDescription>
          </CardHeader>
          <CardContent>
            {hasData && analytics.topCountries.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={analytics.topCountries.slice(0, 5).map((c) => ({
                    ...c,
                    name: getCountryName(c.country),
                  }))}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No geographic data yet</p>
                  <p className="text-sm">Country data will appear as visitors browse your site.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited pages on your website</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData && analytics.topPages.length > 0 ? (
                  analytics.topPages.slice(0, 10).map((page, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{page.page || '/'}</TableCell>
                      <TableCell className="text-right">{page.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No page data available yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* All Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              All Countries
            </CardTitle>
            <CardDescription>Complete list of visitor countries</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Visitors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasData && analytics.topCountries.length > 0 ? (
                  analytics.topCountries.map((country, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <span className="mr-2">{getCountryFlag(country.country)}</span>
                        {getCountryName(country.country)}
                      </TableCell>
                      <TableCell className="text-right">{country.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      No country data available yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
