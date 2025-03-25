const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donationDate: { type: Date, required: true },
    amount: { type: Number, default: 0 },
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endowmentPledgeId: { type: mongoose.Schema.Types.ObjectId, ref: "EndowmentPledge", required: true }
})

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;