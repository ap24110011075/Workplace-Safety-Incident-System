const IncidentCard = ({ incident }) => {
  return (
    <article className="glass-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{incident.location}</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-brand-600/20 px-3 py-1 text-brand-100">
            {incident.severity}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">
            {incident.status}
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{incident.description}</p>
      {incident.mediaUrl && (
        <a
          href={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}${incident.mediaUrl}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm font-medium text-brand-100 underline underline-offset-4"
        >
          View uploaded media
        </a>
      )}
      <p className="mt-4 text-xs text-slate-500">
        Submitted on {new Date(incident.createdAt).toLocaleString()}
      </p>
    </article>
  );
};

export default IncidentCard;
