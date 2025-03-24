const mongoose = require("mongoose");

const endowmentPledgeSchema = new mongoose.Schema({
    beneficiary: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['on-going', 'complete', 'cancelled'], required: true },
    pledgeStart: { type: Date, required: true },
    pledgeEnd: { type: Date, required: true },
    totalPayment: { type: Number, default: 0 },
    paymentType: { type: String, enum: ['fixed', 'custom'], required: true },
    message: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const EndowmentPledge = mongoose.model('Endowment', endowmentPledgeSchema);

module.exports = EndowmentPledge;