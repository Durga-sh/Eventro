import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById } from "../api/tickets";
import { formatDate , formatTime } from "../utils/dateFormatter";
import { formatPrice } from "../utils/priceFormatter";
import TicketQRCode from "../components/tickets/TicketQRcode";

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const ticketData = await getTicketById(id);
        setTicket(ticketData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError("Failed to load ticket details");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading ticket details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!ticket) {
    return <div className="not-found-container">Ticket not found</div>;
  }

  const isTicketUsed = ticket.isCheckedIn;
  const isEventPast = new Date(ticket.event.startDate) < new Date();

  return (
    <div className="ticket-detail-page">
      <div className="container">
        <Link to="/my-tickets" className="back-link">
          &larr; Back to My Tickets
        </Link>

        <div className="ticket-detail-card">
          <div className="ticket-status-banner">
            {isTicketUsed ? (
              <div className="status-badge used">Ticket Used</div>
            ) : isEventPast ? (
              <div className="status-badge expired">Expired</div>
            ) : (
              <div className="status-badge valid">Valid</div>
            )}
          </div>

          <div className="ticket-header">
            <h1>{ticket.event.title}</h1>
            <p className="event-date">
              {formatDate(ticket.event.startDate)} at{" "}
              {formatDate(ticket.event.startDate)}
            </p>
            <p className="event-location">{ticket.event.location}</p>
          </div>

          <div className="ticket-body">
            <div className="ticket-info">
              <div className="info-section">
                <h3>Ticket Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Ticket Type</span>
                    <span className="value">{ticket.ticketType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Quantity</span>
                    <span className="value">{ticket.quantity}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Unit Price</span>
                    <span className="value">
                      {formatPrice(ticket.unitPrice)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total</span>
                    <span className="value">
                      {formatPrice(ticket.totalAmount)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Purchase Date</span>
                    <span className="value">
                      {formatDate(ticket.purchasedAt)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Ticket Number</span>
                    <span className="value">{ticket.ticketNumber}</span>
                  </div>
                </div>
              </div>

              <div className="info-section qr-section">
                <h3>Entry Pass</h3>
                <p className="qr-instructions">
                  Present this QR code at the event entrance
                </p>
                <TicketQRCode qrData={ticket.qrCode} />
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <p className="small-print">
              This ticket is subject to the event terms and conditions.
              Non-refundable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
