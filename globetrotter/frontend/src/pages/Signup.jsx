import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function pwdStrength(pwd) {
  if (!pwd) return { label: '', color: '#e2e8f0', width: '0%' };
  if (pwd.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
  if (pwd.length < 8) return { label: 'Weak', color: '#f97316', width: '50%' };
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
  const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  if (score === 0) return { label: 'Fair', color: '#eab308', width: '65%' };
  if (score === 1) return { label: 'Good', color: '#22c55e', width: '85%' };
  return { label: 'Strong ✓', color: '#10b981', width: '100%' };
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const strength = pwdStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '2rem' }}>🌍</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>GlobeTrotter</span>
          </Link>
        </div>
        <p className="auth-subtitle">Create your free travel account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aryan Soni"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '16px',
                outline: 'none',
                background: '#f8fafc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '16px',
                outline: 'none',
                background: '#f8fafc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '16px',
                  outline: 'none',
                  background: '#f8fafc',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '4px',
                  color: '#64748b'
                }}
                aria-label="Toggle password visibility"
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password strength bar */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: strength.width,
                      background: strength.color,
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem' }}>
                  <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                  <span style={{ color: '#94a3b8' }}>Min 6 characters</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' }}
          >
            {loading ? 'Creating account...' : 'Create Free Account →'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
          <p className="auth-switch" style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
          By signing up, you agree to GlobeTrotter's{' '}
          <Link to="/terms" style={{ color: '#64748b', textDecoration: 'underline' }}>Terms</Link> and{' '}
          <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
