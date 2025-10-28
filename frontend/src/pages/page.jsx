"use client";

import { HeroSection } from "../components/ui/hero";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FeaturesSection } from "../components/ui/features-section";
import { memo, useEffect } from "react";
import { Logos3 } from "../components/ui/logos3";
import { useInViewAnimation } from "../hooks/useScrollAnimation";
import { enableSmoothScroll } from "../utils/smoothScroll";
import ScrollToTop from "../components/common/ScrollToTop";
import FloatingNavigation from "../components/common/FloatingNavigation";
import ParticleBackground from "../components/common/ParticleBackground";

const StatsSection = memo(() => {
  const [ref, isInView] = useInViewAnimation(0.2);
  
  const stats = [
    { number: "10K+", label: "Events Created" },
    { number: "500K+", label: "Tickets Sold" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section 
      ref={ref}
      className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden min-h-[400px]"
    >
      {/* Optimized background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5"></div>
      <div 
        className={`absolute top-0 left-1/4 w-72 h-72 bg-purple-500/8 rounded-full blur-light opacity-50 transition-all duration-700 gpu-accelerated ${
          isInView ? 'translate-x-0 opacity-50' : '-translate-x-20 opacity-0'
        }`}
      ></div>
      <div 
        className={`absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/8 rounded-full blur-light opacity-50 transition-all duration-700 delay-200 gpu-accelerated ${
          isInView ? 'translate-x-0 opacity-50' : 'translate-x-20 opacity-0'
        }`}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 justify-items-center">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`text-center group transition-all duration-800 ${
                isInView 
                  ? 'opacity-100 transform translate-y-0 animate-fade-in-up' 
                  : 'opacity-0 transform translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="relative">
                <div 
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 will-change-transform transition-transform duration-300 group-hover:scale-110 relative z-10 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #a855f7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: '#a855f7', // Fallback color
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.number}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-100"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-violet-400 rounded-full animate-float animation-delay-200"></div>
                  <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce animation-delay-300"></div>
                </div>
              </div>
              <div className="text-lg md:text-xl text-gray-400 font-medium transition-all duration-300 group-hover:text-gray-200 group-hover:scale-105">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";



const CTASection = memo(() => {
  const navigate = useNavigate();
  const [ref, isInView] = useInViewAnimation(0.3);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-medium transition-all duration-700 gpu-accelerated ${
          isInView ? 'opacity-60 scale-100' : 'opacity-0 scale-90'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-medium transition-all duration-700 delay-200 gpu-accelerated ${
          isInView ? 'opacity-60 scale-100' : 'opacity-0 scale-90'
        }`}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-800 gpu-accelerated animate-slide-in-scale ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Ready to create <span className="animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">amazing events</span>?
        </h2>
        <p className={`text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto transition-all duration-600 delay-100 gpu-accelerated ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Join thousands of event organizers who trust Eventro to power their
          events. Start your free trial today and see the difference.
        </p>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-600 delay-200 gpu-accelerated ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Button
            onClick={() => navigate("/register")}
            className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl will-change-transform transition-all duration-300 hover:scale-105 hover:shadow-2xl gpu-accelerated animate-pulse-glow group"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-12" />
          </Button>
          <Button
            onClick={() => navigate("/events")}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm will-change-transform transform transition-all duration-300 hover:scale-105 hover:rotate-1 group relative overflow-hidden"
          >
            <span className="relative z-10">Browse Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="ml-2 inline-block transition-transform group-hover:rotate-45">🎪</span>
          </Button>
        </div>

        <div className={`mt-12 text-gray-300 transition-all duration-800 delay-600 ${
          isInView ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <p className="text-sm mb-4">
            Trusted by 10,000+ event organizers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 opacity-70">
            <div className="text-xs">✓ Free 14-day trial</div>
            <div className="text-xs">✓ No setup fees</div>
            <div className="text-xs">✓ Cancel anytime</div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default function EventroLandingPage() {
  // Enable enhanced smooth scrolling when component mounts
  useEffect(() => {
    enableSmoothScroll();
    
    // Add optimized scroll progress bar
    const scrollProgressBar = document.createElement('div');
    scrollProgressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 z-50 transition-all duration-150 ease-out';
    scrollProgressBar.id = 'scroll-progress';
    scrollProgressBar.style.transformOrigin = '0 0';
    scrollProgressBar.style.transform = 'scaleX(0)';
    document.body.appendChild(scrollProgressBar);

    let rafId = null;
    const updateScrollProgress = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollProgress = Math.min(
          window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),
          1
        );
        scrollProgressBar.style.transform = `scaleX(${scrollProgress})`;
        rafId = null;
      });
    };

    // Throttled scroll handler for better performance
    let scrollTimeout = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        updateScrollProgress();
        scrollTimeout = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        document.body.removeChild(progressBar);
      }
    };
  }, []);

    return (
    <main className="bg-black overflow-x-hidden relative">
      {/* Particle background for enhanced visual appeal */}
      <ParticleBackground density={25} color="rgba(139, 92, 246, 0.4)" />
      
      {/* Enhanced CSS for smooth animations and performance */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        section {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .will-change-transform {
          will-change: transform;
        }

        /* Enhanced performance optimizations */
        * {
          box-sizing: border-box;
        }
        
        /* GPU acceleration for all animated elements */
        section, .animate, [class*="transition-"], [class*="transform-"] {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }

        /* Ensure custom classes are defined */
        .blur-light {
          filter: blur(8px);
        }

        .blur-medium {
          filter: blur(12px);
        }

        .gpu-accelerated {
          transform: translate3d(0, 0, 0);
          will-change: transform;
          backface-visibility: hidden;
        }

        /* Stats number styling with fallback */
        .stats-number {
          background: linear-gradient(135deg, #a855f7, #8b5cf6, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        /* Fallback for browsers that don't support gradient text */
        @supports not (background-clip: text) {
          .stats-number {
            color: #a855f7;
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
        }

        /* Ensure gradient animation works */
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Hero title gradient text fallback */
        .hero-gradient-text {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #a855f7; /* Fallback */
          background-size: 200% 200%;
        }

        /* Custom delay classes for staggered animations */
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        .delay-500 { transition-delay: 500ms; }
        .delay-600 { transition-delay: 600ms; }

        /* Optimized transitions with hardware acceleration */
        button, a, .interactive {
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                     opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        /* Performance optimized hover effects */
        .hover\\:scale-102:hover {
          transform: translate3d(0, 0, 0) scale(1.02);
        }
        
        /* Better scroll snap behavior */
        main {
          scroll-snap-type: y proximity;
        }
        
        section {
          scroll-snap-align: start;
          scroll-snap-stop: normal;
        }

        /* Enhance focus and hover states */
        button:focus-visible, a:focus-visible {
          outline: 2px solid rgba(139, 92, 246, 0.5);
          outline-offset: 2px;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #a855f7);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #9333ea);
        }
      `}</style>

      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="stats">
        <StatsSection />
      </div>
      
      <div id="logos">
        <Logos3 />
      </div>
      
      <div id="features">
        <FeaturesSection />
      </div>
      
      <div id="cta">
    
      </div>
      
      {/* Navigation and utility components */}
      <FloatingNavigation />
      <ScrollToTop />
    </main>
  );
}
