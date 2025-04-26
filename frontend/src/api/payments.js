
import { getToken } from "../utils/tokenManager";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
// Process payment and create ticket
export const processPayment = async (paymentData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    // First check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Invalid response from server");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment processing failed");
    }

    return data;
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
};
