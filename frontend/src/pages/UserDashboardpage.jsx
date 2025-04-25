import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [userStats] = useState({
    ticketsCount: 0,
    eventsCreated: 0,
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-welcome">
          <p>Welcome back, {user?.name || "User"}!</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>My Tickets</h3>
          <p className="stat-value">{userStats.ticketsCount}</p>
          <Link to="/my-tickets" className="stat-link">
            View all tickets
          </Link>
        </div>
        <div className="stat-card">
          <h3>Events Created</h3>
          <p className="stat-value">{userStats.eventsCreated}</p>
          <Link to="/my-events" className="stat-link">
            Manage events
          </Link>
        </div>
        <div className="stat-card">
          <h3>Create Event</h3>
          <div className="stat-action">
            <Link to="/create-event" className="btn-primary">
              + New Event
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="action-card">
            <h3>Browse Events</h3>
            <p>Discover upcoming events in your area</p>
            <Link to="/events" className="btn-secondary">
              Browse
            </Link>
          </div>
          <div className="action-card">
            <h3>My Profile</h3>
            <p>Update your personal information</p>
            <Link to="/profile" className="btn-secondary">
              View Profile
            </Link>
          </div>
          <div className="action-card">
            <h3>Event Reports</h3>
            <p>See analytics for your events</p>
            <Link to="/reports" className="btn-secondary">
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📣</div>
            <div className="activity-content">
              <p>Welcome to the Event Management Platform!</p>
              <span className="activity-timestamp">Just now</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👋</div>
            <div className="activity-content">
              <p>Get started by creating your first event</p>
              <span className="activity-timestamp">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
