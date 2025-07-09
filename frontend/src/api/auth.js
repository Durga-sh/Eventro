// frontend/src/api/auth.js

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Register user (Step 1: Send OTP)
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP (Step 2: Complete registration)
export const verifyOTP = async (otpData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Resend OTP
export const resendOTP = async (tempUserId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempUserId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend OTP");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    console.log("Sending login request with credentials:", credentials);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(
        data.message || `Login failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Forgot Password - Send reset email
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reset Password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Validate Reset Token
export const validateResetToken = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/validate-reset-token/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid or expired token");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/google/verify`, {
      credential,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user data");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
