import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bus } from 'lucide-react';
import * as THREE from 'three';

// 3D Procedural Holographic Bus Logo
const Bus3DEmblem = ({ isHovered }) => {
  const groupRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth continuous spin; rotates faster when hovered
      const rotationSpeed = isHovered ? 2.4 : 0.85;
      groupRef.current.rotation.y += delta * rotationSpeed;
      // Gentle floating oscillation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.8) * 0.08;
      // Slight aerodynamic pitch tilt
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 1.2;
      ringRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Aerodynamic Luxury Coach Chassis */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.15, 0.72, 2.1]} />
        <meshStandardMaterial
          color="#1d4ed8" // Vibrant Royal Blue
          metalness={0.88}
          roughness={0.15}
          emissive="#0c2363"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Cyber Sleek Roof Trim */}
      <mesh position={[0, 0.39, 0.04]}>
        <boxGeometry args={[1.12, 0.09, 1.98]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Curved Cyber Front Windshield Glass */}
      <mesh position={[0, 0.08, 1.06]}>
        <planeGeometry args={[1.0, 0.44]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.7}
          roughness={0.1}
          metalness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Glowing Dual LED Projector Headlights */}
      <mesh position={[0.4, -0.14, 1.07]}>
        <boxGeometry args={[0.2, 0.08, 0.04]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.4, -0.14, 1.07]}>
        <boxGeometry args={[0.2, 0.08, 0.04]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cyan Neon Accent Under-Grille Strip */}
      <mesh position={[0, -0.22, 1.07]}>
        <boxGeometry args={[0.62, 0.04, 0.03]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* Side Cyan Cyber Accent Stripes */}
      <mesh position={[0.59, 0, 0]}>
        <boxGeometry args={[0.02, 0.08, 1.8]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[-0.59, 0, 0]}>
        <boxGeometry args={[0.02, 0.08, 1.8]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* Rear Taillights (Signature Crimson Glow) */}
      <mesh position={[0.38, -0.12, -1.06]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.38, -0.12, -1.06]} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Wheels - Front Left/Right & Rear Left/Right */}
      <mesh position={[-0.6, -0.3, 0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      <mesh position={[0.6, -0.3, 0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, -0.3, -0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      <mesh position={[0.6, -0.3, -0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Holographic Gyroscopic Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3.2, 0, 0]}>
        <torusGeometry args={[1.65, 0.024, 16, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.75} />
      </mesh>
    </group>
  );
};

export default function Logo3D({ size = 44, interactive = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fallback if WebGL isn't supported or fails
  if (hasError) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
        }}
      >
        <Bus size={Math.round(size * 0.5)} color="#ffffff" />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      title="Route3D Live 3D Logo (Hover to spin)"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.28)}px`,
        background: isHovered
          ? 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(7, 10, 18, 0.85) 100%)',
        border: isHovered
          ? '1.5px solid rgba(56, 189, 248, 0.8)'
          : '1px solid rgba(6, 182, 212, 0.4)',
        boxShadow: isHovered
          ? '0 0 25px rgba(6, 182, 212, 0.7), inset 0 0 15px rgba(6, 182, 212, 0.3)'
          : '0 0 16px rgba(6, 182, 212, 0.35)',
        overflow: 'hidden',
        position: 'relative',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Bus size={Math.round(size * 0.5)} color="#38bdf8" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [2.6, 1.9, 3.4], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 5, 4]} intensity={2.0} />
          <pointLight position={[-3, 2, 3]} intensity={2.5} color="#06b6d4" />
          <pointLight position={[3, -2, -2]} intensity={1.8} color="#3b82f6" />
          <Bus3DEmblem isHovered={isHovered} />
        </Canvas>
      </Suspense>
    </div>
  );
}
