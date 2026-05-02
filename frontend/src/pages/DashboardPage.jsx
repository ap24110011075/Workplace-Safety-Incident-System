import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../components/StatCard";
import IncidentCard from "../components/IncidentCard";
import ActionPanel from "../components/ActionPanel";
import NotificationList from "../components/NotificationList";
import AssignActionForm from "../components/AssignActionForm";
import { useAuth } from "../context/AuthContext";
import { fetchDashboard } from "../services/dashboardService";
import { fetchActions, updateActionStatus } from "../services/actionService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [actions, setActions] = useState([]);

  const loadData = async () => {
    try {
      const [dashboardData, actionData] = await Promise.all([fetchDashboard(), fetchActions()]);
      setDashboard(dashboardData);
      setActions(actionData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateActionStatus(id, { status });
      toast.success("Action status updated");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update action");
    }
  };

  if (!dashboard) {
    return <div className="p-8 text-center text-slate-300">Loading dashboard...</div>;
  }

  const roleMessage = {
    worker: "Track your reported incidents and update your assigned actions.",
    supervisor: "Monitor all incidents and coordinate corrective actions for the team.",
    admin: "Review trends, compliance reports, and overall safety performance."
  };

  const severityDistribution = dashboard.analytics.severityDistribution || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <section className="glass-card overflow-hidden p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-100">{user.role} dashboard</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Welcome, {user.name}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">{roleMessage[user.role]}</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Incidents" value={dashboard.analytics.totalIncidents} helper="All relevant incidents in your view" />
        <StatCard title="Completed" value={dashboard.analytics.completedIncidents} helper="Resolved safety issues" />
        <StatCard title="Pending" value={dashboard.analytics.pendingIncidents} helper="Still requires action or follow-up" />
        <StatCard title="Actions" value={dashboard.analytics.totalActions} helper="Assigned workflow items" />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Recent Incidents</h2>
            <div className="space-y-4">
              {dashboard.recentIncidents.length ? (
                dashboard.recentIncidents.map((incident) => (
                  <IncidentCard key={incident._id} incident={incident} />
                ))
              ) : (
                <div className="glass-card p-5 text-sm text-slate-400">No incidents found yet.</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">
              {user.role === "worker" ? "My Actions" : "Action Workflow"}
            </h2>
            <div className="space-y-4">
              {actions.length ? (
                actions.map((action) => (
                  <ActionPanel
                    key={action._id}
                    action={action}
                    onStatusChange={user.role === "worker" ? handleStatusChange : null}
                  />
                ))
              ) : (
                <div className="glass-card p-5 text-sm text-slate-400">No actions available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(user.role === "supervisor" || user.role === "admin") && <AssignActionForm onCreated={loadData} />}

          <div className="glass-card p-5">
            <h2 className="text-xl font-semibold text-white">Severity Distribution</h2>
            <div className="mt-5 space-y-4">
              {["Low", "Medium", "High", "Critical"].map((level) => (
                <div key={level}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{level}</span>
                    <span>{severityDistribution[level] || 0}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400"
                      style={{
                        width: `${Math.min((severityDistribution[level] || 0) * 18, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Notifications</h2>
            <NotificationList notifications={dashboard.notifications} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
