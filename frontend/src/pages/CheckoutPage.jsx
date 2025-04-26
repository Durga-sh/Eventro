import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getEventById } from "../api/events";
import { formatPrice } from "../utils/priceFormatter";
import { formatDate } from "../utils/dateFormatter";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [event, setEvent] = useState(null);

  // Get data from location state (passed from EventDetails)
  const { eventId, ticketTypeId, quantity, unitPrice, totalPrice } =
    location.state || {};

  useEffect(() => {
    // Redirect if no ticket data in state
    if (!eventId || !ticketTypeId) {
      navigate("/");
      return;
    }

    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        // Find selected ticket type
        const selectedTicket = eventData.ticketTypes.find(
          (ticket) => ticket._id === ticketTypeId
        );

        if (!selectedTicket) {
          throw new Error("Selected ticket type not found");
        }

        setTicketData({
          event: eventData,
          ticketType: selectedTicket,
          quantity,
          unitPrice,
          totalPrice,
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load checkout information");
      }
    };

    fetchEventDetails();
  }, [eventId, ticketTypeId, quantity, unitPrice, totalPrice, navigate]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create ticket payload
      const ticketPayload = {
        eventId,
        ticketTypeId,
        quantity,
      };

      console.log("Creating ticket:", ticketPayload);

      // Send request to create ticket directly
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/tickets/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(ticketPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ticket");
      }

      const ticketResult = await response.json();
      console.log("Ticket created successfully:", ticketResult);

      setPaymentSuccess(true);
      // Navigate to success page or ticket page after short delay
      setTimeout(() => {
        navigate("/my-tickets", {
          state: {
            successMessage: "Your ticket has been created successfully!",
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Ticket creation error:", err);
      setError(err.message || "Ticket creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticketData || !event) {
    return (
      <div className="loading-container">Loading checkout information...</div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Complete Your Booking</h1>

        {paymentSuccess && (
          <div className="success-message">
            <h2>Booking Successful!</h2>
            <p>
              Your tickets have been reserved. Redirecting to your tickets...
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!paymentSuccess && (
          <div className="checkout-content">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p className="event-date">{formatDate(event.startDate)}</p>
                <p className="event-location">{event.location}</p>
              </div>

              <div className="ticket-summary">
                <h3>Tickets</h3>
                <div className="ticket-item">
                  <div className="ticket-info">
                    <p className="ticket-type">{ticketData.ticketType.name}</p>
                    <p className="ticket-quantity">x {quantity}</p>
                  </div>
                  <p className="ticket-price">{formatPrice(unitPrice)}</p>
                </div>

                <div className="order-total">
                  <p className="total-label">Total</p>
                  <p className="total-price">{formatPrice(totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="booking-form-container">
              <h2>Contact Information</h2>
              <form className="booking-form" onSubmit={handleCreateTicket}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={user?.name || ""}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={user?.email || ""}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : `Book Tickets (${formatPrice(totalPrice)})`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
