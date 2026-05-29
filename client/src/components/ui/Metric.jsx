export function Metric({ icon: Icon, label, value, compact = false }) {
  return (
    <div className={compact ? "metric compact" : "metric"}>
      {Icon && <Icon size={20} />}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
