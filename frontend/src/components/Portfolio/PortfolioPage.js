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
    const [selectedPledge, setSelectedPledge] = useState(null);

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

    const fetchDonationsData = async (pledge) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/endowment-pledge/${pledge._id}/donations/`
                , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const donationsData = response.data
            setMessage("Fetching pledge donations successful.")

            return donationsData;
        } catch (error) {
            setMessage("Error fetching donatiosn.")
        }
    };

    const createEndowmentPledge = () => {
        navigate("/add-pledge")
    }

    if (!token) {
        return (
            <p>Loading Endowments...</p>
        )
    }

    return (
        <div>
            <h1>Endowment Portfolio</h1>

            <button  className="proceed-button" onClick={createEndowmentPledge}>New Pledge</button>

            <h3>Your Pledges</h3>
            {message && <p>{message}</p>}
            <div>
                {pledges.length > 0 ? (
                        <div className='pledges-container'>
                            {pledges.map((pledge) => (
                                <ul key={pledge.id} className='endowment-pledges'>
                                    <h4 className='pledge-list-title'>{
                                        pledge.beneficiaryName}
                                    </h4>
                                    <span className='pledge-list-details'>
                                        <div>
                                            <label>Purpose</label> 
                                            <span>{pledge.donationPurpose}</span>
                                        </div>

                                        <div>
                                            <label>Pledge Period</label> 
                                            <span>{new Date(pledge.pledgeStart).getFullYear()} - {new Date(pledge.pledgeEnd).getFullYear()} </span>
                                        </div>
                                        
                                        <div>
                                            <label>Total Donation Amount</label> 
                                            <span>${pledge.totalDonation.toLocaleString()}</span>
                                        </div>
                                        
                                        <div className="action-btns">
                                            <button onClick={() => {setPledgeModal(true); setSelectedPledge(pledge)}}>
                                                View Details
                                            </button>
                                            
                                            <button onClick={async () =>{
                                                const donations = await fetchDonationsData(pledge)

                                                navigate("/pledge-data-calculator", 
                                                { state: { pledge, donations }}
                                                )}}>
                                                View in Calculator
                                            </button>
                                        </div>
                                    </span>
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
