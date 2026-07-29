import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Stethoscope, FolderHeart, Map as MapIcon, Settings } from 'lucide-react';
import { auth, onAuthStateChanged, signOut } from './firebase';

// Pages
import Dashboard from './pages/Dashboard';
import Triage from './pages/Triage';
import Records from './pages/Records';
import MapPage from './pages/MapPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/triage', label: 'AI Triage', icon: Stethoscope },
  { path: '/records', label: 'Records', icon: FolderHeart },
  { path: '/map', label: 'Map', icon: MapIcon },
  { path: '/settings', label: 'Settings', icon: Settings },
];

function Sidebar() {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #1976D2, #03A9F4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 24 }}>M</div>
        MediBridge
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function MobileNav() {
  const location = useLocation();
  return (
    <div className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">{children}</div>
      <MobileNav />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real Firebase Auth listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #1976D2, #03A9F4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 24 }}>M</div>
        <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading MediBridge...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/triage" element={<ProtectedRoute user={user}><Triage user={user} /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute user={user}><Records user={user} /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute user={user}><MapPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user}><SettingsPage onLogout={handleLogout} user={user} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
