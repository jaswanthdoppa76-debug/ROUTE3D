import React, { useState, useEffect } from 'react';
import { routeAPI } from '../../services/api';
import { MapPin, Plus, Trash2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    sourceCity: '',
    sourceState: 'TELANGANA',
    destinationCity: '',
    destinationState: 'ANDHRA_PRADESH',
    distanceKm: 280,
    estimatedDurationMinutes: 300,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeAPI.getAll();
      if (res.data.success) {
        setRoutes(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();

    // Verify states are only TELANGANA or ANDHRA_PRADESH
    const allowed = ['TELANGANA', 'ANDHRA_PRADESH'];
    if (!allowed.includes(formData.sourceState) || !allowed.includes(formData.destinationState)) {
      alert('Only routes within or between TELANGANA and ANDHRA PRADESH are allowed.');
      return;
    }

    try {
      const res = await routeAPI.create(formData);
      if (res.data.success) {
        alert('Route registered successfully!');
        setShowModal(false);
        setFormData({
          sourceCity: '',
          sourceState: 'TELANGANA',
          destinationCity: '',
          destinationState: 'ANDHRA_PRADESH',
          distanceKm: 280,
          estimatedDurationMinutes: 300,
          status: 'ACTIVE',
        });
        fetchRoutes();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating route');
    }
  };

  const handleDelete = async (id, source, dest) => {
    if (!window.confirm(`Delete route ${source} → ${dest}?`)) return;
    try {
      await routeAPI.delete(id);
      setRoutes(routes.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting route');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', color: '#fff' }}>AP & Telangana Route Corridor Hub</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Regulate and maintain verified intercity corridors between Telangana & Andhra Pradesh.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Register Corridor
        </button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Origin (Source)</th>
              <th style={{ padding: '14px 16px' }}>Destination</th>
              <th style={{ padding: '14px 16px' }}>Corridor Type</th>
              <th style={{ padding: '14px 16px' }}>Distance</th>
              <th style={{ padding: '14px 16px' }}>Estimated Runtime</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading verified routes...
                </td>
              </tr>
            ) : routes.map((route) => {
              const isInterState = route.sourceState !== route.destinationState;
              return (
                <tr key={route.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#fff' }}>
                    {route.sourceCity} <span style={{ color: '#06b6d4', fontSize: '12px' }}>({route.sourceState})</span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#fff' }}>
                    {route.destinationCity} <span style={{ color: '#3b82f6', fontSize: '12px' }}>({route.destinationState})</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${isInterState ? 'badge-tgsrtc' : 'badge-apsrtc'}`}>
                      {isInterState ? 'Inter-State (TG ⇄ AP)' : 'Intra-State Corridor'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                    {route.distanceKm} km
                  </td>
                  <td style={{ padding: '16px', color: '#94a3b8' }}>
                    {Math.floor(route.estimatedDurationMinutes / 60)}h {route.estimatedDurationMinutes % 60}m
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className="badge badge-active">{route.status}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(route.id, route.sourceCity, route.destinationCity)}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Register Route Modal */}
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
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '18px' }}>Register AP & Telangana Route</h2>
            <form onSubmit={handleCreateRoute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>SOURCE CITY *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={formData.sourceCity}
                    onChange={(e) => setFormData({ ...formData, sourceCity: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>SOURCE STATE *</label>
                  <select
                    value={formData.sourceState}
                    onChange={(e) => setFormData({ ...formData, sourceState: e.target.value })}
                    className="glass-input"
                  >
                    <option value="TELANGANA" style={{ background: '#0f172a' }}>TELANGANA</option>
                    <option value="ANDHRA_PRADESH" style={{ background: '#0f172a' }}>ANDHRA PRADESH</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>DESTINATION CITY *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vijayawada"
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>DESTINATION STATE *</label>
                  <select
                    value={formData.destinationState}
                    onChange={(e) => setFormData({ ...formData, destinationState: e.target.value })}
                    className="glass-input"
                  >
                    <option value="ANDHRA_PRADESH" style={{ background: '#0f172a' }}>ANDHRA PRADESH</option>
                    <option value="TELANGANA" style={{ background: '#0f172a' }}>TELANGANA</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>DISTANCE (KM)</label>
                  <input
                    type="number"
                    min="10"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>DURATION (MINUTES)</label>
                  <input
                    type="number"
                    min="30"
                    value={formData.estimatedDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: Number(e.target.value) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
