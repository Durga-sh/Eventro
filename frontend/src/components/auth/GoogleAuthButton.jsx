import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const { loginUser, setError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setLocalError("");
      console.log("Google login success, credential received");

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Call the backend to verify and process the Google credential
      const response = await googleLogin(credentialResponse.credential);

      if (!response || !response.user || !response.token) {
        throw new Error("Invalid response from server");
      }

      // Update the authentication context
      loginUser(response.user, response.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage =
        error.message || "Failed to authenticate with Google";
      setLocalError(errorMessage);

      if (setError) {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    console.error("Google login failed:", error);
    setLocalError("Google authentication failed. Please try again.");
    if (setError) {
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="google-auth-button">
      {localError && <div className="error-message">{localError}</div>}
      {isLoading ? (
        <div className="loading-spinner">Authenticating with Google...</div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={280}
          cookiePolicy={"single_host_origin"}
        />
      )}
    </div>
  );
};

export default GoogleAuthButton;
