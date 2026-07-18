import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_LABELS, ROLE_CHIP } from '../../utils/constants.js';
import { initials, formatDate } from '../../utils/formatters.js';

// User Profile — personal info, saved designs, posts, subscription, settings.
const TABS = [
  { id: 'info', label: 'Personal Information', icon: '👤' },
  { id: 'designs', label: 'Saved Designs', icon: '🎨' },
  { id: 'posts', label: 'Community Posts', icon: '💬' },
  { id: 'subscription', label: 'Subscription', icon: '⭐' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Profile() {
  const { user, role, logout } = useAuth();
  const [tab, setTab] = useState('info');

  return (
    <div className="container py-4">
      {/* Header card */}
      <div className="v-card p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <span className="d-inline-grid rounded-4 text-white" style={{
            width: 80, height: 80, placeItems: 'center', fontSize: '1.6rem', fontWeight: 700,
            background: 'linear-gradient(135deg,#1e3a8a,#f59e0b)' }}>{initials(user?.name)}</span>
          <div className="flex-grow-1">
            <h3 className="mb-1">{user?.name}</h3>
            <div className="text-muted-2">{user?.email}</div>
            <span className={`${ROLE_CHIP[role]} mt-2`}>{ROLE_LABELS[role]}</span>
          </div>
          <div className="text-md-end small text-muted-2">
            Member since {formatDate(user?.createdAt) || '—'}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="v-card p-2">
            <ul className="nav flex-column">
              {TABS.map((t) => (
                <li className="nav-item" key={t.id}>
                  <button className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${tab === t.id ? 'active text-white' : ''}`}
                    style={tab === t.id ? { background: 'var(--v-indigo)', borderRadius: 10 } : undefined}
                    onClick={() => setTab(t.id)}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="v-card p-4">
            {tab === 'info' && <InfoTab user={user} />}
            {tab === 'designs' && <Empty icon="🎨" text="Your saved designs will appear here. Create some in the Design Studio." cta={{ to: '/studio', label: 'Open Studio' }} />}
            {tab === 'posts' && <Empty icon="💬" text="Posts you share in the community will be listed here." cta={{ to: '/community', label: 'Go to Community' }} />}
            {tab === 'subscription' && <Empty icon="⭐" text="Manage your plan and billing here." cta={{ to: '/subscription', label: 'View plans' }} />}
            {tab === 'settings' && <SettingsTab onLogout={logout} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTab({ user }) {
  return (
    <>
      <h5 className="mb-3">Personal Information</h5>
      <dl className="row mb-0">
        <Item label="Full name" value={user?.name} />
        <Item label="Email" value={user?.email} />
        <Item label="Role" value={ROLE_LABELS[user?.role]} />
        <Item label="Account status" value={user?.isActive ? 'Active' : 'Inactive'} />
        <Item label="Joined" value={formatDate(user?.createdAt)} />
      </dl>
      <button className="btn btn-outline-primary mt-3" disabled>Edit profile (soon)</button>
    </>
  );
}

function SettingsTab({ onLogout }) {
  return (
    <>
      <h5 className="mb-3">Settings</h5>
      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div><div className="fw-semibold">Email notifications</div><div className="small text-muted-2">Coming soon</div></div>
        <div className="form-check form-switch"><input className="form-check-input" type="checkbox" disabled /></div>
      </div>
      <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
        <div><div className="fw-semibold">Password</div><div className="small text-muted-2">Change your password</div></div>
        <button className="btn btn-sm btn-outline-primary" disabled>Change</button>
      </div>
      <div className="d-flex justify-content-between align-items-center py-3">
        <div><div className="fw-semibold text-danger">Log out</div><div className="small text-muted-2">End your session on this device</div></div>
        <button className="btn btn-sm btn-outline-danger" onClick={onLogout}>Log out</button>
      </div>
    </>
  );
}

function Item({ label, value }) {
  return (
    <>
      <dt className="col-sm-4 text-muted-2 fw-normal py-2">{label}</dt>
      <dd className="col-sm-8 fw-semibold py-2">{value || '—'}</dd>
    </>
  );
}

function Empty({ icon, text, cta }) {
  return (
    <div className="text-center py-5">
      <div className="fs-1 mb-2">{icon}</div>
      <p className="text-muted-2">{text}</p>
      {cta && <a href={cta.to} className="btn btn-primary">{cta.label}</a>}
    </div>
  );
}
