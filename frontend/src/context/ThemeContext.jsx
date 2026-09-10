import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_PRESETS = {
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    tag: 'Cyan & Royal Blue',
    primary: '#2563eb',
    accent: '#06b6d4',
    secondary: '#3b82f6',
    glow: 'rgba(6, 182, 212, 0.4)',
    glowPrimary: 'rgba(37, 99, 235, 0.4)',
    border: 'rgba(6, 182, 212, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(37, 99, 235, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.14) 0%, transparent 40%)',
  },
  'electric-sapphire': {
    id: 'electric-sapphire',
    name: 'Electric Sapphire',
    tag: 'Deep Blue & Azure',
    primary: '#1d4ed8',
    accent: '#38bdf8',
    secondary: '#2563eb',
    glow: 'rgba(56, 189, 248, 0.4)',
    glowPrimary: 'rgba(29, 78, 216, 0.4)',
    border: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(29, 78, 216, 0.18) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.12) 0%, transparent 40%)',
  },
  'apsrtc-emerald': {
    id: 'apsrtc-emerald',
    name: 'APSRTC Emerald',
    tag: 'Andhra Transport Green',
    primary: '#059669',
    accent: '#10b981',
    secondary: '#14b8a6',
    glow: 'rgba(16, 185, 129, 0.4)',
    glowPrimary: 'rgba(5, 150, 105, 0.4)',
    border: 'rgba(16, 185, 129, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(5, 150, 105, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.14) 0%, transparent 40%)',
  },
  'tgsrtc-crimson': {
    id: 'tgsrtc-crimson',
    name: 'TGSRTC Crimson Gold',
    tag: 'Telangana Super Luxury',
    primary: '#dc2626',
    accent: '#f59e0b',
    secondary: '#ea580c',
    glow: 'rgba(245, 158, 11, 0.4)',
    glowPrimary: 'rgba(220, 38, 38, 0.4)',
    border: 'rgba(245, 158, 11, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(220, 38, 38, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.14) 0%, transparent 40%)',
  },
  'midnight-amethyst': {
    id: 'midnight-amethyst',
    name: 'Midnight Amethyst',
    tag: 'Executive Purple Coach',
    primary: '#7c3aed',
    accent: '#a855f7',
    secondary: '#6366f1',
    glow: 'rgba(168, 85, 247, 0.4)',
    glowPrimary: 'rgba(124, 58, 237, 0.4)',
    border: 'rgba(168, 85, 247, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(124, 58, 237, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.14) 0%, transparent 40%)',
  },
  'sunset-amber': {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    tag: 'Warm Golden Glow',
    primary: '#d97706',
    accent: '#fbbf24',
    secondary: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.4)',
    glowPrimary: 'rgba(217, 119, 6, 0.4)',
    border: 'rgba(251, 191, 36, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(217, 119, 6, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.14) 0%, transparent 40%)',
  },
  'solar-orange': {
    id: 'solar-orange',
    name: 'Solar Orange',
    tag: 'Blazing Fast Highway',
    primary: '#c2410c',
    accent: '#f97316',
    secondary: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.4)',
    glowPrimary: 'rgba(194, 65, 12, 0.4)',
    border: 'rgba(249, 115, 22, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(194, 65, 12, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.14) 0%, transparent 40%)',
  },
  'cyberpunk-magenta': {
    id: 'cyberpunk-magenta',
    name: 'Cyber Magenta',
    tag: 'Neon Pink & Violet',
    primary: '#be185d',
    accent: '#ec4899',
    secondary: '#f43f5e',
    glow: 'rgba(236, 72, 153, 0.4)',
    glowPrimary: 'rgba(190, 24, 93, 0.4)',
    border: 'rgba(236, 72, 153, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(190, 24, 93, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.14) 0%, transparent 40%)',
  },
  'ruby-red': {
    id: 'ruby-red',
    name: 'Royal Ruby',
    tag: 'Deep Passion Red',
    primary: '#9f1239',
    accent: '#f43f5e',
    secondary: '#e11d48',
    glow: 'rgba(244, 63, 94, 0.4)',
    glowPrimary: 'rgba(159, 18, 57, 0.4)',
    border: 'rgba(244, 63, 94, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(159, 18, 57, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.14) 0%, transparent 40%)',
  },
  'lime-velocity': {
    id: 'lime-velocity',
    name: 'Lime Velocity',
    tag: 'Electric Eco Pulse',
    primary: '#4d7c0f',
    accent: '#84cc16',
    secondary: '#65a30d',
    glow: 'rgba(132, 204, 22, 0.4)',
    glowPrimary: 'rgba(77, 124, 15, 0.4)',
    border: 'rgba(132, 204, 22, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(77, 124, 15, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(132, 204, 22, 0.14) 0%, transparent 40%)',
  },
  'teal-breeze': {
    id: 'teal-breeze',
    name: 'Coastal Teal',
    tag: 'Vizag Bay Breeze',
    primary: '#0f766e',
    accent: '#14b8a6',
    secondary: '#0d9488',
    glow: 'rgba(20, 184, 166, 0.4)',
    glowPrimary: 'rgba(15, 118, 110, 0.4)',
    border: 'rgba(20, 184, 166, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(15, 118, 110, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.14) 0%, transparent 40%)',
  },
  'obsidian-platinum': {
    id: 'obsidian-platinum',
    name: 'Obsidian Platinum',
    tag: 'Minimalist Stealth Slate',
    primary: '#334155',
    accent: '#94a3b8',
    secondary: '#475569',
    glow: 'rgba(148, 163, 184, 0.35)',
    glowPrimary: 'rgba(51, 65, 85, 0.35)',
    border: 'rgba(148, 163, 184, 0.4)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(51, 65, 85, 0.18) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(148, 163, 184, 0.1) 0%, transparent 40%)',
  },
  'custom': {
    id: 'custom',
    name: 'Custom Choice',
    tag: 'Your Personal Color',
    primary: '#06b6d4',
    accent: '#38bdf8',
    secondary: '#0284c7',
    glow: 'rgba(6, 182, 212, 0.4)',
    glowPrimary: 'rgba(56, 189, 248, 0.4)',
    border: 'rgba(6, 182, 212, 0.45)',
    bgGradient: 'radial-gradient(circle at 20% 15%, rgba(6, 182, 212, 0.16) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.14) 0%, transparent 40%)',
  }
};

export const FONT_PRESETS = {
  'outfit-inter': {
    id: 'outfit-inter',
    name: 'Outfit & Inter',
    tag: 'Modern Tech (Default)',
    fontHeading: "'Outfit', sans-serif",
    fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  'jakarta': {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    tag: 'Ultra-Modern Premium SaaS',
    fontHeading: "'Plus Jakarta Sans', sans-serif",
    fontPrimary: "'Plus Jakarta Sans', sans-serif",
  },
  'space-grotesk': {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    tag: 'Cyber Geometric Mobility',
    fontHeading: "'Space Grotesk', sans-serif",
    fontPrimary: "'Inter', sans-serif",
  },
  'roboto': {
    id: 'roboto',
    name: 'Roboto Material',
    tag: 'Clean Transit Standard',
    fontHeading: "'Roboto', sans-serif",
    fontPrimary: "'Roboto', sans-serif",
  },
  'cinzel': {
    id: 'cinzel',
    name: 'Cinzel Royal',
    tag: 'State Luxury Heritage',
    fontHeading: "'Cinzel', serif",
    fontPrimary: "'Inter', sans-serif",
  },
  'jetbrains-mono': {
    id: 'jetbrains-mono',
    name: 'JetBrains Code Mono',
    tag: 'Engineering Command Hub',
    fontHeading: "'JetBrains Mono', monospace",
    fontPrimary: "'JetBrains Mono', monospace",
  },
};

const ThemeContext = createContext();

// Helper to convert hex to rgba
function hexToRgba(hex, alpha = 1) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

// Helper to lighten/darken hex
function adjustHex(hex, percent) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('route3d_theme_id') || 'cyber-neon');
  const [customColor, setCustomColor] = useState(() => localStorage.getItem('route3d_custom_color') || '#06b6d4');
  const [fontId, setFontId] = useState(() => localStorage.getItem('route3d_font_id') || 'outfit-inter');
  const [cursor3dEnabled, setCursor3dEnabled] = useState(() => {
    const saved = localStorage.getItem('route3d_3d_cursor');
    return saved !== null ? saved === 'true' : true;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('route3d_sound_fx');
    return saved !== null ? saved === 'true' : true;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Play subtle Web Audio chimes
  const playSound = (type = 'click') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  };

  const applyThemeTokens = (tId, cColor, fId) => {
    const root = document.documentElement;
    let themeObj = THEME_PRESETS[tId] || THEME_PRESETS['cyber-neon'];

    if (tId === 'custom') {
      const primary = cColor;
      const accent = adjustHex(cColor, 35);
      const secondary = adjustHex(cColor, -25);
      const glow = hexToRgba(primary, 0.4);
      const glowPrimary = hexToRgba(secondary, 0.4);
      const border = hexToRgba(primary, 0.45);

      root.style.setProperty('--primary-500', primary);
      root.style.setProperty('--primary-600', secondary);
      root.style.setProperty('--accent-cyan', accent);
      root.style.setProperty('--shadow-glow', `0 0 28px ${glowPrimary}`);
      root.style.setProperty('--shadow-glow-cyan', `0 0 28px ${glow}`);
      root.style.setProperty('--border-accent', border);
      root.style.setProperty('--theme-accent', primary);
      root.style.setProperty(
        '--theme-bg-gradient',
        `radial-gradient(circle at 20% 15%, ${hexToRgba(primary, 0.16)} 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${hexToRgba(accent, 0.14)} 0%, transparent 40%)`
      );
    } else {
      root.style.setProperty('--primary-500', themeObj.secondary);
      root.style.setProperty('--primary-600', themeObj.primary);
      root.style.setProperty('--accent-cyan', themeObj.accent);
      root.style.setProperty('--shadow-glow', `0 0 28px ${themeObj.glowPrimary}`);
      root.style.setProperty('--shadow-glow-cyan', `0 0 28px ${themeObj.glow}`);
      root.style.setProperty('--border-accent', themeObj.border);
      root.style.setProperty('--theme-accent', themeObj.accent);
      root.style.setProperty('--theme-bg-gradient', themeObj.bgGradient);
    }

    // Apply Typography Fonts
    const fontObj = FONT_PRESETS[fId] || FONT_PRESETS['outfit-inter'];
    root.style.setProperty('--font-primary', fontObj.fontPrimary);
    root.style.setProperty('--font-heading', fontObj.fontHeading);
  };

  useEffect(() => {
    applyThemeTokens(themeId, customColor, fontId);
    localStorage.setItem('route3d_theme_id', themeId);
    localStorage.setItem('route3d_custom_color', customColor);
    localStorage.setItem('route3d_font_id', fontId);
    localStorage.setItem('route3d_3d_cursor', String(cursor3dEnabled));
    localStorage.setItem('route3d_sound_fx', String(soundEnabled));
  }, [themeId, customColor, fontId, cursor3dEnabled, soundEnabled]);

  const selectTheme = (id) => {
    setThemeId(id);
    playSound('click');
  };

  const setCustomColorChoice = (colorHex) => {
    setCustomColor(colorHex);
    setThemeId('custom');
    playSound('click');
  };

  const selectFont = (id) => {
    setFontId(id);
    playSound('click');
  };

  const toggleCursor3D = () => {
    setCursor3dEnabled(prev => !prev);
    playSound('click');
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    playSound('click');
  };

  const activeTheme = themeId === 'custom' 
    ? { ...THEME_PRESETS['custom'], primary: customColor, accent: adjustHex(customColor, 35) }
    : THEME_PRESETS[themeId] || THEME_PRESETS['cyber-neon'];

  const activeFont = FONT_PRESETS[fontId] || FONT_PRESETS['outfit-inter'];

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        selectTheme,
        customColor,
        setCustomColorChoice,
        fontId,
        selectFont,
        activeFont,
        cursor3dEnabled,
        toggleCursor3D,
        soundEnabled,
        toggleSound,
        playSound,
        activeTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
