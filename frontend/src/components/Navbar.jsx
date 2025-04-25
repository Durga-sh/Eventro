import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              EventHub
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/events" className="mx-3 hover:text-gray-300">
              Events
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="mx-3 hover:text-gray-300">
                  Dashboard
                </Link>
                <Link to="/profile" className="mx-3 hover:text-gray-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mx-3 hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mx-3 hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="mx-3 hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
