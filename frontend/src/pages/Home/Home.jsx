import { Link } from 'react-router-dom';
import FeatureCard from '../../components/Cards/FeatureCard.jsx';
import { Eyebrow, BlockPrintDivider, ArchArt, Mandala, Paisley } from '../../components/ornaments/Ornaments.jsx';
import { HERITAGE, PATTERNS } from '../../data/heritage.js';
import { ENCYCLOPEDIA } from '../../data/encyclopedia.js';
import { COMMUNITY_POSTS } from '../../data/community.js';
import { ARTISANS } from '../../data/artisans.js';
import { PLANS } from '../../data/plans.js';
import { formatINR, initials } from '../../utils/formatters.js';
import { ROLE_CHIP, ROLE_LABELS } from '../../utils/constants.js';

// Landing page — introduces Vastra AI, showcases features, and drives signup.
export default function Home() {
  return (
    <>
      <Hero />
      <GeneratorPreview />
      <TextileShowcase />
      <WhyVastra />
      <FeaturedCommunity />
      <FeaturedArtisans />
      <EncyclopediaPreview />
      <PlansStrip />
      <CtaBanner />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */
function Hero() {
  return (
    <section className="v-weave-bg position-relative overflow-hidden">
      <Mandala size={420} className="position-absolute" style={{ top: -120, right: -110, pointerEvents: 'none' }} />
      <Mandala size={260} color="#a6234c" opacity={0.08} className="position-absolute d-none d-lg-block"
        style={{ bottom: -80, left: -70, pointerEvents: 'none' }} />
      <div className="container py-5 position-relative">
        <div className="row align-items-center g-5 py-lg-4">
          <div className="col-lg-6">
            <span className="v-chip v-chip-saffron mb-3 v-rise">🧵 वस्त्र · Preserving India's textile heritage</span>
            <h1 className="display-2 mb-3 v-rise">
              Weave <span className="text-rani">heritage</span> into
              every <span className="text-indigo">design</span>
            </h1>
            <p className="lead text-muted-2 mb-4 v-rise-2" style={{ maxWidth: 540 }}>
              Vastra AI generates Bandhani, Ikat and Patola in seconds — grounded in
              real craft, matched to the right fabric, and tied to the artisans and
              stories that keep these traditions alive.
            </p>
            <div className="d-flex flex-wrap gap-3 v-rise-2">
              <Link to="/register" className="btn btn-primary btn-lg">Start designing free</Link>
              <Link to="/studio" className="btn btn-outline-primary btn-lg">Open the Studio</Link>
            </div>
            <div className="d-flex flex-wrap gap-4 mt-4 text-muted-2 v-rise-3">
              <Stat n="3" label="Living craft traditions" />
              <Stat n="50+" label="Authentic motifs" />
              <Stat n="9" label="Fabric categories" />
            </div>
          </div>
          <div className="col-lg-6 v-rise-3">
            <HeroArtCard />
          </div>
        </div>
      </div>
      <BlockPrintDivider tone="gold" />
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="fs-3 fw-bold text-indigo" style={{ fontFamily: 'var(--v-font-head)' }}>{n}</div>
      <div className="small">{label}</div>
    </div>
  );
}

// A decorative "generated design" panel: three heritage patterns framed inside
// a temple arch (the signature motif). Built from heritage colours — no images,
// so the landing page stays fast and offline-friendly.
function HeroArtCard() {
  return (
    <div className="v-card p-3 p-sm-4" style={{ boxShadow: 'var(--v-shadow-lg)' }}>
      <ArchArt>
        <div className="row g-0" style={{ background: 'var(--v-parchment-2)' }}>
          {PATTERNS.map((p) => (
            <div className="col-4" key={p}>
              <div
                className="d-flex align-items-end p-2 text-white"
                style={{
                  aspectRatio: '3/4',
                  background: `linear-gradient(160deg, ${HERITAGE[p].colors[0].hex}, ${HERITAGE[p].colors[1].hex})`,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <span className="small fw-semibold" style={{ zIndex: 1 }}>{p}</span>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.55) 2px, transparent 3px)',
                  backgroundSize: '18px 18px', opacity: .5,
                }} />
              </div>
            </div>
          ))}
        </div>
      </ArchArt>
      <div className="d-flex align-items-center justify-content-between mt-3 px-1">
        <div className="d-flex align-items-center gap-2">
          <Paisley size={26} color="var(--v-gold-deep)" />
          <div>
            <div className="fw-semibold" style={{ fontFamily: 'var(--v-font-head)' }}>AI Design Studio</div>
            <div className="small text-muted-2">Bandhani · Ikat · Patola</div>
          </div>
        </div>
        <span className="v-chip v-chip-emerald">Authenticity 94%</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------- Generator preview */
function GeneratorPreview() {
  return (
    <section className="v-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2">
            <Eyebrow deva="रचना">AI Design Generator</Eyebrow>
            <h2 className="display-5 my-2">From prompt to pattern, in a breath</h2>
            <p className="text-muted-2 mb-4">
              Pick a heritage pattern and fabric, describe your vision, and let
              Vastra AI generate ready-to-use textile designs — complete with an
              authenticity score, recommended materials and traditional colours.
            </p>
            <ul className="list-unstyled d-grid gap-2">
              {['Pattern & material presets', 'Reference image upload', 'Seed / steps / CFG controls', 'Heritage Inspiration panel'].map((t) => (
                <li key={t} className="d-flex align-items-center gap-2">
                  <span className="text-emerald">✓</span> <span className="fw-semibold">{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/studio" className="btn btn-primary mt-2">Try the studio</Link>
          </div>
          <div className="col-lg-6 order-lg-1">
            <div className="v-panel p-4">
              <div className="d-flex gap-2 flex-wrap mb-3">
                {PATTERNS.map((p, i) => (
                  <span key={p} className={`v-chip ${i === 0 ? '' : 'opacity-75'}`}>{p}</span>
                ))}
              </div>
              <div className="v-canvas mb-3" style={{ minHeight: 240 }}>
                <div className="text-center text-muted-2">
                  <div className="fs-1">🎨</div>
                  <div className="fw-semibold">Your generated design appears here</div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" disabled>Generate</button>
                <button className="btn btn-outline-primary" disabled>Regenerate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------- Traditional showcase */
function TextileShowcase() {
  return (
    <section className="v-section bg-cream">
      <div className="container">
        <SectionHead
          deva="परंपरा"
          eyebrow="Traditional textiles"
          title="Rooted in real craft traditions"
          lead="Every generation is grounded in centuries-old techniques and authentic palettes."
        />
        <div className="row g-4">
          {PATTERNS.map((p) => {
            const h = HERITAGE[p];
            return (
              <div className="col-md-4" key={p}>
                <Link to={`/encyclopedia/${h.slug}`} className="text-decoration-none">
                  <div className="v-card v-card-hover h-100 overflow-hidden">
                    <div style={{
                      height: 160,
                      background: `linear-gradient(135deg, ${h.colors[0].hex}, ${h.colors[2].hex})`,
                    }} />
                    <div className="p-4">
                      <h5 className="text-dark mb-1">{p}</h5>
                      <div className="small text-muted-2 mb-3">{h.tagline}</div>
                      <div className="d-flex gap-1">
                        {h.colors.map((c) => (
                          <span key={c.hex} className="v-swatch" style={{ background: c.hex }} title={c.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Why Vastra */
function WhyVastra() {
  const items = [
    { icon: '⚡', title: 'AI-native studio', accent: 'indigo', body: 'Generate, regenerate and refine textile designs with fine-grained controls.' },
    { icon: '📜', title: 'Heritage-aware', accent: 'saffron', body: 'Authentic motifs, colours and history surface as you design.' },
    { icon: '🧶', title: 'Material matching', accent: 'emerald', body: 'Get the right fabric recommendations for every pattern.' },
    { icon: '🤝', title: 'Artisan network', accent: 'indigo', body: 'Discover and commission the makers behind the crafts.' },
    { icon: '💸', title: 'Instant costing', accent: 'saffron', body: 'Estimate material, design and shipping costs before you commit.' },
    { icon: '🌍', title: 'Community', accent: 'emerald', body: 'Share work, get feedback, and celebrate India\'s textile legacy.' },
  ];
  return (
    <section className="v-section">
      <div className="container">
        <SectionHead deva="क्यों" eyebrow="Why choose Vastra AI" title="Creativity meets craft, responsibly" />
        <div className="row g-4">
          {items.map((it) => (
            <div className="col-md-6 col-lg-4" key={it.title}>
              <FeatureCard icon={it.icon} title={it.title} accent={it.accent}>{it.body}</FeatureCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- Featured community */
function FeaturedCommunity() {
  const posts = COMMUNITY_POSTS.slice(0, 3);
  return (
    <section className="v-section bg-cream">
      <div className="container">
        <SectionHead deva="समुदाय" eyebrow="From the community" title="What creators are making"
          action={<Link to="/community" className="btn btn-outline-primary">View community</Link>} />
        <div className="row g-4">
          {posts.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="v-card v-card-hover h-100 p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Avatar name={p.author} />
                  <div>
                    <div className="fw-semibold small">{p.author}</div>
                    <span className={ROLE_CHIP[p.role]}>{ROLE_LABELS[p.role]}</span>
                  </div>
                </div>
                <h6 className="mb-2">{p.title}</h6>
                <p className="text-muted-2 small mb-3">{p.description}</p>
                <div className="d-flex gap-3 small text-muted-2">
                  <span>❤️ {p.likes}</span>
                  <span>💬 {p.comments.length}</span>
                  <span className="ms-auto v-chip">{p.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------- Featured artisans */
function FeaturedArtisans() {
  const artisans = ARTISANS.slice(0, 4);
  return (
    <section className="v-section">
      <div className="container">
        <SectionHead deva="कारीगर" eyebrow="Featured artisans" title="Meet the makers"
          action={<Link to="/marketplace" className="btn btn-outline-primary">Explore marketplace</Link>} />
        <div className="row g-4">
          {artisans.map((a) => (
            <div className="col-6 col-lg-3" key={a.id}>
              <div className="v-card v-card-hover h-100 p-4 text-center">
                <div className="mx-auto mb-3" style={{
                  width: 64, height: 64, borderRadius: 20, display: 'grid', placeItems: 'center',
                  background: `${a.accent}18`, color: a.accent, fontWeight: 700, fontSize: '1.2rem',
                }}>{initials(a.name)}</div>
                <div className="fw-semibold">{a.name}</div>
                <div className="small text-muted-2 mb-2">{a.craft}</div>
                <span className="v-chip v-chip-saffron">★ {a.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------- Encyclopedia preview */
function EncyclopediaPreview() {
  return (
    <section className="v-section bg-cream">
      <div className="container">
        <SectionHead deva="ज्ञानकोश" eyebrow="Textile Encyclopedia" title="Learn the craft behind every thread"
          action={<Link to="/encyclopedia" className="btn btn-outline-primary">Browse encyclopedia</Link>} />
        <div className="row g-4">
          {ENCYCLOPEDIA.map((a) => (
            <div className="col-md-4" key={a.slug}>
              <Link to={`/encyclopedia/${a.slug}`} className="text-decoration-none">
                <div className="v-card v-card-hover h-100 p-4">
                  <span className="v-chip mb-3" style={{ background: `${a.accent}18`, color: a.accent }}>
                    {a.region}
                  </span>
                  <h5 className="text-dark">{a.name}</h5>
                  <p className="text-muted-2 small mb-0">{a.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Plans strip */
function PlansStrip() {
  return (
    <section className="v-section">
      <div className="container">
        <SectionHead deva="योजना" eyebrow="Subscription" title="Simple plans for every creator" />
        <div className="row g-4 justify-content-center">
          {PLANS.map((plan) => (
            <div className="col-md-6 col-lg-4" key={plan.id}>
              <div className={`v-card h-100 p-4 ${plan.highlight ? 'border-2' : ''}`}
                style={plan.highlight ? { borderColor: 'var(--v-indigo)' } : undefined}>
                {plan.highlight && <span className="v-chip mb-2">Most popular</span>}
                <h5 className="mb-1">{plan.name}</h5>
                <div className="text-muted-2 small mb-3">{plan.tagline}</div>
                <div className="mb-3">
                  <span className="fs-2 fw-bold">{plan.price === 0 ? 'Free' : formatINR(plan.price)}</span>
                  {plan.price !== 0 && <span className="text-muted-2">/{plan.cadence}</span>}
                </div>
                <ul className="list-unstyled d-grid gap-2 mb-4">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f.label} className={f.included ? '' : 'text-muted-2'}>
                      {f.included ? '✓' : '—'} {f.label}
                    </li>
                  ))}
                </ul>
                <Link to="/subscription" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline-primary'} w-100 mt-auto`}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ CTA banner */
function CtaBanner() {
  return (
    <section className="v-section">
      <div className="container">
        <div className="rounded-4 p-5 text-center position-relative overflow-hidden" style={{
          background: 'radial-gradient(120% 130% at 85% 0%, #a6234c 0%, #1b2a6b 60%)',
          color: '#f7efe1', boxShadow: 'inset 0 0 0 1px rgba(201,162,75,.5)',
        }}>
          <Mandala size={320} color="#c9a24b" opacity={0.12} className="position-absolute"
            style={{ top: -110, left: -70, pointerEvents: 'none' }} />
          <div className="text-gold mb-2 position-relative" style={{ fontFamily: 'var(--v-font-head)', letterSpacing: '.12em' }}>शुभारंभ</div>
          <h2 className="display-5 mb-2 position-relative" style={{ color: '#f7efe1' }}>Ready to weave something new?</h2>
          <p className="lead mb-4 position-relative" style={{ color: 'rgba(247,239,225,.75)' }}>Join Vastra AI and start designing with heritage on your side.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-saffron btn-lg">Create free account</Link>
            <Link to="/studio" className="btn btn-outline-light btn-lg">Explore the studio</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- helpers */
function SectionHead({ eyebrow, deva, title, lead, action }) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 gap-3">
      <div>
        <Eyebrow deva={deva}>{eyebrow}</Eyebrow>
        <h2 className="display-5 mt-2 mb-2">{title}</h2>
        <span className="v-thread-line d-block mb-2" />
        {lead && <p className="text-muted-2 mb-0" style={{ maxWidth: 560 }}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

function Avatar({ name }) {
  return (
    <span className="d-inline-grid rounded-circle text-white" style={{
      width: 40, height: 40, placeItems: 'center', background: 'var(--v-indigo)',
      fontSize: '.85rem', fontWeight: 700,
    }}>{initials(name)}</span>
  );
}
