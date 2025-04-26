import React from "react";
import TicketCard from "./TicketCard";

const TicketList = ({ tickets }) => {
  if (tickets.length === 0) {
    return (
      <div className="empty-tickets">
        <h3>You don't have any tickets yet</h3>
        <p>Browse events and purchase tickets to see them here.</p>
      </div>
    );
  }

  return (
    <div className="tickets-list">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;
