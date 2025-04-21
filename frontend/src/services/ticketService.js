import api from "./api";

const ticketService = {
  getTicketsByEvent: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/tickets`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTicket: async (eventId, ticketData) => {
    try {
      const response = await api.post(`/events/${eventId}/tickets`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  purchaseTicket: async (eventId, purchaseData) => {
    try {
      const response = await api.post(
        `/events/${eventId}/purchase`,
        purchaseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserTickets: async () => {
    try {
      const response = await api.get("/tickets/my-tickets");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelTicket: async (ticketId) => {
    try {
      const response = await api.delete(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ticketService;
