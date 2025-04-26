import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const EventCard = ({ event }) => {
  // Get the lowest price ticket
  const lowestPrice =
    event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((ticket) => ticket.price))
      : 0;

  // Calculate available tickets
  const totalAvailable = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.available,
    0
  );

  return (
    <div className="event-card">
      <div className="event-card-image">
        {event.image ? (
          <img src={event.image} alt={event.title} />
        ) : (
          <div className="placeholder-image">
            <span>{event.title.charAt(0)}</span>
          </div>
        )}
        <div className="event-status">
          <span className={`status-badge ${event.status}`}>{event.status}</span>
        </div>
      </div>

      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-date">{formatDate(event.startDate)}</p>
        <p className="event-location">{event.location}</p>

        <div className="event-card-footer">
          <div className="event-price">
            {lowestPrice > 0 ? (
              <span>From {formatPrice(lowestPrice)}</span>
            ) : (
              <span>Free</span>
            )}
          </div>
          <div className="event-available">
            <span>{totalAvailable} tickets available</span>
          </div>
        </div>

        <div className="event-card-actions">
          <Link
            to={`/edit-event/${event._id}`}
            className="btn btn-sm btn-outline"
          >
            Edit
          </Link>
          <Link to={`/events/${event._id}`} className="btn btn-sm btn-primary">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
