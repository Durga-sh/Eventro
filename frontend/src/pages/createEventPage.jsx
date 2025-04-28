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
 
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
