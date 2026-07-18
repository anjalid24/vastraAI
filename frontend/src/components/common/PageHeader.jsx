/**
 * PageHeader — consistent hero strip for interior pages (Community,
 * Encyclopedia, Marketplace, etc.). `eyebrow` + `title` + optional `lead`
 * and right-aligned `actions`.
 */
export default function PageHeader({ eyebrow, title, lead, actions }) {
  return (
    <div className="v-weave-bg border-bottom" style={{ borderColor: 'var(--v-line)' }}>
      <div className="container py-5">
        <div className="row align-items-end g-3">
          <div className="col-lg-8">
            {eyebrow && <div className="v-eyebrow mb-2">{eyebrow}</div>}
            <h1 className="display-6 mb-2">{title}</h1>
            {lead && <p className="lead text-muted-2 mb-0" style={{ maxWidth: 640 }}>{lead}</p>}
          </div>
          {actions && <div className="col-lg-4 text-lg-end">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
