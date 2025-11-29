'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Generate a simple session ID for tracking unique visitors
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export function usePageTracking() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking the same page twice in quick succession
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || '',
            sessionId,
          }),
        });
      } catch (error) {
        // Silently fail - analytics should not break the user experience
        console.debug('Failed to track page view:', error);
      }
    };

    // Small delay to ensure page has loaded
    const timeoutId = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
}
