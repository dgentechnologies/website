'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Generate a simple session ID for tracking unique visitors
// Use localStorage for persistence across browser sessions
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check localStorage first for persistent session tracking
  let sessionId = localStorage.getItem('analytics_session_id');
  
  // If no session exists or it's expired (older than 30 minutes), create a new one
  const sessionTimestamp = localStorage.getItem('analytics_session_timestamp');
  const thirtyMinutes = 30 * 60 * 1000;
  const isExpired = sessionTimestamp && (Date.now() - parseInt(sessionTimestamp, 10)) > thirtyMinutes;
  
  if (!sessionId || isExpired) {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    localStorage.setItem('analytics_session_id', sessionId);
    
    // Clear the tracked pages when session expires to allow re-tracking
    trackedPages.clear();
  }
  
  // Always update the timestamp to extend the session
  localStorage.setItem('analytics_session_timestamp', Date.now().toString());
  
  return sessionId;
};

// Track which pages have been tracked in this browser session to avoid duplicates
// Uses sessionStorage as a persistence check for page reload scenarios
const trackedPages = new Set<string>();

// Initialize tracked pages from sessionStorage on module load
if (typeof window !== 'undefined') {
  try {
    const stored = sessionStorage.getItem('tracked_pages');
    if (stored) {
      JSON.parse(stored).forEach((page: string) => trackedPages.add(page));
    }
  } catch {
    // Ignore parse errors
  }
}

// Save tracked pages to sessionStorage
const saveTrackedPages = () => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('tracked_pages', JSON.stringify([...trackedPages]));
    } catch {
      // Ignore storage errors
    }
  }
};

export function usePageTracking() {
  const pathname = usePathname();
  const isTrackingRef = useRef(false);

  const trackPageView = useCallback(async (page: string) => {
    // Prevent duplicate tracking for the same page in this browser session
    if (trackedPages.has(page)) return;
    
    // Prevent concurrent tracking calls
    if (isTrackingRef.current) return;
    isTrackingRef.current = true;
    
    try {
      const sessionId = getSessionId();
      
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          referrer: document.referrer || '',
          sessionId,
        }),
      });
      
      if (response.ok) {
        // Only mark as tracked if the request succeeded
        trackedPages.add(page);
        saveTrackedPages();
      }
    } catch (error) {
      // Silently fail - analytics should not break the user experience
      console.debug('Failed to track page view:', error);
    } finally {
      isTrackingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    // Small delay to ensure page has loaded
    const timeoutId = setTimeout(() => {
      trackPageView(pathname);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, trackPageView]);
}
