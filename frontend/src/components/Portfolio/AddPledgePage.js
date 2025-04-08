import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddPledge = () => {
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [donationPurpose, setDonationPurpose] = useState("");
    const [customPurpose, setCustomPurpose] = useState("");
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
            alert("This page needs authorization to be accessed.");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (pledgeStart && pledgeEnd) {
            const startYear = pledgeStart.getFullYear();
            const endYear = pledgeEnd.getFullYear();
            if (startYear <= endYear) {
                const newDonations = [];
                for (let year = startYear; year <= endYear; year++) {
                    newDonations.push({
                        donationDate: new Date(year, 0, 1).toISOString(),
                        amount: donationType === "fixed" ? fixedAmount : 0
                    });
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
        const finalPurpose = donationPurpose === "Other" ? customPurpose : donationPurpose;

        try {
            const response = await axios.post("http://localhost:5000/endowment-pledges/create", {
                beneficiaryName,
                donationPurpose: finalPurpose,
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
            setMessage("Pledge created successfully.");
            navigate("/portfolio");
        } catch (error) {
            setMessage(error.message);
        }
    };

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
                    <label>Donation Purpose</label>
                    <select onChange={(e) => setDonationPurpose(e.target.value)} required>
                        <option value="">-- Select Purpose --</option>
                        <option value="Education Support">Education Support</option>
                        <option value="Medical & Health Aid">Medical & Health Aid</option>
                        <option value="Emergency & Disaster Relief">Emergency & Disaster Relief</option>
                        <option value="Food & Nutrition">Food & Nutrition</option>
                        <option value="Shelter & Housing">Shelter & Housing</option>
                        <option value="Religious & Faith-Based">Religious & Faith-Based</option>
                        <option value="Community Development">Community Development</option>
                        <option value="Youth & Children Services">Youth & Children Services</option>
                        <option value="Environmental Causes">Environmental Causes</option>
                        <option value="Animal Welfare">Animal Welfare</option>
                        <option value="Other">Other</option>
                    </select>

                    {donationPurpose === "Other" && (
                        <div style={{ marginTop: '10px' }}>
                            <label>Custom Purpose</label>
                            <input
                                type="text"
                                onChange={(e) => setCustomPurpose(e.target.value)}
                                required
                                placeholder="Enter your custom purpose"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label>Pledge Start Year: </label>
                    <DatePicker
                        selected={pledgeStart}
                        onChange={(date) => setPledgeStart(date)}
                        showYearPicker
                        dateFormat="yyyy"
                        maxDate={pledgeEnd}
                        onKeyDown={(e) => e.preventDefault()}
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
                        onKeyDown={(e) => e.preventDefault()}
                    />
                </div>

                <div>
                    <label>Donor Message (optional)</label>
                    <input type="text" onChange={(e) => setDonorMessage(e.target.value)} />
                </div>

                <div>
                    <label>Donation Type: </label>
                    <select onChange={(e) => setDonationType(e.target.value)} value={donationType}>
                        <option value="fixed">Fixed Annual Donations</option>
                        <option value="custom">Custom Annual Donations</option>
                    </select>
                </div>

                <div>
                    <h3>Donation Details</h3>
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
                                                onChange={(e) => handleDonationChange(i, Number(e.target.value.replace(/\D/g, '')))}
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
    );
};

export default AddPledge;

