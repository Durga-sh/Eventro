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
      className={`bg-slate-800 rounded-xl shadow-lg overflow-hidden h-full ${
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
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mr-6 overflow-hidden"
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
              <span className="text-purple-400 text-2xl font-bold">
                {ticket.event.title.charAt(0)}
              </span>
            )}
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {ticket.event.title}
            </h3>
            <p className="text-base text-gray-400">
              {formatDate(ticket.event.startDate)}
            </p>
          </div>
        </div>

        <motion.div
          className={`px-4 py-2 rounded-full text-sm font-medium ${
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

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Ticket Type</p>
            <p className="text-base text-white">{ticket.ticketType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Quantity</p>
            <p className="text-base text-white">{ticket.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Location</p>
            <p className="text-base text-white">{ticket.event.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Ticket #</p>
            <p className="text-base text-white">{ticket.ticketNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-700/30 flex items-center justify-between">
        <span className="text-xl font-bold text-white">
          {formatPrice(ticket.totalAmount)}
        </span>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={`/tickets/${ticket._id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center text-lg"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
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
