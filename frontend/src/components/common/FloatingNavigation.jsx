import React, { useState, useEffect } from 'react';
import { Home, Users, Zap, Rocket } from 'lucide-react';
import { smoothScrollTo } from '../../utils/smoothScroll';

const FloatingNavigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', icon: Home, label: 'Home' },
    { id: 'stats', icon: Users, label: 'Stats' },
    { id: 'features', icon: Zap, label: 'Features' },
    { id: 'cta', icon: Rocket, label: 'Get Started' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'stats', 'features', 'cta'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    smoothScrollTo(sectionId, 80, 1200);
  };

  return (
    <nav className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-4">
      <div className="bg-black/20 backdrop-blur-md rounded-full p-2 border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative group p-3 rounded-full transition-all duration-300 mb-1 last:mb-0 ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {item.label}
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FloatingNavigation;