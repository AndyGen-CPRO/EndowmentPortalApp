const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
    createEndowmentPledge, getEndowmentPledgeById, getAllEndowmentPledges, updateEndowmentPledge, deleteEndowmentPledge
} = require('../controllers/endowmentController')

router.post("/create", authenticate, createEndowmentPledge);
router.get("/", authenticate, getAllEndowmentPledges);
router.get("/:endowmentPledgeId", authenticate, getEndowmentPledgeById);
router.put("/:endowmentPledgeId", authenticate, updateEndowmentPledge);
router.delete("/:endowmentPledgeId", authenticate, deleteEndowmentPledge);

module.exports = router;