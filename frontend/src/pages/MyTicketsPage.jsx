"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserTickets } from "../api/tickets";
import TicketList from "../components/tickets/TicketList";
import { motion } from "framer-motion";

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null
  );

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true);
        const ticketsData = await getUserTickets();
        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load your tickets");
        setLoading(false);
      }
    };

    fetchUserTickets();

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <motion.div
      className="bg-slate-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            My Tickets
          </motion.h1>
          <motion.p
            className="text-gray-400 text-base sm:text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Manage and view all your event tickets
          </motion.p>
        </motion.div>

        {successMessage && (
          <motion.div
            className="bg-green-900/30 border border-green-500 text-green-200 p-6 rounded-2xl mb-8 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {successMessage}
            </div>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="flex justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-gray-400 text-lg"
              >
                Loading your tickets...
              </motion.p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-red-900/30 border border-red-500 text-red-200 p-8 rounded-2xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold">Error Loading Tickets</h3>
            </div>
            <p className="text-lg">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <TicketList tickets={tickets} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyTicketsPage;
