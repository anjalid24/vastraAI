/**
 * FeatureCard — marketing card used on the landing page's "Why Choose" grid.
 */
export default function FeatureCard({ icon, title, children, accent = 'indigo' }) {
  const accentColor = {
    indigo: 'var(--v-indigo)',
    saffron: 'var(--v-saffron-600)',
    emerald: 'var(--v-emerald-600)',
  }[accent] || 'var(--v-indigo)';

  return (
    <div className="v-card v-card-hover h-100 p-4">
      <div
        className="v-icon-badge mb-3"
        style={{ background: `${accentColor}15`, color: accentColor }}
      >
        {icon}
      </div>
      <h5 className="mb-2">{title}</h5>
      <p className="text-muted-2 mb-0">{children}</p>
    </div>
  );
}
