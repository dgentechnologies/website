import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/server';

// Helper to verify Firebase auth token from request
async function verifyAuthToken(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.substring(7);
    const auth = getAuth(adminApp);
    await auth.verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

// Sanitize a string for use as a Firestore field key
// Replace problematic characters with safe alternatives
function sanitizeFieldKey(key: string): string {
  // Replace slashes, dots, and other problematic chars with underscores
  // Also handle empty strings
  if (!key || key === '/') return '_home_';
  return key
    .replace(/\//g, '_')  // Replace forward slashes
    .replace(/\./g, '_')  // Replace dots (Firestore field path separator)
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}

// POST /api/analytics/track - Track a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, sessionId } = body;

    if (!page) {
      return NextResponse.json({ error: 'Page is required' }, { status: 400 });
    }

    // Get country from headers (set by CDN/hosting provider) or fallback
    const country = request.headers.get('x-vercel-ip-country') || 
                    request.headers.get('cf-ipcountry') || 
                    'Unknown';
    const city = request.headers.get('x-vercel-ip-city') || 
                 request.headers.get('cf-ipcity') || 
                 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Create page view record (store original page path)
    const pageViewData = {
      page,
      country,
      city,
      userAgent,
      referrer: referrer || '',
      sessionId: sessionId || '',
      timestamp: FieldValue.serverTimestamp(),
    };

    // Add to pageViews collection
    await adminFirestore.collection('pageViews').add(pageViewData);

    // Sanitize keys for use in Firestore field paths
    const sanitizedCountry = sanitizeFieldKey(country);
    const sanitizedPage = sanitizeFieldKey(page);

    // Update daily analytics summary
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const analyticsRef = adminFirestore.collection('siteAnalytics').doc(today);
    
    const analyticsDoc = await analyticsRef.get();
    
    if (analyticsDoc.exists) {
      const existingData = analyticsDoc.data();
      const existingSessions = existingData?.sessions || [];
      const isNewSession = sessionId && !existingSessions.includes(sessionId);
      
      // Update existing document
      const updateData: Record<string, unknown> = {
        totalViews: FieldValue.increment(1),
        [`countries.${sanitizedCountry}`]: FieldValue.increment(1),
        [`pages.${sanitizedPage}`]: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      };
      
      // Track unique visitors by session
      if (isNewSession) {
        updateData.uniqueVisitors = FieldValue.increment(1);
        updateData.sessions = FieldValue.arrayUnion(sessionId);
      }
      
      await analyticsRef.update(updateData);
    } else {
      // Create new document for today
      await analyticsRef.set({
        date: today,
        totalViews: 1,
        uniqueVisitors: sessionId ? 1 : 0,
        sessions: sessionId ? [sessionId] : [],
        countries: { [sanitizedCountry]: 1 },
        pages: { [sanitizedPage]: 1 },
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}

// Helper function to convert sanitized page key back to readable path
function unsanitizePageKey(key: string): string {
  if (key === '_home_') return '/';
  // Convert underscores back to slashes for page paths
  // Note: This is a best-effort conversion since we lose some information
  return '/' + key.replace(/^_/, '').replace(/_$/, '').replace(/_/g, '/');
}

// GET /api/analytics/track - Get analytics summary (for admin dashboard)
// Requires authentication via Firebase ID token
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifyAuthToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide a valid authentication token.' },
        { status: 401 }
      );
    }

    // Get date range from query params (default to 30 days)
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get('range') || '30';
    
    // Validate against allowed DateRange values: '7', '30', '365'
    const validRanges = ['7', '30', '365'];
    const daysToFetch = validRanges.includes(rangeParam) ? parseInt(rangeParam, 10) : 30;

    // Calculate the start date based on the range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToFetch);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch daily analytics from siteAnalytics collection
    const analyticsSnapshot = await adminFirestore
      .collection('siteAnalytics')
      .where('date', '>=', startDateStr)
      .orderBy('date', 'desc')
      .get();

    // Aggregate data from siteAnalytics
    let totalPageViews = 0;
    const allSessions = new Set<string>();
    const countryCounts: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    const dailyViews: { date: string; views: number }[] = [];

    analyticsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalPageViews += data.totalViews || 0;
      
      // Track unique sessions across all days
      if (data.sessions && Array.isArray(data.sessions)) {
        data.sessions.forEach((session: string) => allSessions.add(session));
      }
      
      dailyViews.push({
        date: data.date,
        views: data.totalViews || 0,
      });

      // Aggregate countries
      if (data.countries) {
        Object.entries(data.countries).forEach(([country, count]) => {
          countryCounts[country] = (countryCounts[country] || 0) + (count as number);
        });
      }

      // Aggregate pages (with sanitized keys)
      if (data.pages) {
        Object.entries(data.pages).forEach(([page, count]) => {
          pageCounts[page] = (pageCounts[page] || 0) + (count as number);
        });
      }
    });

    // Calculate unique visitors from sessions set
    const uniqueVisitors = allSessions.size;

    // Get top countries (convert sanitized keys back to readable format)
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ 
        country: country === 'Unknown' ? 'Unknown' : country, 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top pages (convert sanitized keys back to readable paths)
    const topPages = Object.entries(pageCounts)
      .map(([page, count]) => ({ 
        page: unsanitizePageKey(page), 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get recent visitors (last 10) from pageViews collection
    const recentVisitorsSnapshot = await adminFirestore
      .collection('pageViews')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const recentVisitors = recentVisitorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort daily views by date ascending for chart
    dailyViews.sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalPageViews,
      uniqueVisitors,
      topCountries,
      topPages,
      dailyViews,
      recentVisitors,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
