import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Text, SpotLight, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// --- 3D DRIVER CABIN ---
const DriverCabin = () => {
  return (
    <group position={[0, 0.5, -9.5]}>
      {/* Dashboard */}
      <mesh position={[0, 1.5, -1]}>
        <boxGeometry args={[4.5, 1, 1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Steering Wheel */}
      <group position={[-1.2, 2.2, -0.4]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.4, 0.06, 16, 32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Driver Seat */}
      <mesh position={[-1.2, 0.8, 0.5]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[-1.2, 2.0, 0.9]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.8, 1.6, 0.2]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Windshield Glass */}
      <mesh position={[0, 3.5, -1.2]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[5, 4]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={0.3} transparent roughness={0.05} metalness={0.1} />
      </mesh>
      
      {/* Driver Display / Glowing HUD */}
      <mesh position={[-1.2, 2.1, -0.9]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial color="#0ea5e9" />
      </mesh>
    </group>
  );
};

// --- REALISTIC BUS SHELL ---
const BusShell = () => {
  return (
    <group position={[0, 0, 4]}>
      {/* Roof (Standard height) */}
      <mesh position={[0, 4.5, -4]} receiveShadow>
        <boxGeometry args={[5.2, 0.2, 28]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Left Wall (Lower) */}
      <mesh position={[-2.5, 1.0, -4]} receiveShadow>
        <boxGeometry args={[0.2, 2, 28]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.5} />
      </mesh>
      
      {/* Right Wall (Lower) */}
      <mesh position={[2.5, 1.0, -4]} receiveShadow>
        <boxGeometry args={[0.2, 2, 28]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Left Panoramic Windows */}
      <mesh position={[-2.5, 3.25, -4]}>
        <boxGeometry args={[0.1, 2.5, 26]} />
        <meshPhysicalMaterial color="#000000" transmission={0.9} opacity={0.6} transparent roughness={0} metalness={0.5} />
      </mesh>

      {/* Right Panoramic Windows */}
      <mesh position={[2.5, 3.25, -4]}>
        <boxGeometry args={[0.1, 2.5, 26]} />
        <meshPhysicalMaterial color="#000000" transmission={0.9} opacity={0.6} transparent roughness={0} metalness={0.5} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.25, 9.8]} receiveShadow>
        <boxGeometry args={[5, 4.5, 0.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      
      {/* LED Strip Lights along the ceiling */}
      <mesh position={[-1.5, 4.3, -4]}>
        <boxGeometry args={[0.1, 0.05, 26]} />
        <meshBasicMaterial color="#bae6fd" />
      </mesh>
      <mesh position={[1.5, 4.3, -4]}>
        <boxGeometry args={[0.1, 0.05, 26]} />
        <meshBasicMaterial color="#bae6fd" />
      </mesh>
    </group>
  );
}

// --- STANDARD SEAT MODEL ---
const SeatModel = ({ seat, position, isSelected, onToggle }) => {
  const isBooked = seat.status === 'BOOKED';
  const isBlocked = seat.status === 'BLOCKED';
  const isAvailable = !isBooked && !isBlocked;

  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Determine Colors
  let color = '#334155'; // Available (Slate 700)
  let emissive = '#000000';
  
  if (isSelected) {
    color = '#06b6d4'; // Cyan
    emissive = '#0284c7'; // Glow
  } else if (isBooked) {
    color = '#0f172a'; // Dark Slate
  } else if (isBlocked) {
    color = '#450a0a'; // Dark Red
  } else if (hovered && isAvailable) {
    color = '#3b82f6'; // Blue Hover
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + 0.15, 0.1);
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
      }
    }
  });

  return (
    <group
      position={position}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (isAvailable) onToggle(seat);
      }}
    >
      {/* Seat Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.85, 0.6, 0.85]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={isSelected ? 0.6 : 0} roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Seat Back */}
      <mesh position={[0, 1.2, 0.35]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 1.4, 0.2]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={isSelected ? 0.6 : 0} roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Headrest */}
      <mesh position={[0, 1.95, 0.45]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.2]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={isSelected ? 0.6 : 0} roughness={0.8} />
      </mesh>

      {/* Armrests */}
      <mesh position={[-0.45, 0.8, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.45, 0.8, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Seat Number Text */}
      <Text
        position={[0, 1.4, 0.26]}
        rotation={[-0.15, 0, 0]}
        fontSize={0.22}
        color={isAvailable ? (isSelected ? "#ffffff" : "#cbd5e1") : "#475569"}
        anchorX="center"
        anchorY="middle"
      >
        {seat.seatNumber}
      </Text>
    </group>
  );
};

// --- BUS INTERIOR SCENE ---
const BusInterior = ({ seats, selectedSeats, onToggle }) => {
  const safeSeats = Array.isArray(seats) ? seats : [];
  
  // Arrange seats logically
  // Standard 4-column layout (2x2) with prominent center aisle
  const ROW_SPACING = 1.6;
  const COL_SPACING = 1.0;
  const AISLE_WIDTH = 1.2;

  return (
    <group position={[0,-1.5,0]}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 30]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      
      {/* Carpet / Aisle Runner */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 28]} />
        <meshStandardMaterial color="#0f172a" roughness={1.0} />
      </mesh>

      <BusShell />
      <DriverCabin />

      {/* Render Seats */}
      <group position={[0, 0, -6]}>
        {safeSeats.map((seat) => {
          const row = seat.rowIndex || seat.rowNum || 1;
          const col = seat.colIndex || seat.colNum || 1;

          // Calculate X position (Columns 1,2 on left, 3,4 on right)
          let xPos = 0;
          if (col === 1) xPos = -COL_SPACING - AISLE_WIDTH / 2;
          else if (col === 2) xPos = -AISLE_WIDTH / 2;
          else if (col === 3) xPos = AISLE_WIDTH / 2;
          else if (col === 4) xPos = COL_SPACING + AISLE_WIDTH / 2;

          // Calculate Z position (Rows extending back)
          const zPos = row * ROW_SPACING;

          const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);

          return (
            <SeatModel
              key={seat.seatId}
              seat={seat}
              position={[xPos, 0, zPos]}
              isSelected={isSelected}
              onToggle={onToggle}
            />
          );
        })}
      </group>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={25} blur={2.5} far={10} />
    </group>
  );
};

export default function SeatSelector3D({
  seats,
  selectedSeats,
  onSeatToggle,
  baseFare,
  maxSeats = 6,
}) {
  const { t } = useLanguage();
  const totalAmount = selectedSeats.length * (baseFare || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Legend */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          gap: '20px',
          padding: '12px 24px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '800px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#334155', border: '1px solid rgba(59, 130, 246, 0.4)' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', boxShadow: '0 0 10px rgba(6,182,212,0.5)' }} />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.05)' }} />
          <span style={{ color: '#64748b' }}>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#450a0a', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
          <span style={{ color: '#f87171' }}>Blocked</span>
        </div>
      </div>

      {/* True Realistic Interactive 3D Canvas */}
      <div 
        style={{ 
          width: '100%', 
          height: '650px', 
          background: '#020617', // Dark outdoor environment
          borderRadius: '24px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab'
        }}
      >
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={55} />
          
          {/* Realistic Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 2]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
          
          {/* Internal Cabin Lights */}
          <SpotLight position={[0, 4, -4]} angle={1.2} penumbra={1} intensity={1.5} color="#e0f2fe" />
          <SpotLight position={[0, 4, 4]} angle={1.2} penumbra={1} intensity={1.5} color="#e0f2fe" />

          {/* Interactive Controls */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            maxDistance={22}
            minDistance={2}
            maxPolarAngle={Math.PI / 2 + 0.1} // Prevent looking completely under the bus
            target={[0, 0, 0]}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          
          <BusInterior seats={seats} selectedSeats={selectedSeats} onToggle={onSeatToggle} />
          <Environment preset="night" />
        </Canvas>
        
        {/* Overlay Instruction */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '13px', fontWeight: 600, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👆</span> Drag to look around the realistic cabin
        </div>
      </div>

      {/* Selection Summary Floating Bar */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-glow"
          style={{
            marginTop: '28px',
            padding: '18px 28px',
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selected Seats ({selectedSeats.length}/{maxSeats})
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {selectedSeats.map((s) => s.seatNumber).join(', ')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Fare</div>
            <div className="pushpa-title" style={{ fontSize: '28px', color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
