import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import { ENCYCLOPEDIA } from '../../data/encyclopedia.js';

// Textile Encyclopedia — searchable list of craft articles.
export default function Encyclopedia() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ENCYCLOPEDIA;
    return ENCYCLOPEDIA.filter((a) =>
      [a.name, a.region, a.summary, ...a.materials].join(' ').toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <>
      <PageHeader
        eyebrow="Textile Encyclopedia"
        deva="ज्ञानकोश"
        title="The stories woven into every craft"
        lead="Explore the history, technique, materials and motifs behind India's living textile traditions."
      />
      <div className="container py-4">
        <div className="v-card p-3 mb-4 d-flex align-items-center gap-2">
          <span className="fs-5">🔍</span>
          <input className="form-control border-0 shadow-none" placeholder="Search crafts, regions, materials…"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {ENCYCLOPEDIA.map((a) => (
            <button key={a.slug} className="v-chip border-0"
              style={{ background: `${a.accent}18`, color: a.accent }}
              onClick={() => setQ(a.name)}>{a.name}</button>
          ))}
        </div>

        <div className="row g-4">
          {results.map((a) => (
            <div className="col-md-6 col-lg-4" key={a.slug}>
              <Link to={`/encyclopedia/${a.slug}`} className="text-decoration-none">
                <div className="v-card v-card-hover h-100 overflow-hidden">
                  <div className="position-relative overflow-hidden" style={{ height: 160 }}>
                    {a.image ? (
                      <img src={a.image} alt={a.name} className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div style={{ height: '100%', background: `linear-gradient(135deg, ${a.accent}, ${a.accent}99)` }} />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="v-chip mb-2" style={{ background: `${a.accent}18`, color: a.accent }}>{a.region}</span>
                    <h5 className="text-dark">{a.name}</h5>
                    <p className="text-muted-2 small mb-0">{a.summary}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {results.length === 0 && (
            <div className="col-12 text-center text-muted-2 py-5">No articles match "{q}".</div>
          )}
        </div>
      </div>
    </>
  );
}
