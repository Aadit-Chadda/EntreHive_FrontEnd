'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'slide-bottom';
  delay?: number;
  threshold?: number;
}

export default function LazyLoad({ 
  children, 
  className = '', 
  animationType = 'fade-up',
  delay = 0,
  threshold = 0.1 
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsInView(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay, threshold]);

  const getAnimationClass = () => {
    switch (animationType) {
      case 'fade-left':
        return 'lazy-load-left';
      case 'fade-right':
        return 'lazy-load-right';
      case 'scale':
        return 'lazy-load-scale';
      case 'slide-bottom':
        return 'lazy-load';
      default:
        return 'lazy-load';
    }
  };

  return (
    <div 
      ref={elementRef}
      className={`${getAnimationClass()} ${isInView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
