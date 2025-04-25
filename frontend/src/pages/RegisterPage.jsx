import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Join Our Platform</h1>
        <RegisterForm />
        <div className="auth-divider">
          <span>OR</span>
        </div>
        <GoogleAuthButton />
      </div>
    </div>
  );
};

export default RegisterPage;
