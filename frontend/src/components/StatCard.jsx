const StatCard = ({ title, value, helper }) => {
  return (
    <div className="glass-card p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </div>
  );
};

export default StatCard;
