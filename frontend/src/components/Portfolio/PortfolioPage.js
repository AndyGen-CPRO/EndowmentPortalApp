import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import PledgeDetails from './PledgeDetailsModal';

const Portfolio = () => {
    const navigate = useNavigate();
    const token = getToken();
    const [message, setMessage] = useState();
    const [pledges, setPledges] = useState([]);
    const [pledgeModal, setPledgeModal] = useState(false);
    const [selectedPledge, setSelectedPledge] = useState(null)

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
        navigate("/add-pledge")
    }

    return (
        <div>
            <h1>Endowment Portfolio</h1>

            <button onClick={createEndowmentPledge}>New Pledge</button>

            <h3>Your Pledges</h3>
            {message && <p>{message}</p>}
            <div>
                {pledges.length > 0 ? (
                        <div>
                            {pledges.map((pledge) => (
                                <ul key={pledge.id}>
                                    <h4>{
                                        pledge.beneficiaryName}
                                    </h4>
                                    <span>
                                        <label>Purpose:</label> {pledge.donationPurpose} ---
                                        <label>Status:</label> {pledge.status} --- 
                                        <label>Pledge Period:</label> {new Date(pledge.pledgeStart).getFullYear()} - {new Date(pledge.pledgeEnd).getFullYear()} 
                                    </span>
                                    <button onClick={() => {setPledgeModal(true); setSelectedPledge(pledge)}}>Details</button>
                                </ul>
                            ))}
                        </div>
                ) : (
                    <p>You have 0 Endowment Pledges in your Portfolio. Click "New Pledge" to start.</p>
                )}
            </div>

            {pledgeModal && selectedPledge && (
                <PledgeDetails
                    closeModal = {() => {setSelectedPledge(null); setPledgeModal(false)}}
                    fetchEndowmentPledges = {fetchEndowmentPledges}
                    pledge = {selectedPledge}
                    token = {token}
                />
            )}
        </div>
    )
};

export default Portfolio;