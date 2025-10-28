import { useEffect, useRef, useState, useCallback } from 'react';

export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef(null);
  const rafRef = useRef(null);

  const {
    threshold = 0.15,
    rootMargin = '-50px 0px',
    triggerOnce = true,
    enableParallax = false,
    parallaxSpeed = 0.3
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  const updateScrollY = useCallback(() => {
    setScrollY(window.scrollY);
    rafRef.current = null;
  }, []);

  useEffect(() => {
    if (!enableParallax) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enableParallax, updateScrollY]);

  const parallaxTransform = enableParallax 
    ? `translate3d(0, ${scrollY * parallaxSpeed}px, 0)` 
    : 'none';

  return {
    elementRef,
    isVisible,
    scrollY,
    parallaxTransform,
  };
};

export const useInViewAnimation = (threshold = 0.1, rootMargin = '0px 0px -100px 0px') => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Don't disconnect observer so animations can retrigger if needed
        }
      },
      { 
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, isInView];
};