import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to EventHub</h1>
        <p>Discover, create, and attend amazing events</p>

        <div className="cta-buttons">
          {user ? (
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
              <Link to="/register" className="btn-secondary">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose EventHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Discover Events</h3>
            <p>Find events that match your interests and preferences</p>
          </div>
          <div className="feature-card">
            <h3>Create & Manage</h3>
            <p>Easily create and manage your own events</p>
          </div>
          <div className="feature-card">
            <h3>Secure Tickets</h3>
            <p>Purchase and store tickets securely</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
