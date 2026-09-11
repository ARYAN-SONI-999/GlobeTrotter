import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setEmail('aryan@example.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMsg('');
    setResetUrl('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setForgotMsg(res.data.message || 'Reset link created.');
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
        <p className="auth-subtitle">
          {forgotMode ? 'Account Recovery' : 'Welcome back, traveler 👋'}
        </p>

        {!forgotMode ? (
          <form onSubmit={handleSubmit} className="auth-form">
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Logging in...' : 'Sign In to Dashboard →'}
            </button>

            {/* Quick Demo Login Helper */}
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleDemoFill}
                style={{
                  background: '#f1f5f9',
                  border: '1px dashed #94a3b8',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  color: '#334155',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ⚡ Autofill Demo Credentials
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="auth-form">
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Enter registered email address
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
            
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '14px' }}>
                ⚠️ {error}
              </div>
            )}
            {forgotMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.85rem', marginBottom: '14px' }}>
                ✅ {forgotMsg}
              </div>
            )}

            {resetUrl && (
              <div style={{ margin: '14px 0', padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 700, color: '#1e40af', marginBottom: '6px' }}>🔗 Demo Password Reset Link:</p>
                <Link to={resetUrl} style={{ wordBreak: 'break-all', fontWeight: 700, color: '#2563eb' }}>
                  Click here to set new password →
                </Link>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '12px', borderRadius: '10px', fontWeight: 700 }}>
              Generate Reset Link
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => { setForgotMode(false); setForgotMsg(''); setResetUrl(''); setError(''); }}
              style={{ display: 'block', width: '100%', marginTop: '12px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
          <p className="auth-switch" style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#2563eb', fontWeight: 700 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
