import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRightLeft, Sparkles, Shield, Clock, Compass, Navigation, Radio } from 'lucide-react';
import BusHeroCanvas from '../../components/BusHeroCanvas';
import { useLanguage } from '../../context/LanguageContext';

const TELANGANA_CITIES = [
  'Hyderabad', 'Secunderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Suryapet', 'Mahbubnagar'
];

const AP_CITIES = [
  'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur', 'Kurnool', 'Nellore', 'Kadapa', 'Anantapur', 'Rajahmundry', 'Kakinada'
];

const QUICK_ROUTES = [
  { from: 'Hyderabad', to: 'Vijayawada', km: '275 km', duration: '5h', operator: 'TGSRTC / APSRTC', buses: 4 },
  { from: 'Hyderabad', to: 'Visakhapatnam', km: '620 km', duration: '11h', operator: 'Amaravati Scania', buses: 3 },
  { from: 'Hyderabad', to: 'Tirupati', km: '560 km', duration: '10h', operator: 'Garuda Plus', buses: 3 },
  { from: 'Vijayawada', to: 'Hyderabad', km: '275 km', duration: '5h', operator: 'Rajdhani AC', buses: 4 },
  { from: 'Visakhapatnam', to: 'Hyderabad', km: '620 km', duration: '11h', operator: 'Lahari Sleeper', buses: 2 },
  { from: 'Tirupati', to: 'Hyderabad', km: '560 km', duration: '10h', operator: 'Super Luxury', buses: 3 },
];

export default function HomePage({ onOpenTracker }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [fromCity, setFromCity] = useState('Hyderabad');
  const [toCity, setToCity] = useState('Vijayawada');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${travelDate}&passengers=${passengers}`);
  };

  const handleQuickRoute = (from, to) => {
    setFromCity(from);
    setToCity(to);
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${travelDate}&passengers=${passengers}`);
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
        }}
      >
        {/* 3D Background Canvas */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <BusHeroCanvas />
        </div>

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1140px',
            width: '100%',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid var(--accent-cyan)',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#38bdf8',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>{t('officialNetworkBadge')}</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 5.5vw, 64px)',
                lineHeight: 1.15,
                marginBottom: '18px',
                background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 70%, var(--accent-cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('heroTitle1')} <br />{t('heroTitle2')}
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: '#94a3b8',
                maxWidth: '680px',
                margin: '0 auto 28px auto',
                lineHeight: 1.6,
              }}
            >
              {t('heroDescription')}
            </p>

            {/* Quick Live Bus Telemetry Tracker Trigger */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
              <button
                type="button"
                onClick={() => onOpenTracker && onOpenTracker()}
                className="btn-secondary"
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  borderRadius: '999px',
                  border: '1px solid var(--accent-cyan)',
                  color: '#38bdf8',
                  background: 'rgba(6, 182, 212, 0.12)',
                }}
              >
                <Radio size={14} className="animate-pulse" color="var(--accent-cyan)" />
                <span>{t('trackBus')}</span>
              </button>
            </div>
          </motion.div>

          {/* Floating Glassmorphism Search Panel */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-glow"
            style={{
              padding: '28px',
              maxWidth: '1060px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 44px repeat(auto-fit, minmax(180px, 1fr)) 160px',
                gap: '14px',
                alignItems: 'end',
              }}
            >
              {/* FROM */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                  <MapPin size={14} color="var(--accent-cyan)" />
                  {t('fromCity')}
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFromCity(val);
                    if (val === toCity) {
                      setToCity(val === 'Vijayawada' ? 'Hyderabad' : 'Vijayawada');
                    }
                  }}
                  className="glass-input"
                >
                  <optgroup label="Telangana Destinations">
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Andhra Pradesh Destinations">
                    {AP_CITIES.map((c) => (
                      <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>{c}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* SWAP BUTTON */}
              <button
                type="button"
                onClick={handleSwap}
                style={{
                  height: '46px',
                  width: '44px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: '0.2s',
                  marginBottom: '2px',
                }}
                title={t('swapCities')}
              >
                <ArrowRightLeft size={16} />
              </button>

              {/* TO */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                  <MapPin size={14} color="var(--primary-500)" />
                  {t('toCity')}
                </label>
                <select
                  value={toCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setToCity(val);
                    if (val === fromCity) {
                      setFromCity(val === 'Hyderabad' ? 'Vijayawada' : 'Hyderabad');
                    }
                  }}
                  className="glass-input"
                >
                  <optgroup label="Andhra Pradesh Destinations">
                    {AP_CITIES.map((c) => (
                      <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Telangana Destinations">
                    {TELANGANA_CITIES.map((c) => (
                      <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>{c}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* TRAVEL DATE */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                  <Calendar size={14} color="#10b981" />
                  {t('travelDate')}
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* PASSENGERS */}
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                  <Users size={14} color="#f59e0b" />
                  {t('passengers')}
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="glass-input"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} style={{ background: '#0f172a', color: '#fff' }}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEARCH BUTTON */}
              <div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    height: '46px',
                    fontSize: '15px',
                  }}
                >
                  {t('findBusesBtn')}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Popular Inter-State Corridors (3D Tilt Cards) */}
      <section style={{ maxWidth: '1280px', margin: '60px auto 40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Compass size={14} /> EXPRESS CORRIDORS
          </div>
          <h2 style={{ fontSize: '32px', color: '#ffffff', marginTop: '6px' }}>
            {t('quickCorridors')}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Direct highway services operated by TGSRTC & APSRTC.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {QUICK_ROUTES.map((route, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleQuickRoute(route.from, route.to)}
              className="glass-panel"
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-glass)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-tgsrtc" style={{ fontSize: '10px' }}>
                    {route.operator}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {route.buses} Daily Services
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 700 }}>
                  <span style={{ color: '#fff' }}>{route.from}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>➔</span>
                  <span style={{ color: '#fff' }}>{route.to}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-glass)',
                  fontSize: '13px',
                  color: '#94a3b8',
                }}
              >
                <span>{route.km} Distance</span>
                <span>⏱️ {route.duration} Express</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>View Buses →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Official State Operators Section */}
      <section style={{ maxWidth: '1280px', margin: '80px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '32px', color: '#ffffff' }}>
            {t('verifiedOperatorsTitle')}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Authorized government transport corporations of Telangana and Andhra Pradesh.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* TGSRTC Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel"
            style={{ padding: '32px', borderLeft: '4px solid #f59e0b' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#fbbf24',
                }}
              >
                TG
              </div>
              <div>
                <h3 style={{ fontSize: '18px', color: '#fff' }}>TGSRTC</h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Telangana State Road Transport</div>
              </div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
              {t('tgsrtcDesc')}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="badge badge-tgsrtc">Rajdhani AC</span>
              <span className="badge badge-tgsrtc">Lahari Sleeper</span>
              <span className="badge badge-tgsrtc">Super Luxury</span>
            </div>
          </motion.div>

          {/* APSRTC Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel"
            style={{ padding: '32px', borderLeft: '4px solid #10b981' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#34d399',
                }}
              >
                AP
              </div>
              <div>
                <h3 style={{ fontSize: '18px', color: '#fff' }}>APSRTC</h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Andhra Pradesh State Road Transport</div>
              </div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
              {t('apsrtcDesc')}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="badge badge-apsrtc">Amaravati Scania</span>
              <span className="badge badge-apsrtc">Dolphin Cruise</span>
              <span className="badge badge-apsrtc">Vennela Sleeper</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
