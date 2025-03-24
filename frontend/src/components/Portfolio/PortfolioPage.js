import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Portfolio = () => {
    const navigate = useNavigate();
    const token = getToken();
    const [message, setMessage] = useState();
    const [pledges, setPledges] = useState([]);

    useEffect(() => {
        if (token) { //fetches all user pledges if theres token
            fetchEndowmentPledges();
        } else {    //redirects user to log in page if theres no token
            navigate("/login");
            alert("This page needs authorization to be accessed.")
        }
    }, []);

    const fetchEndowmentPledges = async () => {
        try {
            const response = await axios.get("http://localhost:5000/endowment-pledges/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPledges(response.data);
        } catch (error) {
            setMessage(error);
        }
    };

    const createEndowmentPledge = () => {
        navigate("/")
    }

    return (
        <div>
            <h1>Endowment Portfolio</h1>

            <button onclick={createEndowmentPledge}>Create Endowment Pledge</button>

            <h3>Your Pledges</h3>
            <p>{message}</p>
            <div>
                {pledges.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Beneficiary</th>
                                <th>Type</th>
                                <th>Pledge Start Date</th>
                                <th>Pledge End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pledges.map((pledge) => (
                                <tr key={pledge.id}>
                                    <td>{pledge.beneficiary}</td>
                                    <td>{pledge.type}</td>
                                    <td>{new Date(pledge.pledgeStart).getFullYear()}</td>
                                    <td>{new Date(pledge.pledgeEnd).getFullYear()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You have 0 Endowment Pledges in your Portfolio. Click the "Create Endowment Pledge" to start.</p>
                )}
            </div>
        </div>
    )
};

export default Portfolio;