import React from "react";
import LoginForm from "../components/auth/LoginForm";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <LoginForm />
        <div className="auth-divider">
          <span>OR</span>
        </div>
        <GoogleAuthButton />
      </div>
    </div>
  );
};

export default LoginPage;
