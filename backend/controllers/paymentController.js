const Payment = require('../models/paymentModel');

const createPayment = async (req,res) => {
    try {
        const { paymentDate, amount } = req.body;
        const { endowmentPledgeId } = req.params;

        const existingPayment = Payment.findOne({ endowmentPledgeId, paymentDate });

        if (existingPayment) {
            return res.status(400).json({ message: "Payment for this year already exists." })
        };

        const newPayment = new Payment({
            paymentDate,
            amount,
            endowmentPledgeId
        });

        await newPayment.save();

        res.status(201).json({ message: "Payment creation successful." })
    } catch (error) {
        res.status(400).json({ message: "Error creating payment.", error })
    }
};

const createPayments = async (req,res) => {
    try {
        const { payments } = req.body;
        const { endowmentPledgeId } = req.params;

        const newPayments = [];

        for (let i = 0; i < payments.length; i++) {
            const { paymentDate, amount } = payments[i];

            const existingPayment = Payment.findOne({ endowmentPledgeId, paymentDate });

            if (existingPayment) {
                return res.status(400).json({ message: `Payment for the year ${paymentDate} already exists.` })
            };

            newPayments.push({
                paymentDate,
                amount,
                endowmentPledgeId
            })
        }

        await Payment.insertMany(newPayments);

        res.status(201).json({ message: "All payments created successfully.", newPayments })

    } catch (error) {
        res.status(400).json({ message: "Error creating payments.", error })
    }
};

const getPaymentById = async (req,res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.paymentId
        });
        if (!payment) return res.status(404).json({ message: "Payment not found.", error })    

        res.status(200).json({ message: "Payment found.", payment });
    } catch(error) {
        res.status(400).json({ message: "Error retrieving payment.", error })
    }
};

const getAllPayments = async (req,res) => {
    try {
        const payment = await Payment.find({ endowmentPledgeId: req.params.endowmentPledgeId })
        res.status(200).json(payment);
    } catch(error) {
        res.status(400).json({ message: "Error retrieving payments.", error })
    }
};

const updatePayment = async (req,res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.paymentId, req.body, {new:true}
        );
        
        if (!payment) return res.status(404).json({ message: "Payment not found." })
        res.status(200).json({ message: "Payment update successful.", payment })
    } catch (error) {
        res.status(400).json({ message: "Error updating payment.", error })
    }
}

const deletePayment = async (req,res) => {
    try {
        const payment = await Payment.findByIdAndDelete(
            req.params.paymentId
        );

        if (!payment) return res.status(404).json({ message: "Payment not found." })
        res.status(200).json({ message: "Payment deletion successful." })
    } catch (error) {
        res.status(400).json({ message: "Error deleting payment.", error })
    }
};

module.exports = {
    createPayment,
    createPayments,
    getPaymentById,
    getAllPayments,
    updatePayment,
    deletePayment
};