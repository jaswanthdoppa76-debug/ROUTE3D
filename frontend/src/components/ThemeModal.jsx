import React from 'react';
import { useTheme, THEME_PRESETS, FONT_PRESETS } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, MousePointer, Volume2, VolumeX, Check, Palette, Type } from 'lucide-react';

export default function ThemeModal() {
  const {
    isThemeModalOpen,
    setIsThemeModalOpen,
    themeId,
    selectTheme,
    customColor,
    setCustomColorChoice,
    fontId,
    selectFont,
    cursor3dEnabled,
    toggleCursor3D,
    soundEnabled,
    toggleSound,
  } = useTheme();

  const { t } = useLanguage();

  if (!isThemeModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid var(--border-accent)',
          boxShadow: 'var(--shadow-glow), 0 25px 60px rgba(0,0,0,0.8)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow-cyan)',
              }}
            >
              <Palette size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', color: '#fff' }}>Theme, Colors & Font Styling</h2>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Personalize colors, typography styles, and 3D effects</p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. All Colors Options Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={15} color="var(--accent-cyan)" />
              All Official Color Palettes (12 Themes)
            </label>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Click to apply instantly</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '10px' }}>
            {Object.values(THEME_PRESETS)
              .filter((p) => p.id !== 'custom')
              .map((preset) => {
                const isSelected = themeId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectTheme(preset.id)}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.7)',
                      border: isSelected ? `2px solid ${preset.accent}` : '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '12px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.name}
                      </span>
                      {isSelected && <Check size={14} color={preset.accent} />}
                    </div>
                    {/* Swatch bars */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <div style={{ flex: 1, height: '8px', borderRadius: '3px', background: preset.primary }} />
                      <div style={{ flex: 1, height: '8px', borderRadius: '3px', background: preset.accent }} />
                      <div style={{ flex: 1, height: '8px', borderRadius: '3px', background: preset.secondary }} />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* 2. Custom Color Picker ("Our Choice") */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: themeId === 'custom' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                Custom Color Picker (Your Exact Choice)
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Choose any custom hue — gradients, 3D cursor, and glow shadows update in real-time
              </p>
            </div>
            {themeId === 'custom' && <span className="badge badge-tgsrtc" style={{ fontSize: '10px' }}>ACTIVE</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColorChoice(e.target.value)}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
              }}
            />
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColorChoice(e.target.value)}
                className="glass-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', padding: '8px 12px' }}
                placeholder="#06b6d4"
              />
            </div>
            <button
              onClick={() => setCustomColorChoice(customColor)}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Apply Custom Color
            </button>
          </div>
        </div>

        {/* 3. Change Font Style Options */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Type size={16} color="#fbbf24" />
            Change Font Style (6 Typography Presets)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {Object.values(FONT_PRESETS).map((f) => {
              const isSelected = fontId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => selectFont(f.id)}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? '2px solid #fbbf24' : '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff', fontFamily: f.fontHeading }}>
                      {f.name}
                    </span>
                    {isSelected && <Check size={16} color="#fbbf24" />}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{f.tag}</div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px', fontFamily: f.fontPrimary }}>
                    Quick brown fox jumps 123
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 3D Cursor & Audio Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={toggleCursor3D}
            className="btn-secondary"
            style={{
              padding: '12px',
              justifyContent: 'space-between',
              background: cursor3dEnabled ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: cursor3dEnabled ? 'var(--accent-cyan)' : 'var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <MousePointer size={16} color={cursor3dEnabled ? 'var(--accent-cyan)' : '#94a3b8'} />
              <span>Full 3D Cursor</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: cursor3dEnabled ? '#38bdf8' : '#64748b' }}>
              {cursor3dEnabled ? 'ACTIVE' : 'OFF'}
            </span>
          </button>

          <button
            onClick={toggleSound}
            className="btn-secondary"
            style={{
              padding: '12px',
              justifyContent: 'space-between',
              background: soundEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: soundEnabled ? '#10b981' : 'var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              {soundEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} color="#64748b" />}
              <span>Audio Chimes</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: soundEnabled ? '#34d399' : '#64748b' }}>
              {soundEnabled ? 'ACTIVE' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
