const express = require("express");
const { createAction, getActions, updateActionStatus } = require("../controllers/actionController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getActions).post(protect, authorizeRoles("supervisor", "admin"), createAction);
router.patch("/:id", protect, updateActionStatus);

module.exports = router;
