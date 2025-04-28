"use client";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";
import { motion } from "framer-motion";

const TicketCard = ({ ticket }) => {
  const isTicketUsed = ticket.isCheckedIn;
  const isEventPast = new Date(ticket.event.startDate) < new Date();

  return (
    <motion.div
      className={`bg-slate-800 rounded-xl shadow-lg overflow-hidden ${
        isTicketUsed ? "border-l-4 border-gray-500" : ""
      } ${isEventPast && !isTicketUsed ? "border-l-4 border-red-500" : ""} ${
        !isEventPast && !isTicketUsed ? "border-l-4 border-green-500" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)",
      }}
    >
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4 overflow-hidden"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {ticket.event.image ? (
              <img
                src={ticket.event.image || "/placeholder.svg"}
                alt={ticket.event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-purple-400 text-xl font-bold">
                {ticket.event.title.charAt(0)}
              </span>
            )}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {ticket.event.title}
            </h3>
            <p className="text-sm text-gray-400">
              {formatDate(ticket.event.startDate)}
            </p>
          </div>
        </div>

        <motion.div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isTicketUsed
              ? "bg-gray-700 text-gray-300"
              : isEventPast
              ? "bg-red-900/30 text-red-300"
              : "bg-green-900/30 text-green-300"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isTicketUsed ? "Used" : isEventPast ? "Expired" : "Valid"}
        </motion.div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400">Ticket Type</p>
            <p className="text-sm text-white">{ticket.ticketType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Quantity</p>
            <p className="text-sm text-white">{ticket.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="text-sm text-white">{ticket.event.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Ticket #</p>
            <p className="text-sm text-white">{ticket.ticketNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-700/30 flex items-center justify-between">
        <span className="text-lg font-bold text-white">
          {formatPrice(ticket.totalAmount)}
        </span>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={`/tickets/${ticket._id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TicketCard;
