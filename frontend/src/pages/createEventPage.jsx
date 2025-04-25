import React from "react";
import EventForm from "../components/events/EventForm";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const CreateEventPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1>Create New Event</h1>
      </div>
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
