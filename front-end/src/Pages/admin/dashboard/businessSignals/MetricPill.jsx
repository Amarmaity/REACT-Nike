const MetricPill = ({ label, value }) => {
  return (
    <div className="bg-white/5 rounded-xl px-4 py-3">
      <p className="text-xs text-white/50">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
};

export default MetricPill;
