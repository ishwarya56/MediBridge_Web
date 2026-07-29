import React, { useState } from 'react';
import { Phone, HeartPulse, Stethoscope, FileText, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handleEmergency = () => {
    // On mobile devices, tel: links work natively via <a> — but we also show the modal
    // on desktop so the user knows to call manually
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'tel:108';
    } else {
      setShowEmergencyModal(true);
    }
  };

  const healthTips = [
    "Drink at least 8 glasses of water today. Staying hydrated helps maintain energy levels and keeps your skin healthy!",
    "Take a 10-minute walk after meals. It helps regulate blood sugar and improves digestion.",
    "Eat at least 5 servings of fruits and vegetables today. They're packed with vitamins and anti-oxidants.",
    "Get 7–9 hours of sleep tonight. Quality sleep repairs your body and boosts your immune system.",
    "Practice deep breathing for 5 minutes. It lowers cortisol levels and reduces stress.",
  ];
  const todayTip = healthTips[new Date().getDay() % healthTips.length];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '8px' }}>Welcome to MediBridge</h1>
        <p style={{ color: 'rgba(0,0,0,0.6)' }}>Your AI-powered personal health companion.</p>
      </header>

      {/* SOS Button — works on mobile AND desktop */}
      <div
        className="three-d-effect"
        style={{ background: 'linear-gradient(135deg, #B3261E, #E57373)', padding: '24px', borderRadius: '24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', cursor: 'pointer', userSelect: 'none' }}
        onClick={handleEmergency}
      >
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>🚨 Emergency SOS</h2>
          <p style={{ opacity: 0.9, margin: 0 }}>Tap to call 108 immediately</p>
        </div>
        <a
          href="tel:108"
          onClick={(e) => e.stopPropagation()}
          style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%', display: 'flex', textDecoration: 'none', color: 'white' }}
          aria-label="Call 108"
        >
          <Phone size={32} />
        </a>
      </div>

      <h3 style={{ marginBottom: '16px', color: 'var(--on-surface)' }}>Quick Actions</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="three-d-effect" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/triage')}>
          <Stethoscope size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '15px' }}>AI Triage</h4>
        </div>
        <div className="three-d-effect" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/records')}>
          <FileText size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '15px' }}>Health Records</h4>
        </div>
        <div className="three-d-effect" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/map')}>
          <MapPin size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '15px' }}>Nearby Hospitals</h4>
        </div>
      </div>

      {/* Health Tip */}
      <div className="three-d-effect" style={{ padding: '24px', borderRadius: '24px', borderLeft: '6px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <HeartPulse color="var(--primary)" />
          <h3 style={{ color: 'var(--primary)', margin: 0 }}>Daily Health Tip</h3>
        </div>
        <p style={{ lineHeight: '1.6', color: 'rgba(0,0,0,0.7)', margin: 0 }}>{todayTip}</p>
      </div>

      {/* Emergency Modal (Desktop) */}
      {showEmergencyModal && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowEmergencyModal(false)}
        >
          <div
            className="three-d-effect"
            style={{ width: '90%', maxWidth: '420px', padding: '36px', textAlign: 'center', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #B3261E, #E57373)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={36} color="white" />
            </div>
            <h2 style={{ color: '#B3261E', marginBottom: '12px' }}>🚨 Medical Emergency</h2>
            <p style={{ color: 'rgba(0,0,0,0.7)', lineHeight: '1.6', marginBottom: '8px' }}>
              Call <strong style={{ fontSize: '32px', color: '#B3261E' }}>108</strong> immediately
            </p>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '13px', marginBottom: '28px' }}>National Ambulance Service — Free, 24×7 across India</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowEmergencyModal(false)} className="btn" style={{ flex: 1, background: 'rgba(0,0,0,0.06)', color: 'var(--on-surface)' }}>
                <X size={16} /> Close
              </button>
              <a href="tel:108" className="btn btn-error" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', background: 'linear-gradient(135deg, #B3261E, #E57373)', color: 'white' }}>
                <Phone size={18} /> Call 108
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
