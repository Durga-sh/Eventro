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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="bg-slate-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 shadow-lg"
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
        </motion.div>

        {successMessage && (
          <motion.div
            className="bg-green-900/30 border border-green-500 text-green-200 p-4 sm:p-6 rounded-lg mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-sm sm:text-base">{successMessage}</p>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="flex justify-center items-center py-12 sm:py-16 lg:py-20"
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
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
              ></motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-gray-400 text-sm sm:text-base"
              >
                Loading your tickets...
              </motion.p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-red-900/30 border border-red-500 text-red-200 p-4 sm:p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Error</h3>
            <p className="text-sm sm:text-base">{error}</p>
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
      </motion.div>
    </motion.div>
  );
};

export default MyTicketsPage;
