import { Link } from "react-router-dom";
import { HERITAGE, PATTERNS } from "../../data/heritage.js";
export default function Home() {
  return (
    <>
      <section className="editorial-hero container">
        <div className="hero-copy">
          <p className="editorial-kicker">वस्त्र / A TEXTILE EXPLORATION</p>
          <h1>
            Old threads.
            <br />
            <em>New possibilities.</em>
          </h1>
          <p className="hero-lead">
            A small digital workshop for the patterns, colours and rhythms of
            Indian textiles. Come curious. Make something your own.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/studio" className="btn btn-primary">
              Enter the pattern workshop ↗
            </Link>
            <Link to="/encyclopedia" className="hero-secondary">
              Explore the craft notes
            </Link>
          </div>
          <div className="hero-footnote">
            <span>01 / Choose a craft</span>
            <span>02 / Find your colours</span>
            <span>03 / Make a repeat</span>
          </div>
        </div>
        <div className="hero-composition">
          <span className="image-caption top-caption">
            A STUDY IN COLOUR & REPETITION
          </span>
          <div className="textile-triptych">
            {PATTERNS.map((p, i) => (
              <Link
                key={p}
                to={`/encyclopedia/${HERITAGE[p].slug}`}
                className={`textile-panel panel-${i}`}
              >
                <img
                  src={HERITAGE[p].image}
                  alt={`${p} inspiration from the original project assets`}
                />
                <span>
                  {String(i + 1).padStart(2, "0")} / {p}
                </span>
              </Link>
            ))}
          </div>
          <div className="composition-caption">
            <span>Bandhani · Ikat · Patola</span>
            <span>✳</span>
            <span>
              Three starting points.
              <br />
              Endless little studies.
            </span>
          </div>
        </div>
      </section>
      <div className="craft-ticker" aria-hidden="true">
        COLOUR / RHYTHM / REPETITION / CURIOSITY / COLOUR / RHYTHM / REPETITION
      </div>
      <section className="container workshop-intro">
        <div>
          <p className="editorial-kicker">THE WORKSHOP, NOT THE FACTORY</p>
          <h2>
            Play with a pattern.
            <br />
            <em>Keep the curiosity.</em>
          </h2>
        </div>
        <div>
          <p>
            Pick a craft-inspired geometry, change its palette and repeat
            density, and download an SVG study. It runs right in your browser,
            with no sign-up.
          </p>
          <p className="small text-muted-2">
            This portfolio prototype uses procedural graphics, not an AI model.
            The Vastra AI project name describes an ambition, not a live
            generation service. There are no paid plans, real orders or artisan
            messages in the demo.
          </p>
          <Link to="/studio">Make your first study ↗</Link>
        </div>
      </section>
      <section className="container craft-shelf">
        <div className="section-heading">
          <div>
            <p className="editorial-kicker">THE INSPIRATION SHELF</p>
            <h2>Follow a thread.</h2>
          </div>
          <Link to="/encyclopedia">All project notes ↗</Link>
        </div>
        <div className="craft-cards">
          {PATTERNS.map((p) => (
            <Link
              to={`/encyclopedia/${HERITAGE[p].slug}`}
              key={p}
              className="craft-card"
            >
              <div>
                <img
                  src={HERITAGE[p].image}
                  alt={`${p} project illustration`}
                />
                <span>EXPLORE ↗</span>
              </div>
              <h3>{p}</h3>
              <p>{HERITAGE[p].tagline}</p>
            </Link>
          ))}
        </div>
        <p className="small text-muted-2 mt-4">
          Illustrations and introductory notes are retained from the original
          project. They are not a claim of provenance, certification or an
          artisan partnership.
        </p>
      </section>
      <section className="container explore-shelf">
        <p className="editorial-kicker">A LITTLE MORE TO EXPLORE</p>
        <div className="explore-links">
          <Link to="/materials">
            <strong>The material shelf</strong>
            <span>Sample fabrics, clearly marked</span>
            <b>↗</b>
          </Link>
          <Link to="/community">
            <strong>The moodboard</strong>
            <span>Fictional posts, local interactions</span>
            <b>↗</b>
          </Link>
          <Link to="/pricing">
            <strong>The cost sketch</strong>
            <span>Illustrative numbers, never a quote</span>
            <b>↗</b>
          </Link>
        </div>
      </section>
      <section className="closing-note">
        <div className="container">
          <p className="editorial-kicker">FROM ONE IDEA TO THE NEXT</p>
          <h2>
            Every good repeat
            <br />
            starts with <em>a little play.</em>
          </h2>
          <Link to="/studio" className="btn btn-primary">
            Open the workshop ↗
          </Link>
        </div>
      </section>
    </>
  );
}
