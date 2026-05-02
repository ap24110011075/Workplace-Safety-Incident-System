const express = require("express");
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
} = require("../controllers/incidentController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/").get(protect, getIncidents).post(protect, upload.single("media"), createIncident);
router
  .route("/:id")
  .get(protect, getIncidentById)
  .put(protect, upload.single("media"), updateIncident)
  .delete(protect, deleteIncident);

module.exports = router;
