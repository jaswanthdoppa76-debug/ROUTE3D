import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import CustomCursor3D from './components/CustomCursor3D';
import ThemeModal from './components/ThemeModal';
import LiveBusTrackerModal from './components/LiveBusTrackerModal';
import AIChatbot from './components/AIChatbot';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import SearchResultsPage from './pages/customer/SearchResultsPage';
import SeatSelectionPage from './pages/customer/SeatSelectionPage';
import PassengerDetailsPage from './pages/customer/PassengerDetailsPage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBusesPage from './pages/admin/AdminBusesPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminChallansPage from './pages/admin/AdminChallansPage';

// Protected Route Component for authorized admin
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  const AUTHORIZED_ADMIN = 'jaswanthdoppa76@gmail.com';
  const hasAccess = isAdmin || user?.role === 'ROLE_ADMIN' || user?.email?.toLowerCase() === AUTHORIZED_ADMIN || user?.email?.toLowerCase().includes('admin');
  if (!user || !hasAccess) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Footer Component
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '44px 24px',
        marginTop: '60px',
        background: 'rgba(7, 10, 18, 0.98)',
        color: '#94a3b8',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '28px',
        }}
      >
        <div style={{ maxWidth: '400px' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
            Route<span style={{ color: 'var(--accent-cyan)' }}>3D</span> Mobility
          </div>
          <p style={{ lineHeight: 1.6, color: '#94a3b8', fontSize: '13px' }}>
            Dedicated inter-state and intra-state online 3D bus reservation system for Andhra Pradesh and Telangana. Powered by Spring Boot REST and React Three Fiber.
          </p>
          <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-tgsrtc">TGSRTC OFFICIAL</span>
            <span className="badge badge-apsrtc">APSRTC OFFICIAL</span>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Verified Fleet Corridors</div>
          <div style={{ marginBottom: '6px' }}>• Hyderabad ⇄ Vijayawada (MGBS ⇄ PNBS)</div>
          <div style={{ marginBottom: '6px' }}>• Hyderabad ⇄ Visakhapatnam (NH16)</div>
          <div style={{ marginBottom: '6px' }}>• Hyderabad ⇄ Tirupati (Alipiri Expressway)</div>
          <div>• Vijayawada ⇄ Visakhapatnam</div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{t('officialContact')}</div>
          <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
            Jaswanth Doppa
          </div>
          <a
            href="mailto:jaswanthdoppa76@gmail.com"
            style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: '8px' }}
          >
            jaswanthdoppa76@gmail.com
          </a>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Direct inquiries, escalations & administrative clearance.
          </p>
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '34px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: '#64748b',
          fontSize: '12px',
        }}
      >
        © {new Date().getFullYear()} {t('rightsReserved')} Official Admin: jaswanthdoppa76@gmail.com.
      </div>
    </footer>
  );
};

// Main App Layout
function AppContent() {
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);
  const [trackerBusData, setTrackerBusData] = useState(null);

  const handleOpenTracker = (busData = null) => {
    setTrackerBusData(busData);
    setIsLiveTrackerOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 3D Custom Cursor */}
      <CustomCursor3D />

      {/* Theme Customizer Modal */}
      <ThemeModal />

      {/* Live 3D Bus Radar Tracker Modal */}
      <LiveBusTrackerModal
        isOpen={isLiveTrackerOpen}
        onClose={() => setIsLiveTrackerOpen(false)}
        busData={trackerBusData}
      />

      {/* AI Chatbot ("Sarathi AI") */}
      <AIChatbot onOpenLiveTracker={() => handleOpenTracker()} />

      {/* Top Navigation */}
      <Navbar onOpenLiveTracker={() => handleOpenTracker()} />

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage onOpenTracker={handleOpenTracker} />} />
          <Route path="/search" element={<SearchResultsPage onOpenTracker={handleOpenTracker} />} />
          <Route path="/seats/:scheduleId" element={<SeatSelectionPage onOpenTracker={handleOpenTracker} />} />
          <Route path="/passenger-details" element={<PassengerDetailsPage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage onOpenTracker={handleOpenTracker} />} />
          <Route path="/my-bookings" element={<MyBookingsPage onOpenTracker={handleOpenTracker} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/buses" element={<AdminRoute><AdminBusesPage /></AdminRoute>} />
          <Route path="/admin/routes" element={<AdminRoute><AdminRoutesPage /></AdminRoute>} />
          <Route path="/admin/schedules" element={<AdminRoute><AdminSchedulesPage /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
          <Route path="/admin/challans" element={<AdminRoute><AdminChallansPage /></AdminRoute>} />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
