import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { ARTISANS } from '../../data/artisans.js';
import { ENCYCLOPEDIA } from '../../data/encyclopedia.js';
import { COMMUNITY_POSTS } from '../../data/community.js';
import { PLANS } from '../../data/plans.js';

/**
 * Admin Dashboard — management console. Sections mirror the spec (users,
 * artisans, materials, encyclopedia, community, AI models, plans). Data shown
 * is representative; wiring each table to its API is a later step.
 */
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'artisans', label: 'Artisans', icon: '🧵' },
  { id: 'materials', label: 'Materials', icon: '🧶' },
  { id: 'encyclopedia', label: 'Encyclopedia', icon: '📜' },
  { id: 'community', label: 'Community', icon: '💬' },
  { id: 'models', label: 'AI Models', icon: '🤖' },
  { id: 'plans', label: 'Subscription Plans', icon: '⭐' },
];

export default function Admin() {
  const [section, setSection] = useState('overview');
  const items = SECTIONS.map((s) => ({
    to: '#', label: s.label, icon: s.icon,
  }));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2 px-0 d-none d-lg-block">
          <aside className="v-sidebar p-3">
            <div className="v-eyebrow px-2 mb-2">Admin</div>
            <ul className="nav flex-column">
              {SECTIONS.map((s) => (
                <li className="nav-item" key={s.id}>
                  <button className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${section === s.id ? 'active' : ''}`}
                    onClick={() => setSection(s.id)}>
                    <span>{s.icon}</span> {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="col-lg-10 py-4 px-lg-5 px-3">
          <div className="v-eyebrow mb-1">Admin console</div>
          <h1 className="h3 mb-4">Manage Vastra AI</h1>

          {/* Mobile section switch */}
          <select className="form-select d-lg-none mb-3" value={section} onChange={(e) => setSection(e.target.value)}>
            {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>

          {section === 'overview' && <Overview />}
          {section === 'users' && <UsersTable />}
          {section === 'artisans' && <ArtisansTable />}
          {section === 'materials' && <ManageHint title="Materials" body="Materials are managed live via /api/materials. Full admin CRUD table wires in here." link="/materials" />}
          {section === 'encyclopedia' && <EncyclopediaTable />}
          {section === 'community' && <CommunityTable />}
          {section === 'models' && <ManageHint title="AI Models" body="Configure the Django AI image-generation models, versions and default parameters." />}
          {section === 'plans' && <PlansTable />}
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const stats = [
    { label: 'Total users', value: '1,284', icon: '👥', accent: 'var(--v-indigo)' },
    { label: 'Artisans', value: ARTISANS.length, icon: '🧵', accent: 'var(--v-emerald-600)' },
    { label: 'Community posts', value: COMMUNITY_POSTS.length, icon: '💬', accent: 'var(--v-saffron-600)' },
    { label: 'Encyclopedia articles', value: ENCYCLOPEDIA.length, icon: '📜', accent: 'var(--v-indigo)' },
  ];
  return (
    <div className="row g-4">
      {stats.map((s) => (
        <div className="col-sm-6 col-xl-3" key={s.label}>
          <div className="v-card p-4 h-100">
            <div className="v-icon-badge mb-3" style={{ background: `${s.accent}18`, color: s.accent }}>{s.icon}</div>
            <div className="fs-3 fw-bold" style={{ fontFamily: 'var(--v-font-head)' }}>{s.value}</div>
            <div className="text-muted-2">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Table({ head, children }) {
  return (
    <div className="v-card p-0 overflow-hidden">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="bg-cream"><tr>{head.map((h) => <th key={h} className="small text-muted-2">{h}</th>)}</tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTable() {
  const rows = [
    { name: 'Nova Label', email: 'nova@brand.com', role: 'brand' },
    { name: 'Ananya Rao', email: 'ananya@weave.in', role: 'artisan' },
    { name: 'Admin', email: 'admin@vastra.ai', role: 'admin' },
  ];
  return (
    <Table head={['Name', 'Email', 'Role', 'Actions']}>
      {rows.map((r) => (
        <tr key={r.email}>
          <td className="fw-semibold">{r.name}</td>
          <td className="text-muted-2">{r.email}</td>
          <td><span className="v-chip text-capitalize">{r.role}</span></td>
          <td><button className="btn btn-sm btn-outline-primary" disabled>Manage</button></td>
        </tr>
      ))}
    </Table>
  );
}

function ArtisansTable() {
  return (
    <Table head={['Artisan', 'Craft', 'City', 'Rating', 'Actions']}>
      {ARTISANS.map((a) => (
        <tr key={a.id}>
          <td className="fw-semibold">{a.name}</td>
          <td className="text-muted-2">{a.craft}</td>
          <td className="text-muted-2">{a.city}</td>
          <td>★ {a.rating}</td>
          <td><button className="btn btn-sm btn-outline-primary" disabled>Review</button></td>
        </tr>
      ))}
    </Table>
  );
}

function EncyclopediaTable() {
  return (
    <Table head={['Article', 'Region', 'Actions']}>
      {ENCYCLOPEDIA.map((a) => (
        <tr key={a.slug}>
          <td className="fw-semibold">{a.name}</td>
          <td className="text-muted-2">{a.region}</td>
          <td><button className="btn btn-sm btn-outline-primary" disabled>Edit</button></td>
        </tr>
      ))}
    </Table>
  );
}

function CommunityTable() {
  return (
    <Table head={['Post', 'Author', 'Category', 'Actions']}>
      {COMMUNITY_POSTS.map((p) => (
        <tr key={p.id}>
          <td className="fw-semibold">{p.title}</td>
          <td className="text-muted-2">{p.author}</td>
          <td><span className="v-chip">{p.category}</span></td>
          <td><button className="btn btn-sm btn-outline-danger" disabled>Moderate</button></td>
        </tr>
      ))}
    </Table>
  );
}

function PlansTable() {
  return (
    <Table head={['Plan', 'Price', 'Role', 'Actions']}>
      {PLANS.map((p) => (
        <tr key={p.id}>
          <td className="fw-semibold">{p.name}</td>
          <td>{p.price === 0 ? 'Free' : `₹${p.price}/${p.cadence}`}</td>
          <td><span className="v-chip text-capitalize">{p.role}</span></td>
          <td><button className="btn btn-sm btn-outline-primary" disabled>Edit</button></td>
        </tr>
      ))}
    </Table>
  );
}

function ManageHint({ title, body, link }) {
  return (
    <div className="v-card p-5 text-center">
      <h5>{title}</h5>
      <p className="text-muted-2">{body}</p>
      {link && <a href={link} className="btn btn-primary">Open {title}</a>}
    </div>
  );
}
