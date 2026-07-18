import { Link } from 'react-router-dom';
import { BlockPrintDivider, Mandala } from '../ornaments/Ornaments.jsx';

const COLS = [
  {
    title: 'Create',
    links: [
      { to: '/studio', label: 'Design Studio' },
      { to: '/materials', label: 'Material Explorer' },
      { to: '/pricing', label: 'Pricing Calculator' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { to: '/community', label: 'Community' },
      { to: '/encyclopedia', label: 'Encyclopedia' },
      { to: '/marketplace', label: 'Artisan Marketplace' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/subscription', label: 'Subscription' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="v-footer pt-0 pb-4 mt-auto position-relative overflow-hidden">
      <BlockPrintDivider tone="gold" style={{ opacity: 0.5 }} />
      <Mandala size={300} color="#c9a24b" opacity={0.06} className="position-absolute d-none d-md-block"
        style={{ bottom: -110, right: -80, pointerEvents: 'none' }} />
      <div className="container pt-5 position-relative">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="v-brand fs-3 mb-1" style={{ color: '#f7efe1' }}>Vastra AI</div>
            <div className="text-gold mb-2" style={{ fontFamily: 'var(--v-font-head)', letterSpacing: '.1em' }}>
              वस्त्र · कारीगर · परंपरा
            </div>
            <p className="mb-3" style={{ maxWidth: 320, color: '#b9ab92' }}>
              AI-powered textile design that preserves India's heritage crafts —
              connecting brands, artisans and living traditions.
            </p>
            <div className="v-thread-line" />
          </div>
          {COLS.map((col) => (
            <div className="col-6 col-lg-2" key={col.title}>
              <h6 className="text-white text-uppercase small fw-bold mb-3" style={{ letterSpacing: '.1em' }}>
                {col.title}
              </h6>
              <ul className="list-unstyled d-grid gap-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-lg-2">
            <h6 className="text-white text-uppercase small fw-bold mb-3" style={{ letterSpacing: '.1em' }}>
              Heritage
            </h6>
            <p className="text-white-50 small mb-0">
              Bandhani · Ikat · Patola<br />and the crafts of India.
            </p>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span className="text-white-50 small">
            © {new Date().getFullYear()} Vastra AI. Crafted with heritage in mind.
          </span>
          <span className="text-white-50 small">Made for India's weavers 🧵</span>
        </div>
      </div>
    </footer>
  );
}
