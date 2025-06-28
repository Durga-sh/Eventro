"use client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.role === "admin";

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
                Eventro
              </h1>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors text-lg"
                >
                  Home
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white transition-colors text-lg"
                    >
                      Dashboard
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/create-event"
                        className="text-gray-300 hover:text-white transition-colors text-lg"
                      >
                        Create Event
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/my-tickets"
                      className="text-gray-300 hover:text-white transition-colors text-lg"
                    >
                      My Tickets
                    </Link>
                  </li>
                  <li className="relative group">
                    <button className="flex items-center text-gray-300 hover:text-white transition-colors text-lg">
                      <span className="mr-2">{user.name || user.email}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transition-transform group-hover:rotate-180"
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
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/dashboard"
                        className="block px-6 py-3 text-base text-gray-300 hover:bg-slate-700 hover:text-white"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-6 py-3 text-base text-gray-300 hover:bg-slate-700 hover:text-white"
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
                      className="text-gray-300 hover:text-white transition-colors text-lg"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors text-lg"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
