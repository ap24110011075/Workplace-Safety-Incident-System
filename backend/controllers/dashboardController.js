const Incident = require("../models/Incident");
const Action = require("../models/Action");
const Notification = require("../models/Notification");

const getDashboardData = async (req, res, next) => {
  try {
    const incidentQuery = req.user.role === "worker" ? { createdBy: req.user._id } : {};
    const actionQuery = req.user.role === "worker" ? { assignedTo: req.user._id } : {};

    const [incidents, actions, notifications] = await Promise.all([
      Incident.find(incidentQuery).sort({ createdAt: -1 }).limit(5),
      Action.find(actionQuery).sort({ createdAt: -1 }).limit(5),
      Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5)
    ]);

    const scopedIncidents = await Incident.find(incidentQuery).select("severity status");
    const analytics = {
      totalIncidents: scopedIncidents.length,
      completedIncidents: scopedIncidents.filter((incident) => incident.status === "Completed").length,
      pendingIncidents: scopedIncidents.filter((incident) =>
        ["Pending", "In Progress"].includes(incident.status)
      ).length,
      totalActions: await Action.countDocuments(actionQuery),
      severityDistribution: scopedIncidents.reduce(
        (acc, incident) => {
          acc[incident.severity] = (acc[incident.severity] || 0) + 1;
          return acc;
        },
        { Low: 0, Medium: 0, High: 0, Critical: 0 }
      )
    };

    res.json({
      role: req.user.role,
      analytics,
      recentIncidents: incidents,
      recentActions: actions,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };
