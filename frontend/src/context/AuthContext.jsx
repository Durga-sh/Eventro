import React, { createContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  loginWithGoogle,
} from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      console.error("Error fetching user:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || "Failed to login");
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message || "Failed to register");
      throw err;
    }
  };

  const googleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    register,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
