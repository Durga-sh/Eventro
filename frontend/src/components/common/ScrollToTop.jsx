import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId = null;
    
    const toggleVisibility = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 300);
        rafId = null;
      });
    };

    const handleScroll = () => {
      toggleVisibility();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const handleClick = () => {
    smoothScrollToTop(1000);
  };

  return (
    <button
      className={`fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 hover:from-purple-500 hover:to-violet-500 ${
        isVisible 
          ? 'translate-y-0 opacity-100 pointer-events-auto' 
          : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTop;