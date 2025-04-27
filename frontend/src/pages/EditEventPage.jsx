import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../api/events";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startDate: "",
    endDate: "",
    ticketTypes: [],
    tags: [],
    status: "draft",
  });

  // Format date for input field using native JavaScript
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);

        // Format dates for input fields
        const formattedEventData = {
          ...eventData,
          startDate: formatDateForInput(eventData.startDate),
          endDate: formatDateForInput(eventData.endDate),
          tags: eventData.tags || [],
        };

        setFormData(formattedEventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData({
      ...formData,
      tags: tagsArray,
    });
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]:
        field === "price" || field === "quantity" ? Number(value) : value,
    };

    setFormData({
      ...formData,
      ticketTypes: updatedTickets,
    });
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: "", description: "", price: 0, quantity: 0, available: 0 },
      ],
    });
  };

  const removeTicketType = (index) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets.splice(index, 1);
    setFormData({
      ...formData,
      ticketTypes: updatedTickets,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Prepare data for submission
      const eventData = {
        ...formData,
        // Ensure dates are in ISO format for the API
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      await updateEvent(id, eventData);
      setSubmitting(false);
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message || "Failed to update event");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading event data...</div>;
  }

  if (error && !formData.title) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="edit-event-page">
      <div className="container">
        <h1>Edit Event</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Date & Location</h2>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Ticket Types</h2>

            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="ticket-type-container">
                <h3>Ticket #{index + 1}</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`ticket-name-${index}`}>Name</label>
                    <input
                      type="text"
                      id={`ticket-name-${index}`}
                      value={ticket.name}
                      onChange={(e) =>
                        handleTicketChange(index, "name", e.target.value)
                      }
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`ticket-price-${index}`}>Price ($)</label>
                    <input
                      type="number"
                      id={`ticket-price-${index}`}
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      min="0"
                      step="0.01"
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`ticket-quantity-${index}`}>
                      Total Quantity
                    </label>
                    <input
                      type="number"
                      id={`ticket-quantity-${index}`}
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleTicketChange(index, "quantity", e.target.value)
                      }
                      min="0"
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`ticket-available-${index}`}>
                      Available
                    </label>
                    <input
                      type="number"
                      id={`ticket-available-${index}`}
                      value={ticket.available}
                      onChange={(e) =>
                        handleTicketChange(index, "available", e.target.value)
                      }
                      min="0"
                      max={ticket.quantity}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`ticket-description-${index}`}>
                    Description
                  </label>
                  <textarea
                    id={`ticket-description-${index}`}
                    value={ticket.description || ""}
                    onChange={(e) =>
                      handleTicketChange(index, "description", e.target.value)
                    }
                    className="form-control"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  className="btn btn-danger btn-sm"
                >
                  Remove Ticket Type
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicketType}
              className="btn btn-secondary"
            >
              Add Ticket Type
            </button>
          </div>

          <div className="form-section">
            <h2>Tags & Status</h2>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
