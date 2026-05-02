const ActionPanel = ({ action, onStatusChange }) => {
  const canEdit = ["Pending", "In Progress", "Overdue"].includes(action.status);

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{action.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            Linked Incident: {action.incidentId?.title || "N/A"}
          </p>
        </div>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-100">
          {action.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-300">{action.description || "No description added."}</p>
      <p className="mt-3 text-sm text-slate-400">
        Deadline: {new Date(action.deadline).toLocaleDateString()}
      </p>
      {onStatusChange && canEdit && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onStatusChange(action._id, "In Progress")} className="btn-secondary text-sm">
            Start
          </button>
          <button onClick={() => onStatusChange(action._id, "Completed")} className="btn-primary text-sm">
            Mark Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
