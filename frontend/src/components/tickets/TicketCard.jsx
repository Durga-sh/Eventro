"use client";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { formatPrice } from "../../utils/priceFormatter";
import { motion } from "framer-motion";

const TicketCard = ({ ticket }) => {
  const isTicketUsed = ticket.isCheckedIn;
  const isEventPast = new Date(ticket.event.startDate) < new Date();

  const getStatusConfig = () => {
    if (isTicketUsed) {
      return {
        status: "Used",
        borderColor: "border-l-gray-500",
        badgeColor: "bg-gray-700 text-gray-300",
        iconColor: "text-gray-400",
      };
    }
    if (isEventPast) {
      return {
        status: "Expired",
        borderColor: "border-l-red-500",
        badgeColor: "bg-red-900/30 text-red-300 border border-red-500/30",
        iconColor: "text-red-400",
      };
    }
    return {
      status: "Valid",
      borderColor: "border-l-green-500",
      badgeColor: "bg-green-900/30 text-green-300 border border-green-500/30",
      iconColor: "text-green-400",
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      className={`bg-slate-800 rounded-2xl shadow-xl overflow-hidden h-full ${statusConfig.borderColor} border-l-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 40px -10px rgba(124, 58, 237, 0.15), 0 10px 20px -5px rgba(124, 58, 237, 0.1)",
        transition: { duration: 0.3 },
      }}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-800/40 flex items-center justify-center overflow-hidden border border-purple-500/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {ticket.event.image ? (
                <img
                  src={ticket.event.image || "/placeholder.svg"}
                  alt={ticket.event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-purple-300 text-2xl font-bold">
                  {ticket.event.title.charAt(0)}
                </span>
              )}
            </motion.div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                {ticket.event.title}
              </h3>
              <div className="flex items-center text-gray-300 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-purple-400"
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
                <span className="font-medium">
                  {formatDate(ticket.event.startDate)}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.badgeColor}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {statusConfig.status}
          </motion.div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Ticket Type
            </p>
            <p className="text-white font-semibold">{ticket.ticketType}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Quantity
            </p>
            <p className="text-white font-semibold">{ticket.quantity}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Location
            </p>
            <p className="text-white font-semibold truncate">
              {ticket.event.location}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Ticket #
            </p>
            <p className="text-white font-semibold font-mono text-sm">
              {ticket.ticketNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 bg-slate-700/20 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Total Amount
            </p>
            <span className="text-2xl font-bold text-white">
              {formatPrice(ticket.totalAmount)}
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              to={`/tickets/${ticket._id}`}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center font-semibold shadow-lg hover:shadow-xl"
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
      </div>
    </motion.div>
  );
};

export default TicketCard;
