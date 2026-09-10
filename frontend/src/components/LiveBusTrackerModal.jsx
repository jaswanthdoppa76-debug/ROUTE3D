import React, { useState, useEffect } from 'react';
import { X, Navigation, Compass, MapPin, Clock, Phone, AlertCircle, Radio, ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LiveBusTrackerModal({ isOpen, onClose, busData }) {
  const { t } = useLanguage();
  const [speed, setSpeed] = useState(76);
  const [progress, setProgress] = useState(58); // 58% along route

  const activeBus = busData || {
    busNumber: 'TS09Z7788',
    busName: 'TGSRTC Rajdhani AC Express',
    operator: 'TGSRTC',
    route: 'Hyderabad (MGBS) ➔ Vijayawada (PNBS)',
    currentLocation: 'NH65, Suryapet Expressway Toll Plaza',
    nextStop: 'Kodad Bus Station',
    etaNextStop: '18 mins',
    destinationETA: '11:15 AM (1h 10m remaining)',
    status: 'On Time',
    driverName: 'S. Narsimha Reddy',
    driverPhone: '+91 98480 11223',
    amenities: ['GPS Live', 'AC Active', 'Speed Governor (80 km/h)'],
  };

  // Subtle speed fluctuation for realism
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSpeed(Math.floor(74 + Math.random() * 8));
    }, 3000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const milestones = [
    { name: 'Hyderabad MGBS', time: '06:00 AM', completed: true },
    { name: 'Choutuppal', time: '07:15 AM', completed: true },
    { name: 'Suryapet Bypass (Now)', time: '08:45 AM', current: true },
    { name: 'Kodad Depot', time: '09:20 AM', completed: false },
    { name: 'Nandigama', time: '10:05 AM', completed: false },
    { name: 'Vijayawada PNBS', time: '11:15 AM', completed: false },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-accent)',
          boxShadow: 'var(--shadow-glow)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-tgsrtc" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Radio size={12} className="animate-pulse" /> LIVE TELEMETRY
              </span>
              <span className="badge badge-apsrtc">{activeBus.status}</span>
            </div>
            <h2 style={{ fontSize: '22px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={22} color="var(--accent-cyan)" />
              {activeBus.busNumber} • {activeBus.busName}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>{activeBus.route}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Radar & Highway Corridor Map Visualizer */}
        <div
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid lines background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }}
          />

          {/* Telemetry HUD top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>GPS Heading: <strong>East (NH65)</strong></span>
            </div>
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '999px',
                padding: '4px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {speed} KM/H
            </div>
          </div>

          {/* Corridor Waypoints Line */}
          <div style={{ position: 'relative', margin: '30px 10px', zIndex: 2 }}>
            {/* Background Line */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-50%)',
                borderRadius: '2px',
              }}
            />
            {/* Active Progress Line */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: `${progress}%`,
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary-600), var(--accent-cyan))',
                transform: 'translateY(-50%)',
                boxShadow: 'var(--shadow-glow-cyan)',
                borderRadius: '2px',
              }}
            />

            {/* 3D Animated Bus Marker */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progress}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px var(--accent-cyan)',
                  border: '2px solid #fff',
                  animation: 'pulse-radar 1.5s infinite',
                }}
              >
                🚌
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginTop: '6px',
                  whiteSpace: 'nowrap',
                  border: '1px solid var(--border-glass)',
                }}
              >
                LIVE: Suryapet
              </span>
            </div>

            {/* Start and End nodes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#34d399', border: '2px solid #fff' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Hyderabad</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#38bdf8', border: '2px solid #fff' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Vijayawada</span>
              </div>
            </div>
          </div>

          {/* Current telemetry breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-glass)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Current Location</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                {activeBus.currentLocation}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Next Boarding Stop</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>
                {activeBus.nextStop} ({activeBus.etaNextStop})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Final ETA</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#34d399', marginTop: '2px' }}>
                {activeBus.destinationETA}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Corridor Timeline */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
            CORRIDOR SCHEDULE & STOPS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: m.current
                    ? 'rgba(6, 182, 212, 0.12)'
                    : m.completed
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: m.current ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} color={m.current ? 'var(--accent-cyan)' : m.completed ? '#34d399' : '#64748b'} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: m.current ? '#fff' : '#cbd5e1' }}>
                    {m.name}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  {m.time} • {m.completed ? 'Passed' : m.current ? 'Approaching' : 'Scheduled'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Contact & Official Support */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-glass)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={16} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Duty Pilot / Driver</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                {activeBus.driverName} ({activeBus.driverPhone})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail size={16} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Admin Oversight</div>
              <a
                href="mailto:jaswanthdoppa76@gmail.com"
                style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24', textDecoration: 'none' }}
              >
                jaswanthdoppa76@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-radar {
          0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
          70% { box-shadow: 0 0 0 16px rgba(6, 182, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
      `}</style>
    </div>
  );
}
