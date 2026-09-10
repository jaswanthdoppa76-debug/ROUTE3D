import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Bus, Calendar, Clock, ArrowRight, AlertCircle, XCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyBookingsPage({ onOpenTracker }) {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id, bookingNumber) => {
    const confirmed = window.confirm(`Are you sure you want to cancel booking #${bookingNumber}? The full ticket fare will be refunded.`);
    if (!confirmed) return;

    setCancellingId(id);
    try {
      const res = await bookingAPI.cancel(id);
      if (res.data.success) {
        // Update local status
        setBookings(bookings.map((b) => (b.id === id ? { ...b, bookingStatus: 'CANCELLED', paymentStatus: 'REFUNDED' } : b)));
        alert('Booking has been cancelled and refunded successfully.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <Ticket size={48} color="#06b6d4" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Sign in to View Your Bookings</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
            Access all your past and upcoming AP & Telangana RTC journeys and download PDF tickets.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#fff' }}>My Bookings History</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Manage your AP & Telangana bus reservations and travel boarding passes.
          </p>
        </div>
        <Link to="/" className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
          Book New Bus
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#94a3b8' }}>Loading your booking roster...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Ticket size={48} color="#64748b" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Bookings Yet</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            You haven't reserved any tickets yet. Explore super luxury RTC buses today!
          </p>
          <Link to="/" className="btn-primary">Search Buses</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
              style={{
                padding: '24px',
                borderLeft: b.bookingStatus === 'CONFIRMED' ? '4px solid #10b981' : '4px solid #f43f5e',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge badge-tgsrtc">{b.operatorName}</span>
                    <span style={{ fontSize: '13px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      #{b.bookingNumber}
                    </span>
                    <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-active' : 'badge-cancelled'}`}>
                      {b.bookingStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', color: '#fff', marginTop: '6px' }}>
                    {b.sourceCity} → {b.destinationCity}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                    {b.busName} ({b.busNumber})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Fare</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>
                    ₹{b.totalAmount?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {b.seatNumbers?.length} Seats: {b.seatNumbers?.join(', ')}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#38bdf8" /> {b.travelDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#06b6d4" /> {b.departureTime?.slice(0, 5)} - {b.arrivalTime?.slice(0, 5)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() =>
                      onOpenTracker &&
                      onOpenTracker({
                        busNumber: b.busNumber || 'TS09Z7788',
                        busName: b.busName || 'TGSRTC Express',
                        operator: b.operatorName || 'RTC Fleet',
                        route: `${b.sourceCity || 'Hyderabad'} ➔ ${b.destinationCity || 'Vijayawada'}`,
                        currentLocation: 'NH65 Corridor (Live GPS Active)',
                        nextStop: 'Approaching Terminal',
                        etaNextStop: '15 mins',
                        destinationETA: 'On Schedule',
                        status: b.bookingStatus === 'CONFIRMED' ? 'On Time' : 'Inactive',
                      })
                    }
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px', gap: '6px', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.3)' }}
                  >
                    <Bus size={14} color="var(--accent-cyan)" /> Track Live
                  </button>

                  <Link
                    to={`/booking-confirmation/${b.id}`}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    View Ticket / PDF
                  </Link>

                  <Link
                    to={`/booking-confirmation/${b.id}?print=true`}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px', gap: '6px', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)' }}
                  >
                    Print
                  </Link>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(b.id, b.bookingNumber)}
                      disabled={cancellingId === b.id}
                      className="btn-danger"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      {cancellingId === b.id ? 'Processing...' : 'Cancel Ticket'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
