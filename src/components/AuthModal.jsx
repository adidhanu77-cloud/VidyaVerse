import React, { useState } from 'react';
import {
  X, Mail, Phone, Lock, User, GraduationCap, CheckCircle2,
  AlertCircle, ArrowRight, Sparkles, ShieldCheck
} from 'lucide-react';
import {
  registerOrLoginWithGoogle,
  sendOtpForPhone,
  verifyOtpAndLoginPhone,
  registerWithEmailPassword,
  loginWithEmailPassword,
  deriveDisplayNameFromEmail
} from '../services/authService';

const GRADE_OPTIONS = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'phone' | 'email'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [grade, setGrade] = useState('Class 9');
  const [school, setSchool] = useState('');

  // Phone OTP specific
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneConfirmResult, setPhoneConfirmResult] = useState(null);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  // Google Quick-Gmail Prompt
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  if (!isOpen) return null;

  // ── 1. Google (Gmail) Handler
  async function handleGoogleAuth() {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await registerOrLoginWithGoogle({
        email: googleEmailInput || undefined,
        grade,
        school
      });
      if (res.success) {
        setSuccessToast(`Welcome, ${res.profile.name}! Gmail profile synced.`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.profile);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google Sign-in failed. Please retry.');
    }
    setLoading(false);
  }

  // ── 2. Phone OTP Handler
  async function handleSendPhoneOtp(e) {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
      const res = await sendOtpForPhone(formatted);
      if (res.success) {
        setOtpSent(true);
        if (res.mockOtp) {
          setDemoOtpHint(`Demo Verification Code: ${res.mockOtp}`);
        }
        if (res.confirmResult) {
          setPhoneConfirmResult(res.confirmResult);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not send verification code.');
    }
    setLoading(false);
  }

  async function handleVerifyPhoneOtp(e) {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
      const res = await verifyOtpAndLoginPhone({
        phoneNumber: formatted,
        otp: otpCode,
        confirmResult: phoneConfirmResult,
        name: displayName,
        grade,
        school
      });
      if (res.success) {
        setSuccessToast(`Welcome, ${res.profile.name}! Phone verified.`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.profile);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    }
    setLoading(false);
  }

  // ── 3. Email & Password Handler
  async function handleEmailAuth(e) {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      let res;
      if (activeTab === 'register') {
        const computedName = displayName || deriveDisplayNameFromEmail(email);
        res = await registerWithEmailPassword({
          email,
          password,
          name: computedName,
          grade,
          school
        });
      } else {
        res = await loginWithEmailPassword({ email, password });
      }

      if (res.success) {
        setSuccessToast(`Welcome, ${res.profile.name}! Session logged in.`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.profile);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error.');
    }
    setLoading(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(23,20,13,0.65)', backdropFilter: 'blur(3px)'
        }}
      />

      {/* Modal Card */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '92%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto',
        background: '#ffffff', border: '3.5px solid #17140d', borderRadius: 24,
        boxShadow: '10px 10px 0 #17140d', zIndex: 501,
        fontFamily: "'DM Sans', sans-serif", color: '#17140d'
      }}>

        {/* Header Bar */}
        <div style={{
          background: '#ffc531', borderBottom: '3px solid #17140d',
          padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎓</span>
            <div>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 19, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
                VidyaVerse Student Account
              </h2>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#333' }}>
                Real-Time Sync with Profile & Career Roadmap
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '2px solid #17140d',
              background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, boxShadow: '2px 2px 0 #17140d'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div style={{ display: 'flex', borderBottom: '2.5px solid #17140d', background: '#f5efe2' }}>
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            style={{
              flex: 1, padding: '12px 16px', border: 'none', borderRight: '2px solid #17140d',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              color: activeTab === 'login' ? '#17140d' : '#777',
              transition: 'all 0.15s'
            }}
          >
            🔑 Log In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
            style={{
              flex: 1, padding: '12px 16px', border: 'none',
              background: activeTab === 'register' ? '#ffffff' : 'transparent',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              color: activeTab === 'register' ? '#17140d' : '#777',
              transition: 'all 0.15s'
            }}
          >
            📝 Register
          </button>
        </div>

        <div style={{ padding: '24px 26px' }}>

          {/* Success Toast */}
          {successToast && (
            <div style={{
              background: '#2bd980', border: '2px solid #17140d', borderRadius: 12,
              padding: '10px 14px', marginBottom: 16, fontWeight: 800, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8, boxShadow: '3px 3px 0 #17140d'
            }}>
              <CheckCircle2 size={18} />
              <span>{successToast}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              background: '#fff0f0', border: '2px solid #ff5b57', borderRadius: 12,
              padding: '10px 14px', marginBottom: 16, fontWeight: 700, fontSize: 13,
              color: '#ff5b57', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ════ METHOD 1: GOOGLE / GMAIL (RECOMMENDED) ════ */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => {
                // If user wants to enter custom Gmail or sign in directly
                setShowGooglePrompt(!showGooglePrompt);
              }}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 14,
                border: '2.5px solid #17140d', background: '#ffffff',
                fontWeight: 800, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '4px 4px 0 #17140d', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #17140d'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #17140d'; }}
            >
              {/* Google G SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{activeTab === 'register' ? 'Register with Gmail Account' : 'Continue with Google (Gmail)'}</span>
            </button>

            {/* Google Prompt Expandable Box */}
            {showGooglePrompt && (
              <div style={{
                marginTop: 12, padding: '16px', background: '#f5f0ff',
                border: '2px solid #804dee', borderRadius: 14, boxShadow: '3px 3px 0 #804dee'
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#804dee', textTransform: 'uppercase', marginBottom: 6 }}>
                  Google Account Details (Real-Time Sync)
                </div>
                <p style={{ fontSize: 12.5, color: '#555', margin: '0 0 10px' }}>
                  Enter your Gmail. Your <strong>default Gmail name</strong> will automatically be saved and displayed on your student profile:
                </p>

                <input
                  type="email"
                  placeholder="e.g. aditya.sharma@gmail.com"
                  value={googleEmailInput}
                  onChange={e => setGoogleEmailInput(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 8,
                    border: '2px solid #17140d', fontSize: 13, fontWeight: 600,
                    marginBottom: 10, boxSizing: 'border-box'
                  }}
                />

                {googleEmailInput && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#2bd980', marginBottom: 10 }}>
                    ✓ Default Name to display: <strong>{deriveDisplayNameFromEmail(googleEmailInput)}</strong>
                  </div>
                )}

                {activeTab === 'register' && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>Select Your Class:</label>
                    <select
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: 8,
                        border: '2px solid #17140d', background: '#fff', fontSize: 13, fontWeight: 700, marginTop: 4
                      }}
                    >
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 10,
                    border: '2px solid #17140d', background: '#804dee', color: '#fff',
                    fontWeight: 800, fontSize: 13.5, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0 #17140d'
                  }}
                >
                  {loading ? 'Syncing Profile...' : 'Confirm Gmail Login & Sync Profile ➔'}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 2, background: '#e0dbcf' }} />
            <span style={{ fontSize: 11.5, fontWeight: 800, color: '#888', textTransform: 'uppercase' }}>OR USE</span>
            <div style={{ flex: 1, height: 2, background: '#e0dbcf' }} />
          </div>

          {/* Auth Method Toggle Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); setErrorMessage(''); }}
              style={{
                padding: '9px 12px', borderRadius: 10, border: '2px solid #17140d',
                background: authMethod === 'phone' ? '#ffc531' : '#ffffff',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: authMethod === 'phone' ? '3px 3px 0 #17140d' : 'none'
              }}
            >
              <Phone size={15} /> Mobile Number
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setErrorMessage(''); }}
              style={{
                padding: '9px 12px', borderRadius: 10, border: '2px solid #17140d',
                background: authMethod === 'email' ? '#ffc531' : '#ffffff',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: authMethod === 'email' ? '3px 3px 0 #17140d' : 'none'
              }}
            >
              <Mail size={15} /> Email / Password
            </button>
          </div>

          {/* ════ METHOD 2: PHONE OTP ════ */}
          {authMethod === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendPhoneOtp}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      Mobile Phone Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#888" style={{ position: 'absolute', left: 12, top: 12 }} />
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        style={{
                          width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                          border: '2px solid #17140d', fontSize: 14, fontWeight: 600, boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {activeTab === 'register' && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Kumar"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px', borderRadius: 10,
                            border: '2px solid #17140d', fontSize: 13, fontWeight: 600, boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                          Current Class / Grade
                        </label>
                        <select
                          value={grade}
                          onChange={e => setGrade(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px', borderRadius: 10,
                            border: '2px solid #17140d', background: '#fff', fontSize: 13, fontWeight: 700, boxSizing: 'border-box'
                          }}
                        >
                          {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  <div id="recaptcha-container" />

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 12,
                      border: '2.5px solid #17140d', background: '#2bd980', color: '#17140d',
                      fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPhoneOtp}>
                  <div style={{ background: '#efffed', border: '1.5px solid #2bd980', borderRadius: 10, padding: '10px 12px', marginBottom: 14, fontSize: 12.5, color: '#17140d' }}>
                    📱 Verification code sent to <strong>{phoneNumber}</strong>
                    {demoOtpHint && (
                      <div style={{ marginTop: 4, fontWeight: 800, color: '#804dee' }}>
                        💡 {demoOtpHint}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 10, letterSpacing: '4px',
                        border: '2.5px solid #17140d', fontSize: 18, fontWeight: 800, textAlign: 'center', boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 12,
                      border: '2.5px solid #17140d', background: '#2bd980', color: '#17140d',
                      fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '3px 3px 0 #17140d'
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Complete Login ➔'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{
                      width: '100%', marginTop: 8, background: 'none', border: 'none',
                      fontSize: 12, fontWeight: 700, color: '#666', cursor: 'pointer', textDecoration: 'underline'
                    }}
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ════ METHOD 3: EMAIL & PASSWORD ════ */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth}>
              {activeTab === 'register' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '2px solid #17140d', fontSize: 13, fontWeight: 600, boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#888" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="email"
                    placeholder="e.g. priya@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                      border: '2px solid #17140d', fontSize: 13, fontWeight: 600, boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#888" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                      border: '2px solid #17140d', fontSize: 13, fontWeight: 600, boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Current Class / Grade
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '2px solid #17140d', background: '#fff', fontSize: 13, fontWeight: 700, boxSizing: 'border-box'
                    }}
                  >
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  border: '2.5px solid #17140d', background: '#ffc531', color: '#17140d',
                  fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <span>{loading ? 'Processing...' : activeTab === 'register' ? 'Register Account' : 'Log In'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div style={{
            marginTop: 18, paddingTop: 14, borderTop: '1.5px solid #eee',
            fontSize: 11.5, color: '#888', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <ShieldCheck size={14} color="#2bd980" />
            <span>Real-time local sync & secure privacy for 100M+ rural learners.</span>
          </div>

        </div>
      </div>
    </>
  );
}
