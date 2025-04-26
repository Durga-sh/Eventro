import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getEventById } from "../api/events";
import { processPayment } from "../api/payments";
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

const handleSubmitPayment = async (e) => {
  e.preventDefault();

  if (!user) {
    navigate("/login");
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    // Create payment payload
    const paymentPayload = {
      eventId,
      ticketTypeId,
      quantity,
      paymentMethod: "credit_card", // Simplified for demo
      // In a real app, you would include payment token or details
    };

    console.log("Sending payment request:", paymentPayload);

    const paymentResult = await processPayment(paymentPayload);

    console.log("Payment successful:", paymentResult);

    setPaymentSuccess(true);
    // Navigate to success page or ticket page after short delay
    setTimeout(() => {
      navigate("/my-tickets", {
        state: {
          successMessage: "Your ticket has been purchased successfully!",
        },
      });
    }, 2000);
  } catch (err) {
    console.error("Payment error:", err);
    setError(err.message || "Payment failed. Please try again.");
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
        <h1>Complete Your Purchase</h1>

        {paymentSuccess && (
          <div className="success-message">
            <h2>Payment Successful!</h2>
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

            <div className="payment-form-container">
              <h2>Payment Details</h2>
              <form className="payment-form" onSubmit={handleSubmitPayment}>
                {/* In a real app, you would include payment form fields here */}
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" required />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay ${formatPrice(totalPrice)}`}
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
