import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Register = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [rules, setRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const userToken = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (userToken) {
            navigate("/projects");
            alert("You are currently logged in.");
            return;
        }
    }, [userToken, navigate]);

    const handlePasswordChange = (value) => {
        setPassword(value);
        setRules({
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            special: /[\W_]/.test(value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            setMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/register", {
                displayName, email, password
            });
            alert("Register successful.");
            navigate("/login");
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
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
                        <label style={{ color: "green" }}>Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ color: "green" }}>Email</label>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Example: name@example.com
                        </p>
                        <input
                            type="email"
                            placeholder="e.g. antoinette@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ color: "green" }}>Password</label>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
                        </p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            required
                        />
                        <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }}>
                            <li>{rules.length ? "✅" : "❌"} At least 8 characters</li>
                            <li>{rules.uppercase ? "✅" : "❌"} At least one uppercase letter</li>
                            <li>{rules.lowercase ? "✅" : "❌"} At least one lowercase letter</li>
                            <li>{rules.number ? "✅" : "❌"} At least one number</li>
                            <li>{rules.special ? "✅" : "❌"} At least one special character</li>
                        </ul>
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
