import { useState } from 'react';
import designService from '../../services/designService.js';
import { HERITAGE, PATTERNS } from '../../data/heritage.js';
import { STUDIO_MATERIALS } from '../../utils/constants.js';
import HeritagePanel from './HeritagePanel.jsx';
import { formatINR } from '../../utils/formatters.js';

/**
 * Design Studio — the heart of Vastra AI. Three-panel layout:
 *   Left   → pattern / material / prompt / reference / advanced settings
 *   Center → generated image + generate / regenerate / download / save
 *   Right  → Heritage Inspiration, AI recommendations, authenticity, cost,
 *            and generation history
 *
 * Generation is currently mocked (see designService) until the Django AI
 * service is wired in; every control is already shaped for the real payload.
 */
export default function DesignStudio() {
  const [pattern, setPattern] = useState('Bandhani');
  const [material, setMaterial] = useState('Silk');
  const [prompt, setPrompt] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [settings, setSettings] = useState({ steps: 30, cfg: 7, seed: '' });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState([]);

  const setSetting = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const generate = async () => {
    setGenerating(true);
    try {
      const out = await designService.generate({
        pattern, material, prompt,
        steps: Number(settings.steps),
        cfg: Number(settings.cfg),
        seed: settings.seed ? Number(settings.seed) : undefined,
      });
      setResult(out);
      setHistory((h) => [out, ...h].slice(0, 12));
    } finally {
      setGenerating(false);
    }
  };

  const regenerate = () => {
    // A fresh seed unless the user pinned one.
    if (!settings.seed) setSetting('seed', '');
    generate();
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `vastra-${pattern}-${result.seed}.svg`;
    a.click();
  };

  const save = () => {
    if (result && !saved.find((s) => s.id === result.id)) setSaved((s) => [result, ...s]);
  };

  const applyColor = (c) => setPrompt((p) => (p ? `${p}, ${c.name.toLowerCase()}` : c.name.toLowerCase()));
  const applyMaterial = (m) => STUDIO_MATERIALS.includes(m) && setMaterial(m);

  return (
    <div className="v-weave-bg v-min-vh">
      <div className="container-fluid py-4 px-lg-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="v-eyebrow">Design Studio</div>
            <h1 className="h4 mb-0">Create a {pattern} design</h1>
          </div>
          <span className="v-chip v-chip-emerald">AI generator</span>
        </div>

        <div className="row g-3">
          {/* ---------------- LEFT PANEL ---------------- */}
          <div className="col-lg-3 order-2 order-lg-1">
            <div className="v-panel p-3 mb-3">
              <PanelLabel>Pattern</PanelLabel>
              <div className="d-grid gap-2">
                {PATTERNS.map((p) => (
                  <button key={p} type="button" onClick={() => setPattern(p)}
                    className={`v-selectable p-2 d-flex align-items-center gap-2 bg-white ${pattern === p ? 'selected' : ''}`}>
                    <span className="v-swatch" style={{ background: HERITAGE[p].colors[0].hex }} />
                    <span className="fw-semibold small">{p}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="v-panel p-3 mb-3">
              <PanelLabel>Material</PanelLabel>
              <div className="d-flex flex-wrap gap-2">
                {STUDIO_MATERIALS.map((m) => (
                  <button key={m} type="button" onClick={() => setMaterial(m)}
                    className={`v-selectable px-3 py-2 bg-white small fw-semibold ${material === m ? 'selected' : ''}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="v-panel p-3 mb-3">
              <PanelLabel>Prompt</PanelLabel>
              <textarea className="form-control" rows={3} value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. festive Bandhani with marigold dots and indigo border" />

              <PanelLabel className="mt-3">Reference image</PanelLabel>
              <label className="v-selectable d-block text-center p-3 bg-white v-cursor small text-muted-2">
                {referenceName ? `📎 ${referenceName}` : '⬆️ Upload a reference (optional)'}
                <input type="file" accept="image/*" className="d-none"
                  onChange={(e) => setReferenceName(e.target.files?.[0]?.name || '')} />
              </label>
            </div>

            <div className="v-panel p-3">
              <PanelLabel>Advanced settings</PanelLabel>
              <RangeRow label="Steps" min={10} max={60} value={settings.steps}
                onChange={(v) => setSetting('steps', v)} />
              <RangeRow label="CFG scale" min={1} max={15} value={settings.cfg}
                onChange={(v) => setSetting('cfg', v)} />
              <label className="form-label small fw-semibold mb-1 mt-2">Seed</label>
              <input className="form-control form-control-sm" type="number" value={settings.seed}
                onChange={(e) => setSetting('seed', e.target.value)} placeholder="Random" />
            </div>
          </div>

          {/* ---------------- CENTER PANEL ---------------- */}
          <div className="col-lg-6 order-1 order-lg-2">
            <div className="v-panel p-3">
              <div className="v-canvas mb-3 position-relative" style={{ minHeight: 440 }}>
                {generating ? (
                  <div className="text-center text-muted-2">
                    <div className="spinner-border text-primary mb-3" role="status" />
                    <div className="fw-semibold">Weaving your design…</div>
                  </div>
                ) : result ? (
                  <img src={result.imageUrl} alt={`${pattern} design`}
                    className="img-fluid rounded-3 shadow"
                    style={{ maxHeight: 420, objectFit: 'contain' }} />
                ) : (
                  <div className="text-center text-muted-2">
                    <div className="fs-1">🎨</div>
                    <div className="fw-semibold">Your generated design will appear here</div>
                    <div className="small">Choose a pattern & material, then hit Generate.</div>
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-primary flex-grow-1" onClick={generate} disabled={generating}>
                  {generating ? 'Generating…' : '✨ Generate'}
                </button>
                <button className="btn btn-outline-primary" onClick={regenerate} disabled={generating || !result}>
                  ↻ Regenerate
                </button>
                <button className="btn btn-outline-primary" onClick={download} disabled={!result}>⬇ Download</button>
                <button className="btn btn-emerald" onClick={save} disabled={!result}>♥ Save</button>
              </div>

              {result && (
                <div className="d-flex flex-wrap gap-3 small text-muted-2 mt-3 px-1">
                  <span>Seed: <strong>{result.seed}</strong></span>
                  <span>Steps: <strong>{settings.steps}</strong></span>
                  <span>CFG: <strong>{settings.cfg}</strong></span>
                  <span>Material: <strong>{material}</strong></span>
                </div>
              )}
            </div>

            {saved.length > 0 && (
              <div className="v-panel p-3 mt-3">
                <PanelLabel>Saved designs ({saved.length})</PanelLabel>
                <div className="d-flex gap-2 overflow-auto">
                  {saved.map((s) => (
                    <img key={s.id} src={s.imageUrl} alt="saved" className="rounded-3"
                      style={{ width: 72, height: 72, objectFit: 'cover' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ---------------- RIGHT PANEL ---------------- */}
          <div className="col-lg-3 order-3">
            <div className="mb-3">
              <HeritagePanel pattern={pattern} onApplyColor={applyColor} onApplyMaterial={applyMaterial} />
            </div>

            <div className="v-panel p-3 mb-3">
              <PanelLabel>AI recommendations</PanelLabel>
              <RecoRow label="Recommended material" value={HERITAGE[pattern].materials[0]} />
              <div className="d-flex align-items-center justify-content-between py-1">
                <span className="small text-muted-2">Traditional colours</span>
                <span className="d-flex gap-1">
                  {HERITAGE[pattern].colors.map((c) => (
                    <span key={c.hex} className="v-swatch" style={{ background: c.hex, width: 18, height: 18 }} />
                  ))}
                </span>
              </div>
              <RecoRow label="Similar designs" value={`${HERITAGE[pattern].motifs.length} motifs`} />
            </div>

            <div className="v-panel p-3 mb-3">
              <PanelLabel>Authenticity score</PanelLabel>
              <AuthenticityMeter score={result?.authenticityScore} />
            </div>

            <div className="v-panel p-3 mb-3">
              <PanelLabel>Cost estimation</PanelLabel>
              <div className="d-flex justify-content-between small"><span className="text-muted-2">Est. per metre</span>
                <strong>{formatINR(material === 'Silk' ? 1200 : material === 'Linen' ? 650 : 480)}</strong></div>
              <div className="d-flex justify-content-between small"><span className="text-muted-2">Design charge</span>
                <strong>{formatINR(300)}</strong></div>
              <hr className="my-2" />
              <p className="small text-muted-2 mb-0">Full breakdown in the <a href="/pricing">Pricing Calculator</a>.</p>
            </div>

            <div className="v-panel p-3">
              <PanelLabel>Generation history</PanelLabel>
              {history.length === 0 ? (
                <p className="small text-muted-2 mb-0">Your generated designs will be listed here.</p>
              ) : (
                <div className="d-grid gap-2">
                  {history.map((h) => (
                    <button key={h.id} className="v-selectable d-flex align-items-center gap-2 p-2 bg-white"
                      onClick={() => setResult(h)}>
                      <img src={h.imageUrl} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded-2" />
                      <span className="small text-start">
                        <div className="fw-semibold">{h.pattern}</div>
                        <div className="text-muted-2">seed {h.seed}</div>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */
function PanelLabel({ children, className = '' }) {
  return <div className={`v-eyebrow mb-2 ${className}`} style={{ fontSize: '.68rem' }}>{children}</div>;
}

function RangeRow({ label, min, max, value, onChange }) {
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between small fw-semibold">
        <span>{label}</span><span className="text-indigo">{value}</span>
      </div>
      <input type="range" className="form-range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function RecoRow({ label, value }) {
  return (
    <div className="d-flex align-items-center justify-content-between py-1">
      <span className="small text-muted-2">{label}</span>
      <span className="v-chip">{value}</span>
    </div>
  );
}

function AuthenticityMeter({ score }) {
  if (score == null) {
    return <p className="small text-muted-2 mb-0">Generate a design to score its authenticity against heritage norms.</p>;
  }
  const color = score >= 85 ? 'var(--v-emerald-600)' : score >= 70 ? 'var(--v-saffron-600)' : '#b91c1c';
  return (
    <>
      <div className="d-flex align-items-baseline gap-2">
        <span className="fs-3 fw-bold" style={{ color, fontFamily: 'var(--v-font-head)' }}>{score}</span>
        <span className="text-muted-2 small">/ 100</span>
      </div>
      <div className="progress mt-1" style={{ height: 8 }}>
        <div className="progress-bar" style={{ width: `${score}%`, background: color }} />
      </div>
    </>
  );
}
