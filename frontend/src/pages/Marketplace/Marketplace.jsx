import { useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import Button from '../../components/Buttons/Button.jsx';
import { ARTISANS } from '../../data/artisans.js';
import { initials } from '../../utils/formatters.js';

// Artisan Marketplace — browse artisans, view profiles, and (mock) contact.
export default function Marketplace() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ARTISANS;
    return ARTISANS.filter((a) => [a.name, a.craft, a.city].join(' ').toLowerCase().includes(term));
  }, [q]);

  return (
    <>
      <PageHeader
        eyebrow="Artisan Marketplace"
        deva="कारीगर"
        title="Commission India's master makers"
        lead="Discover skilled artisans across the country and bring your AI designs to life on real handlooms."
      />
      <div className="container py-4">
        <div className="v-card p-3 mb-4 d-flex align-items-center gap-2">
          <span className="fs-5">🔍</span>
          <input className="form-control border-0 shadow-none" placeholder="Search by name, craft or city…"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="row g-4">
          {results.map((a) => (
            <div className="col-md-6 col-lg-4" key={a.id}>
              <div className="v-card v-card-hover h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  {a.image ? (
                    <img
                      src={a.image}
                      alt={a.name}
                      className="rounded-4 object-fit-cover flex-shrink-0"
                      style={{ width: 60, height: 60, border: `2px solid ${a.accent}` }}
                    />
                  ) : (
                    <span className="d-inline-grid rounded-4 text-white flex-shrink-0" style={{
                      width: 60, height: 60, placeItems: 'center', background: a.accent,
                      fontWeight: 700, fontSize: '1.1rem' }}>{initials(a.name)}</span>
                  )}
                  <div>
                    <h5 className="mb-0">{a.name}</h5>
                    <div className="small text-muted-2">{a.craft}</div>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="v-chip v-chip-saffron">★ {a.rating}</span>
                  <span className="v-chip">{a.experience} yrs</span>
                  <span className="v-chip v-chip-emerald">🖼️ {a.portfolio}</span>
                </div>
                <div className="small text-muted-2 mb-3">📍 {a.city}</div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => setActive(a)}>View profile</Button>
                  <Button variant="primary" size="sm" onClick={() => setActive(a)}>Contact</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name} size="md"
        footer={<Button variant="primary" onClick={() => setActive(null)}>Send request</Button>}>
        {active && (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              {active.image ? (
                <img
                  src={active.image}
                  alt={active.name}
                  className="rounded-4 object-fit-cover flex-shrink-0"
                  style={{ width: 64, height: 64, border: `2px solid ${active.accent}` }}
                />
              ) : (
                <span className="d-inline-grid rounded-4 text-white" style={{
                  width: 56, height: 56, placeItems: 'center', background: active.accent, fontWeight: 700 }}>
                  {initials(active.name)}</span>
              )}
              <div>
                <div className="fw-semibold">{active.craft}</div>
                <div className="small text-muted-2">📍 {active.city} · ★ {active.rating}</div>
              </div>
            </div>
            <p className="text-muted-2">{active.bio}</p>
            <div className="d-flex gap-2">
              <span className="v-chip">{active.experience} years experience</span>
              <span className="v-chip v-chip-emerald">{active.portfolio} portfolio pieces</span>
            </div>
            <p className="small text-muted-2 mt-3 mb-0">Contacting artisans is a preview — messaging goes live with the artisan module.</p>
          </>
        )}
      </Modal>
    </>
  );
}
