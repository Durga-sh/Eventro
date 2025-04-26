import React from "react";
import EventDetails from "../components/events/EventDetails";


const CreateEventPage = () => {


  // Redirect if not authenticated

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1>Create New Event</h1>
      </div>
      <EventDetails/>
    </div>
  );
};

export default CreateEventPage;
