const EndowmentPledge = require("../models/endowmentPledgeModel");
const Donation = require("../models/donationModel");
const { createDonations } = require("./donationController");

const createEndowmentPledge = async (req, res) => {
    try {
        const { 
            beneficiaryName,
            donationPurpose,
            status,
            pledgeStart,
            pledgeEnd,
            donationType,
            donorMessage,
            donations
        } = req.body;

        const existingPledge = await EndowmentPledge.findOne({
            beneficiaryName,
            userId: req.user.id,
            donationPurpose,
            $or: [
                { pledgeStart: { $lte: pledgeEnd, $gte: pledgeStart } },
                { pledgeEnd: { $lte: pledgeEnd, $gte: pledgeStart } }
            ]
        });

        if (existingPledge) {
            return res.status(400).json({ message: "An endowment pledge with the same details already exists." });
        }

        if (donations && donations.length > 0) {
            for (let i = 0; i < donations.length; i++) {
                const { donationDate } = donations[i]; 
                const existingDonation = await Donation.findOne({ beneficiaryName, donationPurpose, donationDate });

                if (existingDonation) {
                    return res.status(400).json({ message: `Donation for the year ${donationDate} already exists.` });
                }
            }
        }

        const newPledge = new EndowmentPledge({
            beneficiaryName,
            donationPurpose,
            status,
            pledgeStart,
            pledgeEnd,
            donationType,
            donorMessage,
            userId: req.user.id
        });

        await newPledge.save();


        console.log("Received donations:", donations);
        
        let donationResponse = null;
        if (donations && donations.length > 0) {
            try {
                donationResponse = await createDonations(newPledge._id, donations);
            } catch (donationError) {
                return res.status(400).json({ message: `Error creating donations: ${donationError.message}` });
            }
        }
        
        res.status(201).json({ 
            message: "Endowment pledge and donations creation successful.", 
            newPledge, 
            donationResponse 
        });

    } catch (error) {
        res.status(400).json({ message: "Error creating endowment.", error: error.message });
    }
};


const getEndowmentPledgeById = async (req,res) => {
    try {
        const endowmentPledge = await EndowmentPledge.findOne({
            _id: req.params.endowmentPledgeId
        });
        if (!endowmentPledge) return res.status(404).json({ message: "Endowment pledge not found.", error })    

        res.status(200).json({ message: "Endowment pledge found.", endowmentPledge });
    } catch(error) {
        res.status(400).json({ message: "Error retrieving endowment pledge.", error })
    }
}

const getAllEndowmentPledges = async (req,res) => {
    try {
        const endowmentPledges = await EndowmentPledge.find({ userId: req.user.id })
        res.status(200).json(endowmentPledges);
    } catch(error) {
        res.status(400).json({ message: "Error retrieving endowment pledges.", error })
    }
}

const updateEndowmentPledge = async (req,res) => {
    try {
        const endowmentPledge = await EndowmentPledge.findByIdAndUpdate(
            req.params.endowmentPledgeId, req.body, {new:true}
        );
        
        if (!endowmentPledge) return res.status(404).json({ message: "Endowment pledge not found." })
        res.status(200).json({ message: "Endowment pledge update successful.", endowmentPledge })
    } catch (error) {
        res.status(400).json({ message: "Error updating endowment pledge.", error })
    }
}

const deleteEndowmentPledge = async (req,res) => {
    try {
        const endowmentPledge = await EndowmentPledge.findByIdAndDelete(
            req.params.endowmentPledgeId
        );

        if (!endowmentPledge) return res.status(404).json({ message: "Endowment pledge not found." })
        res.status(200).json({ message: "Endowment pledge delete successful." })
    } catch (error) {
        res.status(400).json({ message: "Error deleting endowment pledge.", error })
    }
}

module.exports = {
    createEndowmentPledge,
    getEndowmentPledgeById,
    getAllEndowmentPledges,
    updateEndowmentPledge,
    deleteEndowmentPledge
}