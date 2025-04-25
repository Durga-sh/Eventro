import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred during login" };
  }
};

export const register = async (userData) => {
  console.log("API register call with data:", userData);
  console.log("API URL:", `${API_URL}/auth/register`);

  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log("API register success response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API register error:", error);
    console.error("Response data:", error.response?.data);
    throw (
      error.response?.data || {
        message: "An error occurred during registration",
      }
    );
  }
};
export const googleLogin = async (tokenId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google`, { tokenId });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred during Google login",
      }
    );
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};
