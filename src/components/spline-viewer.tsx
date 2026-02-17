'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application } from '@splinetool/runtime';

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
      document.head.removeChild(link);
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
      requestIdleCallback(loadScene, { timeout: 2000 });
    } else {
      setTimeout(loadScene, 0);
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-foreground/30">Loading 3D Scene...</div>
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
