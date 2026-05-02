const path = require("path");
const Incident = require("../models/Incident");
const Notification = require("../models/Notification");

const createIncident = async (req, res, next) => {
  try {
    const { title, description, location, severity, sync_status } = req.body;

    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const incident = await Incident.create({
      title,
      description,
      location,
      severity,
      mediaUrl,
      sync_status: sync_status || "synced",
      createdBy: req.user._id
    });

    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
};

const getIncidents = async (req, res, next) => {
  try {
    const { severity, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === "worker") {
      query.createdBy = req.user._id;
    }

    if (severity) {
      query.severity = severity;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const [incidents, total] = await Promise.all([
      Incident.find(query)
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Incident.countDocuments(query)
    ]);

    res.json({
      incidents,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        pages: Math.ceil(total / perPage)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate("createdBy", "name email role");

    if (!incident) {
      res.status(404);
      throw new Error("Incident not found");
    }

    const isOwner = incident.createdBy._id.toString() === req.user._id.toString();
    const canAccess = req.user.role !== "worker" || isOwner;

    if (!canAccess) {
      res.status(403);
      throw new Error("You are not allowed to view this incident");
    }

    res.json(incident);
  } catch (error) {
    next(error);
  }
};

const updateIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      res.status(404);
      throw new Error("Incident not found");
    }

    const isOwner = incident.createdBy.toString() === req.user._id.toString();
    const canEdit = req.user.role !== "worker" || isOwner;

    if (!canEdit) {
      res.status(403);
      throw new Error("You are not allowed to update this incident");
    }

    const updates = {
      title: req.body.title || incident.title,
      description: req.body.description || incident.description,
      location: req.body.location || incident.location,
      severity: req.body.severity || incident.severity,
      status: req.body.status || incident.status,
      sync_status: req.body.sync_status || incident.sync_status
    };

    if (req.file) {
      updates.mediaUrl = `/uploads/${req.file.filename}`;
    }

    const updatedIncident = await Incident.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });

    await Notification.create({
      userId: incident.createdBy,
      message: `Incident "${updatedIncident.title}" was updated.`,
      type: "incident_updated"
    });

    res.json(updatedIncident);
  } catch (error) {
    next(error);
  }
};

const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      res.status(404);
      throw new Error("Incident not found");
    }

    const isOwner = incident.createdBy.toString() === req.user._id.toString();
    const canDelete = req.user.role === "admin" || isOwner;

    if (!canDelete) {
      res.status(403);
      throw new Error("You are not allowed to delete this incident");
    }

    await incident.deleteOne();
    res.json({ message: "Incident deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
};
