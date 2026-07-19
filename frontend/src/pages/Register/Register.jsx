import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import InputField from '../../components/Forms/InputField.jsx';
import Button from '../../components/Buttons/Button.jsx';
import AuthLayout from './AuthLayout.jsx';
import { SIGNUP_ROLES } from '../../utils/constants.js';

/**
 * Register — collects the spec's fields and submits the subset the backend
 * accepts (name / email / password / role). Role is limited to the backend's
 * self-assignable roles (brand, artisan); `phone` is captured for a future
 * profile field but not yet persisted server-side.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', role: 'brand',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Name must be at least 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address.';
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone)) err.phone = 'Enter a valid phone number.';
    if (form.password.length < 6) err.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) err.confirm = 'Passwords do not match.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout wide title="Create your account" subtitle="Join Vastra AI and start designing with heritage.">
      <form onSubmit={onSubmit} noValidate>
        {apiError && <div className="alert alert-danger py-2">{apiError}</div>}

        {/* Role selection */}
        <label className="form-label fw-semibold">I am joining as <span className="text-danger">*</span></label>
        <div className="row g-2 mb-3">
          {SIGNUP_ROLES.map((r) => (
            <div className="col-6" key={r.value}>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                className={`v-selectable w-100 h-100 p-3 text-start bg-white ${form.role === r.value ? 'selected' : ''}`}
              >
                <div className="fs-4">{r.icon}</div>
                <div className="fw-semibold">{r.label}</div>
                <div className="small text-muted-2">{r.blurb}</div>
              </button>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-md-6">
            <InputField label="Full name" name="name" value={form.name} onChange={onChange}
              error={errors.name} placeholder="Nova Label" required autoComplete="name" />
          </div>
          <div className="col-md-6">
            <InputField label="Phone" name="phone" value={form.phone} onChange={onChange}
              error={errors.phone} placeholder="+91 98765 43210" hint="Optional" autoComplete="tel" />
          </div>
        </div>
        <InputField label="Email" name="email" type="email" value={form.email} onChange={onChange}
          error={errors.email} placeholder="you@example.com" required autoComplete="email" />
        <div className="row">
          <div className="col-md-6">
            <InputField label="Password" name="password" type="password" value={form.password}
              onChange={onChange} error={errors.password} placeholder="••••••••" required
              autoComplete="new-password" hint="At least 6 characters" />
          </div>
          <div className="col-md-6">
            <InputField label="Confirm password" name="confirm" type="password" value={form.confirm}
              onChange={onChange} error={errors.confirm} placeholder="••••••••" required
              autoComplete="new-password" />
          </div>
        </div>

        <Button type="submit" block size="lg" loading={loading} className="mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-muted-2 mt-4 mb-0">
        Already have an account? <Link to="/login" className="fw-semibold text-decoration-none">Log in</Link>
      </p>
    </AuthLayout>
  );
}
