const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createDonation, createDonations, getAllDonations, getDonationById, updateDonation, deleteDonation } = require("../controllers/donationController");

router.post("/:endowmentPledgeId/donations/create", authenticate, createDonation);
router.get("/:endowmentPledgeId/donations/", authenticate, getAllDonations);
router.get("/:endowmentPledgeId/donation/:donationId", authenticate, getDonationById);
router.put("/:endowmentPledgeId/donation/:donationId", authenticate, updateDonation);
router.delete("/:endowmentPledgeId/donation/:donationId", authenticate, deleteDonation);

module.exports = router;