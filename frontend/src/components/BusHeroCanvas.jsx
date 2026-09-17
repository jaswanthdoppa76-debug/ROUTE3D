import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Volvo/Scania Coach Model
const BusModel = () => {
  const busRef = useRef();
  const frontLeftWheel = useRef();
  const frontRightWheel = useRef();
  const rearLeftWheel = useRef();
  const rearRightWheel = useRef();

  useFrame((state, delta) => {
    if (busRef.current) {
      // Aggressive low-profile travel oscillation
      busRef.current.position.y = Math.sin(state.clock.elapsedTime * 12) * 0.015 + 0.45;
    }
    // Faster wheel rotation
    const rotationSpeed = delta * 20;
    if (frontLeftWheel.current) frontLeftWheel.current.rotation.x += rotationSpeed;
    if (frontRightWheel.current) frontRightWheel.current.rotation.x += rotationSpeed;
    if (rearLeftWheel.current) rearLeftWheel.current.rotation.x += rotationSpeed;
    if (rearRightWheel.current) rearRightWheel.current.rotation.x += rotationSpeed;
  });

  return (
    <group ref={busRef} position={[0, 0.5, 0]}>
      {/* Main Bus Chassis - Aerodynamic Carbon Fiber Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.2, 1.7, 7.2]} />
        <meshStandardMaterial
          color="#050505" // Carbon Black
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Aerodynamic Roof Curve */}
      <mesh position={[0, 1.95, 0.2]}>
        <boxGeometry args={[2.16, 0.2, 6.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Windshield & Windows Tinted Glass (Cyan-Tinted Cyber Glass) */}
      <mesh position={[0, 1.25, 3.61]}>
        <planeGeometry args={[2.0, 1.1]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.6}
          opacity={0.85}
          transparent
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Side Windows Tinted Glass */}
      <mesh position={[1.11, 1.3, -0.2]}>
        <boxGeometry args={[0.02, 0.85, 6.4]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          transmission={0.7}
          opacity={0.75}
          transparent
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-1.11, 1.3, -0.2]}>
        <boxGeometry args={[0.02, 0.85, 6.4]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          transmission={0.7}
          opacity={0.75}
          transparent
          roughness={0.1}
        />
      </mesh>

      {/* Front Glowing LED Headlights */}
      <mesh position={[0.8, 0.6, 3.62]}>
        <boxGeometry args={[0.35, 0.15, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.8, 0.6, 3.62]}>
        <boxGeometry args={[0.35, 0.15, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Projector Light Beams onto Road */}
      <spotLight
        position={[0.8, 0.6, 3.7]}
        target-position={[0.8, 0, 10]}
        intensity={8}
        angle={0.6}
        penumbra={0.5}
        color="#bae6fd"
      />
      <spotLight
        position={[-0.8, 0.6, 3.7]}
        target-position={[-0.8, 0, 10]}
        intensity={8}
        angle={0.6}
        penumbra={0.5}
        color="#bae6fd"
      />

      {/* Rear Crimson Tail Lights */}
      <mesh position={[0.8, 0.8, -3.61]}>
        <boxGeometry args={[0.35, 0.15, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.8, 0.8, -3.61]}>
        <boxGeometry args={[0.35, 0.15, 0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Racing Red Glowing Branding Panel on Side */}
      <mesh position={[1.12, 1.8, 1.2]}>
        <boxGeometry args={[0.01, 0.25, 2.2]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-1.12, 1.8, 1.2]}>
        <boxGeometry args={[0.01, 0.25, 2.2]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Aerodynamic Carbon Wing/Spoiler */}
      <mesh position={[0, 2.2, -3.4]}>
        <boxGeometry args={[2.0, 0.05, 0.8]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {/* Front Wheels */}
      <group position={[1.15, 0.4, 2.2]} ref={frontRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-1.15, 0.4, 2.2]} ref={frontLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.02, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Multi-Axle Wheels */}
      <group position={[1.15, 0.4, -1.8]} ref={rearRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-1.15, 0.4, -1.8]} ref={rearLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.02, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Animated Cyber Highway with Moving Lane Stripes
const Highway = () => {
  const roadLinesRef = useRef();

  useFrame((state, delta) => {
    if (roadLinesRef.current) {
      // High-speed racing movement
      roadLinesRef.current.position.z = (roadLinesRef.current.position.z - delta * 30) % 4;
    }
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* Asphalt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 80]} />
        <meshStandardMaterial color="#0a0f1d" roughness={0.9} />
      </mesh>

      {/* Racing Red Edge Rails */}
      <mesh position={[5.5, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 80]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-5.5, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 80]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Moving Center Lane Stripes */}
      <group ref={roadLinesRef}>
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, 0.02, i * 4 - 36]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.25, 2.2]} />
            <meshBasicMaterial color="#fbbf24" opacity={0.8} transparent />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default function BusHeroCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '440px', position: 'relative' }}>
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[5.5, 3.2, 7.5]} fov={42} />
        
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 4, 3]} intensity={2.5} color="#ef4444" />
        <pointLight position={[6, 4, -3]} intensity={2.0} color="#06b6d4" />

        <Stars radius={60} depth={30} count={1200} factor={3} saturation={0} fade speed={3} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.1}>
          <BusModel />
        </Float>

        <Highway />
      </Canvas>
    </div>
  );
}
