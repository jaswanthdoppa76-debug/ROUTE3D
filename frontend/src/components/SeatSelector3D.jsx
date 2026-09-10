import React from 'react';
import { motion } from 'framer-motion';
import { Armchair, ShieldCheck, AlertCircle, Ban } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SeatSelector3D({
  seats,
  selectedSeats,
  onSeatToggle,
  baseFare,
  maxSeats = 6,
}) {
  const { t } = useLanguage();
  const totalAmount = selectedSeats.length * (baseFare || 0);

  const safeSeats = Array.isArray(seats) && seats.length > 0 ? seats : [];

  // Group seats into rows
  const seatRows = {};
  safeSeats.forEach((seat) => {
    if (!seat) return;
    const seatNumStr = String(seat.seatNumber || '');
    const rowKey = seatNumStr ? seatNumStr.charAt(0).toUpperCase() : 'A';
    if (!seatRows[rowKey]) {
      seatRows[rowKey] = [];
    }
    seatRows[rowKey].push(seat);
  });

  // Sort seats in each row by column
  Object.keys(seatRows).forEach((row) => {
    seatRows[row].sort((a, b) => {
      const colA = a.colIndex ?? a.colNum ?? parseInt(String(a.seatNumber || '').replace(/\D/g, '') || '1', 10);
      const colB = b.colIndex ?? b.colNum ?? parseInt(String(b.seatNumber || '').replace(/\D/g, '') || '1', 10);
      return colA - colB;
    });
  });

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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(59, 130, 246, 0.4)' }} />
          <span>{t('available')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))', boxShadow: 'var(--shadow-glow-cyan)' }} />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{t('selected')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)' }} />
          <span style={{ color: '#64748b' }}>{t('booked')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
          <span style={{ color: '#f87171' }}>Blocked</span>
        </div>
      </div>

      {/* Realistic 3D Bus Cabin Frame */}
      <div className="seat-bus-container">
        {/* Windshield & Driver Cabin */}
        <div className="bus-windshield">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#38bdf8" />
            <span>Cabin Entry</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>DRIVER</span>
            <span style={{ fontSize: '18px' }}>🚍</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.keys(seatRows).map((rowLetter) => {
            const rowSeats = seatRows[rowLetter];
            return (
              <div
                key={rowLetter}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Left Pair (Columns 1 & 2) */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {rowSeats.slice(0, 2).map((seat) => renderSeat(seat))}
                </div>

                {/* Central Aisle Gap */}
                <div
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#475569',
                    fontFamily: 'var(--font-mono)',
                    userSelect: 'none',
                  }}
                >
                  {rowLetter}
                </div>

                {/* Right Pair (Columns 3 & 4) */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {rowSeats.slice(2).map((seat) => renderSeat(seat))}
                </div>
              </div>
            );
          })}
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
            maxWidth: '520px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selected Seats ({selectedSeats.length}/{maxSeats})
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {selectedSeats.map((s) => s.seatNumber).join(', ')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Fare</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  function renderSeat(seat) {
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    const isBooked = seat.status === 'BOOKED';
    const isBlocked = seat.status === 'BLOCKED';

    let stateClass = 'available';
    if (isSelected) stateClass = 'selected';
    else if (isBooked) stateClass = 'booked';
    else if (isBlocked) stateClass = 'blocked';

    return (
      <motion.button
        key={seat.seatId}
        type="button"
        whileHover={!isBooked && !isBlocked ? { scale: 1.1 } : {}}
        whileTap={!isBooked && !isBlocked ? { scale: 0.95 } : {}}
        disabled={isBooked || isBlocked}
        onClick={() => onSeatToggle(seat)}
        className={`seat-item ${stateClass}`}
        style={{ width: '52px' }}
      >
        <Armchair size={15} style={{ marginBottom: '2px' }} />
        <span>{seat.seatNumber}</span>
      </motion.button>
    );
  }
}
