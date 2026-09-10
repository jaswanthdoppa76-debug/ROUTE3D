import React, { useState, useEffect } from 'react';
import { challanAPI, busAPI } from '../../services/api';
import { 
  AlertTriangle, ShieldAlert, Plus, CheckCircle, Search, Filter, 
  DollarSign, FileText, Calendar, Scale, Trash2, Check, Bus, User, Phone, X 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminChallansPage() {
  const [challans, setChallans] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const [formData, setFormData] = useState({
    challanNumber: '',
    busNumber: 'TS09Z7788',
    busName: 'TGSRTC Rajdhani AC',
    operatorCode: 'TGSRTC',
    driverName: 'S. Narsimha Reddy',
    offense: '',
    jurisdiction: 'Highway Traffic Patrol Unit (NH65)',
    amount: 1500,
    status: 'PENDING',
    caseType: 'TRAFFIC_VIOLATION',
    courtHearingDate: 'N/A',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chRes, busRes] = await Promise.all([
        challanAPI.getAll(),
        busAPI.getAll(),
      ]);
      if (chRes.data.success) setChallans(chRes.data.data);
      if (busRes.data.success) setBuses(busRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSelect = (busNum) => {
    const selected = buses.find((b) => b.busNumber === busNum);
    if (selected) {
      setFormData({
        ...formData,
        busNumber: selected.busNumber,
        busName: selected.busName,
        operatorCode: selected.operatorCode || (selected.busNumber.startsWith('AP') ? 'APSRTC' : 'TGSRTC'),
        driverName: selected.driverName || 'Designated RTC Pilot',
      });
    }
  };

  const handleCreateChallan = async (e) => {
    e.preventDefault();
    if (!formData.offense.trim()) {
      alert('Please specify the traffic offense or legal case description.');
      return;
    }

    try {
      const res = await challanAPI.create(formData);
      if (res.data.success) {
        alert('E-Challan / Legal Case logged successfully!');
        setShowAddModal(false);
        setFormData({
          challanNumber: '',
          busNumber: 'TS09Z7788',
          busName: 'TGSRTC Rajdhani AC',
          operatorCode: 'TGSRTC',
          driverName: 'S. Narsimha Reddy',
          offense: '',
          jurisdiction: 'Highway Traffic Patrol Unit (NH65)',
          amount: 1500,
          status: 'PENDING',
          caseType: 'TRAFFIC_VIOLATION',
          courtHearingDate: 'N/A',
        });
        fetchData();
      }
    } catch (e) {
      alert('Error creating challan record.');
    }
  };

  const handlePayChallan = async (id, challanNo) => {
    if (!window.confirm(`Settle and mark fine #${challanNo} as Disposed/Paid?`)) return;
    setPayingId(id);
    try {
      const res = await challanAPI.payChallan(id);
      if (res.data.success) {
        setChallans(challans.map((c) => (c.id === id ? { ...c, status: 'DISPOSED', courtHearingDate: `Settled on ${new Date().toISOString().split('T')[0]}` } : c)));
      }
    } catch (e) {
      alert('Failed to update challan.');
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this challan record permanently?')) return;
    try {
      await challanAPI.delete(id);
      setChallans(challans.filter((c) => c.id !== id));
    } catch (e) {
      alert('Failed to delete.');
    }
  };

  // KPIs
  const totalFines = challans.reduce((sum, c) => sum + (c.status === 'PENDING' ? Number(c.amount || 0) : 0), 0);
  const pendingCount = challans.filter((c) => c.status === 'PENDING').length;
  const hearingCount = challans.filter((c) => c.status === 'HEARING_SCHEDULED').length;
  const disposedCount = challans.filter((c) => c.status === 'DISPOSED').length;

  const filteredChallans = challans.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchNum = c.challanNumber?.toLowerCase().includes(term);
      const matchBus = c.busNumber?.toLowerCase().includes(term);
      const matchDriver = c.driverName?.toLowerCase().includes(term);
      const matchOffense = c.offense?.toLowerCase().includes(term);
      if (!matchNum && !matchBus && !matchDriver && !matchOffense) return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1320px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-tgsrtc">AP & TG RTC LEGAL & E-CHALLAN COMMAND</span>
            <span className="badge badge-apsrtc" style={{ fontSize: '11px' }}>Admin: jaswanthdoppa76@gmail.com</span>
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 800 }}>Fleet Traffic Challans & Legal Cases</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Monitor highway speed violations, court hearings, driver offenses, and settle state transport fines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px', gap: '8px' }}
        >
          <Plus size={18} /> Log New Challan / Legal Case
        </button>
      </div>

      {/* 4 Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Pending Fine Dues</span>
            <DollarSign size={20} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#f87171', marginTop: '8px' }}>
            ₹{totalFines.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Across {pendingCount} outstanding challans</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Pending Violations</span>
            <AlertTriangle size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#fbbf24', marginTop: '8px' }}>
            {pendingCount} Cases
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Awaiting RTO / Police Clearance</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Court / RTO Hearings</span>
            <Scale size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#c084fc', marginTop: '8px' }}>
            {hearingCount} Scheduled
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Permit & Legal Audits</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Settled / Disposed</span>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#34d399', marginTop: '8px' }}>
            {disposedCount} Cleared
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Receipts & NOC Generated</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'HEARING_SCHEDULED', 'DISPOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterStatus === st ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: filterStatus === st ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                color: filterStatus === st ? 'var(--accent-cyan)' : '#94a3b8',
              }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '280px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by bus number, driver, challan..."
            className="glass-input"
            style={{ paddingLeft: '38px', fontSize: '13px' }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
        </div>
      </div>

      {/* Challans Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Challan / Case ID</th>
              <th style={{ padding: '14px 16px' }}>Bus & Operator</th>
              <th style={{ padding: '14px 16px' }}>Duty Pilot / Driver</th>
              <th style={{ padding: '14px 16px' }}>Offense & Jurisdiction</th>
              <th style={{ padding: '14px 16px' }}>Fine Amount</th>
              <th style={{ padding: '14px 16px' }}>Court / Hearing</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Loading E-Challan registry...
                </td>
              </tr>
            ) : filteredChallans.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No records match your selected filter.
                </td>
              </tr>
            ) : (
              filteredChallans.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {c.challanNumber}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      {c.offenseDate}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${c.operatorCode?.includes('TGSRTC') ? 'badge-tgsrtc' : 'badge-apsrtc'}`} style={{ fontSize: '9px' }}>
                        {c.operatorCode}
                      </span>
                      <strong style={{ color: '#fff' }}>{c.busNumber}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{c.busName}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 600 }}>
                      <User size={13} color="#38bdf8" />
                      <span>{c.driverName}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Coach Pilot</div>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{c.offense}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      Jurisdiction: {c.jurisdiction}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: c.status === 'PENDING' ? '#f87171' : '#34d399', fontFamily: 'var(--font-heading)' }}>
                      ₹{Number(c.amount).toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>
                    {c.courtHearingDate || 'N/A'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className={`badge ${
                        c.status === 'DISPOSED'
                          ? 'badge-apsrtc'
                          : c.status === 'HEARING_SCHEDULED'
                          ? 'badge-tgsrtc'
                          : 'badge-cancelled'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      {c.status !== 'DISPOSED' && (
                        <button
                          onClick={() => handlePayChallan(c.id, c.challanNumber)}
                          disabled={payingId === c.id}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
                        >
                          <Check size={12} /> {payingId === c.id ? 'Clearing...' : 'Settle Fine'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px', color: '#f87171' }}
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Log New Challan / Case */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid var(--border-accent)',
              boxShadow: 'var(--shadow-glow)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} color="#f59e0b" />
                <div>
                  <h3 style={{ fontSize: '18px', color: '#fff' }}>Log Traffic Challan or Legal Case</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Official Police E-Challan / RTO Case Entry</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateChallan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Select Vehicle Bus Number
                </label>
                <select
                  value={formData.busNumber}
                  onChange={(e) => handleBusSelect(e.target.value)}
                  className="glass-input"
                  style={{ fontSize: '13px' }}
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.busNumber} style={{ background: '#0f172a' }}>
                      {b.busNumber} • {b.busName} ({b.operatorCode}) - Driver: {b.driverName || 'S. Narsimha Reddy'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Assigned Driver Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="glass-input"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Fine Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="glass-input"
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Offense / Violation Description
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.offense}
                  onChange={(e) => setFormData({ ...formData, offense: e.target.value })}
                  placeholder="e.g. Over-speeding (>80 km/h) on NH65 Suryapet Expressway"
                  className="glass-input"
                  style={{ fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Jurisdiction / Police Station / RTO Unit
                </label>
                <input
                  type="text"
                  required
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  placeholder="e.g. Cyberabad Traffic Police (LB Nagar Unit)"
                  className="glass-input"
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Case Category
                  </label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="glass-input"
                    style={{ fontSize: '13px' }}
                  >
                    <option value="TRAFFIC_VIOLATION" style={{ background: '#0f172a' }}>Highway Traffic Violation</option>
                    <option value="RTO_LEGAL_CASE" style={{ background: '#0f172a' }}>RTO Legal Hearing</option>
                    <option value="REGULATORY_OFFENSE" style={{ background: '#0f172a' }}>Pollution/Permit Audit</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="glass-input"
                    style={{ fontSize: '13px' }}
                  >
                    <option value="PENDING" style={{ background: '#0f172a' }}>PENDING</option>
                    <option value="HEARING_SCHEDULED" style={{ background: '#0f172a' }}>HEARING SCHEDULED</option>
                    <option value="DISPOSED" style={{ background: '#0f172a' }}>DISPOSED / PAID</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save E-Challan Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
