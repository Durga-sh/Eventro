import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserTickets } from "../api/tickets";
import TicketList from "../components/tickets/TicketList";

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null
  );

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true);
        const ticketsData = await getUserTickets();
        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load your tickets");
        setLoading(false);
      }
    };

    fetchUserTickets();

    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="my-tickets-page">
      <div className="page-header">
        <h1>My Tickets</h1>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {loading ? (
        <div className="loading">Loading your tickets...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
};

export default MyTicketsPage;
