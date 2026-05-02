import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import IncidentCard from "../components/IncidentCard";
import { fetchIncidents } from "../services/incidentService";
import { getOfflineIncidents } from "../utils/offlineQueue";

const IncidentListPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [offlineIncidents, setOfflineIncidents] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    status: "",
    page: 1
  });
  const [pagination, setPagination] = useState(null);

  const loadIncidents = async () => {
    try {
      const data = await fetchIncidents(filters);
      setIncidents(data.incidents);
      setPagination(data.pagination);
      setOfflineIncidents(getOfflineIncidents());
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load incidents");
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [filters.page]);

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
      page: 1
    }));
  };

  const applyFilters = () => {
    loadIncidents();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold text-white">Incident List</h1>
        <p className="mt-2 text-slate-300">Search, filter, and review all safety incidents relevant to your role.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <input
            name="search"
            className="input-field"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search incidents"
          />
          <select name="severity" className="input-field" value={filters.severity} onChange={handleFilterChange}>
            <option value="">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select name="status" className="input-field" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={applyFilters} className="btn-primary">
            Apply Filters
          </button>
        </div>
      </div>

      {!!offlineIncidents.length && (
        <div className="mt-6 glass-card border-amber-500/30 p-5">
          <h2 className="text-lg font-semibold text-white">Offline Queue</h2>
          <p className="mt-2 text-sm text-amber-100">
            These incidents were saved locally and will sync when the network is restored.
          </p>
          <div className="mt-4 space-y-3">
            {offlineIncidents.map((incident) => (
              <div key={incident.localId} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="font-semibold text-white">{incident.title}</p>
                <p className="mt-1 text-sm text-slate-300">{incident.location}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Saved locally on {new Date(incident.savedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {incidents.length ? (
          incidents.map((incident) => <IncidentCard key={incident._id} incident={incident} />)
        ) : (
          <div className="glass-card p-5 text-slate-400">No incidents available.</div>
        )}
      </div>

      {pagination && (
        <div className="mt-6 flex items-center justify-between">
          <button
            className="btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
          >
            Previous
          </button>
          <p className="text-sm text-slate-300">
            Page {pagination.page} of {pagination.pages || 1}
          </p>
          <button
            className="btn-secondary"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default IncidentListPage;
