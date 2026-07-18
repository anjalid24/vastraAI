import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import materialService, { MATERIAL_CATEGORIES } from '../../services/materialService.js';
import { formatINR } from '../../utils/formatters.js';

/**
 * Material Explorer — lists fabrics from the real backend (/api/materials)
 * with category / availability / search filters and pagination.
 */
export default function Materials() {
  const [filters, setFilters] = useState({ category: '', search: '', available: '' });
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', data: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await materialService.list({
        category: filters.category || undefined,
        search: filters.search || undefined,
        isAvailable: filters.available === '' ? undefined : filters.available === 'true',
        page,
        limit: 12,
      });
      setState({ loading: false, error: '', data });
    } catch (err) {
      setState({ loading: false, error: err.message, data: null });
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const onFilter = (patch) => { setPage(1); setFilters((f) => ({ ...f, ...patch })); };

  const materials = state.data?.materials || [];

  return (
    <>
      <PageHeader
        eyebrow="Material Explorer"
        title="Find the right fabric"
        lead="Browse the live materials catalogue — filter by category, availability and name."
      />
      <div className="container py-4">
        {/* Filters */}
        <div className="v-card p-3 mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Search</label>
              <input className="form-control" placeholder="Search by name…"
                value={filters.search}
                onChange={(e) => onFilter({ search: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Category</label>
              <select className="form-select" value={filters.category}
                onChange={(e) => onFilter({ category: e.target.value })}>
                <option value="">All categories</option>
                {MATERIAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Availability</label>
              <select className="form-select" value={filters.available}
                onChange={(e) => onFilter({ available: e.target.value })}>
                <option value="">Any</option>
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
              </select>
            </div>
          </div>
        </div>

        {state.loading ? (
          <Loader label="Loading materials…" />
        ) : state.error ? (
          <EmptyState
            icon="🔌"
            title="Couldn't load materials"
            body={state.error}
            hint="Start the backend (npm run dev in the project root) and make sure MongoDB is running."
          />
        ) : materials.length === 0 ? (
          <EmptyState icon="🧶" title="No materials found" body="Try clearing filters or adding materials from a Brand account." />
        ) : (
          <>
            <div className="row g-4">
              {materials.map((m) => <div className="col-sm-6 col-lg-4 col-xl-3" key={m._id}><MaterialCard m={m} /></div>)}
            </div>
            <Pagination page={state.data.page} pages={state.data.pages} onPage={setPage} />
          </>
        )}
      </div>
    </>
  );
}

function MaterialCard({ m }) {
  return (
    <div className="v-card v-card-hover h-100 overflow-hidden">
      <div style={{ height: 130, background: 'linear-gradient(135deg,#efeae4,#e4dcd0)', position: 'relative' }}>
        {m.imageUrl
          ? <img src={m.imageUrl} alt={m.materialName} className="w-100 h-100 object-cover" />
          : <div className="d-flex align-items-center justify-content-center h-100 fs-1">🧵</div>}
        <span className={`position-absolute top-0 end-0 m-2 v-chip ${m.isAvailable ? 'v-chip-emerald' : ''}`}>
          {m.isAvailable ? 'In stock' : 'Out'}
        </span>
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="mb-1">{m.materialName}</h6>
          <span className="v-chip">{m.category}</span>
        </div>
        {m.description && <p className="small text-muted-2 mb-2">{m.description.slice(0, 80)}</p>}
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-indigo">{formatINR(m.pricePerMeter)}<span className="small text-muted-2 fw-normal">/m</span></span>
          {m.sustainabilityRating && <span className="small text-emerald">🌿 {m.sustainabilityRating}/5</span>}
        </div>
        {m.colorOptions?.length > 0 && (
          <div className="d-flex gap-1 mt-2 flex-wrap">
            {m.colorOptions.slice(0, 4).map((c) => <span key={c} className="v-chip" style={{ fontSize: '.68rem' }}>{c}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPage(page - 1)}>‹</button>
        </li>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <li className={`page-item ${p === page ? 'active' : ''}`} key={p}>
            <button className="page-link" onClick={() => onPage(p)}>{p}</button>
          </li>
        ))}
        <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPage(page + 1)}>›</button>
        </li>
      </ul>
    </nav>
  );
}

export function EmptyState({ icon, title, body, hint }) {
  return (
    <div className="v-card p-5 text-center">
      <div className="fs-1 mb-2">{icon}</div>
      <h5>{title}</h5>
      <p className="text-muted-2 mb-1">{body}</p>
      {hint && <p className="small text-muted-2 mb-0">{hint}</p>}
    </div>
  );
}
