import { Link } from 'react-router-dom';
import { HERITAGE } from '../../data/heritage.js';

/**
 * Heritage Inspiration — the studio's signature panel. When a pattern is
 * selected it surfaces that craft's history, authentic colours, recommended
 * materials, motifs and a deep link into the Textile Encyclopedia, tying the
 * generator, material recommendations and encyclopedia together.
 *
 * `onApplyColor` / `onApplyMaterial` let the panel push suggestions back into
 * the studio controls so inspiration becomes action in one click.
 */
export default function HeritagePanel({ pattern, onApplyColor, onApplyMaterial }) {
  const h = HERITAGE[pattern];

  if (!h) {
    return (
      <div className="v-panel p-4 text-center text-muted-2">
        <div className="fs-2 mb-2">📜</div>
        <div className="fw-semibold">Heritage Inspiration</div>
        <p className="small mb-0">Select a pattern to reveal its history, colours and motifs.</p>
      </div>
    );
  }

  return (
    <div className="v-panel overflow-hidden">
      <div className="p-3 text-white position-relative overflow-hidden" style={{
        minHeight: 110,
        background: `linear-gradient(135deg, ${h.colors[0].hex}, ${h.colors[2].hex})`,
      }}>
        {h.image && (
          <img
            src={h.image}
            alt={pattern}
            className="position-absolute inset-0 w-100 h-100 object-fit-cover"
            style={{ opacity: 0.35, mixBlendMode: 'luminosity' }}
          />
        )}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="small text-white-50 text-uppercase" style={{ letterSpacing: '.12em' }}>
            Heritage Inspiration
          </div>
          <div className="h5 text-white mb-0">{pattern}</div>
          <div className="small text-white-50">{h.tagline}</div>
        </div>
      </div>

      <div className="p-3">
        <p className="small text-muted-2">{h.history}</p>

        <SectionLabel>Traditional colours</SectionLabel>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {h.colors.map((c) => (
            <button key={c.hex} type="button" onClick={() => onApplyColor?.(c)}
              className="btn btn-sm d-flex align-items-center gap-2 border rounded-pill px-2 py-1"
              title={`Add ${c.name} to prompt`}>
              <span className="v-swatch" style={{ background: c.hex, width: 18, height: 18 }} />
              <span className="small">{c.name}</span>
            </button>
          ))}
        </div>

        <SectionLabel>Recommended materials</SectionLabel>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {h.materials.map((m) => (
            <button key={m} type="button" onClick={() => onApplyMaterial?.(m)}
              className="v-chip v-chip-emerald border-0" title={`Use ${m}`}>
              🧶 {m}
            </button>
          ))}
        </div>

        <SectionLabel>Authentic motifs</SectionLabel>
        <div className="d-flex flex-wrap gap-1 mb-3">
          {h.motifs.map((m) => (
            <span key={m} className="v-chip">{m}</span>
          ))}
        </div>

        <Link to={`/encyclopedia/${h.slug}`} className="btn btn-outline-primary btn-sm w-100">
          Read more in the Encyclopedia →
        </Link>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="v-eyebrow mb-2" style={{ fontSize: '.68rem' }}>{children}</div>;
}
