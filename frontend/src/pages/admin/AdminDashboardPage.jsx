import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { Bus, Users, DollarSign, CalendarCheck, AlertTriangle, TrendingUp, Compass, Award, Scale } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ color: '#94a3b8' }}>Loading 3D transport analytics...</p>
      </div>
    );
  }

  const kpis = [
    { title: 'Total Fleet', value: stats.totalBuses, icon: Bus, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
    { title: 'Active Fleet', value: stats.activeBuses, icon: Compass, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    { title: 'Registered Users', value: stats.totalUsers, icon: Users, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
    { title: "Today's Bookings", value: stats.todayBookings, icon: CalendarCheck, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
    { title: 'Total Revenue', value: `₹${Number(stats.totalRevenue).toLocaleString()}`, icon: DollarSign, color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
    { title: 'Fleet Occupancy', value: `${stats.occupancyRate}%`, icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' },
    { title: 'Confirmed Bookings', value: stats.confirmedBookings, icon: Award, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    { title: 'Pending Challans & Cases', value: `${stats.pendingChallans || 4} Due`, icon: Scale, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-tgsrtc">AP & TG RTC Command Hub</span>
            <span className="badge badge-apsrtc" style={{ fontSize: '11px' }}>
              Authorized Administrator: jaswanthdoppa76@gmail.com
            </span>
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff', marginTop: '6px' }}>Operations & Revenue Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Real-time fleet telemetry, revenue trends, driver rosters, and corridor analytics.
          </p>
        </div>

        <Link
          to="/admin/challans"
          className="btn-secondary"
          style={{ fontSize: '13px', padding: '10px 18px', gap: '8px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
        >
          <Scale size={16} /> Manage Challans & Legal Cases →
        </Link>
      </div>

      {/* 3D KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${kpi.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'var(--transition-normal)',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={22} color={kpi.color} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {kpi.title}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {kpi.value}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Revenue Trend Area Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '4px' }}>7-Day Revenue Trends (₹)</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Intercity daily gross ticket receipts</p>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer>
              <AreaChart data={stats.dailyRevenueTrends || []}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bus Type Distribution Pie Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '4px' }}>Fleet Category Split</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Super Luxury vs Volvo/Scania AC</p>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={stats.busTypeDistribution || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {(stats.busTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top High-Traffic RTC Corridors Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>
          Top High-Occupancy AP & Telangana Corridors
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Corridor Route</th>
                <th style={{ padding: '12px 16px' }}>Total Completed Bookings</th>
                <th style={{ padding: '12px 16px' }}>Average Occupancy Load</th>
                <th style={{ padding: '12px 16px' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topRoutes || stats.topCorridors?.map((c) => ({ route: c.name, bookings: c.bookings, occupancy: '90%' })) || []).map((route, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#fff' }}>{route.route}</td>
                  <td style={{ padding: '14px 16px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{route.bookings}</td>
                  <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>{route.occupancy}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: route.occupancy || '85%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
