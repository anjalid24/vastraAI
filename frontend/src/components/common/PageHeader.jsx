import { Eyebrow, BlockPrintDivider, Mandala } from '../ornaments/Ornaments.jsx';

/**
 * PageHeader — consistent hero strip for interior pages (Community,
 * Encyclopedia, Marketplace, etc.). Carries the brand's bilingual eyebrow,
 * a faint mandala, and a block-print rule at its base.
 */
export default function PageHeader({ eyebrow, deva, title, lead, actions }) {
  return (
    <div className="v-weave-bg border-bottom position-relative overflow-hidden"
      style={{ borderColor: 'var(--v-line)' }}>
      <Mandala size={300} className="position-absolute d-none d-md-block"
        style={{ top: -90, right: -70, pointerEvents: 'none' }} />
      <div className="container py-5 position-relative">
        <div className="row align-items-end g-3">
          <div className="col-lg-8">
            {eyebrow && <Eyebrow deva={deva} className="mb-2 d-inline-block">{eyebrow}</Eyebrow>}
            <h1 className="display-5 mt-2 mb-2">{title}</h1>
            <span className="v-thread-line d-block mb-3" />
            {lead && <p className="lead text-muted-2 mb-0" style={{ maxWidth: 640 }}>{lead}</p>}
          </div>
          {actions && <div className="col-lg-4 text-lg-end">{actions}</div>}
        </div>
      </div>
      <BlockPrintDivider tone="gold" />
    </div>
  );
}
