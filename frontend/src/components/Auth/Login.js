import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        try {
            const response = await axios.post("http://localhost:5000/auth/login", { email, password });
            
            if (response.status === 204) {
                setMessage("Login attempt failed: No content returned");
            } else if (response.data?.token) {
                const { token } = response.data;
                setToken(token);
                onLogIn(token);
                setMessage("Log in successful.");
                setJustLoggedIn(true);
                navigate("/portfolio");
                return
            } else {
                setMessage("Unknown response from the server.");
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setMessage("Bad request: " + data.message);
                        break;
                    case 401:
                        setMessage("Unauthorized: " + data.message);
                        break;
                    case 404:
                        setMessage("Not found: " + data.message);
                        break;
                    case 500:
                        setMessage("Server error: " + data.message);
                        break;
                    default:
                        setMessage("An unknown error occurred.");
                        break;
                }
            }
        }
    };

    return (
        <div>
            <div className='login-page'>
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
                {message && (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
};

export default Login;
