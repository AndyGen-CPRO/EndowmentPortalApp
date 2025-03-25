import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddPledge = () => {
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [donationPurpose, setDonationPurpose] = useState("");
    const [status, setStatus] = useState("on-going");
    const [pledgeStart, setPledgeStart] = useState(new Date());
    const [pledgeEnd, setPledgeEnd] = useState(new Date());
    const [donationType, setDonationType] = useState("fixed");
    const [fixedAmount, setFixedAmount] = useState(0);
    const [donorMessage, setDonorMessage] = useState("");
    const [donations, setDonations] = useState([]);

    const [message, setMessage] = useState("");
    const token = getToken();
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate("/login");
            alert("This page needs authorization to be accessed.")
            return;
        }
    });

    useEffect(() => {
        if (pledgeStart && pledgeEnd) {
            const startYear = pledgeStart.getFullYear();
            const endYear = pledgeEnd.getFullYear();
            if (startYear <= endYear) {
                const newDonations = []
                for (let year = startYear; year <= endYear; year++) {
                    newDonations.push({ 
                        donationDate: new Date(year, 0, 1).toISOString(), 
                        amount: donationType === "fixed" ? fixedAmount : 0 });
                }
                setDonations(newDonations);
            }
        }
    }, [pledgeStart, pledgeEnd, donationType, fixedAmount]);

    const handleDonationChange = (i, amount) => {
        const updatedDonations = [...donations];
        updatedDonations[i].amount = amount;
        setDonations(updatedDonations);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/endowment-pledges/create", {
                beneficiaryName,
                donationPurpose,
                status,
                pledgeStart,
                pledgeEnd,
                donationType,
                donorMessage,
                donations
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
            setMessage("Pledge created successfully.")
            navigate("/portfolio")
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <div>
            <h2>New Pledge</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Beneficiary Name</label>
                    <input type="text" onChange={(e) => setBeneficiaryName(e.target.value)} required />
                </div>

                <div>
                    <label>Donation Purpose (Emerging Needs, Community Needs, etc...)</label>
                    <input type="text" onChange={(e) => setDonationPurpose(e.target.value)} required />
                </div>

                <div>
                    <label>Status: </label>
                    <select onChange={(e) => setStatus(e.target.value)} selected="on-going">
                        <option value="on-going">On-going</option>
                        <option value="complete">Complete</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label>Pledge Start Year: </label>
                    <DatePicker
                        selected={pledgeStart}
                        onChange={(date) => setPledgeStart(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        maxDate={pledgeEnd}
                        onKeyDown={(e) => {
                            e.preventDefault();
                         }}
                    />
                </div>
                
                <div>
                    <label>Pledge End Year: </label>
                    <DatePicker
                        selected={pledgeEnd}
                        onChange={(date) => setPledgeEnd(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        minDate={pledgeStart}
                        onKeyDown={(e) => {
                            e.preventDefault();
                         }}
                    />
                </div>

                <div>
                    <label>Donor Message (optional)</label>
                    <input type="text" onChange={(e) => setDonorMessage(e.target.value)} />
                </div>

                <div>
                    <label>Donation Type: </label>
                    <select onChange={(e) => setDonationType(e.target.value)} selected="fixed">
                        <option value="fixed">Fixed Annual Donations</option>
                        <option value="custom">Custom Annual Donations</option>
                    </select>
                </div>

                <div>
                    <h2>Donation Details</h2>
                    {donationType === "fixed" ? (
                        <div>
                            <label>Annual Donation Amount</label>
                            <input
                                type="text"
                                value={"$" + fixedAmount}
                                onChange={(e) => setFixedAmount(Number(e.target.value.replace(/\D/g, '')))}
                                min={0}
                                required 
                            />
                        </div>
                    ) : (
                        <>
                            {donations.length > 0 && (
                                <ul>
                                    {donations.map((donation, i) => (
                                        <li key={donation.donationDate}>
                                            <label>{new Date(donation.donationDate).getFullYear()}</label>
                                            <input
                                                type="text"
                                                value={"$" + donation.amount}
                                                onChange={(e) => handleDonationChange(i, Number(e.target.value.replace(/\D/g, '')).toString())}
                                                min={0}
                                                required
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddPledge;