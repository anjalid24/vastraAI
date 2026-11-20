import { useState } from "react";
import { Link } from "react-router-dom";
import designService from "../../services/designService.js";
import { PATTERNS, HERITAGE } from "../../data/heritage.js";
import { STUDIO_MATERIALS } from "../../utils/constants.js";
export default function DesignStudio() {
  const [options, setOptions] = useState({
    pattern: "Bandhani",
    material: "Cotton",
    seed: 42,
    density: 7,
    palette: "heritage",
  });
  const [result, setResult] = useState(null),
    [history, setHistory] = useState([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  const update = (key, value) => setOptions((o) => ({ ...o, [key]: value }));
  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await designService.generate(options);
      setResult(r);
      setHistory((h) => [r, ...h].slice(0, 8));
      setStatus("Pattern study created. Download it or try another variation.");
    } catch {
      setError("Could not create this study. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([result.svg], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `vastra-${result.pattern.toLowerCase()}-${result.seed}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("SVG download started.");
  };
  return (
    <div className="studio-page container py-5">
      <header className="studio-heading">
        <div>
          <p className="editorial-kicker">THE PATTERN WORKSHOP</p>
          <h1>
            Make a little
            <br />
            <em>pattern magic.</em>
          </h1>
          <p className="text-muted-2">
            Explore colour, rhythm and repetition. Every study is made in your
            browser.
          </p>
        </div>
        <span className="v-chip">Procedural SVG, not AI</span>
      </header>
      <div className="studio-layout">
        <aside className="v-card studio-controls">
          <h2 className="h5">Your ingredients</h2>
          <fieldset>
            <legend>01 / Craft inspiration</legend>
            <div className="pattern-choices">
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  aria-pressed={options.pattern === p}
                  onClick={() => update("pattern", p)}
                  className={options.pattern === p ? "selected" : ""}
                >
                  <img src={HERITAGE[p].image} alt="" />
                  {p}
                </button>
              ))}
            </div>
          </fieldset>
          <label htmlFor="study-material">02 / Fabric note</label>
          <select
            id="study-material"
            className="form-select"
            value={options.material}
            onChange={(e) => update("material", e.target.value)}
          >
            {STUDIO_MATERIALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <p className="control-note">
            A label for your study, not a fabric simulation.
          </p>
          <label htmlFor="study-palette">03 / Colour story</label>
          <select
            id="study-palette"
            className="form-select"
            value={options.palette}
            onChange={(e) => update("palette", e.target.value)}
          >
            <option value="heritage">Craft-inspired</option>
            <option value="indigo">Indigo & chalk</option>
            <option value="rose">Rose & terracotta</option>
          </select>
          <label htmlFor="study-density">
            04 / Repeat density: {options.density}
          </label>
          <input
            id="study-density"
            className="form-range"
            type="range"
            min="3"
            max="12"
            value={options.density}
            onChange={(e) => update("density", +e.target.value)}
          />
          <label htmlFor="study-seed">05 / Variation seed</label>
          <input
            id="study-seed"
            className="form-control"
            type="number"
            min="0"
            max="4294967295"
            step="1"
            value={options.seed}
            onChange={(e) => update("seed", e.target.value)}
          />
          <p className="control-note">
            Same ingredients + same seed = the same pattern.
          </p>
          <button
            className="btn btn-primary w-100"
            disabled={busy}
            onClick={generate}
          >
            {busy ? "Making your study…" : "Create pattern study ↗"}
          </button>
        </aside>
        <section className="studio-output" aria-label="Pattern preview">
          <div className="pattern-canvas">
            {result ? (
              <img
                src={result.imageUrl}
                alt={`${result.pattern}-inspired geometric study, seed ${result.seed}`}
              />
            ) : (
              <div className="canvas-empty">
                <span aria-hidden="true">✳</span>
                <h2>A new repeat starts here.</h2>
                <p>Choose your ingredients, then create a study.</p>
              </div>
            )}
          </div>
          <div className="preview-toolbar">
            <div>
              <strong>
                {result
                  ? `${result.pattern} / ${result.material}`
                  : "Your blank canvas"}
              </strong>
              <p>
                {result
                  ? `Seed ${result.seed} · ${result.density} repeats · ${result.palette}`
                  : "Downloadable SVG · no account required"}
              </p>
            </div>
            <button
              className="btn btn-outline-primary"
              disabled={!result}
              onClick={download}
            >
              Download SVG ↓
            </button>
          </div>
          <p className="control-note">
            Inspired by craft, not a reproduction or authenticity certificate.
            No prompt, reference image or AI model is used. History stays on
            this page and clears on refresh.
          </p>
          <p role="status" className="small">
            {status}
          </p>
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
          {history.length > 0 && (
            <section className="history-panel">
              <h2 className="h5">Your recent studies</h2>
              <div className="study-history">
                {history.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setResult(r);
                      setStatus(
                        "Opened a previous study. Controls remain ready for your next one.",
                      );
                    }}
                    aria-label={`Open study ${i + 1}: ${r.pattern}, seed ${r.seed}`}
                  >
                    <img src={r.imageUrl} alt="" />
                    <span>{r.pattern}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </section>
        <aside className="studio-notes">
          <p className="editorial-kicker">A THREAD TO FOLLOW</p>
          <h2>{options.pattern}</h2>
          <p>{HERITAGE[options.pattern].tagline}</p>
          <img
            src={HERITAGE[options.pattern].image}
            alt={`${options.pattern} inspiration image from the project's original asset collection`}
          />
          <p className="control-note">
            Project illustration. These geometric studies are not artisan-made
            textiles.
          </p>
          <Link to={`/encyclopedia/${HERITAGE[options.pattern].slug}`}>
            Read the project notes ↗
          </Link>
          <hr />
          <h3 className="h6">Take it further</h3>
          <p className="small text-muted-2">
            Try a lower repeat density for a bolder rhythm. Change the seed for
            a fresh arrangement.
          </p>
        </aside>
      </div>
    </div>
  );
}
