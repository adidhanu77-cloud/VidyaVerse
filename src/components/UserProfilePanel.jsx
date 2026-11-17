import { useState, useEffect, useRef } from 'react';
import { API_BASE as API } from '../services/api';
import AuthModal from './AuthModal';
import { logoutUser } from '../services/authService';

const GRADE_OPTIONS = ['Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];
const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
];

const AVATAR_COLORS = ['#ff5b57','#12b3a4','#6b5be6','#ffc531','#3aa0ff','#2bd980'];
function getAvatarColor(name) {
  if (!name) return '#6b5be6';
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const BADGE_EMOJI = { first_quest:'🎯', streak_3:'🌶️', week_warrior:'🔥', streak_30:'🏅', speed_demon:'⚡', perfect_score:'💯', physics_hero:'⚛️', chemistry_wizard:'🧪', bio_expert:'🧬', math_genius:'📐', xp_500:'🌟', xp_2000:'🏆' };
const BADGE_NAME = { first_quest:'First Quest', streak_3:'Hot Streak', week_warrior:'Week Warrior', streak_30:'Month Master', speed_demon:'Speed Demon', perfect_score:'Perfect Score', physics_hero:'Physics Hero', chemistry_wizard:'Chemistry Wizard', bio_expert:'Bio Expert', math_genius:'Math Genius', xp_500:'XP Explorer', xp_2000:'XP Legend' };

export default function UserProfilePanel({ isOpen, onClose }) {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState({ name: '', username: '', avatar: null, bio: '', school: '', grade: '', language: 'en', email: '', phone: '', provider: '' });
  const [progress, setProgress] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    let uid = localStorage.getItem('vidyaverse_userId') || localStorage.getItem('stemverse_userId');
    if (!uid) { uid = 'user_' + Date.now(); localStorage.setItem('vidyaverse_userId', uid); }
    setUserId(uid);
  }, []);

  // Listen to real-time auth changes across components
  useEffect(() => {
    function handleAuthUpdate(e) {
      if (e.detail) {
        setProfile(e.detail);
        if (e.detail.userId) setUserId(e.detail.userId);
      }
    }
    window.addEventListener('vidyaverse_auth_update', handleAuthUpdate);
    return () => window.removeEventListener('vidyaverse_auth_update', handleAuthUpdate);
  }, []);

  useEffect(() => {
    if (!isOpen || !userId) return;
    const cached = localStorage.getItem('vidyaverse_profile') || localStorage.getItem('stemverse_profile');
    if (cached) { try { setProfile(JSON.parse(cached)); } catch {} }
    fetch(`${API}/user/profile/${userId}`).then(r => r.json())
      .then(d => { if (d.profile) { setProfile(d.profile); localStorage.setItem('vidyaverse_profile', JSON.stringify(d.profile)); }}).catch(() => {});
    fetch(`${API}/treasure-hunt/progress/${userId}`).then(r => r.json())
      .then(d => { if (d.progress) { setProgress(d.progress); localStorage.setItem('vidyaverse_progress', JSON.stringify(d.progress)); }}).catch(() => {});
  }, [isOpen, userId]);

  function startEdit() { setForm({ ...profile }); setEditing(true); }

  async function saveProfile() {
    setSaving(true);
    const updated = { ...form, userId };
    try {
      const res = await fetch(`${API}/user/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      const data = await res.json();
      setProfile(data.profile);
      localStorage.setItem('vidyaverse_profile', JSON.stringify(data.profile));
      setEditing(false);
      showToast('Profile saved! ✅');
    } catch { showToast('Could not save. Backend offline?'); }
    setSaving(false);
  }

  function handleAvatarFile(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result;
      const updated = { ...profile, avatar: b64, userId };
      setProfile(updated); localStorage.setItem('vidyaverse_profile', JSON.stringify(updated));
      try { await fetch(`${API}/user/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }); } catch {}
      showToast('Avatar updated! 📸');
    };
    reader.readAsDataURL(file);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2800); }

  const totalLevels = progress ? Object.values(progress.completedLevels || {}).flat().length : 0;
  const totalXP = progress?.totalXP || 0;
  const streak = progress?.streak || 0;
  const badgeList = progress?.badges || [];
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]; });
  const actLog = progress?.activityLog || [];

  if (!isOpen) return null;

  const inp = { width: '100%', border: '2px solid #17140d', borderRadius: 10, padding: '8px 10px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, boxSizing: 'border-box' };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(23,20,13,.5)', zIndex: 400, backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, width: 400, height: '100vh', background: '#f5efe2', borderLeft: '3px solid #17140d', boxShadow: '-10px 0 0 #17140d', zIndex: 401, display: 'flex', flexDirection: 'column', overflowY: 'auto', fontFamily: "'DM Sans', sans-serif", color: '#17140d' }}>

        {/* Header */}
        <div style={{ background: '#17140d', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18, color: '#ffc531', flex: 1 }}>👤 My Profile</span>
          <button onClick={onClose} style={{ background: 'none', border: '2px solid #ff5b57', color: '#ff5b57', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>

        {toast && (<div style={{ background: '#2bd980', color: '#17140d', fontWeight: 800, fontSize: 14, padding: '8px 20px', textAlign: 'center', borderBottom: '2px solid #17140d' }}>{toast}</div>)}

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Avatar + Name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div onClick={() => fileRef.current.click()} style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid #17140d', boxShadow: '5px 5px 0 #17140d', overflow: 'hidden', cursor: 'pointer', background: getAvatarColor(profile.name), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile.avatar ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{getInitials(profile.name)}</span>}
              </div>
              <div onClick={() => fileRef.current.click()} style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, background: '#ffc531', border: '2px solid #17140d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>📸</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20 }}>{profile.name || 'Set Your Name'}</div>
            {profile.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: 12.5, color: '#444', fontWeight: 600 }}>✉️ {profile.email}</span>
                {profile.provider === 'google' && (
                  <span style={{ background: '#e8f0fe', color: '#1a73e8', border: '1.5px solid #1a73e8', padding: '1px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 800 }}>
                    Gmail Verified ✅
                  </span>
                )}
              </div>
            )}
            {profile.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 12.5, color: '#444', fontWeight: 600 }}>📱 {profile.phone}</span>
                <span style={{ background: '#e6f4ea', color: '#137333', border: '1.5px solid #137333', padding: '1px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 800 }}>
                  Phone Verified
                </span>
              </div>
            )}
            {profile.parentPhone && (
              <div style={{ fontSize: 12, color: '#444', fontWeight: 600, marginTop: 3 }}>
                👨‍👩‍👦 Parent WhatsApp: <strong>{profile.parentPhone}</strong>
              </div>
            )}
            {profile.username && <div style={{ fontSize: 13, color: '#7a7068', marginTop: 2 }}>@{profile.username}</div>}
            {profile.school && <div style={{ fontSize: 12, color: '#5a5450', marginTop: 2 }}>🏫 {profile.school} · {profile.grade}</div>}
            
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {!editing && (
                <button onClick={startEdit} style={{ padding: '6px 14px', border: '2px solid #17140d', borderRadius: 999, background: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '2px 2px 0 #17140d' }}>
                  ✏️ Edit Details
                </button>
              )}
              <button
                onClick={() => setShowAuthModal(true)}
                style={{ padding: '6px 14px', border: '2px solid #17140d', borderRadius: 999, background: '#ffc531', fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '2px 2px 0 #17140d' }}
              >
                {profile.email || profile.phone ? '🔄 Switch Account' : '🔑 Log In / Register'}
              </button>
              {(profile.email || profile.name) && (
                <button
                  onClick={async () => {
                    await logoutUser();
                    setProfile({ name: '', username: '', avatar: null, bio: '', school: '', grade: '', language: 'en', email: '', phone: '', provider: '' });
                    showToast('Logged out 👋');
                  }}
                  style={{ padding: '6px 12px', border: '2px solid #ff5b57', borderRadius: 999, background: '#fff0f0', color: '#ff5b57', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                >
                  🚪 Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div style={{ background: '#fff', border: '2.5px solid #17140d', borderRadius: 18, padding: 16, boxShadow: '5px 5px 0 #17140d' }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>✏️ Edit Profile</div>
              {[{ key:'name', label:'Full Name', ph:'e.g. Raju Kumar' }, { key:'username', label:'Username', ph:'e.g. raju_science' }, { key:'school', label:'School', ph:'Govt High School...' }, { key:'parentName', label:'Parent Name', ph:'e.g. Ramesh Kumar' }, { key:'parentPhone', label:'Parent WhatsApp / Phone', ph:'e.g. +91 98765 43210' }].map(f => (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#7a7068', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>{f.label}</label>
                  <input value={form[f.key] || ''} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} placeholder={f.ph} style={inp} />
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#7a7068', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Bio</label>
                <textarea value={form.bio || ''} onChange={e => setForm(x => ({ ...x, bio: e.target.value }))} placeholder="I love science..." maxLength={150} style={{ ...inp, resize: 'none', height: 60 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#7a7068', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Grade</label>
                  <select value={form.grade || ''} onChange={e => setForm(x => ({ ...x, grade: e.target.value }))} style={{ ...inp, background: '#fff' }}>
                    <option value="">Select</option>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#7a7068', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>Language</label>
                  <select value={form.language || 'en'} onChange={e => setForm(x => ({ ...x, language: e.target.value }))} style={{ ...inp, background: '#fff' }}>
                    {LANG_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setEditing(false)} style={{ flex: 1, padding: 9, border: '2px solid #17140d', borderRadius: 12, background: '#fff', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveProfile} disabled={saving} style={{ flex: 1, padding: 9, border: '2px solid #17140d', borderRadius: 12, background: '#12b3a4', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '3px 3px 0 #17140d' }}>
                  {saving ? 'Saving…' : '💾 Save'}
                </button>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[{ emoji:'🌟', value: totalXP, label:'Total XP', color:'#ffc531' }, { emoji:'🔥', value:`${streak}d`, label:'Streak', color:'#ff5b57' }, { emoji:'🏅', value: totalLevels, label:'Levels', color:'#6b5be6' }].map(s => (
              <div key={s.label} style={{ border: '2.5px solid #17140d', borderRadius: 14, padding: '10px 8px', background: '#fff', boxShadow: '3px 3px 0 #17140d', textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#7a7068' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Streak Calendar */}
          <div style={{ background: '#fff', border: '2.5px solid #17140d', borderRadius: 16, padding: '14px 16px', boxShadow: '4px 4px 0 #17140d' }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 10 }}>📅 Last 7 Days</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {last7.map(date => {
                const active = actLog.includes(date);
                const day = new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).slice(0, 2);
                return (
                  <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: active ? '#ffc531' : '#e8e2d8', border: `2px solid ${active ? '#17140d' : '#d4c9b5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {active ? '🔥' : ''}
                    </div>
                    <span style={{ fontSize: 9, color: '#7a7068', fontWeight: 700 }}>{day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontWeight: 800, fontSize: 12, color: streak > 0 ? '#ff5b57' : '#7a7068', textAlign: 'center' }}>
              {streak > 0 ? `🔥 ${streak} day streak! Keep it up!` : 'Complete a level today to start your streak!'}
            </div>
          </div>

          {/* Badges */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>🏆 My Badges ({badgeList.length})</div>
            {badgeList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                {badgeList.map(bId => (
                  <div key={bId} style={{ background: '#ffc531', border: '2.5px solid #17140d', borderRadius: 14, padding: '10px 12px', boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{BADGE_EMOJI[bId] || '🎖️'}</span>
                    <div style={{ fontWeight: 800, fontSize: 12 }}>{BADGE_NAME[bId] || bId}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: '#7a7068', fontSize: 13, border: '2px dashed #d4c9b5', borderRadius: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>🔒</div>
                Complete levels to earn badges!
              </div>
            )}
          </div>

          {/* User ID footer */}
          <div style={{ background: '#e8e2d8', border: '2px solid #d4c9b5', borderRadius: 12, padding: '10px 14px', fontSize: 11, color: '#7a7068' }}>
            <strong>User ID:</strong> {userId}
          </div>
        </div>
      </div>

      {/* Auth Modal for Login / Registration */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(newProf) => {
          if (newProf) {
            setProfile(newProf);
            if (newProf.userId) setUserId(newProf.userId);
            showToast(`Welcome, ${newProf.name}! 🎉`);
          }
        }}
      />
    </>
  );
}
