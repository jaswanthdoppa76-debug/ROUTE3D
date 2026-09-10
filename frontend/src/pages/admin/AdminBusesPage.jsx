import React, { useState, useEffect } from 'react';
import { busAPI } from '../../services/api';
import { Bus, Plus, Trash2, Edit2, CheckCircle, AlertTriangle, ShieldCheck, User, Phone, Award, X } from 'lucide-react';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    operatorId: 1, // 1 = TGSRTC, 2 = APSRTC
    busNumber: '',
    busName: '',
    busType: 'SUPER_LUXURY',
    totalSeats: 36,
    layoutType: 'SEATER_2X2',
    status: 'ACTIVE',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    driverExperience: '10 Years',
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await busAPI.getAll();
      if (res.data.success) {
        setBuses(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        operatorCode: formData.operatorId === 1 ? 'TGSRTC' : 'APSRTC',
        driverName: formData.driverName || 'Designated RTC Pilot',
        driverPhone: formData.driverPhone || '+91 98480 11223',
        driverLicense: formData.driverLicense || `DL-AP09-${Math.floor(1000 + Math.random() * 9000)}`,
        driverExperience: formData.driverExperience || '10 Years',
      };
      const res = await busAPI.create(payload);
      if (res.data.success) {
        alert('Bus and Assigned Driver successfully added with physical seat grid generated!');
        setShowModal(false);
        setFormData({
          operatorId: 1,
          busNumber: '',
          busName: '',
          busType: 'SUPER_LUXURY',
          totalSeats: 36,
          layoutType: 'SEATER_2X2',
          status: 'ACTIVE',
          driverName: '',
          driverPhone: '',
          driverLicense: '',
          driverExperience: '10 Years',
        });
        fetchBuses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating bus');
    }
  };

  const handleDelete = async (id, busNum) => {
    if (!window.confirm(`Delete bus ${busNum}?`)) return;
    try {
      await busAPI.delete(id);
      setBuses(buses.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting bus');
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-tgsrtc">FLEET & PILOT MANAGEMENT</span>
            <span className="badge badge-apsrtc" style={{ fontSize: '11px' }}>Admin: jaswanthdoppa76@gmail.com</span>
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 800 }}>RTC Fleet & Driver Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Register new coaches, assign certified duty drivers/pilots, and manage bus capacities.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Bus & Driver
        </button>
      </div>

      {/* Buses Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Bus Number</th>
              <th style={{ padding: '14px 16px' }}>Service Name</th>
              <th style={{ padding: '14px 16px' }}>Assigned Driver / Pilot</th>
              <th style={{ padding: '14px 16px' }}>Operator</th>
              <th style={{ padding: '14px 16px' }}>Category</th>
              <th style={{ padding: '14px 16px' }}>Seats & Layout</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading fleet database...
                </td>
              </tr>
            ) : buses.map((bus) => (
              <tr key={bus.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '16px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {bus.busNumber}
                </td>
                <td style={{ padding: '16px', fontWeight: 600, color: '#fff' }}>{bus.busName}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={14} color="#38bdf8" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{bus.driverName || 'S. Narsimha Reddy'}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {bus.driverPhone || '+91 98480 11223'} • {bus.driverLicense || 'DL-TG09-VERIFIED'}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge ${bus.operatorCode?.includes('TGSRTC') ? 'badge-tgsrtc' : 'badge-apsrtc'}`}>
                    {bus.operatorCode}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#cbd5e1' }}>{bus.busType?.replace(/_/g, ' ')}</td>
                <td style={{ padding: '16px', color: '#94a3b8' }}>
                  {bus.totalSeats} Seats ({bus.layoutType?.replace(/_/g, ' ')})
                </td>
                <td style={{ padding: '16px' }}>
                  <span className="badge badge-active">{bus.status}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(bus.id, bus.busNumber)}
                    className="btn-danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    title="Delete Bus"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Bus Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '20px', color: '#fff' }}>Add Official RTC Bus & Assign Driver</h2>
              <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateBus} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>OPERATOR</label>
                  <select
                    value={formData.operatorId}
                    onChange={(e) => setFormData({ ...formData, operatorId: Number(e.target.value) })}
                    className="glass-input"
                  >
                    <option value={1} style={{ background: '#0f172a' }}>TGSRTC (Telangana State RTC)</option>
                    <option value={2} style={{ background: '#0f172a' }}>APSRTC (Andhra Pradesh State RTC)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>VEHICLE REGISTRATION NUMBER *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TS09Z9988 or AP29Z7766"
                    value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>SERVICE / FLEET NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TGSRTC Rajdhani Super Express"
                  value={formData.busName}
                  onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                  className="glass-input"
                />
              </div>

              {/* Driver Information Fields */}
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '14px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> ASSIGNED PILOT / DRIVER DETAILS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Driver Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Narsimha Reddy"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="glass-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Driver Contact Mobile *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98480 11223"
                      value={formData.driverPhone}
                      onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                      className="glass-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Heavy Vehicle Commercial License *</label>
                    <input
                      type="text"
                      required
                      placeholder="DL-TG09-2017-004819"
                      value={formData.driverLicense}
                      onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                      className="glass-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Driving Experience</label>
                    <input
                      type="text"
                      placeholder="14 Years (Senior Pilot)"
                      value={formData.driverExperience}
                      onChange={(e) => setFormData({ ...formData, driverExperience: e.target.value })}
                      className="glass-input"
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>BUS TYPE</label>
                  <select
                    value={formData.busType}
                    onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                    className="glass-input"
                  >
                    <option value="SUPER_LUXURY" style={{ background: '#0f172a' }}>Super Luxury (2x2)</option>
                    <option value="GARUDA_PLUS" style={{ background: '#0f172a' }}>Garuda Plus AC (Multi-Axle)</option>
                    <option value="AMARAVATI" style={{ background: '#0f172a' }}>Amaravati Scania AC</option>
                    <option value="LAHARI_SLEEPER" style={{ background: '#0f172a' }}>Lahari Sleeper (2x1)</option>
                    <option value="VENNELA" style={{ background: '#0f172a' }}>Vennela Sleeper (2x1)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>TOTAL SEATS CAPACITY</label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                    className="glass-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Bus, Driver & Generate Seats Layout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
