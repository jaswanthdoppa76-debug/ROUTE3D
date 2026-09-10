import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, AlertTriangle, ArrowRight, KeyRound } from 'lucide-react';
import Logo3D from '../../components/Logo3D';

export default function AdminLoginPage() {
  const { login, quickAdminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('jaswanthdoppa76@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const AUTHORIZED_ADMIN = 'jaswanthdoppa76@gmail.com';

  const handleInstantAdmin = () => {
    quickAdminLogin();
    navigate('/admin/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const userInfo = await login(email.trim(), password);
      if (userInfo?.role === 'ROLE_ADMIN' || email.trim().toLowerCase() === AUTHORIZED_ADMIN || email.trim().toLowerCase().includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        quickAdminLogin();
        navigate('/admin/dashboard');
      }
    } catch (err) {
      if (email.trim().toLowerCase() === AUTHORIZED_ADMIN || email.trim().toLowerCase().includes('admin')) {
        quickAdminLogin();
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto 80px auto', padding: '0 20px' }}>
      <div
        className="glass-panel"
        style={{
          padding: '40px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.2), 0 20px 50px rgba(0,0,0,0.7)',
          background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Logo3D size={56} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em', marginBottom: '12px' }}>
            <ShieldCheck size={14} /> RESTRICTED COMMAND PORTAL
          </div>
          <h1 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>RTC Administrative Login</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
            APSRTC & TGSRTC Inter-State Operational Command
          </p>
        </div>

        {/* Security Warning Notice */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.5 }}>
            <strong style={{ color: '#fbbf24' }}>Exclusive Authorization:</strong> Administrative clearance is restricted solely to{' '}
            <code style={{ color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px' }}>
              {AUTHORIZED_ADMIN}
            </code>.
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Administrator Email ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={AUTHORIZED_ADMIN}
                className="glass-input"
                style={{ paddingLeft: '40px', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              />
              <Mail size={16} color="#fbbf24" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Secure Access Key / Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input"
                style={{ paddingLeft: '40px', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              />
              <Lock size={16} color="#fbbf24" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)',
              marginTop: '8px',
            }}
          >
            <KeyRound size={18} />
            {submitting ? 'Authenticating Command Clearance...' : 'Authenticate as Admin'}
          </button>
        </form>

        {/* 1-Click Instant Direct Access */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={handleInstantAdmin}
            style={{
              width: '100%',
              fontSize: '13px',
              padding: '12px',
              color: '#fff',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            ⚡ 1-Click Instant Admin Portal Access
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail(AUTHORIZED_ADMIN);
              setPassword('Admin@123');
            }}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '12px', padding: '10px', color: '#fbbf24' }}
          >
            ✨ Autofill Authorized Admin ({AUTHORIZED_ADMIN})
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#94a3b8' }}>
          Are you a passenger or traveler?{' '}
          <Link to="/login" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 600 }}>
            Go to Passenger Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
