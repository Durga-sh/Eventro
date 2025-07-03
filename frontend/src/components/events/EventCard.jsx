import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";

const EventCard = ({ event }) => {
  const lowestPrice =
    event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((ticket) => ticket.price))
      : 0;

  const totalAvailable = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.available,
    0
  );

  const statusColors = {
    published: "bg-green-500",
    draft: "bg-yellow-500",
    cancelled: "bg-red-500",
  };

  return (
    <div className="group bg-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-900/25 h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {event.image ? (
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-slate-700 flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold text-white/90">
              {event.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full text-white shadow-lg ${
              statusColors[event.status] || "bg-slate-600"
            }`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 line-clamp-2 min-h-[3rem] leading-tight">
          {event.title}
        </h3>

        {/* Date */}
        <div className="flex items-center text-gray-300 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-purple-400"
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
          <span className="font-medium">{formatDate(event.startDate)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-300 text-sm mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-purple-400 flex-shrink-0"
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
          <span className="truncate font-medium">{event.location}</span>
        </div>

        {/* Price and Tickets Info */}
        <div className="flex justify-between items-center mb-6 mt-auto">
          <div className="text-white">
            {lowestPrice > 0 ? (
              <div>
                <span className="text-xs text-gray-400 block">
                  Starting from
                </span>
                <span className="text-xl font-bold text-purple-400">
                  {formatPrice(lowestPrice)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-green-400">Free</span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Available</span>
            <span className="text-sm font-semibold text-white">
              {totalAvailable} tickets
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/events/${event._id}`}
          className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2 inline-block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
