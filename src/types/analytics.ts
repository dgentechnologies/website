
export interface PageView {
  id?: string;
  page: string;
  timestamp: Date | { seconds: number; nanoseconds: number };
  country?: string;
  city?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
}

export interface SiteAnalytics {
  id?: string;
  date: string; // YYYY-MM-DD format
  totalViews: number;
  uniqueVisitors: number;
  countries: Record<string, number>; // country code -> count
  pages: Record<string, number>; // page path -> count
  updatedAt: Date | { seconds: number; nanoseconds: number };
}

export type DateRange = '7' | '30' | '365';

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  topCountries: { country: string; count: number }[];
  topPages: { page: string; count: number }[];
  dailyViews: { date: string; views: number }[];
  recentVisitors: PageView[];
  range?: DateRange;
}
