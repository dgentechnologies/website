'use client';

import { useEffect, useRef, useState } from 'react';

// Maximum timeout to wait before forcing scene load (in milliseconds)
const IDLE_CALLBACK_TIMEOUT_MS = 2000;

// Fallback timeout for browsers without requestIdleCallback
const FALLBACK_LOAD_DELAY_MS = 100;

interface Model3DViewerProps {
  src: string; // Path to the 3D model file (GLB/GLTF)
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
  cameraControls?: boolean;
  lazy?: boolean; // Enable lazy loading with Intersection Observer
  cameraOrbit?: string; // Camera position in format "theta phi radius" (e.g., "90deg 75deg 105%")
}

export default function Model3DViewer({
  src,
  alt = '3D Model',
  onLoad,
  onError,
  className,
  style,
  autoRotate = true,
  cameraControls = true,
  lazy = false,
  cameraOrbit,
}: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modelNotFound, setModelNotFound] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy) return;
    
    // Feature detection for IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Load model-viewer script
  useEffect(() => {
    if (!isVisible || typeof window === 'undefined') return;

    // Check if script is already loaded
    if (window.customElements && window.customElements.get('model-viewer')) {
      setScriptsLoaded(true);
      return;
    }

    let cleanup: (() => void) | undefined;

    const loadScript = () => {
      const script = document.createElement('script');
      script.type = 'module';
      // Match the CDN version with installed package version (4.1.0)
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
      script.async = true;
      
      script.onload = () => {
        setScriptsLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load model-viewer script');
        setError(true);
        setIsLoading(false);
        onError?.();
      };

      document.head.appendChild(script);

      cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    // Use requestIdleCallback for non-critical loading
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(loadScript, { timeout: IDLE_CALLBACK_TIMEOUT_MS });
    } else {
      setTimeout(loadScript, FALLBACK_LOAD_DELAY_MS);
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isVisible, onError]);

  // Handle model-viewer events
  useEffect(() => {
    if (!scriptsLoaded || !modelViewerRef.current) return;

    const modelViewer = modelViewerRef.current;

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = (e: ErrorEvent | Event) => {
      console.warn('Model file not found or failed to load:', src);
      // Set modelNotFound state for graceful degradation
      // The component will still render but show loading state
      setIsLoading(false);
      setModelNotFound(true);
      onError?.();
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [scriptsLoaded, onLoad, onError, src]);

  if (error) {
    return null;
  }

  if (!isVisible) {
    return (
      <div 
        ref={containerRef}
        className={className} 
        style={style}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={className} 
      style={{ 
        ...style,
        minWidth: '100%',
        minHeight: '100%',
        width: style?.width || '100%',
        height: style?.height || '100vh',
        position: 'relative'
      }}
    >
      {(isLoading || modelNotFound) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="text-center space-y-4">
            {!modelNotFound ? (
              <>
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-sm text-muted-foreground animate-pulse">
                  Loading 3D Model...
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>3D Model placeholder</p>
                <p className="text-xs mt-2 opacity-60">Add your GLB file to /public/models/</p>
              </div>
            )}
          </div>
        </div>
      )}
      {scriptsLoaded && (
        <model-viewer
          ref={modelViewerRef}
          src={src}
          alt={alt}
          {...(autoRotate && { 'auto-rotate': '' })}
          {...(cameraControls && { 'camera-controls': '' })}
          {...(cameraOrbit && { 'camera-orbit': cameraOrbit })}
          shadow-intensity="1"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
      )}
    </div>
  );
}

// TypeScript declarations for model-viewer custom element
interface ModelViewerElement extends HTMLElement {
  src: string;
  alt?: string;
  'auto-rotate'?: string;
  'camera-controls'?: string;
  'shadow-intensity'?: string;
  'camera-orbit'?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': Partial<ModelViewerElement> & {
        ref?: React.Ref<any>;
        style?: React.CSSProperties;
      };
    }
  }
}
