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

  useEffect(() => {
    if (token && !justLoggedIn) {
      alert("You are currently logged in.");
      navigate("/portfolio");
    }
  }, [token, navigate, justLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.data?.token) {
        const { token } = response.data;
        setToken(token);
        onLogIn(token);
        setJustLoggedIn(true);
        navigate("/portfolio");
      } else {
        setMessage("Unexpected response from server.");
      }
    } catch (error) {
      const finalMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred.";
      setMessage(finalMessage);
    }
  };

  return (
    <div className="login-page">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ color: "green" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ color: "green" }}>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="proceed-button" type="submit">Log In</button>
      </form>

      <p>
        Forgot your password?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/forgot-password")}
        >
          Click here to reset it
        </span>
      </p>

      {message && <p style={{ color: "crimson" }}>{message}</p>}
    </div>
  );
};

export default Login;
