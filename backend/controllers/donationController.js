const Donation = require('../models/donationModel');

const createDonation = async (req,res) => {
    try {
        const { donationDate, amount } = req.body;
        const { endowmentPledgeId } = req.params;

        const existingDonation = Donation.findOne({ endowmentPledgeId, donationDate });

        if (existingDonation) {
            return res.status(400).json({ message: "Donation for this year already exists." })
        };

        const newDonation = new Donation({
            donationDate,
            amount,
            endowmentPledgeId
        });

        await newDonation.save();

        res.status(201).json({ message: "Donation creation successful." })
    } catch (error) {
        res.status(400).json({ message: "Error creating donation.", error })
    }
};

const createDonations = async (endowmentPledgeId, donations) => {
    try {
        console.log(donations)
        const newDonations = [];

        for (let i = 0; i < donations.length; i++) {
            const { donationDate, amount } = donations[i];

            newDonations.push({
                donationDate,
                amount,
                endowmentPledgeId
            })
        }

        if (newDonations.length > 0) {
            await Donation.insertMany(newDonations);
        }

        return { message: "All donations created successfully.", newDonations }

    } catch (error) {
        throw new Error("Error creating donations: " + error.message);
    }
};

const getDonationById = async (req,res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.donationId
        });
        if (!donation) return res.status(404).json({ message: "Donation not found.", error })    

        res.status(200).json({ message: "Donation found.", donation });
    } catch(error) {
        res.status(400).json({ message: "Error retrieving donation.", error })
    }
};

const getAllDonations = async (req,res) => {
    try {
        const donation = await Donation.find({ endowmentPledgeId: req.params.endowmentPledgeId })

        if (!donation) {
            res.status(404).json({ message: "No donations found." })
        }
        res.status(200).json(donation);
    } catch(error) {
        res.status(400).json({ message: "Error retrieving donations.", error })
    }
};

const updateDonation = async (req,res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.donationId, req.body, {new:true}
        );
        
        if (!donation) return res.status(404).json({ message: "Donation not found." })
        res.status(200).json({ message: "Donation update successful.", donation })
    } catch (error) {
        res.status(400).json({ message: "Error updating donation.", error })
    }
}

const deleteDonation = async (req,res) => {
    try {
        const donation = await Donation.findByIdAndDelete(
            req.params.donationId
        );

        if (!donation) return res.status(404).json({ message: "Donation not found." })
        res.status(200).json({ message: "Donation deletion successful." })
    } catch (error) {
        res.status(400).json({ message: "Error deleting donation.", error })
    }
};

module.exports = {
    createDonation,
    createDonations,
    getDonationById,
    getAllDonations,
    updateDonation,
    deleteDonation
};