import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, User, Eye, EyeOff } from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from '../firebase';

function Login() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-email':         return 'Invalid email address.';
      case 'auth/user-not-found':        return 'No account found with this email. Please register first.';
      case 'auth/wrong-password':        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':    return 'Invalid email or password.';
      case 'auth/email-already-in-use':  return 'An account with this email already exists. Please sign in.';
      case 'auth/weak-password':         return 'Password must be at least 6 characters.';
      case 'auth/too-many-requests':     return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':return 'Network error. Check your internet connection.';
      default:                           return 'Something went wrong. Please try again.';
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in App.jsx will handle the state update
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Save display name to Firebase profile
      await updateProfile(credential.user, { displayName: name.trim() });
      // onAuthStateChanged in App.jsx will handle session
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (m) => { setMode(m); setError(''); };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div className="three-d-effect" style={{ width: '100%', maxWidth: '420px', padding: '36px', margin: '16px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, #1976D2, #03A9F4)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 36, boxShadow: '0 8px 24px rgba(25,118,210,0.35)' }}>M</div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '4px', fontSize: '26px' }}>MediBridge</h1>
          <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '14px' }}>Your AI Health Companion</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '4px', marginBottom: '24px' }}>
          {[['signin', <LogIn size={15} />, 'Sign In'], ['register', <UserPlus size={15} />, 'Register']].map(([key, icon, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchMode(key)}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '10px', fontWeight: '600',
                fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: mode === key ? 'white' : 'transparent',
                color: mode === key ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                boxShadow: mode === key ? '0 2px 8px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', borderLeft: '4px solid #E53935' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <InputField type="email" placeholder="Email address" icon={<Mail size={18} />} value={email} onChange={setEmail} />
            <PasswordField placeholder="Password" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(s => !s)} />
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginTop: '8px', height: '52px', fontSize: '16px', borderRadius: '14px', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? '⏳ Signing in...' : <><LogIn size={20} /> Sign In</>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Register here</button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <InputField type="text" placeholder="Full Name" icon={<User size={18} />} value={name} onChange={setName} />
            <InputField type="email" placeholder="Email address" icon={<Mail size={18} />} value={email} onChange={setEmail} />
            <PasswordField placeholder="Password (min 6 chars)" value={password} onChange={setPassword} show={showPassword} toggle={() => setShowPassword(s => !s)} />
            <PasswordField placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} show={showPassword} toggle={() => setShowPassword(s => !s)} />
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ marginTop: '8px', height: '52px', fontSize: '16px', borderRadius: '14px', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? '⏳ Creating account...' : <><UserPlus size={20} /> Create Account</>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Sign in here</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function InputField({ type, placeholder, icon, value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>{icon}</span>
      <input type={type} placeholder={placeholder} className="input-field" style={{ paddingLeft: '48px' }} value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );
}

function PasswordField({ placeholder, value, onChange, show, toggle }) {
  return (
    <div style={{ position: 'relative' }}>
      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
      <input type={show ? 'text' : 'password'} placeholder={placeholder} className="input-field" style={{ paddingLeft: '48px', paddingRight: '48px' }} value={value} onChange={(e) => onChange(e.target.value)} required />
      <button type="button" onClick={toggle} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)', padding: 0, display: 'flex' }}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default Login;
