import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import Logo3D from '../../components/Logo3D';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const returnTo = location.state?.returnTo || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const userInfo = await login(email, password);
      if (userInfo.role === 'ROLE_ADMIN' && returnTo === '/') {
        navigate('/admin/dashboard');
      } else {
        navigate(returnTo, { state: location.state });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto 80px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Logo3D size={54} />
          </div>
          <h2 style={{ fontSize: '24px', color: '#fff' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Sign in to Route3D AP & Telangana Bus System
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '40px' }}
              />
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In Badge for Passenger */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '10px' }}>
            Quick Demo 1-Click Passenger Sign-in:
          </div>
          <button
            type="button"
            onClick={() => handleQuickLogin('passenger@teluguride.com', 'User@123')}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '13px', padding: '10px', gap: '8px' }}
          >
            <UserCheck size={16} color="#38bdf8" /> Sign in as Passenger (Ravi Kumar Naidu)
          </button>
        </div>

        {/* Separate Admin Portal Link */}
        <div
          style={{
            marginTop: '20px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '6px' }}>
            Authorized RTC Operations Official?
          </div>
          <Link
            to="/admin/login"
            style={{
              color: '#fbbf24',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={15} /> Access Dedicated Admin Portal (jaswanthdoppa76@gmail.com) →
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
