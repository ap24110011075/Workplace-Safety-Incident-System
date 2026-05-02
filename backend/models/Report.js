const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      default: null
    },
    reportUrl: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ["pdf", "json"],
      required: true
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Report", reportSchema);
