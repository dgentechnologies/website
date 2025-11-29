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

    // Create page view record
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
        [`countries.${country}`]: FieldValue.increment(1),
        [`pages.${page}`]: FieldValue.increment(1),
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
        countries: { [country]: 1 },
        pages: { [page]: 1 },
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

    // Get the last 30 days of analytics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    // Fetch daily analytics
    const analyticsSnapshot = await adminFirestore
      .collection('siteAnalytics')
      .where('date', '>=', thirtyDaysAgoStr)
      .orderBy('date', 'desc')
      .get();

    // Aggregate data
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

      // Aggregate pages
      if (data.pages) {
        Object.entries(data.pages).forEach(([page, count]) => {
          pageCounts[page] = (pageCounts[page] || 0) + (count as number);
        });
      }
    });

    // Calculate unique visitors from sessions set
    const uniqueVisitors = allSessions.size;

    // Get top countries
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top pages
    const topPages = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get recent visitors (last 10)
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
