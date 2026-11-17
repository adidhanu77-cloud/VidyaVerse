import React, { useState, useEffect } from 'react';
import { Microscope, Globe, Sparkles, Layers, ChevronDown } from 'lucide-react';
import { realtime } from '../services/realtime';
import UserProfilePanel from './UserProfilePanel';

export default function Navbar({ currentLang, setLang, onOpenScanner, onSelectSection, onGoHome, activeTab }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({ name: '', avatar: null });
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    realtime.connect();
    const unsub = realtime.on('STATUS_CHANGE', ({ connected }) => setIsWsConnected(connected));
    return unsub;
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
    { id: 'scanner',    label: 'Object Scanner',        icon: '📷', tag: 'Vision' },
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
        <div className="container-1440" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>

          {/* Brand Left */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onGoHome) onGoHome();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div style={{ width: 44, height: 44, backgroundColor: '#ffc531', borderRadius: 12, border: '3px solid #17140d', boxShadow: '4px 4px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Microscope size={24} color="#17140d" strokeWidth={2.6} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#17140d', letterSpacing: '-0.03em' }}>
              Vidya<span style={{ color: '#ff5b57' }}>Verse</span>
            </span>
          </button>

          {/* Center: Module Selector & Quick Back */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Real-time WS indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: isWsConnected ? '#e8fbf2' : '#fff2f1', border: '2px solid #17140d', padding: '5px 10px', borderRadius: 9999, fontSize: 11.5, fontWeight: 800, boxShadow: '2px 2px 0 #17140d' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isWsConnected ? '#2bd980' : '#ff5b57', display: 'inline-block', boxShadow: isWsConnected ? '0 0 6px #2bd980' : 'none' }} />
              <span>{isWsConnected ? 'REAL-TIME LIVE' : 'WS CONNECTING'}</span>
            </div>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: 9999, border: '3px solid #17140d', boxShadow: '3px 3px 0 #17140d' }}>
              <Globe size={16} color="#17140d" />
              <select value={currentLang} onChange={e => setLang(e.target.value)} style={{ border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#17140d', cursor: 'pointer', outline: 'none' }}>
                {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            {/* Try Scanner CTA */}
            <button onClick={onOpenScanner} className="btn-candy teal" style={{ fontSize: 14, padding: '10px 18px' }}>
              <Sparkles size={16} />
              Try Scanner
            </button>

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
        </div>
      </header>

      {/* Profile Panel */}
      <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
