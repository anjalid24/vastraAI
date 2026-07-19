import { useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { PATTERNS } from '../../data/heritage.js';
import { SHIPPING_ZONES } from '../../utils/constants.js';
import { formatINR } from '../../utils/formatters.js';

// Base fabric rates (₹/metre) used by the estimator — placeholder until the
// live materials catalogue feeds these in.
const FABRIC_RATES = { Silk: 1200, Cotton: 320, Georgette: 540, Linen: 650, Wool: 780 };
const GST_RATE = 0.05; // 5% GST on textiles

export default function Pricing() {
  const [input, setInput] = useState({
    material: 'Silk', length: 5, pattern: 'Bandhani', zone: 'domestic',
  });

  const set = (k, v) => setInput((s) => ({ ...s, [k]: v }));

  const estimate = useMemo(() => {
    const length = Math.max(Number(input.length) || 0, 0);
    const materialCost = (FABRIC_RATES[input.material] || 0) * length;
    const designCharge = 300; // flat AI design charge
    const artisanCharge = length * 220; // handloom finishing per metre
    const shipping = SHIPPING_ZONES.find((z) => z.value === input.zone)?.rate || 0;
    const subtotal = materialCost + designCharge + artisanCharge + shipping;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;
    return { materialCost, designCharge, artisanCharge, shipping, gst, total };
  }, [input]);

  return (
    <>
      <PageHeader
        eyebrow="Pricing Calculator"
        deva="मूल्य"
        title="Estimate your design cost"
        lead="Get a transparent breakdown — material, design, artisan, shipping and GST — before you commit."
      />
      <div className="container py-4">
        <div className="row g-4">
          {/* Inputs */}
          <div className="col-lg-6">
            <div className="v-card p-4">
              <h5 className="mb-3">Order details</h5>
              <Field label="Material">
                <select className="form-select form-select-lg" value={input.material}
                  onChange={(e) => set('material', e.target.value)}>
                  {Object.keys(FABRIC_RATES).map((m) => (
                    <option key={m} value={m}>{m} — {formatINR(FABRIC_RATES[m])}/m</option>
                  ))}
                </select>
              </Field>
              <Field label={`Fabric length — ${input.length} m`}>
                <input type="range" className="form-range" min={1} max={50} value={input.length}
                  onChange={(e) => set('length', e.target.value)} />
              </Field>
              <Field label="Pattern">
                <select className="form-select form-select-lg" value={input.pattern}
                  onChange={(e) => set('pattern', e.target.value)}>
                  {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Shipping location">
                <select className="form-select form-select-lg" value={input.zone}
                  onChange={(e) => set('zone', e.target.value)}>
                  {SHIPPING_ZONES.map((z) => (
                    <option key={z.value} value={z.value}>{z.label} — {formatINR(z.rate)}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Output */}
          <div className="col-lg-6">
            <div className="v-card p-4 h-100 d-flex flex-column">
              <h5 className="mb-3">Estimate</h5>
              <Row label="Material cost" value={estimate.materialCost} />
              <Row label="Design charge" value={estimate.designCharge} />
              <Row label="Artisan charge" value={estimate.artisanCharge} />
              <Row label="Shipping" value={estimate.shipping} />
              <Row label="GST (5%)" value={estimate.gst} />
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Total estimate</span>
                <span className="fw-bold fs-3 text-indigo" style={{ fontFamily: 'var(--v-font-head)' }}>
                  {formatINR(estimate.total)}
                </span>
              </div>
              <p className="small text-muted-2 mt-3 mb-0">
                Indicative only. Final pricing depends on the artisan, finishing and live material rates.
              </p>
              <a href="/marketplace" className="btn btn-primary mt-auto">Find an artisan to produce this</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="d-flex justify-content-between py-2 border-bottom">
      <span className="text-muted-2">{label}</span>
      <span className="fw-semibold">{formatINR(value)}</span>
    </div>
  );
}
