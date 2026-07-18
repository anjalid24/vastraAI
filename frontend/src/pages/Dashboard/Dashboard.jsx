import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import StatCard from '../../components/Cards/StatCard.jsx';
import { ROLE_LABELS, ROLE_CHIP } from '../../utils/constants.js';

// Role-aware dashboard. Each role sees a different set of cards, per the spec.
export default function Dashboard() {
  const { user, role } = useAuth();

  const sidebarItems = [
    { to: '/dashboard', label: 'Overview', icon: '🏠', end: true },
    { to: '/studio', label: 'Design Studio', icon: '🎨' },
    { to: '/materials', label: 'Materials', icon: '🧶' },
    { to: '/community', label: 'Community', icon: '💬' },
    { to: '/encyclopedia', label: 'Encyclopedia', icon: '📜' },
    { to: '/marketplace', label: 'Marketplace', icon: '🤝' },
    { to: '/pricing', label: 'Pricing', icon: '🧮' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];
  if (role === 'admin') sidebarItems.push({ to: '/admin', label: 'Admin', icon: '🛡️' });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2 px-0 d-none d-lg-block">
          <Sidebar items={sidebarItems} title="Workspace" />
        </div>
        <div className="col-lg-10 py-4 px-lg-5 px-3">
          {/* Header */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <div className="v-eyebrow mb-1">{ROLE_LABELS[role]} dashboard</div>
              <h1 className="h3 mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
              <span className={ROLE_CHIP[role]}>{ROLE_LABELS[role]}</span>
            </div>
            <Link to="/studio" className="btn btn-primary">＋ New design</Link>
          </div>

          {/* Mobile sidebar */}
          <div className="d-lg-none mb-3">
            <Sidebar items={sidebarItems} />
          </div>

          {role === 'artisan' ? <ArtisanCards /> : role === 'admin' ? <AdminCards /> : <BrandCards />}
        </div>
      </div>
    </div>
  );
}

/* Brand covers both the paid Brand tier and the default free account. */
function BrandCards() {
  return (
    <>
      <div className="row g-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard icon="⚡" value="Unlimited" label="AI generations" hint="Brand plan" accent="indigo" to="/studio" cta="Generate" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon="🕑" value="0" label="Designs in history" accent="saffron" to="/studio" cta="Start creating" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon="🧮" value="—" label="Pricing calculator" accent="emerald" to="/pricing" cta="Estimate cost" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon="🧶" value="Browse" label="Materials catalogue" accent="indigo" to="/materials" cta="Explore" />
        </div>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <StatCard icon="🤝" label="Find artisans for your designs" hint="Marketplace" accent="emerald" to="/marketplace" cta="Meet makers" />
        </div>
        <div className="col-lg-6">
          <StatCard icon="⭐" label="Subscription status: active" hint="Brand" accent="saffron" to="/subscription" cta="Manage plan" />
        </div>
      </div>
    </>
  );
}

function ArtisanCards() {
  return (
    <div className="row g-4">
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="🖼️" value="0" label="Portfolio pieces" accent="indigo" to="/profile" cta="Build portfolio" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="📥" value="0" label="Brand requests" accent="saffron" to="/marketplace" cta="View marketplace" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="💰" value="Soon" label="Earnings (coming soon)" accent="emerald" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="💬" value="Active" label="Community" accent="indigo" to="/community" cta="Join in" />
      </div>
    </div>
  );
}

function AdminCards() {
  return (
    <div className="row g-4">
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="👥" label="Manage users" accent="indigo" to="/admin" cta="Open admin" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="🧶" label="Manage materials" accent="saffron" to="/admin" cta="Open admin" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="📜" label="Manage encyclopedia" accent="emerald" to="/admin" cta="Open admin" />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard icon="🛡️" label="Full admin console" accent="indigo" to="/admin" cta="Open admin" />
      </div>
    </div>
  );
}
