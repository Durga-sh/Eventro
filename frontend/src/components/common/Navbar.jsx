"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Enhanced Navbar component with Header functionality
export function Navbar() {
  const { user, logoutUser } = useAuth();
  const isAdmin = user && user.role === "admin";
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 50;
    setScrolled(isScrolled);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinkClass = (itemName, extraClasses = "") => {
    const isCurrentItemHovered = hoveredNavItem === itemName;
    const isAnotherItemHovered =
      hoveredNavItem !== null && !isCurrentItemHovered;
    const colorClass = isCurrentItemHovered
      ? "text-white"
      : isAnotherItemHovered
      ? "text-gray-500"
      : "text-gray-200";

    return `text-sm font-medium transition-all duration-200 ${colorClass} ${extraClasses}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                EVENTRO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Always show Events link */}
            <div className="relative group">
              <Link
                to="/events"
                className={navLinkClass("events", "hover:text-white")}
              >
                Events
              </Link>
            </div>

            {/* Public navigation items (when not logged in) */}
            {!user && (
              <>
                {["Features", "Solutions", "Resources", "Pricing"].map(
                  (item) => (
                    <div
                      key={item}
                      className="relative group"
                      onMouseEnter={() => setHoveredNavItem(item.toLowerCase())}
                      onMouseLeave={() => setHoveredNavItem(null)}
                    >
                      <a
                        href="#"
                        className={navLinkClass(
                          item.toLowerCase(),
                          "flex items-center hover:text-white"
                        )}
                      >
                        {item}
                        {item !== "Pricing" && (
                          <svg
                            className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </a>

                      {/* Dropdown for non-Pricing items */}
                      {item !== "Pricing" && (
                        <div className="absolute left-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl py-3 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                          {item === "Features" && (
                            <>
                              <DropdownItem href="#" text="Event Creation" />
                              <DropdownItem href="#" text="Ticket Booking" />
                              <DropdownItem href="#" text="QR Code System" />
                              <DropdownItem
                                href="#"
                                text="Payment Integration"
                              />
                            </>
                          )}
                          {item === "Solutions" && (
                            <>
                              <DropdownItem href="#" text="Corporate Events" />
                              <DropdownItem href="#" text="Conferences" />
                              <DropdownItem href="#" text="Workshops" />
                            </>
                          )}
                          {item === "Resources" && (
                            <>
                              <DropdownItem href="#" text="Documentation" />
                              <DropdownItem href="#" text="API Reference" />
                              <DropdownItem href="#" text="Support" />
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {/* Authenticated user navigation items */}
            {user && (
              <>
                <div className="relative group">
                  <Link
                    to="/"
                    className={navLinkClass("dashboard", "hover:text-white")}
                  >
                    Dashboard
                  </Link>
                </div>

                {isAdmin && (
                  <div className="relative group">
                    <Link
                      to="/create-event"
                      className={navLinkClass(
                        "create-event",
                        "hover:text-white"
                      )}
                    >
                      Create Event
                    </Link>
                  </div>
                )}

                <div className="relative group">
                  <Link
                    to="/my-tickets"
                    className={navLinkClass("my-tickets", "hover:text-white")}
                  >
                    My Tickets
                  </Link>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center text-gray-200 hover:text-white transition-all duration-200 text-sm font-medium">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-24 truncate">
                      {user.name || user.email}
                    </span>
                    <svg
                      className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-3 w-56 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl py-3 border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right side buttons for non-authenticated users */}
          {!user && (
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Contact Sales
              </a>
              <Link
                to="/login"
                className="hidden sm:block text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-full text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile menu button for authenticated users */}
          {user && (
            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {/* Always show Events */}
            <Link
              to="/events"
              className="block text-gray-200 hover:text-white text-base font-medium py-2 transition-colors"
              onClick={toggleMobileMenu}
            >
              Events
            </Link>

            {/* Public navigation for non-authenticated users */}
            {!user && (
              <>
                {["Features", "Solutions", "Resources", "Pricing"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-gray-200 hover:text-white text-base font-medium py-2 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      {item}
                    </a>
                  )
                )}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <a
                    href="#"
                    className="block text-gray-200 hover:text-white text-base font-medium transition-colors"
                  >
                    Contact Sales
                  </a>
                  <Link
                    to="/login"
                    className="block text-gray-200 hover:text-white text-base font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}

            {/* Authenticated user navigation */}
            {user && (
              <>
                <Link
                  to="/"
                  className="block text-gray-200 hover:text-white text-base font-medium py-2 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    to="/create-event"
                    className="block text-gray-200 hover:text-white text-base font-medium py-2 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Create Event
                  </Link>
                )}

                <Link
                  to="/my-tickets"
                  className="block text-gray-200 hover:text-white text-base font-medium py-2 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  My Tickets
                </Link>

                {/* User section in mobile */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium truncate max-w-40">
                        {user.name || user.email}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {user.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block text-gray-200 hover:text-white text-base font-medium transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    My Account
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-200 hover:text-white text-base font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper component for dropdown items
function DropdownItem({ href, text }) {
  return (
    <a
      href={href}
      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-150 rounded-lg mx-2"
    >
      {text}
    </a>
  );
}
