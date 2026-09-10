import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import { Ticket, Download, Search, XCircle, User, Calendar, CheckCircle } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getAll();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id, refNum) => {
    if (!window.confirm(`Issue administrative cancellation for booking #${refNum}? Full refund will be marked.`)) return;

    try {
      const res = await bookingAPI.cancel(id);
      if (res.data.success) {
        setBookings(bookings.map((b) => (b.id === id ? { ...b, bookingStatus: 'CANCELLED', paymentStatus: 'REFUNDED' } : b)));
        alert('Booking cancelled and marked for refund.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling booking');
    }
  };

  const exportCSV = () => {
    const headers = 'Booking Reference,Customer,Bus Number,Route,Date,Seats,Amount,Status\n';
    const rows = bookings.map((b) =>
      `"${b.bookingNumber}","${b.userEmail}","${b.busNumber}","${b.sourceCity} -> ${b.destinationCity}","${b.travelDate}","${b.seatNumbers?.join(' ')}","${b.totalAmount}","${b.bookingStatus}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Route3D_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredBookings = bookings.filter((b) =>
    (b.bookingNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (b.sourceCity?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (b.destinationCity?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (b.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#fff' }}>Booking Master Registry</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Comprehensive passenger manifest and transaction audit logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export CSV Audit
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search by Reference, City, or Passenger Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-input"
        />
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Booking Number</th>
              <th style={{ padding: '14px 16px' }}>Passenger Email</th>
              <th style={{ padding: '14px 16px' }}>Corridor Route</th>
              <th style={{ padding: '14px 16px' }}>Vehicle</th>
              <th style={{ padding: '14px 16px' }}>Seats</th>
              <th style={{ padding: '14px 16px' }}>Total Fare</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading booking registry...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No matching bookings found.
                </td>
              </tr>
            ) : filteredBookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {b.bookingNumber}
                </td>
                <td style={{ padding: '16px', color: '#fff' }}>{b.userEmail}</td>
                <td style={{ padding: '16px', color: '#cbd5e1' }}>
                  {b.sourceCity} → {b.destinationCity} ({b.travelDate})
                </td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>{b.busNumber}</td>
                <td style={{ padding: '16px', color: '#06b6d4', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {b.seatNumbers?.join(', ')}
                </td>
                <td style={{ padding: '16px', fontWeight: 800, color: '#10b981' }}>
                  ₹{b.totalAmount?.toFixed(2)}
                </td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-active' : 'badge-cancelled'}`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id, b.bookingNumber)}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      title="Issue Cancellation & Refund"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
