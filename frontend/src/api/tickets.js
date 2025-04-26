
import { getToken } from "../utils/tokenManager";

// Get user's tickets

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export const getUserTickets = async () => {
  try {
    const response = await fetch(`${API_URL}/tickets/my-tickets`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
};

// Get single ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ticket");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};
