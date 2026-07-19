/**
 * Loader — a themed spinner. `full` centers it in a min-height viewport
 * region (used while the session re-hydrates or a page loads).
 */
export default function Loader({ full = false, label = 'Loading…', size = 'md' }) {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 56 : 40;
  const spinner = (
    <div className="text-center">
      <div
        className="spinner-border text-primary"
        style={{ width: dim, height: dim, borderWidth: Math.max(2, dim / 12) }}
        role="status"
      >
        <span className="visually-hidden">{label}</span>
      </div>
      {label && <div className="mt-3 text-muted-2 fw-semibold">{label}</div>}
    </div>
  );

  if (full) {
    return <div className="d-flex align-items-center justify-content-center v-min-vh">{spinner}</div>;
  }
  return <div className="d-flex align-items-center justify-content-center py-5">{spinner}</div>;
}
