import React, { useState } from 'react';
import { LogOut, Heart, Star, Cloud, Phone, Edit2, CheckCircle } from 'lucide-react';

function SettingsPage({ onLogout, user }) {
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Guest User');
  const email = user?.email || 'Not logged in';
  const initial = displayName.charAt(0).toUpperCase();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '32px' }}>⚙️ Settings</h1>

      {/* Profile Card */}
      <div className="three-d-effect" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1976D2, #03A9F4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 6px 20px rgba(25,118,210,0.3)' }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '22px', color: 'var(--on-surface)' }}>{displayName}</h2>
          <p style={{ margin: '0 0 12px', color: 'rgba(0,0,0,0.55)', fontSize: '15px' }}>{email}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(25, 118, 210, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={13} /> Verified
            </span>
            <span style={{ background: 'rgba(46, 125, 50, 0.1)', color: '#2E7D32', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
              🏥 MediBridge User
            </span>
          </div>
        </div>
      </div>

      {/* App Info Card */}
      <div className="three-d-effect" style={{ marginBottom: '24px' }}>
        <SettingItem icon={<Heart size={20} color="var(--primary)" />} label="AI Model" value="Llama 3.1 (Groq)" />
        <Divider />
        <SettingItem icon={<Star size={20} color="var(--primary)" />} label="App Version" value="1.0.0 (Web)" />
        <Divider />
        <SettingItem icon={<Cloud size={20} color="var(--primary)" />} label="Storage" value="Cloudinary Cloud" />
        <Divider />
        <SettingItem icon={<Phone size={20} color="var(--primary)" />} label="Emergency SOS" value="108 (India)" />
      </div>

      {/* About Card */}
      <div className="three-d-effect" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 12px', color: 'var(--on-surface)' }}>About MediBridge Web</h3>
        <p style={{ color: 'rgba(0,0,0,0.6)', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
          MediBridge is your AI-powered personal health companion. This web version seamlessly syncs with your Android application, providing the same powerful Llama 3.1 AI triage and secure Cloudinary medical records storage directly from your browser.
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="btn btn-error"
        style={{ width: '100%', height: '56px', fontSize: '18px' }}
      >
        <LogOut size={24} />
        Sign Out
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="three-d-effect" style={{ width: '90%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFEBEE', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={28} color="#C62828" />
            </div>
            <h2 style={{ marginBottom: '8px' }}>Sign Out</h2>
            <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '32px' }}>Are you sure you want to sign out, <strong>{displayName}</strong>?</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn" style={{ flex: 1, background: 'rgba(0,0,0,0.05)' }}>Cancel</button>
              <button onClick={onLogout} className="btn btn-error" style={{ flex: 1 }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingItem({ icon, label, value }) {
  return (
    <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      {icon}
      <span style={{ fontWeight: '500', flex: 1 }}>{label}</span>
      <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '14px' }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 24px' }} />;
}

export default SettingsPage;
