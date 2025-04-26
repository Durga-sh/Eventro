import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/events";
import { useAuth } from "../../hooks/useAuth";
import { formatDateRange } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);

        // Set first ticket type as default selected
        if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
          setSelectedTicket(eventData.ticketTypes[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setQuantity(1); // Reset quantity when changing ticket type
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (selectedTicket?.available || 0)) {
      setQuantity(value);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: `/events/${id}` } });
      return;
    }

    // Here you would typically navigate to checkout or add to cart
    // For now we'll just navigate to a hypothetical checkout page
    navigate("/checkout", {
      state: {
        eventId: id,
        ticketTypeId: selectedTicket._id,
        quantity: quantity,
        unitPrice: selectedTicket.price,
        totalPrice: selectedTicket.price * quantity,
      },
    });
  };

  if (loading) {
    return <div className="loading-container">Loading event details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!event) {
    return <div className="not-found-container">Event not found</div>;
  }

  const isOrganizer =
    user && event.organizer && user.id === event.organizer._id;
  const isEventPast = new Date(event.endDate) < new Date();
  const isEventCancelled = event.status === "cancelled";
  const canPurchaseTickets =
    !isEventPast && !isEventCancelled && event.status === "published";

  return (
    <div className="event-details-page">
      <div className="event-details-header">
        <div className="container">
          <Link to="/" className="back-link">
            &larr; Back to Events
          </Link>

          <div className="event-status-banner">
            {isEventPast && (
              <div className="status-badge past">Event has ended</div>
            )}
            {isEventCancelled && (
              <div className="status-badge cancelled">Event cancelled</div>
            )}
            {event.status === "draft" && (
              <div className="status-badge draft">Draft</div>
            )}
          </div>

          {isOrganizer && (
            <div className="organizer-actions">
              <Link to={`/edit-event/${event._id}`} className="btn btn-outline">
                Edit Event
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="event-details-content">
        <div className="container">
          <div className="event-details-grid">
            <div className="event-details-main">
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="event-image-placeholder">
                    <span>{event.title.charAt(0)}</span>
                  </div>
                )}
              </div>

              <h1 className="event-title">{event.title}</h1>

              <div className="event-meta">
                <div className="meta-item">
                  <i className="icon icon-calendar"></i>
                  <span>{formatDateRange(event.startDate, event.endDate)}</span>
                </div>
                <div className="meta-item">
                  <i className="icon icon-location"></i>
                  <span>{event.location}</span>
                </div>
                <div className="meta-item">
                  <i className="icon icon-organizer"></i>
                  <span>
                    Organized by{" "}
                    {event.organizer ? event.organizer.name : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="event-tags">
                {event.tags &&
                  event.tags.map((tag, index) => (
                    <span key={index} className="event-tag">
                      {tag}
                    </span>
                  ))}
              </div>

              <div className="event-description">
                <h2>About this event</h2>
                <div className="description-content">
                  {event.description.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="event-details-sidebar">
              <div className="ticket-selection-card">
                <h2>Tickets</h2>

                {event.ticketTypes.length === 0 ? (
                  <div className="no-tickets-message">
                    No tickets available for this event.
                  </div>
                ) : (
                  <>
                    <div className="ticket-types">
                      {event.ticketTypes.map((ticket) => (
                        <div
                          key={ticket._id}
                          className={`ticket-type ${
                            selectedTicket?._id === ticket._id ? "selected" : ""
                          } ${ticket.available === 0 ? "sold-out" : ""}`}
                          onClick={() =>
                            ticket.available > 0 && handleTicketSelect(ticket)
                          }
                        >
                          <div className="ticket-info">
                            <h3 className="ticket-name">{ticket.name}</h3>
                            <p className="ticket-price">
                              {formatPrice(ticket.price)}
                            </p>
                            {ticket.description && (
                              <p className="ticket-description">
                                {ticket.description}
                              </p>
                            )}
                          </div>
                          <div className="ticket-availability">
                            {ticket.available > 0 ? (
                              <span className="available">
                                {ticket.available} available
                              </span>
                            ) : (
                              <span className="sold-out">Sold out</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedTicket && (
                      <div className="ticket-purchase-form">
                        <div className="quantity-selector">
                          <label htmlFor="quantity">Quantity:</label>
                          <div className="quantity-control">
                            <button
                              type="button"
                              className="quantity-btn minus"
                              disabled={quantity <= 1}
                              onClick={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                              }
                            >
                              -
                            </button>
                            <input
                              id="quantity"
                              type="number"
                              min="1"
                              max={selectedTicket.available}
                              value={quantity}
                              onChange={handleQuantityChange}
                            />
                            <button
                              type="button"
                              className="quantity-btn plus"
                              disabled={quantity >= selectedTicket.available}
                              onClick={() =>
                                quantity < selectedTicket.available &&
                                setQuantity(quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="purchase-summary">
                          <div className="summary-item">
                            <span>Price per ticket:</span>
                            <span>{formatPrice(selectedTicket.price)}</span>
                          </div>
                          <div className="summary-item">
                            <span>Quantity:</span>
                            <span>{quantity}</span>
                          </div>
                          <div className="summary-total">
                            <span>Total:</span>
                            <span>
                              {formatPrice(selectedTicket.price * quantity)}
                            </span>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary btn-full"
                          disabled={
                            !canPurchaseTickets ||
                            selectedTicket.available === 0
                          }
                          onClick={handleCheckout}
                        >
                          {canPurchaseTickets
                            ? "Get Tickets"
                            : "Tickets Unavailable"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="event-location-card">
                <h2>Location</h2>
                <p className="location-address">{event.location}</p>
                {/* You could add a map component here */}
              </div>

              <div className="share-event-card">
                <h2>Share Event</h2>
                <div className="share-buttons">
                  <button className="share-btn facebook">Facebook</button>
                  <button className="share-btn twitter">Twitter</button>
                  <button className="share-btn email">Email</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
