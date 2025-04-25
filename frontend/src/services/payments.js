import api from "./api";

export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await api.post(
      "/payments/create-payment-intent",
      paymentData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create payment"
    );
  }
};
