const express = require("express");
const { getReports, generateJsonReport, generatePdfReport } = require("../controllers/reportController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getReports);
router.post("/json", protect, authorizeRoles("admin"), generateJsonReport);
router.post("/pdf", protect, authorizeRoles("admin"), generatePdfReport);

module.exports = router;
