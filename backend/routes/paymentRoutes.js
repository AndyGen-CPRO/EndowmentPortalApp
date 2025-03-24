const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createPayment, createPayments, getAllPayments, getPaymentById, updatePayment, deletePayment } = require("../controllers/paymentController");

router.post("/:endowmentPledgeId/payments/create", authenticate, createPayment);
router.post("/:endowmentPledgeId/payments/create-many", authenticate, createPayments);
router.get("/:endowmentPledgeId/", authenticate, getAllPayments);
router.get("/:endowmentPledgeId/payment/:paymentId", authenticate, getPaymentById);
router.put("/:endowmentPledgeId/payment/:paymentId", authenticate, updatePayment);
router.delete("/:endowmentPledgeId/payment/:paymentId", authenticate, deletePayment);

module.exports = router;