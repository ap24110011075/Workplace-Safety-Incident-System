const Action = require("../models/Action");
const Incident = require("../models/Incident");
const Notification = require("../models/Notification");

const createAction = async (req, res, next) => {
  try {
    const { incidentId, assignedTo, deadline, title, description } = req.body;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      res.status(404);
      throw new Error("Incident not found");
    }

    const action = await Action.create({
      incidentId,
      assignedTo,
      assignedBy: req.user._id,
      deadline,
      title,
      description
    });

    incident.status = "In Progress";
    await incident.save();

    await Notification.create({
      userId: assignedTo,
      message: `A new action "${title}" has been assigned to you.`,
      type: "action_assigned"
    });

    res.status(201).json(action);
  } catch (error) {
    next(error);
  }
};

const getActions = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === "worker") {
      query.assignedTo = req.user._id;
    }

    const actions = await Action.find(query)
      .populate("incidentId", "title location severity status")
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .sort({ deadline: 1 });

    const now = new Date();

    const updatedActions = await Promise.all(
      actions.map(async (action) => {
        if (!["Completed", "Overdue"].includes(action.status) && new Date(action.deadline) < now) {
          action.status = "Overdue";
          await action.save();

          await Notification.create({
            userId: action.assignedTo._id || action.assignedTo,
            message: `Deadline missed for action "${action.title}".`,
            type: "deadline_missed"
          });
        }

        return action;
      })
    );

    res.json(updatedActions);
  } catch (error) {
    next(error);
  }
};

const updateActionStatus = async (req, res, next) => {
  try {
    const action = await Action.findById(req.params.id);

    if (!action) {
      res.status(404);
      throw new Error("Action not found");
    }

    const isAssignedWorker = action.assignedTo.toString() === req.user._id.toString();
    const canUpdate = req.user.role !== "worker" || isAssignedWorker;

    if (!canUpdate) {
      res.status(403);
      throw new Error("You are not allowed to update this action");
    }

    action.status = req.body.status || action.status;
    await action.save();

    const incidentActions = await Action.find({ incidentId: action.incidentId });
    const allCompleted = incidentActions.every((item) => item.status === "Completed");

    if (allCompleted) {
      await Incident.findByIdAndUpdate(action.incidentId, { status: "Completed" });
    }

    res.json(action);
  } catch (error) {
    next(error);
  }
};

module.exports = { createAction, getActions, updateActionStatus };
