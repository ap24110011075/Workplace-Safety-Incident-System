const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("supervisor", "admin"), getUsers);

module.exports = router;
