import { useParams, Link } from 'react-router-dom';
import { findArticle, ENCYCLOPEDIA } from '../../data/encyclopedia.js';

// A single encyclopedia article: history, origin, technique, materials,
// colours, gallery, timeline, references and related patterns.
export default function EncyclopediaArticle() {
  const { slug } = useParams();
  const article = findArticle(slug);

  if (!article) {
    return (
      <div className="container py-5 text-center">
        <div className="fs-1 mb-2">📭</div>
        <h3>Article not found</h3>
        <Link to="/encyclopedia" className="btn btn-primary mt-2">Back to encyclopedia</Link>
      </div>
    );
  }

  const related = article.related.map(findArticle).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <div className="position-relative text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${article.accent}, ${article.accent}dd)` }}>
        {article.image && (
          <img
            src={article.image}
            alt={article.name}
            className="position-absolute inset-0 w-100 h-100 object-fit-cover"
            style={{ opacity: 0.25, mixBlendMode: 'luminosity' }}
          />
        )}
        <div className="container py-5 position-relative">
          <Link to="/encyclopedia" className="text-white-50 text-decoration-none small">← Encyclopedia</Link>
          <h1 className="display-4 text-white mt-2 mb-1">{article.name}</h1>
          <p className="lead text-white-50 mb-3">{article.summary}</p>
          <div className="d-flex flex-wrap gap-2">
            <span className="v-chip bg-white text-dark">{article.region}</span>
            <span className="v-chip bg-white text-dark">Origin: {article.origin}</span>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <Section title="Technique">{article.technique}</Section>

            <Section title="Timeline">
              <div className="position-relative ps-4" style={{ borderLeft: `2px solid ${article.accent}` }}>
                {article.timeline.map((t, i) => (
                  <div className="mb-3 position-relative" key={i}>
                    <span className="position-absolute rounded-circle" style={{
                      width: 12, height: 12, background: article.accent, left: -26, top: 6 }} />
                    <div className="fw-bold">{t.year}</div>
                    <div className="text-muted-2">{t.event}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Gallery">
              {article.image && (
                <div className="rounded-3 overflow-hidden mb-3" style={{ height: 260 }}>
                  <img src={article.image} alt={article.name} className="w-100 h-100 object-fit-cover" />
                </div>
              )}
              <div className="row g-2">
                {article.colors.map((c, i) => (
                  <div className="col-4 col-md-3" key={i}>
                    <div className="rounded-3" style={{
                      aspectRatio: '1',
                      background: `linear-gradient(135deg, ${article.accent}, ${article.accent}66)`,
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.5) 2px, transparent 3px)',
                      backgroundSize: '16px 16px',
                    }} />
                  </div>
                ))}
              </div>
              <p className="small text-muted-2 mt-2 mb-0">Authentic handloom weave texture and traditional palette.</p>
            </Section>

            <Section title="References">
              <ul className="text-muted-2">
                {article.references.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Section>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="v-card p-4 mb-3">
              <h6 className="v-eyebrow mb-3">Materials</h6>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {article.materials.map((m) => <span key={m} className="v-chip v-chip-emerald">🧶 {m}</span>)}
              </div>
              <h6 className="v-eyebrow mb-3">Traditional colours</h6>
              <div className="d-flex flex-wrap gap-2">
                {article.colors.map((c) => <span key={c} className="v-chip">{c}</span>)}
              </div>
            </div>

            <div className="v-card p-4 mb-3">
              <h6 className="v-eyebrow mb-3">Try it in the studio</h6>
              <p className="small text-muted-2">Generate your own {article.name} design with authentic colours and motifs.</p>
              <Link to="/studio" className="btn btn-primary w-100">Open Design Studio</Link>
            </div>

            {related.length > 0 && (
              <div className="v-card p-4">
                <h6 className="v-eyebrow mb-3">Related patterns</h6>
                <div className="d-grid gap-2">
                  {related.map((r) => (
                    <Link key={r.slug} to={`/encyclopedia/${r.slug}`}
                      className="v-selectable p-2 d-flex align-items-center gap-2 bg-white text-decoration-none">
                      <span className="v-swatch" style={{ background: r.accent }} />
                      <span className="fw-semibold small text-dark">{r.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="h4 mb-3">{title}</h3>
      <div className="text-muted-2" style={{ lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
