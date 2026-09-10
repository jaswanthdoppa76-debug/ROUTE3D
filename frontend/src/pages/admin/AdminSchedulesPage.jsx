import React, { useState, useEffect } from 'react';
import { scheduleAPI, busAPI, routeAPI } from '../../services/api';
import { Calendar, Plus, Trash2, Clock, MapPin, Bus } from 'lucide-react';

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    travelDate: new Date().toISOString().split('T')[0],
    departureTime: '08:00',
    arrivalTime: '13:00',
    baseFare: 650.0,
    status: 'SCHEDULED',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedRes, busRes, routeRes] = await Promise.all([
        scheduleAPI.getAll(),
        busAPI.getAll(),
        routeAPI.getAll(),
      ]);

      if (schedRes.data.success) setSchedules(schedRes.data.data);
      if (busRes.data.success) {
        setBuses(busRes.data.data);
        if (busRes.data.data.length > 0) setFormData((prev) => ({ ...prev, busId: busRes.data.data[0].id }));
      }
      if (routeRes.data.success) {
        setRoutes(routeRes.data.data);
        if (routeRes.data.data.length > 0) setFormData((prev) => ({ ...prev, routeId: routeRes.data.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await scheduleAPI.create({
        ...formData,
        departureTime: formData.departureTime.length === 5 ? formData.departureTime + ':00' : formData.departureTime,
        arrivalTime: formData.arrivalTime.length === 5 ? formData.arrivalTime + ':00' : formData.arrivalTime,
      });

      if (res.data.success) {
        alert('Schedule successfully published!');
        setShowModal(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dispatch schedule?')) return;
    try {
      await scheduleAPI.delete(id);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting schedule');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#fff' }}>Trip Dispatcher & Scheduling</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Assign buses to verified AP-Telangana corridors with live fare tariffs.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Dispatch Service
        </button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Travel Date</th>
              <th style={{ padding: '14px 16px' }}>Bus & Operator</th>
              <th style={{ padding: '14px 16px' }}>Corridor Route</th>
              <th style={{ padding: '14px 16px' }}>Departure - Arrival</th>
              <th style={{ padding: '14px 16px' }}>Fare</th>
              <th style={{ padding: '14px 16px' }}>Available Seats</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading schedules...
                </td>
              </tr>
            ) : schedules.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '16px', fontWeight: 600, color: '#38bdf8' }}>{s.travelDate}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{s.busName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{s.busNumber} • {s.operatorName}</div>
                </td>
                <td style={{ padding: '16px', color: '#cbd5e1' }}>
                  {s.sourceCity} → {s.destinationCity}
                </td>
                <td style={{ padding: '16px', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  {s.departureTime?.slice(0, 5)} - {s.arrivalTime?.slice(0, 5)}
                </td>
                <td style={{ padding: '16px', fontWeight: 700, color: '#10b981' }}>
                  ₹{s.baseFare}
                </td>
                <td style={{ padding: '16px', color: s.availableSeats > 5 ? '#38bdf8' : '#f87171' }}>
                  {s.availableSeats} / {s.totalSeats}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="btn-danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '540px', width: '100%', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '18px' }}>Dispatch Bus Service</h2>
            <form onSubmit={handleCreateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>SELECT FLEET VEHICLE *</label>
                <select
                  value={formData.busId}
                  onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                  className="glass-input"
                  required
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id} style={{ background: '#0f172a' }}>
                      {b.busNumber} - {b.busName} ({b.operatorCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>ASSIGN CORRIDOR ROUTE *</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="glass-input"
                  required
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id} style={{ background: '#0f172a' }}>
                      {r.sourceCity} ({r.sourceState}) → {r.destinationCity} ({r.destinationState})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>TRAVEL DATE *</label>
                  <input
                    type="date"
                    required
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>DEPARTURE *</label>
                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>ARRIVAL *</label>
                  <input
                    type="time"
                    required
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>BASE TICKET FARE (₹) *</label>
                <input
                  type="number"
                  min="100"
                  step="10"
                  required
                  value={formData.baseFare}
                  onChange={(e) => setFormData({ ...formData, baseFare: Number(e.target.value) })}
                  className="glass-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
