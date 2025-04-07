import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setMessage("Password reset instructions sent to your email.");
    } catch (error) {
      console.error("Forgot password error:", error);

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

      setMessage(String(finalMessage));
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
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
        <button type="submit">Send Reset Link</button>
      </form>

      {message && (
        <p style={{ color: message.toLowerCase().includes("error") ? "crimson" : "green" }}>
          {typeof message === "string"
            ? message
            : JSON.stringify(message, Object.getOwnPropertyNames(message))}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
