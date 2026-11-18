import React, { useState, useEffect } from 'react';
import {
  Microscope, Globe, Sparkles, Layers, ChevronDown, User, LogIn,
  Menu, X, Home, Camera, Beaker, Bot, Compass, BookOpen, ClipboardCheck,
  MapPin, Trophy, Moon, Sun
} from 'lucide-react';
import { realtime } from '../services/realtime';
import UserProfilePanel from './UserProfilePanel';
import AuthModal from './AuthModal';

export default function Navbar({ currentLang, setLang, onOpenScanner, onSelectSection, onGoHome, activeTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('dark');
    return stored === 'true';
  });

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dark', next);
    if (next) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  // Apply on mount
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    }
  }, []);

  const [profile, setProfile] = useState({ name: '', avatar: null });
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    realtime.connect();
    const unsub = realtime.on('STATUS_CHANGE', ({ connected }) => setIsWsConnected(connected));
    return unsub;
  }, []);

  // Listen for real-time auth updates across components
  useEffect(() => {
    function handleAuthUpdate(e) {
      if (e.detail) {
        setProfile(e.detail);
      } else {
        setProfile({ name: '', avatar: null });
      }
    }
    window.addEventListener('vidyaverse_auth_update', handleAuthUpdate);
    return () => window.removeEventListener('vidyaverse_auth_update', handleAuthUpdate);
  }, []);

  // Load profile from localStorage on mount + listen for updates
  useEffect(() => {
    function loadFromStorage() {
      try {
        const p = localStorage.getItem('vidyaverse_profile') || localStorage.getItem('stemverse_profile');
        if (p) setProfile(JSON.parse(p));
        const prog = localStorage.getItem('vidyaverse_progress') || localStorage.getItem('stemverse_progress');
        if (prog) setProgress(JSON.parse(prog));
      } catch {}
    }
    loadFromStorage();
    // Poll localStorage every 3s so avatar/badges update after profile save
    const interval = setInterval(loadFromStorage, 3000);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  const verticalTabs = [
    { id: 'scanner',    label: 'What is this?',         icon: '📷', tag: 'Vision' },
    { id: 'labs',       label: 'Virtual Labs',           icon: '🧪', tag: 'Physics/Chem' },
    { id: 'hunt',       label: 'Treasure Hunt',          icon: '🧭', tag: 'Gamified' },
    { id: 'stories',    label: 'StoryVerse Learning',    icon: '🎬', tag: 'Pixar Mode' },
    { id: 'mentor',     label: 'AI Tutor',               icon: '🤖', tag: 'Dr. APJ' },
    { id: 'assessment', label: 'Skill Assessment',        icon: '📝', tag: 'Weekly Test' },
    { id: 'careers',    label: 'Career Navigator',        icon: '🎯', tag: 'Live Roadmap' },
    { id: 'analytics',  label: 'Leaderboards & Gaps',    icon: '🏆', tag: 'School League' },
  ];

  const handleSelectTab = (id) => { setShowDropdown(false); onSelectSection(id); };

  // Avatar helpers
  const AVATAR_COLORS = ['#ff5b57','#12b3a4','#6b5be6','#ffc531','#3aa0ff','#2bd980'];
  const name = profile?.name || '';
  const initials = name ? name.trim().split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';
  const avatarBg = name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : '#6b5be6';
  const badgeCount = progress?.badges?.length || 0;
  const streak = progress?.streak || 0;

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(245,239,226,0.97)', backdropFilter: 'blur(8px)', borderBottom: '3px solid #17140d' }}>
        <div className="container-1440" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', gap: 12 }}>

          {/* Brand Left */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              if (onGoHome) onGoHome();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <div style={{ width: 40, height: 40, backgroundColor: '#ffc531', borderRadius: 12, border: '2.5px solid #17140d', boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Microscope size={22} color="#17140d" strokeWidth={2.6} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 25px)', fontWeight: 800, color: '#17140d', letterSpacing: '-0.03em' }}>
              Vidya<span style={{ color: '#ff5b57' }}>Verse</span>
            </span>
          </button>

          {/* Center (Desktop only): Module Selector & Quick Back */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {activeTab && (
              <button
                onClick={onGoHome}
                className="btn-candy"
                style={{
                  padding: '8px 14px',
                  fontSize: 13,
                  backgroundColor: '#ffffff',
                  color: '#17140d',
                  boxShadow: '3px 3px 0 #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                title="Return to All Features"
              >
                <span>←</span>
                <span>All Features</span>
              </button>
            )}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="btn-candy secondary" style={{ padding: '8px 18px', fontSize: 14, boxShadow: '3px 3px 0 #17140d', gap: 8 }}>
                <Layers size={16} color="#ff5b57" />
                <span>Select Modules (8)</span>
                <ChevronDown size={16} color="#17140d" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

            {showDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', width: 280, backgroundColor: '#ffffff', border: '3px solid #17140d', borderRadius: 16, boxShadow: '6px 6px 0 #17140d', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 60 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#666', padding: '4px 8px' }}>Quick Jump:</div>
                {verticalTabs.map((tab) => (
                  <button key={tab.id} onClick={() => handleSelectTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, border: '1.5px solid transparent', backgroundColor: '#f5efe2', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#17140d', transition: 'all 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffc531'; e.currentTarget.style.borderColor = '#17140d'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5efe2'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{tab.icon}</span><span>{tab.label}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: 4, border: '1px solid #17140d' }}>{tab.tag}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right side (Desktop): Full Controls */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: 9999, border: '3px solid #17140d', boxShadow: '3px 3px 0 #17140d' }}>
              <Globe size={16} color="#17140d" />
              <select value={currentLang} onChange={e => setLang(e.target.value)} style={{ border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#17140d', cursor: 'pointer', outline: 'none' }}>
                {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            {/* Dark Mode Toggle */}
            <button onClick={toggleDark} className="btn-candy secondary" style={{ marginLeft: 8, padding: '8px 12px' }}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* ── User Status or Log In CTA ── */}
            {profile?.name ? (
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#ffffff', border: '2.5px solid #17140d', borderRadius: 999,
                  padding: '7px 14px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '3px 3px 0 #17140d', color: '#17140d'
                }}
                title="View Profile & Career Roadmap"
              >
                <span>👤 {profile.name}</span>
                {profile.provider === 'google' && (
                  <span style={{ fontSize: 10, background: '#e8f0fe', color: '#1a73e8', padding: '1px 6px', borderRadius: 999, border: '1px solid #1a73e8' }}>
                    Gmail ✅
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-candy"
                style={{
                  fontSize: 13, padding: '8px 16px',
                  background: '#ffc531', color: '#17140d',
                  boxShadow: '3px 3px 0 #17140d', fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <LogIn size={15} />
                <span>Log In / Register</span>
              </button>
            )}

            {/* ── User Avatar Button ── */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowProfile(true)}
                style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #17140d', boxShadow: '3px 3px 0 #17140d', overflow: 'visible', cursor: 'pointer', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, position: 'relative', flexShrink: 0 }}
                title="Open Profile">
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {profile?.avatar
                    ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{initials}</span>
                  }
                </div>
                {/* Badge count pill */}
                {badgeCount > 0 && (
                  <div style={{ position: 'absolute', top: -6, right: -6, background: '#ff5b57', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 800, padding: '1px 5px', border: '2px solid #17140d', minWidth: 18, textAlign: 'center', lineHeight: 1.5 }}>
                    {badgeCount}
                  </div>
                )}
                {/* Streak pill */}
                {streak > 0 && (
                  <div style={{ position: 'absolute', bottom: -8, right: -8, background: '#ffc531', color: '#17140d', borderRadius: 999, fontSize: 9, fontWeight: 800, padding: '1px 5px', border: '2px solid #17140d', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                    🔥{streak}
                  </div>
                )}
              </button>
            </div>

          </div>

          {/* Right side (Mobile / Tablet < 1024px): Compact Profile + Hamburger Toggle */}
          <div className="hide-on-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Real-time pulse dot on mobile */}
            <div
              title={isWsConnected ? 'WebSocket Live' : 'WebSocket Connecting'}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                backgroundColor: isWsConnected ? '#2bd980' : '#ff5b57',
                border: '1.5px solid #17140d',
                boxShadow: isWsConnected ? '0 0 6px #2bd980' : 'none'
              }}
            />

            {/* Compact Avatar */}
            <button
              onClick={() => setShowProfile(true)}
              style={{
                width: 38, height: 38, borderRadius: '50%', border: '2.5px solid #17140d',
                boxShadow: '2.5px 2.5px 0 #17140d', cursor: 'pointer', background: avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                position: 'relative', flexShrink: 0
              }}
              title="Open Profile"
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile?.avatar
                  ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{initials}</span>
                }
              </div>
              {badgeCount > 0 && (
                <div style={{ position: 'absolute', top: -4, right: -4, background: '#ff5b57', color: '#fff', borderRadius: 999, fontSize: 9, fontWeight: 800, padding: '0 4px', border: '1.5px solid #17140d', minWidth: 14, textAlign: 'center' }}>
                  {badgeCount}
                </div>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: isMobileMenuOpen ? '#ff5b57' : '#ffffff',
                color: isMobileMenuOpen ? '#ffffff' : '#17140d',
                border: '2.5px solid #17140d',
                boxShadow: '3px 3px 0 #17140d',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              title={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            MOBILE NAVIGATION DRAWER (Expands on Hamburger Tap)
            ══════════════════════════════════════════════════════════ */}
        {isMobileMenuOpen && (
          <div
            className="hide-on-desktop"
            style={{
              backgroundColor: '#ffffff',
              borderTop: '2.5px solid #17140d',
              borderBottom: '3.5px solid #17140d',
              boxShadow: '0 10px 0 rgba(23,20,13,0.15)',
              padding: '16px 18px 24px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Top row: User greeting or login CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '2px solid #f0e6d6', flexWrap: 'wrap', gap: 10 }}>
              {profile?.name ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#17140d' }}>
                    👋 Hi, <strong>{profile.name}</strong>
                  </span>
                  {profile.provider === 'google' && (
                    <span style={{ fontSize: 10, background: '#e8f0fe', color: '#1a73e8', padding: '1px 6px', borderRadius: 999, border: '1px solid #1a73e8' }}>
                      Gmail ✅
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setShowAuthModal(true); }}
                  className="btn-candy"
                  style={{
                    fontSize: 13, padding: '7px 14px', background: '#ffc531', color: '#17140d',
                    boxShadow: '2.5px 2.5px 0 #17140d', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6
                  }}
                >
                  <LogIn size={14} />
                  <span>Log In / Register</span>
                </button>
              )}

              {/* Language Selector Dropdown on Mobile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: '#f5efe2', padding: '5px 10px', borderRadius: 999, border: '2px solid #17140d' }}>
                <Globe size={14} color="#17140d" />
                <select
                  value={currentLang}
                  onChange={e => setLang(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: '#17140d', cursor: 'pointer', outline: 'none' }}
                >
                  {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {/* Quick All Features Button if inside a section */}
            {activeTab && (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onGoHome(); }}
                className="btn-candy"
                style={{
                  width: '100%', marginBottom: 14, padding: '9px 16px',
                  backgroundColor: '#ffffff', color: '#17140d', fontSize: 13.5,
                  boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                <span>🏠</span>
                <span>Return to All Features Directory</span>
              </button>
            )}

            {/* 8 Laboratory Modules List */}
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#777', marginBottom: 8, letterSpacing: '.06em' }}>
              Laboratory Modules (8):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 16 }}>
              {verticalTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setIsMobileMenuOpen(false); onSelectSection(tab.id); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 12,
                      border: '2px solid #17140d',
                      backgroundColor: isActive ? '#ffc531' : '#fcfaf6',
                      boxShadow: isActive ? '3px 3px 0 #17140d' : '1.5px 1.5px 0 #17140d',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
                      color: '#17140d', transition: 'all 0.1s'
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{tab.icon}</span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Direct Try What is this? Action */}
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenScanner(); }}
              className="btn-candy teal"
              style={{ width: '100%', fontSize: 14, padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Sparkles size={16} />
              <span>Launch "What is this?" Scanner</span>
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════
          STICKY MOBILE BOTTOM NAVIGATION BAR (< 768px Phones)
          ══════════════════════════════════════════════════════════ */}
      <nav
        className="hide-on-desktop"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 62,
          backgroundColor: '#ffffff',
          borderTop: '2.5px solid #17140d',
          boxShadow: '0 -3px 0 rgba(23,20,13,0.06)',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* 1. Home / All Features */}
        <button
          onClick={onGoHome}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: !activeTab ? '#ff5b57' : '#666', padding: '6px 12px',
            borderRadius: 8, transition: 'all 0.15s'
          }}
        >
          <Home size={20} strokeWidth={!activeTab ? 2.8 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: !activeTab ? 800 : 600 }}>Home</span>
        </button>

        {/* 2. What is this? */}
        <button
          onClick={() => onSelectSection('scanner')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: activeTab === 'scanner' ? '#ff5b57' : '#666', padding: '6px 12px',
            borderRadius: 8, transition: 'all 0.15s'
          }}
        >
          <Camera size={20} strokeWidth={activeTab === 'scanner' ? 2.8 : 2} />
          <span style={{ fontSize: 10, fontWeight: activeTab === 'scanner' ? 800 : 600, whiteSpace: 'nowrap' }}>What is this?</span>
        </button>

        {/* 3. Virtual Labs */}
        <button
          onClick={() => onSelectSection('labs')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: activeTab === 'labs' ? '#12b3a4' : '#666', padding: '6px 12px',
            borderRadius: 8, transition: 'all 0.15s'
          }}
        >
          <Beaker size={20} strokeWidth={activeTab === 'labs' ? 2.8 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: activeTab === 'labs' ? 800 : 600 }}>Labs</span>
        </button>

        {/* 4. AI Tutor */}
        <button
          onClick={() => onSelectSection('mentor')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: activeTab === 'mentor' ? '#6b5be6' : '#666', padding: '6px 12px',
            borderRadius: 8, transition: 'all 0.15s'
          }}
        >
          <Bot size={20} strokeWidth={activeTab === 'mentor' ? 2.8 : 2} />
          <span style={{ fontSize: 10.5, fontWeight: activeTab === 'mentor' ? 800 : 600 }}>AI Tutor</span>
        </button>

        {/* 5. User Profile */}
        <button
          onClick={() => setShowProfile(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: '#666', padding: '6px 12px',
            borderRadius: 8, transition: 'all 0.15s'
          }}
        >
          <User size={20} />
          <span style={{ fontSize: 10.5, fontWeight: 600 }}>Profile</span>
        </button>
      </nav>

      {/* Profile Panel */}
      <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />

      {/* Auth Modal for Login & Registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(prof) => {
          if (prof) setProfile(prof);
        }}
      />
    </>
  );
}
