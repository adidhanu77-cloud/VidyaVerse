import React, { useState } from 'react';
import {
  Camera, Beaker, Compass, BookOpen, Bot, MapPin, Trophy,
  Layers, ArrowLeft, ChevronRight,
} from 'lucide-react';

import InteractiveScanner from './InteractiveScanner';
import VirtualLabs from './VirtualLabs';
import TreasureHunt from './TreasureHunt';
import StoryMode from './StoryMode';
import AiTutor from './AiTutor';
import CareerNavigator from './CareerNavigator';
import LeaderboardAndDashboards from './LeaderboardAndDashboards';

/* ─── Tab definitions (7 Core Modules) ───────────────────────────── */
const BASE_TABS = [
  { id: 'scanner',   title: 'Object Scanner',        subtitle: 'Point your camera at any everyday object to decode STEM', badge: 'AI Vision',   color: '#ff5b57', bg: '#fff0f0', icon: Camera,    emoji: '📷' },
  { id: 'labs',      title: 'Virtual Labs',           subtitle: 'Zero-glassware PhET simulations for every science subject', badge: 'PhET Sims',   color: '#12b3a4', bg: '#f0fbfa', icon: Beaker,    emoji: '🧪' },
  { id: 'hunt',      title: 'Treasure Hunt',          subtitle: 'AI quiz quest paths with XP, streaks & badges',             badge: 'Gemini AI',   color: '#ffc531', bg: '#fffbf0', icon: Compass,   emoji: '🧭' },
  { id: 'stories',   title: 'StoryVerse Learning',    subtitle: 'Disney/Pixar cartoon adventures, voice narration, decisions & labs', badge: 'StoryVerse',  color: '#3aa0ff', bg: '#f0f7ff', icon: BookOpen,  emoji: '🎬' },
  { id: 'mentor',    title: 'MentorAI — Intelligent STEM Tutor', subtitle: 'Adaptive Socratic teacher, concept gap detector & multi-modal learning guide', badge: 'MentorAI',     color: '#6b5be6', bg: '#f4f2ff', icon: Bot,       emoji: '🤖' },
  { id: 'careers',   title: 'Career Navigator',       subtitle: 'From village curiosity to real research career roadmaps',   badge: 'Roadmaps',    color: '#2bd980', bg: '#efffed', icon: MapPin,    emoji: '🎯' },
  { id: 'analytics', title: 'Leaderboards & Gaps',    subtitle: 'School league tables & student concept gap analytics',      badge: 'Class Tool',  color: '#ff5b57', bg: '#fff0f0', icon: Trophy,    emoji: '🏆' },
];

/* ─── Full-page wrapper for each feature ───────────────────────── */
function FeaturePage({ tab, onBack, currentLang, onSelectTab }) {
  return (
    <div style={{ minHeight: '100vh', background: tab.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Feature hero banner */}
      <div style={{
        background: tab.color, borderBottom: '3px solid #17140d',
        padding: '0',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Back button */}
          <button onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', border: '2.5px solid #17140d', borderRadius: 999,
              background: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              boxShadow: '4px 4px 0 #17140d', flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #17140d'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 #17140d'; }}>
            <ArrowLeft size={16} />
            All Features
          </button>

          {/* Feature icon */}
          <div style={{
            width: 56, height: 56, background: 'rgba(255,255,255,.25)',
            border: '3px solid rgba(255,255,255,.7)', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            {tab.emoji}
          </div>

          {/* Title + subtitle */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(20px,3vw,30px)', color: '#fff', margin: 0, lineHeight: 1.1 }}>
                {tab.title}
              </h1>
              <span style={{ background: 'rgba(255,255,255,.25)', color: '#fff', border: '2px solid rgba(255,255,255,.6)', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {tab.badge}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,.88)', fontSize: 15, margin: '4px 0 0', fontWeight: 500 }}>
              {tab.subtitle}
            </p>
          </div>

          {/* VidyaVerse badge */}
          <div style={{ background: 'rgba(255,255,255,.18)', border: '2px solid rgba(255,255,255,.5)', borderRadius: 12, padding: '6px 14px', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            VidyaVerse
          </div>
        </div>
      </div>

      {/* Full-width content area */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 32px 80px' }}>
        {tab.id === 'scanner'   && <InteractiveScanner currentLang={currentLang} />}
        {tab.id === 'labs'      && <VirtualLabs />}
        {tab.id === 'hunt'      && <TreasureHunt />}
        {tab.id === 'stories'   && <StoryMode />}
        {tab.id === 'mentor'    && <AiTutor currentLang={currentLang} onNavigate={onSelectTab} />}
        {tab.id === 'careers'   && <CareerNavigator />}
        {tab.id === 'analytics' && <LeaderboardAndDashboards />}
      </div>
    </div>
  );
}

/* ─── Home: Feature Grid (shown when no tab selected) ──────────── */
function FeatureGrid({ tabs, onSelect }) {
  return (
    <section id="studio" style={{ paddingTop: 36, paddingBottom: 80 }}>
      <div className="container-1440">

        {/* Hero header */}
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto 20px auto' }}>
          <div className="eyebrow-pill" style={{ backgroundColor: '#6b5be6', color: '#fff', marginBottom: 18 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffc531', border: '1.5px solid #17140d' }} />
            ⚡ POCKET SCIENCE LAB FOR 100M+ RURAL & UNDERSERVED STUDENTS
          </div>

          <h1 style={{ fontSize: 'clamp(34px, 4.5vw, 62px)', lineHeight: 1.05, marginBottom: 18, letterSpacing: '-0.035em' }}>
            Bringing a <span className="marker-highlight">Universe of Learning</span> to{' '}
            <span className="marker-highlight teal">Every Village.</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,1.2vw,18px)', color: '#444', lineHeight: 1.65, maxWidth: 740, margin: '0 auto 24px auto' }}>
            No expensive glassware required. Click any feature below to open it in full-screen mode — scan objects, run PhET experiments, hunt for STEM treasures, and more.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { text: '🎮 Gamified Learning', bg: '#fff' },
              { text: '🚀 Future Roadmaps', bg: '#fff' },
              { text: '🗣️ 6 Indic Languages', bg: '#fff' },
              { text: '✓ 100% Free & Offline Ready', bg: '#2bd980' },
            ].map(p => (
              <span key={p.text} style={{ background: p.bg, border: '2px solid #17140d', padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 700, boxShadow: '2px 2px 0 #17140d' }}>{p.text}</span>
            ))}
          </div>
        </div>

        {/* Clean, spacious divider between trust pills and feature modules */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '64px auto 40px auto', maxWidth: 800 }}>
          <div style={{ height: 3, flex: 1, backgroundColor: '#17140d', borderRadius: 999 }} />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#ffffff',
              border: '2.5px solid #17140d',
              borderRadius: 9999,
              padding: '6px 20px',
              boxShadow: '3px 3px 0 #17140d',
              fontSize: 12.5,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#17140d',
            }}
          >
            <span>🔬</span>
            <span>Select a Laboratory Module</span>
            <span style={{ backgroundColor: '#ffc531', padding: '1px 8px', borderRadius: 6, border: '1.5px solid #17140d', fontSize: 11 }}>
              7 Modules
            </span>
          </div>
          <div style={{ height: 3, flex: 1, backgroundColor: '#17140d', borderRadius: 999 }} />
        </div>

        {/* Feature Cards Grid (7 Core Modules) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28, marginBottom: 40 }}>
          {tabs.map((tab, i) => (
            <FeatureCard key={tab.id} tab={tab} index={i} onSelect={() => onSelect(tab.id)} />
          ))}
        </div>

        {/* Bottom tip */}
        <div style={{ textAlign: 'center', fontSize: 14, color: '#7a7068', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Layers size={16} color="#6b5be6" />
          Click any card above to open the full feature — each opens as a dedicated full-width page.
          <ChevronRight size={16} color="#6b5be6" />
        </div>
      </div>
    </section>
  );
}

/* ─── Individual Feature Card ───────────────────────────────────── */
function FeatureCard({ tab, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = tab.icon;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '3px solid #17140d', borderRadius: 20, background: '#fff',
        padding: 0, cursor: 'pointer', textAlign: 'left', overflow: 'hidden',
        boxShadow: hovered ? '10px 10px 0 #17140d' : '6px 6px 0 #17140d',
        transform: hovered ? 'translate(-3px,-3px)' : 'none',
        transition: 'all .18s cubic-bezier(0.2,0,0,1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'DM Sans', sans-serif",
      }}>

      {/* Colored header band */}
      <div style={{ background: tab.color, borderBottom: '3px solid #17140d', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,.25)', border: '2px solid rgba(255,255,255,.65)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconComponent size={26} color="#fff" strokeWidth={2.4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>{tab.title}</div>
          <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,.25)', color: '#fff', border: '1.5px solid rgba(255,255,255,.5)', borderRadius: 999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            {tab.badge}
          </span>
        </div>
        {/* Arrow indicator */}
        <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,.2)', border: '2px solid rgba(255,255,255,.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: hovered ? 'scale(1.15)' : 'none', transition: 'transform .15s' }}>
          <ChevronRight size={18} color="#fff" />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 14, color: '#4a4642', lineHeight: 1.6, margin: 0 }}>{tab.subtitle}</p>

        {/* Feature highlights (small pills) */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
          {getFeatureHighlights(tab.id).map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, background: tab.bg, color: tab.color, border: `1.5px solid ${tab.color}`, borderRadius: 999, padding: '2px 8px' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Open button */}
        <div style={{
          marginTop: 8, padding: '10px 16px', background: hovered ? tab.color : '#f5efe2',
          border: '2.5px solid #17140d', borderRadius: 12,
          fontWeight: 800, fontSize: 14, color: hovered ? '#fff' : '#17140d',
          transition: 'all .18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: hovered ? '3px 3px 0 #17140d' : '2px 2px 0 #17140d',
        }}>
          Open {tab.title} <ChevronRight size={16} />
        </div>
      </div>
    </button>
  );
}

function getFeatureHighlights(id) {
  const map = {
    scanner:   ['📸 Live Camera', '🤖 AI Identify', '🔬 STEM Explain', '🎙 Voice Readout'],
    labs:      ['⚡ PhET Sims', '🧪 Chemistry', '🧬 Biology', '📐 Maths'],
    hunt:      ['🗺 Path Map', '🤖 Gemini Q&A', '🔥 Streaks', '🏆 Badges'],
    stories:   ['🎬 Pixar Cartoon', '🗣 Voice Narration', '🎮 RPG Decisions', '🧪 PhET Labs'],
    mentor:    ['🗣 Voice Input', '🌐 6 Languages', '💡 Socratic', '🤖 Dr. APJ'],
    careers:   ['🎯 Roadmaps', '🏡 Village Jobs', '📈 STEM Paths', '💼 Guidance'],
    analytics: ['🏆 School League', '📊 Concept Gaps', '📡 Real-Time', '👩‍🏫 Teacher View'],
  };
  return map[id] || [];
}

/* ─── Main PocketLabStudio ──────────────────────────────────────── */
export default function PocketLabStudio({ currentLang, activeTabId, onSelectTab }) {
  const [currentTab, setCurrentTab] = useState(null); // null = home / grid view

  // If parent sets activeTabId, open that tab
  React.useEffect(() => {
    if (activeTabId && activeTabId !== currentTab) {
      setCurrentTab(activeTabId);
    }
  }, [activeTabId]);

  function openTab(id) {
    setCurrentTab(id);
    if (onSelectTab) onSelectTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goHome() {
    setCurrentTab(null);
    if (onSelectTab) onSelectTab(null);
    setTimeout(() => {
      const el = document.getElementById('studio');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  const activeTabObj = BASE_TABS.find(t => t.id === currentTab);

  // ── Full-page feature view
  if (currentTab && activeTabObj) {
    return (
      <FeaturePage tab={activeTabObj} onBack={goHome} currentLang={currentLang} onSelectTab={openTab} />
    );
  }

  // ── Home: feature grid
  return (
    <FeatureGrid tabs={BASE_TABS} onSelect={openTab} />
  );
}
