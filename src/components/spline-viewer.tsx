'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application } from '@splinetool/runtime';

// Maximum timeout to wait before forcing scene load (in milliseconds)
// This prevents indefinite deferral if the browser stays busy
const IDLE_CALLBACK_TIMEOUT_MS = 2000;

// Fallback timeout for browsers without requestIdleCallback
// Small delay to approximate idle callback behavior
const FALLBACK_LOAD_DELAY_MS = 100;

interface SplineViewerProps {
  scene: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean; // Enable lazy loading with Intersection Observer
  preload?: boolean; // Enable preloading of the scene
}

export default function SplineViewer({
  scene,
  onLoad,
  onError,
  className,
  style,
  lazy = false,
  preload = true
}: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy); // If lazy, start as not visible

  // Wait for container to have valid dimensions before initializing
  const checkDimensions = useCallback(() => {
    if (!containerRef.current) return false;
    const { offsetWidth, offsetHeight } = containerRef.current;
    return offsetWidth > 0 && offsetHeight > 0;
  }, []);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Preload scene resource hint
  useEffect(() => {
    if (!preload || typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = scene;
    link.as = 'fetch';
    document.head.appendChild(link);
    
    return () => {
      // Safely remove the link element if it's still in the document
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [scene, preload]);

  // Initialize dimensions check
  useEffect(() => {
    const checkReady = () => {
      if (checkDimensions()) {
        setIsReady(true);
      } else {
        // Retry after a short delay if dimensions aren't ready
        requestAnimationFrame(checkReady);
      }
    };
    
    // Use requestAnimationFrame to ensure the DOM has rendered
    requestAnimationFrame(checkReady);
  }, [checkDimensions]);

  // Load Spline scene once container is ready and visible
  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current || !isVisible) return;

    // Set explicit canvas dimensions to prevent zero-size WebGL error
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Get the actual pixel dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Set canvas dimensions explicitly
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const app = new Application(canvas);
    appRef.current = app;
    
    // Use requestIdleCallback for non-critical loading, fallback to setTimeout
    const loadScene = () => {
      app.load(scene)
        .then(() => {
          setIsLoading(false);
          onLoad?.();
        })
        .catch((err) => {
          console.error('Spline load error:', err);
          setError(true);
          setIsLoading(false);
          onError?.();
        });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadScene, { timeout: IDLE_CALLBACK_TIMEOUT_MS });
    } else {
      // Fallback with a small delay to approximate idle behavior
      setTimeout(loadScene, FALLBACK_LOAD_DELAY_MS);
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const newWidth = containerRef.current.offsetWidth;
      const newHeight = containerRef.current.offsetHeight;
      canvasRef.current.width = newWidth * window.devicePixelRatio;
      canvasRef.current.height = newHeight * window.devicePixelRatio;
      canvasRef.current.style.width = `${newWidth}px`;
      canvasRef.current.style.height = `${newHeight}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [isReady, scene, onLoad, onError, isVisible]);

  if (error) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={className} 
      style={{ 
        ...style,
        // Ensure container has explicit dimensions
        minWidth: '100%',
        minHeight: '100%',
        width: style?.width || '100%',
        height: style?.height || '100vh'
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-sm text-muted-foreground animate-pulse">
              Loading 3D Scene...
            </div>
          </div>
        </div>
      )}
      {isReady && (
        <canvas 
          ref={canvasRef} 
          style={{ 
            display: 'block',
            width: '100%', 
            height: '100%',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out'
          }} 
        />
      )}
    </div>
  );
}
