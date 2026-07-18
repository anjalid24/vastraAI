import { Link } from 'react-router-dom';
import { HERITAGE, PATTERNS } from '../../data/heritage.js';

/**
 * AuthLayout — split-screen shell shared by Login and Register: a branded
 * heritage panel on the left, the form card on the right.
 */
export default function AuthLayout({ title, subtitle, children, wide = false }) {
  return (
    <div className="container-fluid">
      <div className="row v-min-vh">
        {/* Brand / heritage panel */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
          style={{ background: 'linear-gradient(150deg, var(--v-indigo), #3b1d6e)' }}>
          <Link to="/" className="v-brand text-white fs-3 text-decoration-none">Vastra AI</Link>
          <div>
            <h2 className="display-5 text-white mb-3">Design India's textile heritage, reimagined by AI.</h2>
            <p className="text-white-50">Bandhani, Ikat and Patola — authentic patterns, colours and
              materials at your fingertips.</p>
            <div className="row g-2 mt-3" style={{ maxWidth: 360 }}>
              {PATTERNS.map((p) => (
                <div className="col-4" key={p}>
                  <div className="rounded-3" style={{
                    aspectRatio: '1', background: `linear-gradient(140deg, ${HERITAGE[p].colors[0].hex}, ${HERITAGE[p].colors[1].hex})`,
                  }} />
                  <div className="small text-white-50 mt-1 text-center">{p}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-white-50 small">Preserving heritage, one design at a time.</div>
        </div>

        {/* Form panel */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center py-5 v-weave-bg">
          <div className="w-100 px-3" style={{ maxWidth: wide ? 620 : 440 }}>
            <div className="d-lg-none mb-4">
              <Link to="/" className="v-brand fs-3 text-decoration-none">Vastra AI</Link>
            </div>
            <h1 className="h2 mb-1">{title}</h1>
            {subtitle && <p className="text-muted-2 mb-4">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
