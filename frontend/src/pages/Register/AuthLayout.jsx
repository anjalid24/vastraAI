import { Link } from 'react-router-dom';
import { HERITAGE, PATTERNS } from '../../data/heritage.js';
import { ArchArt, Mandala } from '../../components/ornaments/Ornaments.jsx';

/**
 * AuthLayout — split-screen shell shared by Login and Register: a branded
 * heritage panel on the left, the form card on the right.
 */
export default function AuthLayout({ title, subtitle, children, wide = false }) {
  return (
    <div className="container-fluid">
      <div className="row v-min-vh">
        {/* Brand / heritage panel */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 position-relative overflow-hidden"
          style={{ background: 'radial-gradient(140% 120% at 15% 0%, #a6234c 0%, #1b2a6b 55%, #14205a 100%)', color: '#fdf6f4' }}>
          <Mandala size={360} color="#c9a24b" opacity={0.14} className="position-absolute"
            style={{ top: -100, right: -90, pointerEvents: 'none' }} />
          <Link to="/" className="v-brand fs-2 text-decoration-none position-relative" style={{ color: '#fdf6f4' }}>
            Vastra AI
            <span className="d-block text-gold" style={{ fontSize: '.8rem', letterSpacing: '.3em', fontFamily: 'var(--v-font-body)', fontWeight: 700 }}>वस्त्र</span>
          </Link>
          <div className="position-relative">
            <h2 className="display-5 mb-3" style={{ color: '#fdf6f4' }}>Design India's textile heritage, reimagined by AI.</h2>
            <p style={{ color: 'rgba(247,239,225,.72)' }}>Bandhani, Ikat and Patola — authentic patterns, colours and
              materials at your fingertips.</p>
            <div className="row g-3 mt-2" style={{ maxWidth: 380 }}>
              {PATTERNS.map((p) => (
                <div className="col-4" key={p}>
                  <ArchArt style={{ borderColor: 'var(--v-gold)', boxShadow: 'none' }}>
                    <div style={{
                      aspectRatio: '3/4', background: `linear-gradient(140deg, ${HERITAGE[p].colors[0].hex}, ${HERITAGE[p].colors[1].hex})`,
                    }} />
                  </ArchArt>
                  <div className="small mt-1 text-center text-gold">{p}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="small position-relative" style={{ color: 'rgba(247,239,225,.6)' }}>
            परंपरा — preserving heritage, one design at a time.
          </div>
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
