import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User, LogOut, ShieldCheck, Ticket, Search, Palette, Globe, Navigation, ChevronDown, Menu, X } from 'lucide-react';
import Logo3D from './Logo3D';

export default function Navbar({ onOpenLiveTracker }) {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { setIsThemeModalOpen, activeTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminPath = location.pathname.startsWith('/admin');

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(7, 10, 18, 0.88)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '12px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAdminPath ? '/admin/dashboard' : '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <Logo3D size={42} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                JD Bus<span style={{ color: 'var(--accent-cyan)' }}> Services</span>
              </span>
              {isAdminPath ? (
                <span className="badge badge-tgsrtc" style={{ fontSize: '10px' }}>
                  COMMAND
                </span>
              ) : (
                <span className="badge badge-apsrtc" style={{ fontSize: '9px' }}>
                  RTC
                </span>
              )}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.04em' }}>
              {t('appSubtitle')}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {!isAdminPath ? (
            <>
              <Link
                to="/"
                style={{
                  color: location.pathname === '/' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Search size={16} />
                {t('searchBuses')}
              </Link>
              <Link
                to="/my-bookings"
                style={{
                  color: location.pathname === '/my-bookings' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Ticket size={16} />
                {t('myBookings')}
              </Link>
              <button
                onClick={onOpenLiveTracker}
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  gap: '6px',
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                }}
              >
                <Navigation size={14} color="var(--accent-cyan)" />
                {t('trackBus')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  color: location.pathname === '/admin/dashboard' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/buses"
                style={{
                  color: location.pathname === '/admin/buses' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Fleet
              </Link>
              <Link
                to="/admin/routes"
                style={{
                  color: location.pathname === '/admin/routes' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Routes
              </Link>
              <Link
                to="/admin/schedules"
                style={{
                  color: location.pathname === '/admin/schedules' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Schedules
              </Link>
              <Link
                to="/admin/bookings"
                style={{
                  color: location.pathname === '/admin/bookings' ? 'var(--accent-cyan)' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Bookings
              </Link>
              <Link
                to="/admin/challans"
                style={{
                  color: location.pathname === '/admin/challans' ? '#fbbf24' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Challans & Cases
              </Link>
              <Link
                to="/"
                style={{
                  color: '#34d399',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {t('customerSite')}
              </Link>
            </>
          )}

          <div style={{ height: '20px', width: '1px', background: 'var(--border-glass)' }} />

          {/* Theme & Colors Chooser Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              gap: '6px',
              border: '1px solid var(--border-accent)',
            }}
            title={t('themeCustomizer')}
          >
            <Palette size={15} color="var(--accent-cyan)" />
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: activeTheme.primary,
                boxShadow: 'var(--shadow-glow-cyan)',
              }}
            />
          </button>

          {/* Language Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '13px', gap: '6px' }}
            >
              <Globe size={14} color="#38bdf8" />
              <span>
                {languageOptions.find((l) => l.code === language)?.flag}{' '}
                {languageOptions.find((l) => l.code === language)?.label}
              </span>
              <ChevronDown size={12} />
            </button>

            {langMenuOpen && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  minWidth: '130px',
                  padding: '6px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 200,
                }}
              >
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: language === opt.code ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      color: language === opt.code ? 'var(--accent-cyan)' : '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: language === opt.code ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile / Authentication */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <User size={14} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600 }}>{user?.fullName?.split(' ')[0]}</span>
                <span className={`badge ${isAdmin ? 'badge-tgsrtc' : 'badge-apsrtc'}`} style={{ fontSize: '9px' }}>
                  {isAdmin ? t('adminBadge') : t('passengerBadge')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '8px', fontSize: '13px', borderRadius: '50%' }}
                title={t('signOut')}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {t('signIn')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
