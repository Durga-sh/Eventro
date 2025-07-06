"use client";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Header = () => {
  const { user, logoutUser } = useAuth();
  const isAdmin = user && user.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
                Eventro
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-4 lg:space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                >
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                    >
                      Dashboard
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/create-event"
                        className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                      >
                        Create Event
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/my-tickets"
                      className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                    >
                      My Tickets
                    </Link>
                  </li>
                  <li className="relative group">
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                      <span className="mr-2 max-w-20 lg:max-w-24 truncate">
                        {user.name || user.email}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transition-transform group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-44 lg:w-56 bg-slate-800 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/dashboard"
                        className="block px-4 lg:px-6 py-2 lg:py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 lg:px-6 py-2 lg:py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-md transition-colors text-sm lg:text-base"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md p-1.5"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors text-base"
              >
                Home
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors text-base"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/create-event"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors text-base"
                    >
                      Create Event
                    </Link>
                  )}
                  <Link
                    to="/my-tickets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors text-base"
                  >
                    My Tickets
                  </Link>
                  <div className="px-3 py-2 border-t border-slate-600 mt-2">
                    <p className="text-sm text-gray-400 mb-2 truncate">
                      {user.name || user.email}
                    </p>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-white transition-colors text-base"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors text-base"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors mx-3 mt-2 text-center text-base"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
