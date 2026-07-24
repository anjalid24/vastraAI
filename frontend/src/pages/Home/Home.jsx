import { Link } from 'react-router-dom';
import FeatureCard from '../../components/Cards/FeatureCard.jsx';
import { Eyebrow, BlockPrintDivider, ArchArt, Mandala, Paisley } from '../../components/ornaments/Ornaments.jsx';
import BackgroundSlideshow from '../../components/common/BackgroundSlideshow.jsx';
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
    <section className="v-weave-bg position-relative overflow-hidden py-3 py-lg-4" style={{ minHeight: 460 }}>
      {/* Background Fading Image Slideshow */}
      <BackgroundSlideshow
        images={[
          '/images/bandhani.png',
          '/images/ikat.png',
          '/images/patola.png',
          '/images/hero_generated.png',
        ]}
        interval={3800}
        opacity={0.35}
        overlayGradient="linear-gradient(180deg, rgba(247,239,225,0.35) 0%, rgba(247,239,225,0.85) 85%)"
        showIndicators={false}
        showLabelBadge={false}
      />

      <Mandala size={420} className="position-absolute" style={{ top: -120, right: -110, pointerEvents: 'none', zIndex: 1 }} />
      <Mandala size={260} color="#1b2a6b" opacity={0.07} className="position-absolute d-none d-lg-block"
        style={{ bottom: -80, left: -70, pointerEvents: 'none', zIndex: 1 }} />
      <div className="container py-2 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-4 pb-lg-2">
          <div className="col-lg-6">
            <span className="v-chip v-chip-saffron mb-1.5 v-rise">🧵 वस्त्र · Preserving India's textile heritage</span>
            <h3 className="display-2 mb-2 v-rise" style={{ lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Weave <span className="text-rani">heritage</span> into
              every <span className="text-indigo">design</span>
            </h3>
            <p className="lead text-muted-2 mb-3 v-rise-2" style={{ maxWidth: 520, lineHeight: 1.38, fontSize: '1.02rem' }}>
              Vastra AI generates Bandhani, Ikat and Patola in seconds — grounded in
              real craft, matched to authentic handloom fabrics, and tied to India's master artisans.
            </p>
            <div className="d-flex flex-wrap gap-2.5 v-rise-2 mb-3">
              <Link to="/register" className="btn btn-primary px-4 py-2">Start designing free</Link>
              <Link to="/studio" className="btn btn-outline-primary px-4 py-2">Open the Studio</Link>
            </div>
            <div className="d-flex flex-wrap gap-4 text-muted-2 v-rise-3">
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
// A decorative "generated design" panel: three heritage patterns framed inside
// a temple arch (the signature motif). Built from rich high-res heritage images.
function HeroArtCard() {
  return (
    <div className="v-card p-3 p-sm-4" style={{ boxShadow: 'var(--v-shadow-lg)' }}>
      <ArchArt>
        <div className="row g-0" style={{ background: 'var(--v-parchment-2)' }}>
          {PATTERNS.map((p) => (
            <div className="col-4" key={p}>
              <div
                className="d-flex align-items-end p-2 text-white position-relative overflow-hidden"
                style={{
                  aspectRatio: '3/4',
                }}
              >
                <img
                  src={HERITAGE[p].image}
                  alt={p}
                  className="position-absolute inset-0 w-100 h-100 object-fit-cover"
                  style={{ transition: 'transform 0.5s ease' }}
                />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)',
                  }}
                />
                <span className="small fw-semibold position-relative" style={{ zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  {p}
                </span>
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
              <div className="v-canvas mb-3 position-relative overflow-hidden rounded-3" style={{ minHeight: 250, background: '#111827' }}>
                <img
                  src="/images/hero_generated.png"
                  alt="Generated Design Preview"
                  className="w-100 h-100 object-fit-cover position-absolute"
                  style={{ inset: 0, opacity: 0.95 }}
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.92), transparent)' }}>
                  <div className="d-flex align-items-center justify-content-between text-white">
                    <div>
                      <span className="v-chip v-chip-saffron mb-1">✨ AI Output · Fusion Motif</span>
                      <div className="fw-semibold small">Bandhani x Patola Silk Weave</div>
                    </div>
                    <span className="v-chip v-chip-emerald">Authenticity 96%</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Link to="/studio" className="btn btn-primary flex-grow-1">Generate New Motif</Link>
                <Link to="/studio" className="btn btn-outline-primary">Open Studio</Link>
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
                    <div className="position-relative overflow-hidden" style={{ height: 180 }}>
                      <img
                        src={h.image}
                        alt={p}
                        className="w-100 h-100 object-fit-cover"
                        style={{ transition: 'transform 0.4s ease' }}
                      />
                      <div className="position-absolute bottom-0 start-0 end-0 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}>
                        <span className="v-chip v-chip-saffron text-white">{h.materials.join(' · ')}</span>
                      </div>
                    </div>
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
          {posts.map((p) => {
            const artisanObj = ARTISANS.find(a => a.name === p.author);
            return (
              <div className="col-md-4" key={p.id}>
                <div className="v-card v-card-hover h-100 p-0 overflow-hidden d-flex flex-column">
                  {p.image && (
                    <div className="position-relative" style={{ height: 170, overflow: 'hidden' }}>
                      <img src={p.image} alt={p.title} className="w-100 h-100 object-fit-cover" />
                    </div>
                  )}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Avatar name={p.author} image={artisanObj?.image} />
                      <div>
                        <div className="fw-semibold small">{p.author}</div>
                        <span className={ROLE_CHIP[p.role]}>{ROLE_LABELS[p.role]}</span>
                      </div>
                    </div>
                    <h6 className="mb-2">{p.title}</h6>
                    <p className="text-muted-2 small mb-3 flex-grow-1">{p.description}</p>
                    <div className="d-flex gap-3 small text-muted-2 mt-auto">
                      <span>❤️ {p.likes}</span>
                      <span>💬 {p.comments.length}</span>
                      <span className="ms-auto v-chip">{p.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                <div className="mx-auto mb-3 overflow-hidden rounded-circle" style={{
                  width: 72, height: 72, border: `2.5px solid ${a.accent}`,
                  boxShadow: 'var(--v-shadow-sm)'
                }}>
                  {a.image ? (
                    <img src={a.image} alt={a.name} className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <div className="w-100 h-100 d-grid place-items-center fw-bold" style={{ background: `${a.accent}18`, color: a.accent }}>
                      {initials(a.name)}
                    </div>
                  )}
                </div>
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
                <div className="v-card v-card-hover h-100 p-0 overflow-hidden d-flex flex-column">
                  {a.image && (
                    <div className="position-relative" style={{ height: 160, overflow: 'hidden' }}>
                      <img src={a.image} alt={a.name} className="w-100 h-100 object-fit-cover" />
                    </div>
                  )}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <span className="v-chip mb-3 align-self-start" style={{ background: `${a.accent}18`, color: a.accent }}>
                      {a.region}
                    </span>
                    <h5 className="text-dark mb-2">{a.name}</h5>
                    <p className="text-muted-2 small mb-0">{a.summary}</p>
                  </div>
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
          color: '#fdf6f4', boxShadow: 'inset 0 0 0 1px rgba(199,168,94,.5)',
        }}>
          {/* Fading Background Slideshow */}
          <BackgroundSlideshow
            images={[
              '/images/patola.png',
              '/images/bandhani.png',
              '/images/ikat.png',
              '/images/hero_generated.png',
            ]}
            interval={5000}
            opacity={0.25}
            overlayGradient="radial-gradient(120% 130% at 85% 0%, rgba(166, 35, 76, 0.85) 0%, rgba(27, 42, 107, 0.9) 60%)"
          />

          <Mandala size={320} color="#c9a24b" opacity={0.15} className="position-absolute"
            style={{ top: -110, left: -70, pointerEvents: 'none', zIndex: 1 }} />
          <div className="text-gold mb-2 position-relative" style={{ fontFamily: 'var(--v-font-head)', letterSpacing: '.12em', zIndex: 2 }}>शुभारंभ</div>
          <h2 className="display-5 mb-2 position-relative" style={{ color: '#fdf6f4', zIndex: 2 }}>Ready to weave something new?</h2>
          <p className="lead mb-4 position-relative" style={{ color: 'rgba(247,239,225,.75)', zIndex: 2 }}>Join Vastra AI and start designing with heritage on your side.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative" style={{ zIndex: 2 }}>
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

function Avatar({ name, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="rounded-circle object-fit-cover"
        style={{ width: 40, height: 40, border: '1.5px solid var(--v-gold)' }}
      />
    );
  }
  return (
    <span className="d-inline-grid rounded-circle text-white" style={{
      width: 40, height: 40, placeItems: 'center', background: 'var(--v-indigo)',
      fontSize: '.85rem', fontWeight: 700,
    }}>{initials(name)}</span>
  );
}
