const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    paymentDate: { type: Date, required: true },
    amount: { type: Number, default: 0 },
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endowmentPledgeId: { type: mongoose.Schema.Types.ObjectId, ref: "EndowmentPledge", required: true }    
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;