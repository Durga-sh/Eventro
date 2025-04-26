import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserEvents } from "../api/events";
import EventCard from "../components/events/EventCard";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    ticketsCount: 0,
    eventsCreated: 0,
  });

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const events = await getUserEvents();
        setUserEvents(events);
        setUserStats((prevStats) => ({
          ...prevStats,
          eventsCreated: events.length,
        }));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load your events");
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

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

      {/* My Events Section */}
      <div className="my-events-section">
        <div className="section-header">
          <h2>My Events</h2>
          <Link to="/my-events" className="view-all-link">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading your events...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : userEvents.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any events yet.</p>
            <Link to="/create-event" className="btn-primary">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {userEvents.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
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
