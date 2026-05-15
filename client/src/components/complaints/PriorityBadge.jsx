const styles = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-800',
  Critical: 'bg-red-100 text-red-700',
};

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}
