import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { user, token } = await googleLogin(credentialResponse.credential);
      loginUser(user, token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="google-auth-button">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleAuthButton;
