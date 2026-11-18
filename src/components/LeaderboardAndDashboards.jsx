import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, WifiOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LeaderboardAndDashboards() {
  const [offlineMode, setOfflineMode] = useState(false);

  const schoolRankings = [
    { rank: 1, name: 'Govt High School Doddaballapura (Karnataka)', points: 9420, badges: 48, trend: '+350 pts this week', color: '#ffc531' },
    { rank: 2, name: 'Zilla Parishad High School Warangal (Telangana)', points: 8950, badges: 42, trend: '+280 pts this week', color: '#12b3a4' },
    { rank: 3, name: 'Govt Model Higher Secondary School Salem (Tamil Nadu)', points: 8410, badges: 39, trend: '+410 pts this week', color: '#ff5b57' },
    { rank: 4, name: 'Kasturba Gandhi Balika Vidyalaya Varanasi (UP)', points: 7980, badges: 35, trend: '+220 pts this week', color: '#6b5be6' },
  ];

  return (
    <section style={{ padding: '70px 0', borderTop: '3px solid #17140d' }}>
      <div className="container-1440">
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 48px auto' }}>
          <div className="eyebrow-pill" style={{ backgroundColor: '#2bd980', color: '#17140d', marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#17140d', border: '1.5px solid #17140d' }} />
            COMMUNITY & TEACHER DASHBOARD
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', marginBottom: 12 }}>
            Healthy school rivalries.{' '}
            <span className="marker-highlight teal">Actionable insights for teachers.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#444' }}>
            Drive student motivation with state-wide school competitions and empower teachers with AI concept gap analysis.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(20px, 3vw, 36px)',
          }}
        >
          {/* ================= 1. SCHOOL VS SCHOOL LEADERBOARD ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#ffc531',
                    border: '2px solid #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy size={24} color="#17140d" />
                </div>
                <div>
                  <h3 style={{ fontSize: 22 }}>School vs School Championship</h3>
                  <p style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Rural STEM League • Term 2</p>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#ff5b57',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                LIVE
              </span>
            </div>

            {/* School Rank List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {schoolRankings.map((sch) => (
                <div
                  key={sch.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid #17140d',
                    backgroundColor: sch.rank === 1 ? '#fff9e6' : '#f5efe2',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: sch.color,
                        color: sch.color === '#ff5b57' ? '#fff' : '#17140d',
                        border: '2px solid #17140d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                      }}
                    >
                      #{sch.rank}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5, color: '#17140d' }}>{sch.name}</div>
                      <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>{sch.trend}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#17140d' }}>
                      {sch.points.toLocaleString()} pts
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#12b3a4' }}>
                      {sch.badges} Badges
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 2. TEACHER CONCEPT GAP ANALYTICS ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#12b3a4',
                    border: '2px solid #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={24} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: 22 }}>AI Concept Gap Detection</h3>
                  <p style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Teacher Analytics • Class 8-B</p>
                </div>
              </div>
            </div>

            {/* Gap Analysis Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span>Friction & Surface Resistance (Bicycle/Shoes)</span>
                  <span style={{ color: '#2bd980', fontWeight: 800 }}>92% Mastery ★</span>
                </div>
                <div style={{ height: 12, backgroundColor: '#f5efe2', borderRadius: 9999, border: '2px solid #17140d', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', backgroundColor: '#2bd980' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span>Photosynthesis & Stomatal Respiration</span>
                  <span style={{ color: '#ffc531', fontWeight: 800 }}>78% Good</span>
                </div>
                <div style={{ height: 12, backgroundColor: '#f5efe2', borderRadius: 9999, border: '2px solid #17140d', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', backgroundColor: '#ffc531' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <span>Gear Torque & Angular Velocity (Needs Attention)</span>
                  <span style={{ color: '#ff5b57', fontWeight: 800 }}>46% Alert ⚠️</span>
                </div>
                <div style={{ height: 12, backgroundColor: '#f5efe2', borderRadius: 9999, border: '2px solid #17140d', overflow: 'hidden' }}>
                  <div style={{ width: '46%', height: '100%', backgroundColor: '#ff5b57' }} />
                </div>
              </div>
            </div>

            {/* Offline Mode Switcher */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                border: '2px solid #17140d',
                backgroundColor: offlineMode ? '#fffae5' : '#f5efe2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <WifiOff size={22} color={offlineMode ? '#ff5b57' : '#17140d'} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>Low-Connectivity Offline Mode</div>
                  <div style={{ fontSize: 11, color: '#666' }}>
                    {offlineMode ? 'Saved 24 Lessons & 3 Labs to Device Storage' : 'Click to cache lessons for offline village use'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOfflineMode(!offlineMode)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  backgroundColor: offlineMode ? '#2bd980' : '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {offlineMode ? 'OFFLINE READY' : 'CACHE NOW'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
