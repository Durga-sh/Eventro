"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading checkout information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Event
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Complete Your Booking
        </h1>

        {paymentSuccess && (
          <div className="bg-green-900/30 border border-green-500 text-green-200 p-6 rounded-lg text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Booking Successful!</h2>
            <p>
              Your tickets have been reserved. Redirecting to your tickets...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {!paymentSuccess && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Order Summary
              </h2>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-gray-300 text-sm mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>

              <h3 className="text-lg font-medium text-white mb-3">Tickets</h3>
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-white font-medium">
                      {ticketData.ticketType.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      Quantity: {quantity}
                    </p>
                  </div>
                  <p className="text-white">{formatPrice(unitPrice)}</p>
                </div>

                <div className="border-t border-slate-600 pt-4 flex justify-between items-center">
                  <p className="text-white font-medium">Total</p>
                  <p className="text-lg font-semibold text-white">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Contact Information
              </h2>
              <form className="space-y-4" onSubmit={handleCreateTicket}>
                <div className="form-group">
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="block text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors mt-6 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Book Tickets (${formatPrice(totalPrice)})`
                  )}
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
