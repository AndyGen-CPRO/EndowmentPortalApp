import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Register = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const userToken = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if(userToken){
            navigate("/projects");
            alert("You are currently logged in.");
            return;
        }
    }, [userToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/auth/register", { displayName, email, password });
            alert("Register successful.");
            navigate("/login");
        } catch (error) {
            if (error.response) {
                const {status, data} = error.response;
                switch (status){
                    case 400:
                        setMessage('Bad request: ' + data.message);
                        break;
                    case 401:
                        setMessage('Email already in use or unauthorized. ' + data.message);
                        break;
                    case 404:
                        setMessage('Not found: ' + data.message);
                        break;
                    case 500:
                        setMessage('Server error: ' + data.message);
                        break;
                    default:
                        setMessage("Unknown error has occurred.");
                        break;
                }
            }
        }
    };
    
    return (
        <div>
            <div className='register-page'>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
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
                    <button type="submit">Register</button>
                </form>
                {message && (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
};

export default Register;
