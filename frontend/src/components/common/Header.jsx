import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>EventHub</h1>
            </Link>
          </div>

          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/create-event">Create Event</Link>
                  </li>
                  <li>
                    <Link to="/my-tickets">My Tickets</Link>
                  </li>
                  <li className="dropdown">
                    <span className="user-menu">
                      {user.name || user.email}
                      <i className="icon-chevron-down"></i>
                    </span>
                    <div className="dropdown-content">
                      <Link to="/dashboard">My Account</Link>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
