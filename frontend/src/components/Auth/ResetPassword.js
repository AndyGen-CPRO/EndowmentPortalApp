import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, { password });
      setMessage(response.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login?reset=success"), 2000);
    } catch (error) {
      console.error("Reset password error:", error);

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
    <div className="reset-password-page">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />{" "}
            Show Password
          </label>
        </div>
        <button type="submit">Reset Password</button>
      </form>

      {message && (
        <p style={{ color: message.toLowerCase().includes("success") ? "green" : "crimson" }}>
          {typeof message === "string"
            ? message
            : JSON.stringify(message, Object.getOwnPropertyNames(message))}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
