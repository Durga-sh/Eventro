import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/events";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading event data...</div>;
  }

  if (!event) {
    return <div className="not-found-container">Event not found</div>;
  }

  return (
    <div className="edit-event-page">
      <div className="container">
        <h1>Edit Event: {event.title}</h1>
        <p>
          This is a placeholder for the edit event form. The event editing
          functionality would be implemented here.
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/events/${id}`)}
        >
          Back to Event Details
        </button>
      </div>
    </div>
  );
};

export default EditEventPage;
