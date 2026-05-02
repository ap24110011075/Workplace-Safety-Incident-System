const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Incident = require("../models/Incident");
const Action = require("../models/Action");
const Report = require("../models/Report");

const reportsDir = path.join(__dirname, "..", "uploads", "reports");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const getAnalyticsData = async () => {
  const incidents = await Incident.find();
  const actions = await Action.find();

  const severityCounts = incidents.reduce(
    (acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    },
    { Low: 0, Medium: 0, High: 0, Critical: 0 }
  );

  return {
    totalIncidents: incidents.length,
    completedIncidents: incidents.filter((incident) => incident.status === "Completed").length,
    pendingIncidents: incidents.filter((incident) => incident.status !== "Completed").length,
    severityDistribution: severityCounts,
    totalActions: actions.length,
    overdueActions: actions.filter((action) => action.status === "Overdue").length
  };
};

const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    const analytics = await getAnalyticsData();

    res.json({ reports, analytics });
  } catch (error) {
    next(error);
  }
};

const generateJsonReport = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsData();
    const fileName = `report-${Date.now()}.json`;
    const filePath = path.join(reportsDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(analytics, null, 2));

    const report = await Report.create({
      reportUrl: `/uploads/reports/${fileName}`,
      format: "json",
      createdBy: req.user._id
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const generatePdfReport = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsData();
    const fileName = `report-${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(20).text("Workplace Safety Compliance Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated On: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text(`Total Incidents: ${analytics.totalIncidents}`);
    doc.text(`Completed Incidents: ${analytics.completedIncidents}`);
    doc.text(`Pending Incidents: ${analytics.pendingIncidents}`);
    doc.text(`Total Actions: ${analytics.totalActions}`);
    doc.text(`Overdue Actions: ${analytics.overdueActions}`);
    doc.moveDown();
    doc.text("Severity Distribution:");
    Object.entries(analytics.severityDistribution).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    doc.end();

    stream.on("finish", async () => {
      const report = await Report.create({
        reportUrl: `/uploads/reports/${fileName}`,
        format: "pdf",
        createdBy: req.user._id
      });

      res.status(201).json(report);
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports, generateJsonReport, generatePdfReport };
