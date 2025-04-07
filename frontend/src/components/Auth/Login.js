import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { setToken } from '../../utils/auth';

const Login = ({ onLogIn, token }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setMessage("Your password was reset successfully. Please log in.");
    }

    if (token && !justLoggedIn) {
      navigate("/portfolio");
    }
  }, [token, navigate, justLoggedIn, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      console.log("Server response:", response);

      const { token: loginToken, message: serverMessage } = response.data || {};

      if (loginToken) {
        setToken(loginToken);
        onLogIn(loginToken);
        setJustLoggedIn(true);
        navigate("/portfolio");
      } else if (serverMessage === "Login successful.") {
        setJustLoggedIn(true);
        navigate("/portfolio");
      } else {
        setMessage("Unknown response from the server.");
      }

    } catch (error) {
      console.error("Login error (raw):", error);

      let finalMessage = "Something went wrong.";

      if (error?.response?.data?.message) {
        finalMessage = error.response.data.message;
      } else if (error?.message) {
        finalMessage = error.message;
      } else {
        try {
          finalMessage = JSON.stringify(error, Object.getOwnPropertyNames(error));
        } catch {
          finalMessage = "An unexpected error occurred.";
        }
      }

      console.log("Final message set:", finalMessage);
      setMessage(String(finalMessage));
    }
  };

  const renderMessage = () => {
    if (!message) return null;

    let msg = message;
    if (typeof msg !== "string") {
      try {
        msg = JSON.stringify(msg, Object.getOwnPropertyNames(msg));
      } catch {
        msg = "An unknown error occurred.";
      }
    }

    const isSuccess = msg.toLowerCase().includes("success");

    return (
      <p style={{ color: isSuccess ? "green" : "crimson" }}>
        {msg}
      </p>
    );
  };

  return (
    <div>
      <div className="login-page">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>

        <p>
          Forgot your password?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          >
            Click here to reset it
          </span>
        </p>

        {renderMessage()}
      </div>
    </div>
  );
};

export default Login;
