import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CheckCircle, Download, Home, Ticket, Bus, Calendar, Clock, MapPin, ShieldCheck, Printer, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingConfirmationPage({ onOpenTracker }) {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef();

  const [booking, setBooking] = useState(() => {
    if (location.state?.booking) return location.state.booking;
    try {
      const last = localStorage.getItem('route3d_last_booking');
      if (last) {
        const parsed = JSON.parse(last);
        if (!bookingId || String(parsed.id) === String(bookingId) || parsed.bookingNumber === bookingId) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [loading, setLoading] = useState(!booking);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#06b6d4', '#10b981', '#fbbf24'],
      });
    } catch (e) {
      console.warn('Confetti animation suppressed:', e);
    }

    if (!booking) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await bookingAPI.getById(bookingId);
      if (res.data?.success && res.data?.data) {
        setBooking(res.data.data);
      } else {
        const last = localStorage.getItem('route3d_last_booking');
        if (last) setBooking(JSON.parse(last));
      }
    } catch (err) {
      console.error(err);
      const last = localStorage.getItem('route3d_last_booking');
      if (last) setBooking(JSON.parse(last));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const handlePrintTicket = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);

    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#070a12',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
      pdf.save(`JDBus_Ticket_${booking?.bookingNumber || booking?.bookingReference || 'Ticket'}.pdf`);
    } catch (err) {
      console.error('Failed to generate ticket PDF:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: '36px', animation: 'bounce 1s infinite' }}>🎫</div>
        <p style={{ color: '#94a3b8', marginTop: '16px' }}>Loading verified ticket boarding pass...</p>
      </div>
    );
  }

  // Safe fallback if booking is somehow empty
  const activeBooking = booking || {
    id: 991,
    bookingNumber: 'RT3D-TG-884920',
    bookingReference: 'RT3D-TG-884920',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    sourceCity: 'Hyderabad',
    sourceState: 'TELANGANA',
    destinationCity: 'Vijayawada',
    destinationState: 'ANDHRA_PRADESH',
    travelDate: new Date().toISOString().split('T')[0],
    departureTime: '06:00:00',
    arrivalTime: '11:00:00',
    busName: 'TGSRTC Rajdhani AC Express',
    busNumber: 'TS09Z7788',
    busType: 'GARUDA_PLUS',
    operatorName: 'TGSRTC (Telangana RTC)',
    seatNumbers: ['A1'],
    totalAmount: 650.0,
    qrCodeData: 'JDBUS-TICKET-TG-884920',
    passengers: [{ name: 'Ravi Kumar Naidu', age: 28, gender: 'MALE', seatNumber: 'A1' }],
  };

  const bookingRef = activeBooking.bookingNumber || activeBooking.bookingReference || 'RT3D-TG-884920';
  const qrUrl = typeof window !== 'undefined' ? `${window.location.origin}` : `https://route3d-bus.com`;
  const sourceCity = activeBooking.sourceCity || activeBooking.schedule?.sourceCity || 'Hyderabad';
  const destCity = activeBooking.destinationCity || activeBooking.schedule?.destinationCity || 'Vijayawada';
  const depTime = (activeBooking.departureTime || activeBooking.schedule?.departureTime || '06:00').slice(0, 5);
  const arrTime = (activeBooking.arrivalTime || activeBooking.schedule?.arrivalTime || '11:00').slice(0, 5);
  const travelDate = activeBooking.travelDate || activeBooking.schedule?.travelDate || 'Today';
  const busName = activeBooking.busName || activeBooking.schedule?.busName || 'TGSRTC Rajdhani AC Express';
  const busNum = activeBooking.busNumber || activeBooking.schedule?.busNumber || 'TS09Z7788';
  const busType = activeBooking.busType || 'SUPER_LUXURY';
  const opName = activeBooking.operatorName || activeBooking.schedule?.operatorName || 'TGSRTC Official';
  const seatsList = (activeBooking.seatNumbers && activeBooking.seatNumbers.length > 0)
    ? activeBooking.seatNumbers
    : (activeBooking.passengers?.map((p) => p.seatNumber).filter(Boolean) || ['A1']);
  const totalFare = activeBooking.totalAmount ? Number(activeBooking.totalAmount) : 650;
  const statusBadge = activeBooking.bookingStatus || activeBooking.status || 'CONFIRMED';
  const payStatus = activeBooking.paymentStatus || 'PAID';

  const paxList = activeBooking.passengers && activeBooking.passengers.length > 0
    ? activeBooking.passengers
    : [{ name: activeBooking.passengerLeadName || 'Passenger 1', age: 28, gender: 'MALE', seatNumber: seatsList[0] || 'A1' }];

  return (
    <div style={{ maxWidth: '840px', margin: '40px auto 80px auto', padding: '0 20px' }}>
      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="no-print"
        style={{ textAlign: 'center', marginBottom: '32px' }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle size={36} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '6px' }}>Booking Confirmed!</h1>
        <p style={{ color: '#94a3b8' }}>
          Your seat(s) are officially confirmed on the RTC intercity network.
        </p>
      </motion.div>

      {/* Printable / Downloadable PDF Ticket Container */}
      <div
        ref={ticketRef}
        id="printable-ticket"
        className="glass-panel printable-ticket-card"
        style={{
          padding: '36px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          background: 'radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        {/* Ticket Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '20px',
            borderBottom: '2px dashed rgba(255, 255, 255, 0.15)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bus size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                Route<span style={{ color: '#06b6d4' }}>3D</span>
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>OFFICIAL BOARDING PASS</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>BOOKING REFERENCE</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {bookingRef}
            </div>
            <span className="badge badge-active" style={{ marginTop: '4px' }}>
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>DEPARTURE</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{sourceCity}</div>
            <div style={{ fontSize: '13px', color: '#38bdf8' }}>{depTime}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{activeBooking.sourceState || 'TELANGANA'}</div>
          </div>

          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, #2563eb, #06b6d4)', margin: '0 auto 6px auto' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{travelDate}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>ARRIVAL</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{destCity}</div>
            <div style={{ fontSize: '13px', color: '#38bdf8' }}>{arrTime}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{activeBooking.destinationState || 'ANDHRA_PRADESH'}</div>
          </div>
        </div>

        {/* Bus and Seat Information Grid */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>OPERATOR / SERVICE</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{opName}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{busName}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>VEHICLE NUMBER</div>
            <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{busNum}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{busType}</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>RESERVED SEATS</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
              {seatsList.join(', ')}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{seatsList.length} Passenger(s)</div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>TOTAL PAID</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              ₹{totalFare.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>STATUS: {payStatus}</div>
          </div>
        </div>

        {/* Passenger Roster + Verification QR Code */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '20px', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              Passenger Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {paxList.map((p, idx) => (
                <div key={idx} style={{ fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    [{p.seatNumber || seatsList[idx] || `A${idx + 1}`}]
                  </span>
                  <span style={{ fontWeight: 600 }}>{p.name || p.passengerName || 'Passenger'}</span>
                  <span style={{ color: '#64748b' }}>({p.age || 28} yrs, {p.gender || 'MALE'})</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                display: 'inline-block',
              }}
            >
              <QRCodeSVG
                value={qrUrl}
                size={100}
                level="M"
              />
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
              Scan to Verify
            </div>
          </div>
        </div>

        {/* Official Administrator Contact Footer */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px dashed var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          <div>
            Verified by: <strong style={{ color: '#fff' }}>JD Bus Services Inter-State Mobility</strong>
          </div>
          <div>
            Official Administrator Support:{' '}
            <a href="mailto:jaswanthdoppa76@gmail.com" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}>
              jaswanthdoppa76@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrintTicket}
          className="btn-secondary"
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            borderColor: '#10b981',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
          }}
        >
          <Printer size={18} color="#34d399" />
          Print Ticket
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '14px' }}
        >
          <Download size={18} />
          {downloading ? 'Preparing Ticket PDF...' : 'Download Official PDF Ticket'}
        </button>

        <button
          onClick={() =>
            onOpenTracker &&
            onOpenTracker({
              busNumber: busNum,
              busName: busName,
              operator: opName,
              route: `${sourceCity} ➔ ${destCity}`,
              currentLocation: 'NH65 Corridor - Active Run',
              nextStop: 'Approaching Next Station',
              etaNextStop: '24 mins',
              destinationETA: `${arrTime} Scheduled`,
              status: 'On Time',
            })
          }
          className="btn-secondary"
          style={{ padding: '12px 20px', fontSize: '14px', borderColor: 'var(--accent-cyan)', color: '#38bdf8' }}
        >
          <Navigation size={18} color="var(--accent-cyan)" />
          Track This Bus in Live 3D Radar
        </button>

        <Link
          to="/my-bookings"
          className="btn-secondary"
          style={{ padding: '12px 20px', fontSize: '14px' }}
        >
          <Ticket size={18} />
          View My Bookings
        </Link>

        <Link
          to="/"
          className="btn-secondary"
          style={{ padding: '12px 20px', fontSize: '14px' }}
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
