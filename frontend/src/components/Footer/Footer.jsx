import { Link } from 'react-router-dom';

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
    <footer className="v-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="v-brand text-white fs-4 mb-2">Vastra AI</div>
            <p className="text-white-50 mb-3" style={{ maxWidth: 320 }}>
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
