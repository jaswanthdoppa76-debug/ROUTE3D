import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor3D() {
  const { cursor3dEnabled } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [trail, setTrail] = useState([]);
  const [visible, setVisible] = useState(false);

  const requestRef = useRef();
  const lastPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!cursor3dEnabled) {
      document.documentElement.classList.remove('custom-3d-cursor-active');
      return;
    }

    // Only apply if primary pointer is fine (mouse)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add('custom-3d-cursor-active');

    const handleMouseMove = (e) => {
      setVisible(true);
      setTargetPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target;
      const clickable = target.closest('button, a, input, select, textarea, .seat-item, .clickable, [role="button"], label');
      setIsHovered(!!clickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('custom-3d-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursor3dEnabled]);

  // Smooth lerp animation loop & trailing particles
  useEffect(() => {
    if (!cursor3dEnabled) return;

    const animate = () => {
      setPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const vx = (targetPos.x - lastPosRef.current.x) * 0.8;
        const vy = (targetPos.y - lastPosRef.current.y) * 0.8;
        lastPosRef.current = { x: targetPos.x, y: targetPos.y };
        setVelocity({ vx, vy });

        const newX = prev.x + dx * 0.35;
        const newY = prev.y + dy * 0.35;

        // Append to trailing particles
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          setTrail((t) => [
            { x: newX, y: newY, id: Date.now() + Math.random(), age: 1 },
            ...t.slice(0, 5),
          ]);
        }

        return { x: newX, y: newY };
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [targetPos, cursor3dEnabled]);

  if (!cursor3dEnabled || !visible) return null;

  // Calculate 3D tilt angles based on velocity
  const tiltX = Math.max(-35, Math.min(35, -velocity.vy * 1.5));
  const tiltY = Math.max(-35, Math.min(35, velocity.vx * 1.5));
  const tiltZ = Math.max(-25, Math.min(25, velocity.vx * 0.8));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      {/* Trailing Comet Tail Particles */}
      {trail.map((pt, idx) => {
        const opacity = (1 - idx / 6) * 0.45;
        const scale = (1 - idx / 7) * 0.8;
        return (
          <div
            key={pt.id}
            style={{
              position: 'absolute',
              left: `${pt.x}px`,
              top: `${pt.y}px`,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: 'var(--shadow-glow-cyan)',
              transform: 'translate(-50%, -50%)',
              opacity,
              scale,
              transition: 'opacity 0.2s, transform 0.2s',
            }}
          />
        );
      })}

      {/* Main 3D Reticle & Bus Pointer */}
      <div
        style={{
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) scale(${
            isClicked ? 0.85 : isHovered ? 1.4 : 1
          })`,
          transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer 3D Glow Ring when Hovered */}
        {isHovered ? (
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '2px dashed var(--accent-cyan)',
              boxShadow: 'var(--shadow-glow-cyan), inset 0 0 12px var(--accent-cyan)',
              animation: 'spin3d 4s linear infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(6, 182, 212, 0.15)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px #ffffff',
              }}
            />
          </div>
        ) : (
          /* Futuristic 3D Arrowhead / Bus Pointer */
          <div
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: 'rotate(-45deg)',
                filter: 'drop-shadow(0 0 8px var(--accent-cyan))',
              }}
            >
              {/* Sleek 3D Dart Polygon */}
              <polygon
                points="12,2 22,22 12,17 2,22"
                fill="url(#cursorGrad)"
                stroke="var(--accent-cyan)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="var(--accent-cyan)" />
                  <stop offset="100%" stopColor="var(--primary-600)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center Glowing 3D Beacon */}
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px #ffffff',
              }}
            />
          </div>
        )}

        {/* 3D Click Wave Effect */}
        {isClicked && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid var(--accent-cyan)',
              transform: 'translate(-50%, -50%)',
              animation: 'clickWave 0.4s ease-out forwards',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes spin3d {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes clickWave {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 60px;
            height: 60px;
            opacity: 0;
          }
        }
        html.custom-3d-cursor-active,
        html.custom-3d-cursor-active * {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
