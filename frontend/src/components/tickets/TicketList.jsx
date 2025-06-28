"use client";
import TicketCard from "./TicketCard";
import { motion } from "framer-motion";

const TicketList = ({ tickets }) => {
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (tickets.length === 0) {
    return (
      <motion.div
        className="bg-slate-800 p-12 rounded-xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-4">
          You don't have any tickets yet
        </h3>
        <p className="text-gray-400 text-lg">
          Browse events and purchase tickets to see them here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tickets.map((ticket, index) => (
        <motion.div key={ticket._id} variants={itemVariants} custom={index}>
          <TicketCard ticket={ticket} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TicketList;
