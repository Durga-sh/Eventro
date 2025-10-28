import { useEffect } from 'react';

export const useSmoothMomentumScroll = () => {
  useEffect(() => {
    let currentScrollY = 0;
    let targetScrollY = 0;
    let ease = 0.1;
    let rafId = null;

    const updateScroll = () => {
      currentScrollY += (targetScrollY - currentScrollY) * ease;
      
      if (Math.abs(targetScrollY - currentScrollY) < 0.1) {
        currentScrollY = targetScrollY;
      }

      if (currentScrollY !== targetScrollY) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
      
      if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    // Only apply momentum scrolling on desktop for better performance
    const isDesktop = window.innerWidth > 768;
    
    if (isDesktop) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (isDesktop) {
        window.removeEventListener('scroll', handleScroll);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
};

export default useSmoothMomentumScroll;