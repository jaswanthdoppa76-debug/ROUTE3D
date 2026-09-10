import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { scheduleAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Bus, Clock, Calendar, MapPin, Filter, ArrowRight, ShieldCheck, Wifi, Droplet, BatteryCharging, Snowflake, Armchair, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchResultsPage({ onOpenTracker }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryParams = new URLSearchParams(location.search);

  const fromCity = queryParams.get('from') || 'Hyderabad';
  const toCity = queryParams.get('to') || 'Vijayawada';
  const travelDate = queryParams.get('date') || new Date().toISOString().split('T')[0];
  const passengerCount = Number(queryParams.get('passengers') || 1);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedOperator, setSelectedOperator] = useState('ALL');
  const [selectedBusType, setSelectedBusType] = useState('ALL');
  const [maxFare, setMaxFare] = useState(2000);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('ALL');

  useEffect(() => {
    fetchSchedules();
  }, [fromCity, toCity, travelDate]);

  const fetchSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await scheduleAPI.search(fromCity, toCity, travelDate);
      if (res.data.success) {
        setSchedules(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch buses. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredSchedules = schedules.filter((s) => {
    if (selectedOperator !== 'ALL' && !s.operatorCode?.includes(selectedOperator)) {
      return false;
    }
    if (selectedBusType !== 'ALL' && s.busType !== selectedBusType) {
      return false;
    }
    if (s.baseFare > maxFare) {
      return false;
    }
    if (selectedTimeSlot !== 'ALL') {
      const hour = parseInt(s.departureTime.split(':')[0], 10);
      if (selectedTimeSlot === 'MORNING' && (hour < 6 || hour >= 12)) return false;
      if (selectedTimeSlot === 'AFTERNOON' && (hour < 12 || hour >= 18)) return false;
      if (selectedTimeSlot === 'EVENING' && (hour < 18 || hour >= 23)) return false;
      if (selectedTimeSlot === 'NIGHT' && (hour < 23 && hour >= 6)) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      {/* Route Header Banner */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '20px 28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: 800 }}>
            <span>{fromCity}</span>
            <ArrowRight size={22} color="var(--accent-cyan)" />
            <span>{toCity}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {travelDate}
            </span>
            <span>•</span>
            <span>{filteredSchedules.length} {t('verifiedServices')}</span>
          </div>
        </div>

        <Link
          to="/"
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          Modify Search
        </Link>
      </div>

      {/* Grid: Left Filters + Right Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Filter Sidebar */}
        <aside className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
            <Filter size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '16px' }}>{t('filters')}</h3>
          </div>

          {/* Operator Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              {t('operator')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['ALL', 'TGSRTC', 'APSRTC'].map((op) => (
                <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="operator"
                    checked={selectedOperator === op}
                    onChange={() => setSelectedOperator(op)}
                  />
                  <span>{op === 'ALL' ? t('allOperators') : op}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bus Type Filter */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              {t('busType')}
            </label>
            <select
              value={selectedBusType}
              onChange={(e) => setSelectedBusType(e.target.value)}
              className="glass-input"
              style={{ fontSize: '13px', padding: '8px 12px' }}
            >
              <option value="ALL">{t('allTypes')}</option>
              <option value="SUPER_LUXURY">{t('seater')}</option>
              <option value="GARUDA_PLUS">{t('multiAxle')}</option>
              <option value="AMARAVATI">Amaravati Scania AC</option>
              <option value="LAHARI_SLEEPER">{t('sleeper')}</option>
              <option value="VENNELA">Vennela AC Sleeper</option>
            </select>
          </div>

          {/* Departure Time */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              {t('timeSlot')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'ALL', label: t('allDay') },
                { id: 'MORNING', label: t('morning') },
                { id: 'AFTERNOON', label: t('afternoon') },
                { id: 'EVENING', label: t('evening') },
              ].map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    background: selectedTimeSlot === slot.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedTimeSlot === slot.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                    color: selectedTimeSlot === slot.id ? 'var(--accent-cyan)' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Fare Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>{t('maxFare')}</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>₹{maxFare}</span>
            </div>
            <input
              type="range"
              min="400"
              max="2000"
              step="50"
              value={maxFare}
              onChange={(e) => setMaxFare(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>
        </aside>

        {/* Bus Results List */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '36px', animation: 'bounce 1s infinite' }}>🚍</div>
              <p style={{ color: '#94a3b8', marginTop: '14px' }}>Loading verified RTC bus schedules...</p>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#f87171' }}>
              {error}
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px 30px', textAlign: 'center' }}>
              <Bus size={48} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{t('noBusesFound')}</h3>
              <p style={{ color: '#94a3b8', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                We could not find any buses matching your selected criteria between {fromCity} and {toCity} on {travelDate}.
              </p>
              <button onClick={() => { setSelectedOperator('ALL'); setSelectedBusType('ALL'); setMaxFare(2000); }} className="btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredSchedules.map((schedule) => {
                const availableCount = schedule.availableSeatsCount ?? schedule.availableSeats ?? 24;
                const durStr = schedule.durationFormatted || (schedule.durationMinutes ? `${Math.floor(schedule.durationMinutes / 60)}h ${schedule.durationMinutes % 60}m` : '5h 00m');
                return (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      transition: 'var(--transition-normal)',
                      border: '1px solid var(--border-glass)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      {/* Left Bus Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span className={`badge ${schedule.operatorCode?.includes('TGSRTC') ? 'badge-tgsrtc' : 'badge-apsrtc'}`}>
                            {schedule.operatorCode}
                          </span>
                          <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {schedule.busNumber}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                          {schedule.busName}
                        </h3>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                          {schedule.busType?.replace(/_/g, ' ')} • {schedule.layoutType?.replace(/_/g, ' ')}
                        </div>
                      </div>

                      {/* Departure, Duration, Arrival */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                            {schedule.departureTime?.slice(0, 5)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{schedule.sourceCity || fromCity}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {durStr}
                          </span>
                          <div style={{ width: '70px', height: '2px', background: 'linear-gradient(90deg, var(--primary-600), var(--accent-cyan))', margin: '4px 0' }} />
                          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>Verified Express</span>
                        </div>

                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                            {schedule.arrivalTime?.slice(0, 5)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{schedule.destinationCity || toCity}</div>
                        </div>
                      </div>

                      {/* Fare & Booking Button */}
                      <div style={{ textAlign: 'right', minWidth: '140px' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Starting from</div>
                        <div style={{ fontSize: '26px', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
                          ₹{schedule.baseFare}
                        </div>
                        <div style={{ fontSize: '12px', color: availableCount > 5 ? 'var(--accent-cyan)' : '#f87171', marginBottom: '10px' }}>
                          {availableCount} {t('seatsAvailable')}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button
                            onClick={() => navigate(`/seats/${schedule.id}`, { state: { schedule, passengerCount } })}
                            className="btn-primary"
                            style={{ padding: '9px 16px', fontSize: '13px', width: '100%' }}
                          >
                            {t('selectSeats')}
                          </button>
                          <button
                            onClick={() =>
                              onOpenTracker &&
                              onOpenTracker({
                                busNumber: schedule.busNumber,
                                busName: schedule.busName,
                                operator: schedule.operatorCode,
                                route: `${fromCity} ➔ ${toCity}`,
                                currentLocation: 'NH65 Corridor - Active Run',
                                nextStop: 'Highway Hub',
                                etaNextStop: '22 mins',
                                destinationETA: `${schedule.arrivalTime} Scheduled`,
                                status: 'On Time',
                              })
                            }
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '11px', gap: '4px', width: '100%' }}
                          >
                            <Navigation size={12} color="var(--accent-cyan)" /> {t('trackLive')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Amenities Bar */}
                    {schedule.amenities && schedule.amenities.length > 0 && (
                      <div
                        style={{
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Amenities:
                        </span>
                        {schedule.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '12px',
                              color: '#94a3b8',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-glass)',
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
