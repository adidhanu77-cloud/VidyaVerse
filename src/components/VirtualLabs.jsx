import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

/* ─── Discipline config ─────────────────────────────── */
const DISCIPLINES = [
  {
    key: 'physics',
    label: 'Physics',
    icon: '⚡',
    color: '#ff5b57',
    bg: '#fff0f0',
    desc: 'Circuits, Forces, Motion & Energy',
  },
  {
    key: 'chemistry',
    label: 'Chemistry',
    icon: '🧪',
    color: '#12b3a4',
    bg: '#f0fbfa',
    desc: 'Atoms, pH, States of Matter & Reactions',
  },
  {
    key: 'biology',
    label: 'Biology',
    icon: '🧬',
    color: '#6b5be6',
    bg: '#f4f2ff',
    desc: 'Cells, Genetics, Evolution & Neurons',
  },
  {
    key: 'mathematics',
    label: 'Mathematics',
    icon: '📐',
    color: '#ffc531',
    bg: '#fffbf0',
    desc: 'Fractions, Geometry, Graphs & Torque',
  },
];

/* ─── Inline styles (Memphis Neo-Brutalist) ─────────── */
const S = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    color: '#17140d',
    minHeight: '100%',
  },

  /* Section header */
  eyebrowRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#6b5be6',
    color: '#fff',
    border: '2px solid #17140d',
    borderRadius: 999,
    padding: '4px 14px',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '.06em',
    textTransform: 'uppercase',
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%', background: '#ffc531',
    border: '1.5px solid #17140d', display: 'inline-block',
  },
  headingLg: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(22px, 3vw, 32px)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 4,
  },
  subHead: { fontSize: 15, color: '#5a5450', maxWidth: 580, marginBottom: 32, lineHeight: 1.6 },

  /* Discipline tab strip */
  tabStrip: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  tab: (active, color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 22px',
    border: '2.5px solid #17140d',
    borderRadius: 999,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 15,
    background: active ? color : '#fff',
    color: active ? '#fff' : '#17140d',
    boxShadow: active ? `4px 4px 0 #17140d` : `2px 2px 0 #17140d`,
    transform: active ? 'translate(-1px,-1px)' : 'none',
    transition: 'all .15s ease',
    userSelect: 'none',
  }),

  /* Sim grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
    marginBottom: 40,
  },

  /* Sim card */
  card: (color) => ({
    border: '3px solid #17140d',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '8px 8px 0 #17140d',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform .15s ease, box-shadow .15s ease',
    cursor: 'default',
  }),
  cardHeader: (color) => ({
    background: color,
    padding: '14px 18px',
    borderBottom: '3px solid #17140d',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }),
  cardHeaderIcon: {
    width: 38, height: 38,
    background: 'rgba(255,255,255,.25)',
    border: '2px solid rgba(255,255,255,.6)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20,
  },
  cardHeaderTitle: {
    color: '#fff',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 800,
    fontSize: 15,
    lineHeight: 1.25,
    flex: 1,
  },
  cardBody: { padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  cardSubtitle: { fontSize: 13, color: '#4a4642', lineHeight: 1.5 },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: (color) => ({
    fontSize: 11, fontWeight: 700,
    background: color + '22',
    color: color,
    border: `1.5px solid ${color}`,
    borderRadius: 999,
    padding: '2px 10px',
  }),
  conceptBox: {
    background: '#f5efe2',
    border: '1.5px solid #d4c9b5',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 12,
    color: '#3a3530',
    lineHeight: 1.5,
  },
  villageBox: {
    background: '#efffed',
    border: '1.5px solid #12b3a4',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 12,
    color: '#096b62',
    lineHeight: 1.5,
  },
  villageLabel: { fontWeight: 700, marginRight: 4, color: '#096b62' },
  launchBtn: (color) => ({
    marginTop: 'auto',
    padding: '10px 0',
    border: '2.5px solid #17140d',
    borderRadius: 12,
    background: color,
    color: '#fff',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '4px 4px 0 #17140d',
    transition: 'transform .12s, box-shadow .12s',
    letterSpacing: '.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  }),

  /* Iframe panel */
  iframePanel: {
    border: '3px solid #17140d',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '10px 10px 0 #17140d',
    background: '#fff',
    marginBottom: 40,
  },
  iframeTopBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    background: '#17140d',
    borderBottom: '3px solid #17140d',
    flexWrap: 'wrap',
  },
  iframeTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 800,
    color: '#f5efe2',
    fontSize: 16,
    flex: 1,
  },
  iframeCloseBtn: {
    padding: '6px 16px',
    border: '2px solid #ffc531',
    borderRadius: 999,
    background: 'transparent',
    color: '#ffc531',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 13,
  },
  iframeFullBtn: {
    padding: '6px 16px',
    border: '2px solid #12b3a4',
    borderRadius: 999,
    background: 'transparent',
    color: '#12b3a4',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 13,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  iframeVillageBar: {
    background: '#efffed',
    borderBottom: '2px solid #17140d',
    padding: '8px 20px',
    fontSize: 13,
    color: '#096b62',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iframe: {
    width: '100%',
    height: 620,
    border: 'none',
    display: 'block',
  },
  iframeBackRow: {
    padding: '12px 20px',
    borderTop: '2px solid #e8e2d8',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#fafaf8',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 18px',
    border: '2.5px solid #17140d',
    borderRadius: 999,
    background: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '3px 3px 0 #17140d',
    transition: 'transform .12s, box-shadow .12s',
  },

  /* Loading / error */
  loadingBox: {
    textAlign: 'center',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  spinner: {
    width: 48, height: 48,
    border: '4px solid #e8e2d8',
    borderTopColor: '#6b5be6',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },

  /* Phet logo strip */
  phetAttrib: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 20px',
    background: '#17140d',
    borderRadius: 14,
    border: '2px solid #17140d',
    marginBottom: 32,
    fontSize: 13,
    color: '#c9bfaa',
  },
  phetLogo: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontWeight: 800,
    fontSize: 18,
    color: '#ffc531',
  },
};

/* ─── Component ─────────────────────────────────────── */
export default function VirtualLabs() {
  const [activeDiscipline, setActiveDiscipline] = useState('physics');
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSim, setActiveSim] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(false);
  const iframeRef = useRef(null);

  /* ── Fetch sims whenever discipline changes ── */
  useEffect(() => {
    setActiveSim(null);
    setLoading(true);
    setError(null);

    api.getPhetSimulations(activeDiscipline)
      .then((data) => {
        if (data?.status === 'success') {
          setSimulations(data.simulations || []);
        } else {
          setError('Could not load simulations. Is the backend running?');
        }
      })
      .catch(() => setError('Network error — make sure the backend is running on port 5000.'))
      .finally(() => setLoading(false));
  }, [activeDiscipline]);

  /* ── Launch a simulation ── */
  const handleLaunch = (sim) => {
    setActiveSim(sim);
    setIframeLoading(true);
    setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 50);
  };

  /* ── Current discipline meta ── */
  const disc = DISCIPLINES.find((d) => d.key === activeDiscipline);

  return (
    <div style={S.root}>
      {/* ── Spin animation ── */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Section eyebrow + heading ── */}
      <div style={S.eyebrowRow}>
        <span style={S.eyebrow}>
          <span style={S.dot} />
          FEATURE 2: ZERO-GLASSWARE PHET VIRTUAL LABS
        </span>
      </div>
      <h2 style={S.headingLg}>
        Your Village is a{' '}
        <span style={{ background: '#ffc531', padding: '0 6px', borderRadius: 6 }}>
          Science Lab
        </span>{' '}
        — No Glassware Needed.
      </h2>
      <p style={S.subHead}>
        Powered by PhET Interactive Simulations (University of Colorado Boulder). Run real
        physics circuits, chemistry reactions, biology models and maths explorers — all inside
        your browser for free.
      </p>

      {/* ── PhET attribution strip ── */}
      <div style={S.phetAttrib}>
        <span style={S.phetLogo}>PhET</span>
        <span>
          Simulations by{' '}
          <a
            href="https://phet.colorado.edu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#12b3a4', fontWeight: 700 }}
          >
            PhET Interactive Simulations
          </a>
          , University of Colorado Boulder — free, open-source, HTML5 &amp; Java simulations
          for science and maths education.
        </span>
      </div>

      {/* ── Discipline tab strip ── */}
      <div style={S.tabStrip}>
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            style={S.tab(activeDiscipline === d.key, d.color)}
            onClick={() => setActiveDiscipline(d.key)}
            onMouseEnter={(e) => {
              if (activeDiscipline !== d.key) {
                e.currentTarget.style.transform = 'translate(-1px,-1px)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #17140d';
              }
            }}
            onMouseLeave={(e) => {
              if (activeDiscipline !== d.key) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '2px 2px 0 #17140d';
              }
            }}
          >
            <span style={{ fontSize: 20 }}>{d.icon}</span>
            {d.label}
          </button>
        ))}
      </div>

      {/* ── Discipline subtitle ── */}
      {disc && (
        <p style={{ fontSize: 14, color: '#5a5450', marginBottom: 24, marginTop: -16 }}>
          <strong style={{ color: disc.color }}>{disc.icon} {disc.label}:</strong>{' '}
          {disc.desc}
        </p>
      )}

      {/* ── PhET iframe panel (shown when a sim is active) ── */}
      {activeSim && (
        <div style={S.iframePanel}>
          {/* Top bar */}
          <div style={S.iframeTopBar}>
            <div style={S.iframeTitle}>
              {disc?.icon} {activeSim.title}
            </div>
            <a
              href={activeSim.phetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={S.iframeFullBtn}
            >
              🔗 Full Tab
            </a>
            <button style={S.iframeCloseBtn} onClick={() => setActiveSim(null)}>
              ✕ Close
            </button>
          </div>

          {/* Village connection bar */}
          <div style={S.iframeVillageBar}>
            <span style={{ fontSize: 18 }}>🏡</span>
            <strong>Village Connection:</strong> {activeSim.villageLink}
          </div>

          {/* The PhET iframe */}
          {iframeLoading && (
            <div
              style={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 14,
                color: '#5a5450',
                borderBottom: '1px solid #e8e2d8',
              }}
            >
              <div style={S.spinner} /> Loading PhET simulation…
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={activeSim.phetUrl}
            title={activeSim.title}
            style={{ ...S.iframe, display: iframeLoading ? 'none' : 'block' }}
            allow="fullscreen"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
          />

          {/* Bottom back row */}
          <div style={S.iframeBackRow}>
            <button
              style={S.backBtn}
              onClick={() => setActiveSim(null)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px,-1px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #17140d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '3px 3px 0 #17140d';
              }}
            >
              ← Back to Simulations
            </button>
            <span style={{ fontSize: 13, color: '#5a5450' }}>
              Concept: <strong>{activeSim.concept}</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Simulation card grid ── */}
      {!activeSim && (
        <>
          {loading && (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <span style={{ fontSize: 15, color: '#5a5450' }}>
                Loading {disc?.label} simulations…
              </span>
            </div>
          )}

          {error && !loading && (
            <div
              style={{
                padding: 24,
                border: '2.5px solid #ff5b57',
                borderRadius: 16,
                background: '#fff0f0',
                color: '#c0392b',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24 }}>⚠️</span> {error}
            </div>
          )}

          {!loading && !error && (
            <div style={S.grid}>
              {simulations.map((sim) => (
                <SimCard
                  key={sim.id}
                  sim={sim}
                  color={sim.color || disc?.color || '#6b5be6'}
                  onLaunch={() => handleLaunch(sim)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Bottom info strip ── */}
      <div
        style={{
          borderTop: '2px solid #e8e2d8',
          paddingTop: 20,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          fontSize: 13,
          color: '#7a7068',
        }}
      >
        <span>
          🌐 <strong>Works offline?</strong> Download PhET app from phet.colorado.edu/en/offline-access.html
        </span>
        <span>
          🗣 <strong>Languages:</strong> PhET sims include Hindi, Kannada, Telugu, Tamil &amp; Marathi interfaces.
        </span>
        <span>
          📱 <strong>Mobile-friendly:</strong> All HTML5 sims run on Android/iOS browsers.
        </span>
      </div>
    </div>
  );
}

/* ─── SimCard sub-component ─────────────────────────── */
function SimCard({ sim, color, onLaunch }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...S.card(color),
        transform: hovered ? 'translate(-3px, -3px)' : 'none',
        boxShadow: hovered ? '11px 11px 0 #17140d' : '8px 8px 0 #17140d',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card header */}
      <div style={S.cardHeader(color)}>
        <div style={S.cardHeaderIcon}>
          {color === '#ff5b57' ? '⚡' :
           color === '#12b3a4' ? '🧪' :
           color === '#6b5be6' ? '🧬' :
           color === '#ffc531' ? '📐' :
           color === '#2bd980' ? '🌿' :
           color === '#3aa0ff' ? '💧' : '🔬'}
        </div>
        <span style={S.cardHeaderTitle}>{sim.title}</span>
      </div>

      {/* Card body */}
      <div style={S.cardBody}>
        <p style={S.cardSubtitle}>{sim.subtitle}</p>

        {/* Badges */}
        <div style={S.badgeRow}>
          <span style={S.badge(color)}>🎓 {sim.grade}</span>
          <span style={S.badge('#17140d')}>PhET Sim</span>
        </div>

        {/* Concept box */}
        <div style={S.conceptBox}>
          <strong>📘 Concepts: </strong>{sim.concept}
        </div>

        {/* Village connection */}
        <div style={S.villageBox}>
          <span style={S.villageLabel}>🏡 Village Link:</span>
          {sim.villageLink}
        </div>

        {/* Launch button */}
        <button
          style={S.launchBtn(color)}
          onClick={onLaunch}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 #17140d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '4px 4px 0 #17140d';
          }}
        >
          ▶ Launch Simulation
        </button>
      </div>
    </div>
  );
}
