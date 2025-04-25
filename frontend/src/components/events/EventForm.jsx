import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/events";

const EventForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startDate: "",
    startTime: "", // For time input
    endDate: "",
    endTime: "", // For time input
    tags: "", // Will be split into an array
    status: "draft", // Default status
    ticketTypes: [
      {
        name: "General Admission",
        description: "Standard ticket",
        price: 0,
        quantity: 100,
      },
    ],
  });

  // Handle changes to the main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Handle changes to ticket types
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets[index][field] =
      field === "price" || field === "quantity" ? Number(value) : value;

    setEventData({
      ...eventData,
      ticketTypes: updatedTickets,
    });
  };

  // Add a new ticket type
  const addTicketType = () => {
    setEventData({
      ...eventData,
      ticketTypes: [
        ...eventData.ticketTypes,
        {
          name: "",
          description: "",
          price: 0,
          quantity: 0,
        },
      ],
    });
  };

  // Remove a ticket type
  const removeTicketType = (index) => {
    const updatedTickets = [...eventData.ticketTypes];
    updatedTickets.splice(index, 1);
    setEventData({
      ...eventData,
      ticketTypes: updatedTickets,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Format dates by combining date and time inputs
      const formattedData = {
        ...eventData,
        startDate: `${eventData.startDate}T${eventData.startTime}:00`,
        endDate: `${eventData.endDate}T${eventData.endTime}:00`,
        tags: eventData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      // Remove the time fields as they're now part of the dates
      delete formattedData.startTime;
      delete formattedData.endTime;

      const response = await createEvent(formattedData);
      console.log("Event created successfully:", response);

      // Redirect to the event detail page or events list
      navigate(`/events/${response.event._id}`);
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={eventData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="date-time-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={eventData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={eventData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={eventData.tags}
            onChange={handleChange}
            placeholder="music, concert, jazz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={eventData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="ticket-types-section">
          <h3>Ticket Types</h3>

          {eventData.ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket-type-card">
              <h4>Ticket Type {index + 1}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`ticketName${index}`}>Name</label>
                  <input
                    type="text"
                    id={`ticketName${index}`}
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`ticketPrice${index}`}>Price ($)</label>
                  <input
                    type="number"
                    id={`ticketPrice${index}`}
                    value={ticket.price}
                    onChange={(e) =>
                      handleTicketChange(index, "price", e.target.value)
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`ticketDescription${index}`}>Description</label>
                <input
                  type="text"
                  id={`ticketDescription${index}`}
                  value={ticket.description}
                  onChange={(e) =>
                    handleTicketChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor={`ticketQuantity${index}`}>Quantity</label>
                <input
                  type="number"
                  id={`ticketQuantity${index}`}
                  value={ticket.quantity}
                  onChange={(e) =>
                    handleTicketChange(index, "quantity", e.target.value)
                  }
                  required
                  min="1"
                />
              </div>

              {eventData.ticketTypes.length > 1 && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => removeTicketType(index)}
                >
                  Remove Ticket Type
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn-secondary"
            onClick={addTicketType}
          >
            Add Ticket Type
          </button>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
