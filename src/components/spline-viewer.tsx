'use client';

import { useEffect, useRef, useState } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current);
    
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

    return () => {
      app.dispose();
    };
  }, [scene, onLoad, onError]);

  if (error) {
    return null;
  }

  return (
    <div className={className} style={style}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-foreground/30">Loading 3D Scene...</div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }} 
      />
    </div>
  );
}
