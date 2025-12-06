'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application } from '@splinetool/runtime';

interface SplineViewerProps {
  scene: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplineViewer({
  scene,
  onLoad,
  onError,
  className,
  style
}: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for container to have valid dimensions before initializing
  const checkDimensions = useCallback(() => {
    if (!containerRef.current) return false;
    const { offsetWidth, offsetHeight } = containerRef.current;
    return offsetWidth > 0 && offsetHeight > 0;
  }, []);

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

  // Load Spline scene once container is ready
  useEffect(() => {
    if (!isReady || !canvasRef.current || !containerRef.current) return;

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
  }, [isReady, scene, onLoad, onError]);

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
