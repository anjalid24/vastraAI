import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import InputField from '../../components/Forms/InputField.jsx';
import Button from '../../components/Buttons/Button.jsx';
import AuthLayout from '../Register/AuthLayout.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue designing with heritage on your side."
    >
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <InputField
          label="Email" name="email" type="email" value={form.email}
          onChange={onChange} placeholder="you@example.com" required autoComplete="email"
        />
        <div className="d-flex justify-content-between align-items-center">
          <label className="form-label fw-semibold mb-1">Password <span className="text-danger">*</span></label>
          <span className="small text-muted-2 v-cursor" title="Password reset is coming soon">Forgot password?</span>
        </div>
        <InputField
          name="password" type="password" value={form.password}
          onChange={onChange} placeholder="••••••••" required autoComplete="current-password"
        />
        <Button type="submit" block size="lg" loading={loading} className="mt-2">
          {loading ? 'Signing in…' : 'Login'}
        </Button>
      </form>
      <p className="text-center text-muted-2 mt-4 mb-0">
        New to Vastra AI? <Link to="/register" className="fw-semibold text-decoration-none">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
