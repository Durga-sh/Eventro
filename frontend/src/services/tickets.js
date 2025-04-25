import api from "./api";

export const getUserTickets = async () => {
  try {
    const response = await api.get("/tickets/my-tickets");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tickets");
  }
};

export const getTicket = async (id) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch ticket");
  }
};

export const verifyTicket = async (ticketId, qrData) => {
  try {
    const response = await api.post("/tickets/verify", { ticketId, qrData });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify ticket");
  }
};

export const getEventTickets = async (eventId) => {
  try {
    const response = await api.get(`/tickets/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch event tickets"
    );
  }
};
