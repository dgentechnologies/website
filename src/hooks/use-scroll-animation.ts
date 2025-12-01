'use client';

import { useEffect, useState, useRef, RefObject, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * A hook that provides mouse position for interactive tilt/hover effects.
 * Returns normalized coordinates (-1 to 1) relative to element center.
 */
export function useMousePosition(elementRef: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0, isHovering: false });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setPosition({ x, y, isHovering: true });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0, isHovering: false });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);

  return position;
}

/**
 * A hook that provides a floating animation effect based on scroll position.
 * Creates a subtle up-down floating motion.
 */
export function useFloatingAnimation(speed: number = 1): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrame: number;
    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const floatOffset = Math.sin(elapsed * speed) * 10;
      setOffset(floatOffset);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [speed]);

  return offset;
}

/**
 * A hook that provides scale animation based on scroll position within viewport.
 * Elements scale up slightly as they come into view.
 */
export function useScrollScale(elementRef: RefObject<HTMLElement | null>, minScale: number = 0.95, maxScale: number = 1): number {
  const [scale, setScale] = useState(minScale);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setScale(maxScale);
      return;
    }

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is in view
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      
      if (elementBottom < 0 || elementTop > windowHeight) {
        setScale(minScale);
        return;
      }
      
      // Calculate visibility percentage
      const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
      const visibility = visibleHeight / rect.height;
      
      const newScale = minScale + (maxScale - minScale) * Math.min(visibility, 1);
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef, minScale, maxScale]);

  return scale;
}

/**
 * A hook that provides horizontal parallax movement based on scroll.
 * Useful for creating depth effects with multiple layers.
 */
export function useHorizontalParallax(speed: number = 0.1): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const adjustedSpeed = isMobile ? speed * 0.3 : speed;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setOffset(scrollY * adjustedSpeed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
}

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * A hook that tracks when an element becomes visible in the viewport
 * for triggering scroll-based animations.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;
  const ref = useRef<T | null>(null) as RefObject<T>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      // Store element in closure to ensure we unobserve the correct element
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

/**
 * A hook that provides the current scroll progress of the page (0 to 1).
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(Math.max(scrollProgress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
}

/**
 * A hook that provides parallax scroll offset for an element.
 * Automatically reduces or disables parallax on mobile devices for better performance.
 */
export function useParallax(speed: number = 0.5): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion - disable parallax
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Check if mobile device once at initialization - reduce parallax effect for better performance
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const adjustedSpeed = isMobile ? speed * 0.3 : speed;

    const handleScroll = () => {
      setOffset(window.scrollY * adjustedSpeed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
}
