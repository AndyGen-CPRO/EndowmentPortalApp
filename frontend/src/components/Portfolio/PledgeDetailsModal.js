import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import PledgeDelete  from './PledgeDeleteModal';

const PledgeDetails = ({ closeModal, fetchEndowmentPledges, pledge, token }) => {
    const [editMode, setEditMode] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [endowmentPledge, setEndowmentPledge] = useState(null);
    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [donationPurpose, setDonationPurpose] = useState("");
    const [status, setStatus] = useState("on-going");
    const [pledgeStart, setPledgeStart] = useState(new Date());
    const [pledgeEnd, setPledgeEnd] = useState(new Date());
    const [donationType, setDonationType] = useState("fixed");
    const [fixedAmount, setFixedAmount] = useState(0);
    const [donations, setDonations] = useState([]);
    const [donorMessage, setDonorMessage] = useState("");
    const [message, setMessage] = useState("");

    const [donationYears, setDonationYears] = useState([]);

    const [addDonationBtn, setAddDonationBtn] = useState(false);
    const [newDonationYear, setNewDonationYear] = useState(null);
    const [newDonationAmount, setNewDonationAmount] = useState(0);

    const [editDonationId, setEditDonationId] = useState(null); 
    const [editAmount, setEditAmount] = useState(0); 

    useEffect(() => {
        fetchDonations();
    }, []);

    useEffect(() => {
        if (pledge) {
            setBeneficiaryName(pledge.beneficiaryName);
            setDonationPurpose(pledge.donationPurpose);
            setStatus(pledge.status);
            setPledgeStart(new Date(pledge.pledgeStart));
            setPledgeEnd(new Date(pledge.pledgeEnd));
        }
    }, [pledge]);

    const fetchEndowmentPledge = async() => {
        try {
            const response = await axios.get(`http://localhost:5000/endowment-pledges/${pledge._id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEndowmentPledge(response.data);
        } catch (error) {
            setMessage(error);
        }
    }    

    const handlePledgeUpdate = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/endowment-pledges/${pledge._id}/`, {
                beneficiaryName,
                donationPurpose,
                status,
                pledgeStart,
                pledgeEnd,
                donationType,
                donorMessage,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
            closeModal(false);
            fetchEndowmentPledges();
            setMessage("Pledge update successful.")
        } catch (error) {
            setMessage("Pledge update failed.")
        }
    };

    const handlePledgeDelete = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(
                `http://localhost:5000/endowment-pledges/${pledge._id}/`
                , {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
            fetchEndowmentPledges();
            closeModal(false);
            alert("Pledge deletion successful.")
        } catch (error) {
            alert("Pledge deletion failed.")
        }
    };

    const editBtn = () => { 
        setEditMode(!editMode);
        setBeneficiaryName(pledge.beneficiaryName);
        setDonationPurpose(pledge.donationPurpose);
        setStatus(pledge.status);
        setPledgeStart(pledge.pledgeStart);
        setPledgeEnd(pledge.pledgeEnd);
    }

    const fetchDonations = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/endowment-pledge/${pledge._id}/donations/`
                , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDonations(response.data);
            setMessage("Fetching pledge donations successful.")

            const years = response.data.map(donation => 
                new Date(donation.donationDate).getFullYear()
            );
            setDonationYears([...new Set(years)]);
        } catch (error) {
            setMessage("Error fetching donatiosn.")
        }
    };

    const handleDonationCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:5000/endowment-pledge/${pledge._id}/donations/create`
                , {
                    donationDate: newDonationYear,
                    amount: newDonationAmount
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDonations();
            setNewDonationYear(null)
            setAddDonationBtn(false);
            setMessage("Donation creation successful.");
        } catch (error) {
            setMessage("Donation creation failed.");
        }
    };

    const handleDonationEdit = (donation) => {
        console.log(donation)
        setEditDonationId(donation._id);
        setEditAmount(donation.amount);
    };

    const handleDonationUpdate = async (donationId) => {
        console.log(editAmount)
        try {
            const response = await axios.put(
                `http://localhost:5000/endowment-pledge/${pledge._id}/donation/${donationId}`
                , { amount: editAmount }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDonations();
            setEditDonationId(null);
            setMessage("Donation update successful.")
        } catch (error) {
            setMessage("Donation update failed.")
        }
    };

    const handleDonationDelete = async (donationId) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/endowment-pledge/${pledge._id}/donation/${donationId}`
                , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDonations();
            setMessage("Donation delete successful.")
        } catch (error) {
            setMessage("Donation delete failed.")
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {!editMode ? (
                    <div>
                        <h2>{pledge.beneficiaryName}</h2>
                        <h4>{pledge.donationPurpose}</h4>
                        {pledge.donorMessage && <p>From the donor: <i>"{pledge.donorMessage}"</i></p>}
                        <p className="pledge-detail">Status: {pledge.status}</p>
                        <p>Pledge Start Date: {new Date(pledge.pledgeStart).getFullYear()}</p>
                        <p>Pledge End Date: {new Date(pledge.pledgeEnd).getFullYear()}</p>

                        <button onClick={editBtn}>Edit Pledge</button>
                        <button onClick={() => setConfirmDeleteModal(true)}>Delete Pledge</button>
                        <button onClick={() => closeModal(false)}>Close</button>

                        {/* Pledge Delete Confirmation Modal */}
                        {confirmDeleteModal && (
                            <PledgeDelete 
                            onConfirm={handlePledgeDelete}
                            onCancel={() => setConfirmDeleteModal(false)}
                            />
                        )}

                        <h3>Donations</h3>
                        <button onClick={() => setAddDonationBtn(!addDonationBtn)}>Add Donation</button>
                        {addDonationBtn && (
                            <form onSubmit={handleDonationCreate}>
                                <div>
                                    <label>Year: </label>
                                    <DatePicker
                                        selected={newDonationYear}
                                        onChange={(date) => 
                                            {const convDate = new Date(date.getFullYear(), 0, 1);
                                             setNewDonationYear(convDate.toISOString())}
                                        }
                                        showYearPicker
                                        dateFormat="yyyy"
                                        minDate={pledge.pledgeStart}
                                        maxDate={pledge.pledgeEnd}
                                        filterDate={(date) => !donationYears.includes(date.getFullYear())}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                            }}
                                    />
                                </div>
                                <div>
                                    <label>Amount</label>
                                    <input
                                        type="text"
                                        value={"$" + newDonationAmount}
                                        onChange={(e) => setNewDonationAmount(Number(e.target.value.replace(/\D/g, '')))}
                                        min={0}
                                        required 
                                    />
                                </div>
                                <button type="submit">Add</button>
                            </form>
                        )}
                        {donations.length > 0 ? (
                            <ul>
                                {donations.map((donation) => (
                                    <li key={donation._id}>
                                        {editDonationId === donation._id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={"$" + editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value.replace(/\D/g, ''))}
                                                    min={0}
                                                    required
                                                />
                                                <button className="save-btn" onClick={() => handleDonationUpdate(donation._id)}>Save</button>
                                                <button className="cancel-btn" onClick={() => setEditDonationId(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="pledge-donations">
                                                <p>{new Date(donation.donationDate).getFullYear()}: ${donation.amount.toLocaleString()}</p>
                                                <button className="edit-btn" onClick={() => handleDonationEdit(donation)}>Edit</button>
                                                <button className="delete-btn" onClick={() => handleDonationDelete(donation._id)}>Delete</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>This pledge has no donations yet.</p>
                        )}

                    </div>
                ) : (
                    <div>
                        <form onSubmit={handlePledgeUpdate}>
                            <div>
                                <label>Beneficiary Name</label>
                                <input value={beneficiaryName} type="text" onChange={(e) => setBeneficiaryName(e.target.value)} required />
                            </div>
            
                            <div>
                                <label>Donation Purpose (Emerging Needs, Community Needs, etc...)</label>
                                <input value={donationPurpose} type="text" onChange={(e) => setDonationPurpose(e.target.value)} required />
                            </div>
            
                            <div>
                                <label>Status: </label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} >
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
                                    minDate={null} 
                                    maxDate={new Date(Math.min(...donationYears), 0, 1)} 
                                    filterDate={(date) => {
                                        const donationYear = date.getFullYear();
                                        return donationYear <= Math.min(...donationYears); 
                                    }}
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
                                    filterDate={(date) => {
                                        const donationYear = date.getFullYear();
                                        return donationYear >= Math.max(...donationYears); 
                                    }}
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        }}
                                />
                            </div>
            
                            <div>
                                <label>Donor Message (optional)</label>
                                <input type="text" onChange={(e) => setDonorMessage(e.target.value)} />
                            </div>

                            <button type="submit">Submit</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
};

export default PledgeDetails;