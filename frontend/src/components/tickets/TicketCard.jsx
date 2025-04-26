import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const TicketCard = ({ ticket }) => {
  const isTicketUsed = ticket.isCheckedIn;
  const isEventPast = new Date(ticket.event.startDate) < new Date();

  return (
    <div
      className={`ticket-card ${isTicketUsed ? "used" : ""} ${
        isEventPast && !isTicketUsed ? "expired" : ""
      }`}
    >
      <div className="ticket-header">
        <div className="event-image">
          {ticket.event.image ? (
            <img src={ticket.event.image} alt={ticket.event.title} />
          ) : (
            <div className="placeholder-image">
              <span>{ticket.event.title.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="ticket-status">
          {isTicketUsed ? (
            <span className="status used">Used</span>
          ) : isEventPast ? (
            <span className="status expired">Expired</span>
          ) : (
            <span className="status valid">Valid</span>
          )}
        </div>
      </div>

      <div className="ticket-content">
        <h3 className="event-title">{ticket.event.title}</h3>

        <div className="ticket-details">
          <div className="detail-item">
            <span className="label">Date:</span>
            <span className="value">{formatDate(ticket.event.startDate)}</span>
          </div>

          <div className="detail-item">
            <span className="label">Location:</span>
            <span className="value">{ticket.event.location}</span>
          </div>

          <div className="detail-item">
            <span className="label">Ticket Type:</span>
            <span className="value">{ticket.ticketType}</span>
          </div>

          <div className="detail-item">
            <span className="label">Quantity:</span>
            <span className="value">{ticket.quantity}</span>
          </div>

          <div className="detail-item">
            <span className="label">Ticket #:</span>
            <span className="value">{ticket.ticketNumber}</span>
          </div>
        </div>
      </div>

      <div className="ticket-footer">
        <span className="ticket-price">{formatPrice(ticket.totalAmount)}</span>

        <Link to={`/tickets/${ticket._id}`} className="btn btn-outline">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
