import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import { PLANS } from '../../data/plans.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatINR } from '../../utils/formatters.js';

// Subscription plans. Highlights the plan matching the signed-in user's role.
export default function Subscription() {
  const { isAuthenticated, role } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="Subscription"
        deva="योजना"
        title="Choose the plan that fits your craft"
        lead="Start free and upgrade when you're ready to scale. No hidden charges."
      />
      <div className="container py-4">
        <div className="row g-4 justify-content-center">
          {PLANS.map((plan) => {
            const isCurrent = isAuthenticated && plan.role === role && plan.id !== 'free';
            return (
              <div className="col-md-6 col-lg-4" key={plan.id}>
                <div className={`v-card h-100 p-4 d-flex flex-column ${plan.highlight ? 'border-2' : ''}`}
                  style={plan.highlight ? { borderColor: 'var(--v-indigo)' } : undefined}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="mb-1">{plan.name}</h4>
                      <div className="text-muted-2 small">{plan.tagline}</div>
                    </div>
                    {plan.highlight && <span className="v-chip">Popular</span>}
                    {isCurrent && <span className="v-chip v-chip-emerald">Your plan</span>}
                  </div>

                  <div className="my-3">
                    <span className="display-6 fw-bold">{plan.price === 0 ? 'Free' : formatINR(plan.price)}</span>
                    {plan.price !== 0 && <span className="text-muted-2">/{plan.cadence}</span>}
                  </div>

                  <ul className="list-unstyled d-grid gap-2 mb-4">
                    {plan.features.map((f) => (
                      <li key={f.label} className={f.included ? '' : 'text-muted-2'}>
                        <span className={f.included ? 'text-emerald' : 'text-muted-2'}>{f.included ? '✓' : '—'}</span>{' '}
                        {f.label}
                      </li>
                    ))}
                  </ul>

                  {isAuthenticated ? (
                    <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline-primary'} mt-auto`}
                      disabled={isCurrent}>
                      {isCurrent ? 'Current plan' : plan.id === 'free' ? 'Included' : `Upgrade to ${plan.name}`}
                    </button>
                  ) : (
                    <Link to="/register" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline-primary'} mt-auto`}>
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center small text-muted-2 mt-4">
          Payments and billing go live with the subscription module — plans shown are the launch line-up.
        </p>
      </div>
    </>
  );
}
