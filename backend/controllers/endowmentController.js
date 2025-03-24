const EndowmentPledge = require("../models/endowmentPledgeModel");

const createEndowmentPledge = async (req,res) => {
    try {
        const { 
            beneficiary,
            type,
            status,
            pledgeStart,
            pledgeEnd,
            paymentType,
            message,
         } = req.body;

        const existingPledge = await EndowmentPledge.findOne({
            beneficiary,
            userId: req.user.id,
            type,
            $or: [
                { pledgeStart: { $lte: pledgeEnd, $gte: pledgeStart } },
                { pledgeEnd: { $lte: pledgeEnd, $gte: pledgeStart } } 
            ]
        });

        if (existingPledge) {
            return res.status(400).json({ message: "An endowment pledge with the same details already exists." })
        }

        const newPledge = new EndowmentPledge({
            beneficiary,
            type,
            status,
            pledgeStart,
            pledgeEnd,
            paymentType,
            message,
            userId: req.user.id
        });

        await newPledge.save();
        
        res.status(201).json({ message: "Endowment pledge creation successful." })
    } catch (error) {
        res.status(400).json({ message : 'Error creating endowment.',error})
    }
}

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