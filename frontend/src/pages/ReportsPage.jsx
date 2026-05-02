import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchReports, generateJsonReport, generatePdfReport } from "../services/reportService";

const ReportsPage = () => {
  const [reportsData, setReportsData] = useState(null);

  const loadReports = async () => {
    try {
      const data = await fetchReports();
      setReportsData(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load reports");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async (type) => {
    try {
      if (type === "pdf") {
        await generatePdfReport();
      } else {
        await generateJsonReport();
      }
      toast.success(`${type.toUpperCase()} report generated`);
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not generate report");
    }
  };

  if (!reportsData) {
    return <div className="p-8 text-center text-slate-300">Loading reports...</div>;
  }

  const { analytics, reports } = reportsData;
  const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="glass-card p-6 md:p-8">
        <h1 className="text-3xl font-bold text-white">Compliance Reports</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Review basic analytics, monitor safety trends, and generate PDF or JSON compliance documents for audits.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => handleGenerate("pdf")} className="btn-primary">
            Generate PDF Report
          </button>
          <button onClick={() => handleGenerate("json")} className="btn-secondary">
            Generate JSON Report
          </button>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Total Incidents</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{analytics.totalIncidents}</h3>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Completed Incidents</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{analytics.completedIncidents}</h3>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Pending Incidents</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{analytics.pendingIncidents}</h3>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-slate-400">Overdue Actions</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{analytics.overdueActions}</h3>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card p-5">
          <h2 className="text-xl font-semibold text-white">Severity Trend</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(analytics.severityDistribution).map(([severity, count]) => (
              <div key={severity}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                  <span>{severity}</span>
                  <span>{count}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                    style={{ width: `${Math.min(count * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-xl font-semibold text-white">Generated Reports</h2>
          <div className="mt-5 space-y-4">
            {reports.length ? (
              reports.map((report) => (
                <div key={report._id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{report.format.toUpperCase()} Report</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Generated on {new Date(report.generatedAt).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={`${baseUrl}${report.reportUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary text-sm"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400">No reports generated yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;
