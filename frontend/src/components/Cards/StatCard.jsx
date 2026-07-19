import { Link } from 'react-router-dom';

/**
 * StatCard — the dashboard "card" primitive. Shows an icon, a value/metric,
 * a label and optional call-to-action link. Used across all role dashboards.
 */
export default function StatCard({
  icon,
  label,
  value,
  hint,
  to,
  cta,
  accent = 'indigo',
}) {
  const accentColor = {
    indigo: 'var(--v-indigo)',
    saffron: 'var(--v-saffron-600)',
    emerald: 'var(--v-emerald-600)',
  }[accent] || 'var(--v-indigo)';

  return (
    <div className="v-card v-card-hover h-100 p-4 d-flex flex-column">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div
          className="v-icon-badge"
          style={{ background: `${accentColor}15`, color: accentColor }}
        >
          {icon}
        </div>
        {hint && <span className="v-chip">{hint}</span>}
      </div>
      {value !== undefined && (
        <div className="fs-2 fw-bold" style={{ fontFamily: 'var(--v-font-head)' }}>
          {value}
        </div>
      )}
      <div className="text-muted-2 fw-semibold">{label}</div>
      {to && (
        <Link to={to} className="mt-auto pt-3 text-decoration-none fw-semibold" style={{ color: accentColor }}>
          {cta || 'Open'} →
        </Link>
      )}
    </div>
  );
}
