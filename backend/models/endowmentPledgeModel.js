const mongoose = require("mongoose");

const endowmentPledgeSchema = new mongoose.Schema({
    beneficiaryName: { type: String, required: true },
    donationPurpose: { type: String, required: true },
    pledgeStart: { type: Date, required: true },
    pledgeEnd: { type: Date, required: true },
    totalDonation: { type: Number, default: 0 },
    donationType: { type: String, enum: ['fixed', 'custom'], required: true },
    donorMessage: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const EndowmentPledge = mongoose.model('Endowment', endowmentPledgeSchema);

module.exports = EndowmentPledge;