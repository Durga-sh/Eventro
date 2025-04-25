import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={event.image || "/placeholder-event.jpg"}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">{formatDate(event.startDate)}</span>
          <span className="text-gray-700">{event.location}</span>
        </div>
        <Link
          to={`/events/${event._id}`}
          className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
