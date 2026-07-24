import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_LABELS, ROLE_CHIP } from '../../utils/constants.js';
import { initials } from '../../utils/formatters.js';

// Primary navigation, matching the spec's navbar. Auth-aware: shows
// Login/Register when signed out, and an account menu when signed in.
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/studio', label: 'Design Studio' },
  { to: '/community', label: 'Community' },
  { to: '/encyclopedia', label: 'Encyclopedia' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg v-navbar sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand v-brand fs-3 d-flex align-items-center gap-2" to="/">
          <span
            className="d-inline-grid"
            style={{
              width: 38,
              height: 38,
              placeItems: 'center',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 25%, #a6234c, #1b2a6b 70%)',
              color: '#fdf6f4',
              fontFamily: 'var(--v-font-head)',
              fontSize: '1.25rem',
              boxShadow: 'inset 0 0 0 1.5px var(--v-gold)',
            }}
          >
            व
          </span>
          <span className="lh-1">
            Vastra&nbsp;AI
            <span className="d-block text-gold" style={{ fontFamily: 'var(--v-font-body)', fontSize: '.62rem', letterSpacing: '.28em', fontWeight: 700 }}>
              वस्त्र
            </span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#vNav"
          aria-controls="vNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="vNav">
          <ul className="navbar-nav mx-lg-auto gap-lg-1">
            {LINKS.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink className="nav-link" to={l.to} end={l.end}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-light border rounded-pill d-flex align-items-center gap-2 dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="d-inline-grid rounded-circle text-white"
                    style={{
                      width: 30, height: 30, placeItems: 'center',
                      background: 'var(--v-indigo)', fontSize: '.8rem', fontWeight: 700,
                    }}
                  >
                    {initials(user?.name)}
                  </span>
                  <span className="d-none d-sm-inline fw-semibold">{user?.name?.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                  <li className="px-3 py-2">
                    <div className="fw-semibold">{user?.name}</div>
                    <span className={`${ROLE_CHIP[role] || 'v-chip'} mt-1`}>
                      {ROLE_LABELS[role] || role}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/studio">Design Studio</Link></li>
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  {role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin">Admin</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
