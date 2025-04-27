import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EventHub</h3>
            <p>
              Your platform for creating, managing, and discovering amazing
              events.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/create-event">Create Event</Link>
              </li>
              <li>
                <Link to="/my-tickets">My Tickets</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@eventhub.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
