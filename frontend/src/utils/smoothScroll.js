// Enhanced smooth scroll with custom easing
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

export const smoothScrollTo = (targetId, offset = 80, duration = 1200) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + (distance * easedProgress));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const smoothScrollToTop = (duration = 1000) => {
  const startPosition = window.pageYOffset;
  let startTime = null;

  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition * (1 - easedProgress));
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const enableSmoothScroll = () => {
  // Enhanced smooth scroll setup
  document.documentElement.style.scrollBehavior = 'smooth';
  document.body.style.scrollBehavior = 'smooth';
  
  // Add momentum scrolling for iOS
  document.documentElement.style.webkitOverflowScrolling = 'touch';
  document.body.style.webkitOverflowScrolling = 'touch';
  
  // Optimize scroll performance
  let ticking = false;
  
  const optimizeScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', optimizeScroll, { passive: true });
};

// Animation classes for scroll effects
export const fadeInUpAnimation = {
  initial: { opacity: 0, transform: 'translateY(60px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
};

export const fadeInLeftAnimation = {
  initial: { opacity: 0, transform: 'translateX(-60px)' },
  animate: { opacity: 1, transform: 'translateX(0px)' },
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
};

export const fadeInRightAnimation = {
  initial: { opacity: 0, transform: 'translateX(60px)' },
  animate: { opacity: 1, transform: 'translateX(0px)' },
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
};

export const scaleInAnimation = {
  initial: { opacity: 0, transform: 'scale(0.8)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
};