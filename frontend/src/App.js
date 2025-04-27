import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./components/common/Layout";
import Routes from "./Routes";
import "./App.css";

const App = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <Router>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <Layout>
            <Routes />
          </Layout>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
