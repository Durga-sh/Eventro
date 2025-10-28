"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Optimized background without heavy 3D rendering
function HeroOptimizedBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden gpu-accelerated">
      {/* Static gradient background for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      
      {/* Animated elements with enhanced motion */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-light animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-light animate-pulse animation-delay-300"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-medium animate-float animation-delay-500"></div>
      
      {/* Additional floating orbs */}
      <div className="absolute top-3/4 left-1/6 w-32 h-32 bg-cyan-500/10 rounded-full blur-light animate-bounce animation-delay-200"></div>
      <div className="absolute top-1/6 right-1/6 w-40 h-40 bg-yellow-500/10 rounded-full blur-light animate-float animation-delay-400"></div>
      
      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
}

function HeroContent() {
  const navigate = useNavigate();

  const handleStartBooking = () => {
    navigate("/events");
  };

  return (
    <div className="relative z-20 text-left text-white pt-16 sm:pt-20 md:pt-24 px-4 max-w-6xl ml-4 sm:ml-8 lg:ml-16">
      <div className="ml-2 sm:ml-6 lg:ml-12">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight animate-slide-in-scale">
          Transform your <br className="hidden sm:block" />
          events into <br className="hidden sm:block" />
          <span className="text-purple-400 animate-pulse">
            unforgettable experiences.
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl leading-relaxed animate-fade-in-up animation-delay-200">
          Complete event management solution with seamless ticket booking, QR
          code generation, and secure Razorpay payment integration. Create,
          manage, and scale your events effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up animation-delay-400">
          <button
            onClick={handleStartBooking}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 w-full sm:w-auto shadow-xl hover:shadow-2xl transform hover:scale-105 hover:shadow-purple-500/25 animate-pulse-glow"
          >
            Start Booking Events
            <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="group border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 w-full sm:w-auto backdrop-blur-sm hover:bg-white/10 transform hover:scale-105 hover:rotate-1"
          >
            Get Started Free
            <span className="inline-block ml-2 transition-transform group-hover:rotate-12">✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Scroll Indicator Component
function ScrollIndicator() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
      <button
        onClick={scrollToContent}
        className="flex flex-col items-center text-white/70 hover:text-white transition-all duration-300 group"
        aria-label="Scroll to content"
      >
        <span className="text-sm mb-2 opacity-80 group-hover:opacity-100">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full relative overflow-hidden group-hover:border-white/60">
          <div className="w-1 h-3 bg-white/60 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2 animate-bounce group-hover:bg-white"></div>
        </div>
      </button>
    </div>
  );
}

// Hero Section without Navbar
export const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Optimized background without heavy 3D rendering */}
      <div className="absolute inset-0">
        <HeroOptimizedBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <HeroContent />
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </div>
  );
};
