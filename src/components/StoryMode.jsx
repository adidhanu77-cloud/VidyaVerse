import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX,
  ChevronRight, Award, Compass, ArrowLeft, Wand2, BarChart3,
  CheckCircle2, AlertCircle, HelpCircle, User, Zap, Film, Beaker,
  Maximize2, Eye, Flame, Star, Video, Clapperboard, Copy, Check,
  ExternalLink, Layers, MonitorPlay
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { api } from '../services/api';
import { CURATED_STORIES } from '../data/curatedStories';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

/* ─── Animated Cartoon Scene Backgrounds ────────────────────────── */
const SCENE_THEMES = {
  forest: {
    name: 'Sacred Banyan Forest',
    gradient: 'linear-gradient(180deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    decorations: ['🍃', '🌿', '☀️', '🌱', '🦋', '🌲'],
    sunbeam: true,
  },
  laboratory: {
    name: 'Quantum Nano-Lab',
    gradient: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    decorations: ['🧪', '🔬', '⚗️', '⚡', '🧬', '💡'],
    bubbles: true,
  },
  human_body: {
    name: 'Microscopic Bloodstream',
    gradient: 'linear-gradient(180deg, #881337 0%, #be123c 50%, #f43f5e 100%)',
    decorations: ['🔴', '🩸', '🧬', '🔬', '✨', '🫀'],
    pulse: true,
  },
  space_station: {
    name: 'Cosmic Orbit Station',
    gradient: 'linear-gradient(180deg, #09090b 0%, #18181b 50%, #27272a 100%)',
    decorations: ['🌌', '⭐', '🛰️', '🚀', '🪐', '✨'],
    stars: true,
  },
  classroom: {
    name: 'Village STEM Workshop',
    gradient: 'linear-gradient(180deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
    decorations: ['📐', '📚', '🎒', '✏️', '🚲', '💡'],
    chalkboard: true,
  },
  ocean_world: {
    name: 'Bioluminescent Abyss',
    gradient: 'linear-gradient(180deg, #082f49 0%, #0369a1 50%, #0ea5e9 100%)',
    decorations: ['🌊', '🐠', '🐬', '🫧', '🪸', '🐙'],
    bubbles: true,
  },
  future_city: {
    name: 'Solar Future Village',
    gradient: 'linear-gradient(180deg, #312e81 0%, #4f46e5 50%, #06b6d4 100%)',
    decorations: ['🏙️', '🛸', '⚡', '☀️', '🤖', '🔋'],
    energyGrid: true,
  },
};

/* ─── Dynamic Animated Science Concept Visualizer ───────────────── */
function AnimatedScienceVisualizer({ storyId, topic, sceneNumber }) {
  const isPhotosynthesis = (storyId === 'leo_leaf' || (topic || '').toLowerCase().includes('photo') || (topic || '').toLowerCase().includes('plant'));
  const isElectricity = (storyId === 'eddy_electron' || (topic || '').toLowerCase().includes('electri') || (topic || '').toLowerCase().includes('circuit'));
  const isAtoms = (storyId === 'atomia_quest' || (topic || '').toLowerCase().includes('atom') || (topic || '').toLowerCase().includes('bond'));

  if (isPhotosynthesis) {
    return (
      <div style={{
        backgroundColor: 'rgba(23, 20, 13, 0.88)',
        border: '3px solid #ffc531',
        borderRadius: 20,
        padding: '16px 20px',
        maxWidth: 520,
        margin: '0 auto',
        boxShadow: '4px 4px 0 #17140d',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ffc531', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔬 Cellular Cross-Section Animation
          </span>
          <span style={{ fontSize: 11, color: '#86efac', fontWeight: 700 }}>
            {sceneNumber === 1 ? '☀️ Trapping Photons' : sceneNumber === 2 ? '💧 Root Water + CO2' : '🫧 Releasing Pure O2'}
          </span>
        </div>

        {/* Animated Leaf Factory Schematic */}
        <div style={{
          height: 140,
          background: 'radial-gradient(circle, #065f46 0%, #064e3b 70%, #022c22 100%)',
          borderRadius: 14,
          border: '2px solid rgba(255,255,255,0.2)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          overflow: 'hidden'
        }}>
          {/* Animated Sunbeams streaming in */}
          <div style={{ position: 'absolute', top: 6, left: 14, display: 'flex', gap: 6, animation: 'pulse 1.5s infinite' }}>
            <span style={{ fontSize: 24 }}>☀️</span>
            <span style={{ color: '#fef08a', fontSize: 11, fontWeight: 800, alignSelf: 'center' }}>Light Photons (hν) ➔</span>
          </div>

          {/* Microscopic Chloroplast Thylakoid Organelle */}
          <div style={{
            width: 74, height: 74,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            border: '3px solid #34d399',
            boxShadow: '0 0 20px #10b981',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            animation: 'float 2s ease-in-out infinite alternate',
            position: 'relative'
          }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: '#064e3b', textTransform: 'uppercase' }}>Chloroplast</span>
            <div style={{ position: 'absolute', width: 26, height: 4, backgroundColor: '#047857', borderRadius: 2, bottom: 10 }} />
          </div>

          {/* Stomata Breathing Gate */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: 10,
            border: '1.5px dashed #34d399'
          }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#fef08a' }}>Stomata Pore</span>
            <span style={{ fontSize: 9, color: '#cbd5e1' }}>In: 6 CO₂</span>
          </div>

          {/* Outputs floating out */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'jump 2s infinite' }}>
            <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
              💧 H₂O Water
            </span>
            <span style={{ backgroundColor: '#22c55e', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
              🫧 6 O₂ Released!
            </span>
            <span style={{ backgroundColor: '#eab308', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
              🍯 Glucose C₆H₁₂O₆
            </span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
          Equation: 6CO₂ + 6H₂O + Sunlight ➔ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)
        </div>
      </div>
    );
  }

  if (isElectricity) {
    return (
      <div style={{
        backgroundColor: 'rgba(23, 20, 13, 0.88)',
        border: '3px solid #ffc531',
        borderRadius: 20,
        padding: '16px 20px',
        maxWidth: 520,
        margin: '0 auto',
        boxShadow: '4px 4px 0 #17140d',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ffc531', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Closed Electric Circuit Loop (Ohm's Law)
          </span>
          <span style={{ fontSize: 11, color: '#fef08a', fontWeight: 800 }}>
            V = I × R (12V = 3A × 4Ω)
          </span>
        </div>

        {/* Animated Circuit Board Wire */}
        <div style={{
          height: 140,
          backgroundColor: '#09090b',
          borderRadius: 14,
          border: '2px solid #f59e0b',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          overflow: 'hidden'
        }}>
          {/* Wire loop background track */}
          <div style={{
            position: 'absolute', inset: '16px 20px',
            border: '3px solid #3b82f6',
            borderRadius: 12,
            pointerEvents: 'none'
          }} />

          {/* Battery Component */}
          <div style={{
            backgroundColor: '#dc2626', color: '#fff',
            border: '2px solid #fff', borderRadius: 8,
            padding: '8px 12px', textAlign: 'center', zIndex: 2
          }}>
            <div style={{ fontSize: 16 }}>🔋</div>
            <div style={{ fontSize: 11, fontWeight: 900 }}>12V</div>
            <div style={{ fontSize: 9, opacity: 0.8 }}>Battery</div>
          </div>

          {/* Moving Electron Particles on wire */}
          <div style={{
            display: 'flex', gap: 14, alignItems: 'center', zIndex: 2,
            animation: 'walk 1s linear infinite'
          }}>
            {['⚡', '⚡', '⚡'].map((e, idx) => (
              <span key={idx} style={{
                fontSize: 18, color: '#60a5fa',
                filter: 'drop-shadow(0 0 6px #3b82f6)'
              }}>
                {e}
              </span>
            ))}
          </div>

          {/* Ceramic Resistor */}
          <div style={{
            backgroundColor: '#78350f', color: '#fef08a',
            border: '2px solid #d97706', borderRadius: 6,
            padding: '6px 10px', textAlign: 'center', zIndex: 2
          }}>
            <div style={{ fontSize: 14 }}>🧱</div>
            <div style={{ fontSize: 10, fontWeight: 900 }}>4Ω Load</div>
            <div style={{ fontSize: 9 }}>Resistor</div>
          </div>

          {/* Glowing Tungsten Filament Bulb */}
          <div style={{
            backgroundColor: '#fef08a', color: '#17140d',
            border: '2.5px solid #d97706', borderRadius: '50%',
            width: 58, height: 58, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px #facc15', zIndex: 2,
            animation: 'pulse 1s infinite alternate'
          }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <span style={{ fontSize: 9, fontWeight: 900 }}>36W</span>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginTop: 8 }}>
          Current I = 12V / 4Ω = <strong>3.0 Amperes</strong> safe electron charge drift!
        </div>
      </div>
    );
  }

  if (isAtoms) {
    return (
      <div style={{
        backgroundColor: 'rgba(23, 20, 13, 0.88)',
        border: '3px solid #ffc531',
        borderRadius: 20,
        padding: '16px 20px',
        maxWidth: 520,
        margin: '0 auto',
        boxShadow: '4px 4px 0 #17140d'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#ffc531', textTransform: 'uppercase' }}>
            ⚛️ Bohr Model & Ionic Electron Transfer
          </span>
          <span style={{ fontSize: 11, color: '#c084fc', fontWeight: 800 }}>
            Octet Rule: (2, 8, 8)
          </span>
        </div>

        <div style={{
          height: 140,
          backgroundColor: '#030712',
          borderRadius: 14,
          border: '2px solid #818cf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Sodium Cation (Na+) */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              backgroundColor: '#6366f1', border: '2.5px solid #a5b4fc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px #6366f1', margin: '0 auto 4px'
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>Na⁺</span>
            </div>
            <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 700 }}>Sodium (2, 8)</span>
          </div>

          {/* Animated Electron Transfer Leap */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <span style={{ fontSize: 10, color: '#fef08a', fontWeight: 800 }}>e⁻ Leap</span>
            <div style={{
              fontSize: 22, color: '#38bdf8',
              animation: 'walk 0.8s infinite',
              filter: 'drop-shadow(0 0 8px #38bdf8)'
            }}>
              ➔ ⚡ ➔
            </div>
            <span style={{ fontSize: 9, color: '#86efac', fontWeight: 800 }}>Ionic Bond</span>
          </div>

          {/* Chlorine Anion (Cl-) */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              backgroundColor: '#10b981', border: '2.5px solid #6ee7b7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px #10b981', margin: '0 auto 4px'
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>Cl⁻</span>
            </div>
            <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 700 }}>Chloride (2, 8, 8)</span>
          </div>

          {/* Resulting Crystal */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1.5px solid #fff', borderRadius: 8,
            padding: '6px 10px', textAlign: 'center', zIndex: 2
          }}>
            <span style={{ fontSize: 18 }}>🧂</span>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>NaCl Salt</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', marginTop: 8 }}>
          Opposites attract! Na⁺ metal donates 1e⁻ to Cl⁻ halogen to form table salt.
        </div>
      </div>
    );
  }

  // General Topic Visualizer
  return (
    <div style={{
      backgroundColor: 'rgba(23, 20, 13, 0.88)',
      border: '3px solid #ffc531',
      borderRadius: 20,
      padding: '16px 20px',
      maxWidth: 520,
      margin: '0 auto',
      boxShadow: '4px 4px 0 #17140d'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#ffc531', textTransform: 'uppercase' }}>
          🤖 Interactive Science Simulator
        </span>
        <span style={{ fontSize: 11, color: '#86efac', fontWeight: 800 }}>
          {topic || 'Scientific Principles'}
        </span>
      </div>

      <div style={{
        height: 120,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 14,
        border: '2px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24
      }}>
        <div style={{ fontSize: 36, animation: 'float 2s infinite alternate' }}>🔬</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ color: '#fef08a', fontSize: 14, fontWeight: 800 }}>Empirical Science in Action</div>
          <div style={{ color: '#cbd5e1', fontSize: 11 }}>Cause, effect, energy transfer & physical verification</div>
        </div>
        <div style={{ fontSize: 36, animation: 'jump 1.5s infinite' }}>✨</div>
      </div>
    </div>
  );
}

/* ─── Animated Multi-Actor Stage Component ──────────────────────── */
function MultiActorStage({ story, currentScene, isSpeaking, isFirstPerson, speakText, stopVoice }) {
  const characters = story?.characters || [];
  const primarySpeakerName = currentScene?.character_speaking;
  const primaryChar = characters.find(c => c.name === primarySpeakerName) || {
    name: primarySpeakerName || 'Hero',
    avatar: '🧑‍🔬',
    role: 'Hero'
  };

  const mentorChar = characters.find(c => c.name !== primarySpeakerName) || {
    name: 'Dr. Vidya',
    avatar: '🔬',
    role: 'Mentor'
  };

  const thirdChar = characters.find(c => c.name !== primarySpeakerName && c.name !== mentorChar.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 10 }}>
      {/* Cartoon Cast Interaction Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        padding: '10px 20px',
        position: 'relative'
      }}>
        {/* Character 1: Active Speaker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {isSpeaking && (
            <div style={{
              position: 'absolute', top: -40,
              background: '#ffffff', border: '2.5px solid #17140d',
              borderRadius: 9999, padding: '4px 14px',
              fontSize: 11, fontWeight: 800, color: '#17140d',
              boxShadow: '3px 3px 0 #17140d', whiteSpace: 'nowrap',
              animation: 'jump 0.8s infinite'
            }}>
              💬 Speaking!
            </div>
          )}

          <div
            className="animate-walk"
            style={{
              width: 88, height: 88,
              borderRadius: '50%',
              backgroundColor: '#ffc531',
              border: '4px solid #17140d',
              boxShadow: '6px 6px 0 #17140d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44,
              transform: isSpeaking ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}
          >
            {primaryChar.avatar || '🧑‍🔬'}
          </div>

          <div style={{
            marginTop: 8,
            backgroundColor: '#17140d', color: '#ffc531',
            padding: '3px 12px', borderRadius: 9999,
            fontSize: 11, fontWeight: 800,
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
          }}>
            {isFirstPerson ? '🌟 YOU' : primaryChar.name}
          </div>
        </div>

        {/* Center: Dynamic Animated Science Concept Visualizer */}
        <AnimatedScienceVisualizer
          storyId={story.id}
          topic={story.topic}
          sceneNumber={currentScene?.scene_number || 1}
        />

        {/* Character 2: Mentor / Companion */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div
            className="animate-idle"
            style={{
              width: 76, height: 76,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '3.5px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38
            }}
          >
            {mentorChar.avatar || '🔬'}
          </div>

          <div style={{
            marginTop: 8,
            backgroundColor: '#ffffff', color: '#17140d',
            padding: '3px 12px', borderRadius: 9999,
            fontSize: 11, fontWeight: 800, border: '1.5px solid #17140d',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
          }}>
            {mentorChar.name}
          </div>
        </div>

        {/* Character 3: Floating Messenger / Spark (if available) */}
        {thirdChar && (
          <div style={{
            position: 'absolute', top: -10, right: '22%',
            display: 'flex', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(23, 20, 13, 0.75)',
            padding: '4px 10px', borderRadius: 9999,
            border: '1.5px solid #ffc531',
            animation: 'float 3s infinite ease-in-out'
          }}>
            <span style={{ fontSize: 18 }}>{thirdChar.avatar}</span>
            <span style={{ fontSize: 10, color: '#fff', fontWeight: 800 }}>{thirdChar.name}</span>
          </div>
        )}
      </div>

      {/* Subtitle Dialogue Box */}
      <div style={{
        backgroundColor: 'rgba(23, 20, 13, 0.94)',
        border: '3px solid #ffc531',
        borderRadius: 20,
        padding: '20px 24px',
        color: '#ffffff',
        boxShadow: '6px 6px 0 #17140d',
        backdropFilter: 'blur(6px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#ffc531', fontWeight: 800, textTransform: 'uppercase' }}>
            🎙️ {primaryChar.name} explains:
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            Scene {currentScene?.scene_number || 1} of {story.scenes?.length || 3}
          </span>
        </div>

        <p style={{
          fontSize: 'clamp(16px, 1.8vw, 19px)',
          fontWeight: 700, lineHeight: 1.45,
          color: '#fef08a', margin: '0 0 10px 0',
          fontFamily: "'Bricolage Grotesque', sans-serif"
        }}>
          "{currentScene?.dialogue}"
        </p>

        <p style={{ fontSize: 13.5, color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
          📖 {currentScene?.narration}
        </p>
      </div>
    </div>
  );
}

/* ─── Embedded Cartoon Animated Video Cinema Player ─────────────── */
function CartoonVideoPlayer({ story, onOpenCheckpoint, onLaunchSimulation, onStartQuiz }) {
  const videoUrl = story.video_url || 'https://www.youtube-nocookie.com/embed/sQK3Yr4Sc_k';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      animation: 'fadeIn 0.3s ease'
    }}>
      {/* Video Marquee Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
        backgroundColor: '#17140d', padding: '12px 20px', borderRadius: 16,
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            backgroundColor: '#ff5b57', color: '#fff',
            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 900,
            border: '1.5px solid #fff'
          }}>
            🎬 CARTOON ANIMATION CINEMA
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fef08a' }}>
            {story.video_title || `${story.topic} Cartoon Science Adventure`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {story.video_channel && (
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700
            }}>
              📺 {story.video_channel}
            </span>
          )}
          {story.video_duration && (
            <span style={{
              backgroundColor: '#ffc531', color: '#17140d',
              padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 800
            }}>
              ⏱️ {story.video_duration}
            </span>
          )}
        </div>
      </div>

      {/* 16:9 Cinema Screen Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        backgroundColor: '#09090b',
        borderRadius: 20,
        border: '3.5px solid #17140d',
        boxShadow: '8px 8px 0 #17140d',
        overflow: 'hidden'
      }}>
        <iframe
          src={`${videoUrl}?rel=0&modestbranding=1&enablejsapi=1`}
          title={story.video_title || "Cartoon Animated Educational Story"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 16
          }}
        />
      </div>

      {/* Concept Description Bar & External Watcher Option */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        backgroundColor: '#efffed',
        border: '2px solid #12b3a4',
        borderRadius: 14,
        padding: '12px 18px',
        fontSize: 13,
        color: '#096b62'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <Sparkles size={18} style={{ flexShrink: 0 }} />
          <span><strong>What You Learn In This Video:</strong> {story.video_description || story.subtitle}</span>
        </div>

        {story.video_url && (
          <a
            href={story.video_url.replace('/embed/', '/watch?v=')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#ffffff',
              color: '#096b62',
              border: '1.5px solid #12b3a4',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '2px 2px 0 #096b62'
            }}
          >
            <span>Open in YouTube Fullscreen</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Interactive Checkpoint Toolbar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '3px solid #17140d',
        borderRadius: 18,
        padding: '18px 22px',
        boxShadow: '5px 5px 0 #17140d'
      }}>
        <div style={{
          fontSize: 12, fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#17140d', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <span>🚨</span>
          <span>Interactive Checkpoints (Pause Video & Solve):</span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {story.scenes?.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => onOpenCheckpoint(idx)}
              className="btn-candy"
              style={{
                backgroundColor: '#f5efe2', color: '#17140d',
                padding: '8px 14px', fontSize: 12.5, gap: 6,
                boxShadow: '2px 2px 0 #17140d'
              }}
            >
              <span>🎯</span>
              <span>Checkpoint {idx + 1}: {scene.title?.slice(0, 24)}...</span>
            </button>
          ))}
        </div>

        {/* Quick Launch Next Phase */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          borderTop: '2px dashed #e2e8f0', paddingTop: 14
        }}>
          {story.simulation_target && (
            <button
              onClick={onLaunchSimulation}
              className="btn-candy primary"
              style={{ padding: '10px 18px', fontSize: 13.5, gap: 8 }}
            >
              <Beaker size={16} /> Launch PhET Digital Simulation
            </button>
          )}

          <button
            onClick={onStartQuiz}
            className="btn-candy"
            style={{
              backgroundColor: '#2bd980', color: '#17140d',
              padding: '10px 18px', fontSize: 13.5, gap: 8,
              boxShadow: '3px 3px 0 #17140d'
            }}
          >
            <Award size={16} /> Take 3-Question Mastery Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Video Storyboard & Prompts Studio ───────────────────────── */
function AIVideoStudio({ story }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const storyboard = story.ai_video_storyboard || [];

  const handleCopyPrompt = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        backgroundColor: '#17140d', color: '#ffffff',
        padding: '20px 24px', borderRadius: 20,
        boxShadow: '6px 6px 0 #ffc531',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 14
      }}>
        <div>
          <span style={{
            backgroundColor: '#8b5cf6', color: '#fff',
            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 900
          }}>
            🤖 AI VIDEO GENERATOR ENGINE (VEO / SORA / RUNWAY)
          </span>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '6px 0 2px', color: '#fef08a' }}>
            Director Storyboard for "{story.title}"
          </h3>
          <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0 }}>
            Use these scene-by-scene prompts to generate 3D cartoon video clips in Gemini Veo, OpenAI Sora, Runway Gen-3, or Pika.
          </p>
        </div>

        <button
          onClick={() => {
            const allPrompts = storyboard.map(s => `Scene ${s.scene}: ${s.title}\nCamera: ${s.camera_direction}\nVisual: ${s.visual_prompt}\nDialogue: "${s.dialogue}"\n`).join('\n---\n');
            navigator.clipboard.writeText(allPrompts);
            alert("All AI Video Storyboard prompts copied to clipboard!");
          }}
          className="btn-candy"
          style={{ backgroundColor: '#ffc531', color: '#17140d', fontSize: 12, padding: '8px 16px', gap: 6 }}
        >
          <Copy size={14} /> Copy Full Script (JSON/Text)
        </button>
      </div>

      {/* Storyboard Scene Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {storyboard.map((sc, idx) => (
          <div
            key={idx}
            className="memphis-card"
            style={{
              backgroundColor: '#ffffff',
              padding: '20px 24px',
              display: 'flex', flexDirection: 'column', gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  backgroundColor: '#ff5b57', color: '#fff',
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900
                }}>
                  {sc.scene || idx + 1}
                </span>
                <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  {sc.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                  ⏱️ {sc.duration_sec || 12}s Clip
                </span>
                <button
                  onClick={() => handleCopyPrompt(sc.visual_prompt, idx)}
                  style={{
                    backgroundColor: copiedIdx === idx ? '#2bd980' : '#17140d',
                    color: copiedIdx === idx ? '#17140d' : '#ffffff',
                    border: '1.5px solid #17140d', borderRadius: 8,
                    padding: '4px 10px', fontSize: 11, fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  {copiedIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedIdx === idx ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>

            {/* Camera Direction */}
            <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: 10, border: '1.5px dashed #cbd5e1' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                🎥 Camera Tracking & Angle:
              </span>
              <p style={{ fontSize: 13, color: '#0f172a', margin: '4px 0 0', fontWeight: 600 }}>
                {sc.camera_direction}
              </p>
            </div>

            {/* Visual Prompt for Veo / Sora */}
            <div style={{ backgroundColor: '#fef3c7', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #f59e0b' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                🎨 3D Cartoon Visual Prompt:
              </span>
              <p style={{ fontSize: 13, color: '#78350f', margin: '4px 0 0', lineHeight: 1.5 }}>
                {sc.visual_prompt}
              </p>
            </div>

            {/* Spoken Dialogue in Video */}
            <div style={{ fontSize: 13, color: '#334155' }}>
              <strong>🗣️ Audio / Dialogue:</strong> <em>"{sc.dialogue}"</em>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   MAIN STORYMODE COMPONENT
   ═════════════════════════════════════════════════════════════════════ */
export default function StoryMode() {
  // Navigation views: 'catalog' | 'player' | 'generator' | 'analytics'
  const [activeView, setActiveView] = useState('catalog');

  // Player presentation modes: 'video' | 'stage' | 'ai_storyboard'
  const [cinemaMode, setCinemaMode] = useState('video');

  // Stories Catalog initialized with curated stories guarantee
  const [stories, setStories] = useState(CURATED_STORIES);
  const [selectedStory, setSelectedStory] = useState(CURATED_STORIES[0]);
  const [loading, setLoading] = useState(false);

  // Player state
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [playerPhase, setPlayerPhase] = useState('scene'); // 'scene' | 'decision' | 'simulation' | 'quiz' | 'celebration'
  const [isFirstPersonMode, setIsFirstPersonMode] = useState(false);

  // Voice Narration
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const speechUtteranceRef = useRef(null);

  // Decision Checkpoint
  const [selectedOption, setSelectedOption] = useState(null);
  const [decisionFeedback, setDecisionFeedback] = useState(null);

  // Quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);

  // AI Story Generator Form
  const [genSubject, setGenSubject] = useState('Biology');
  const [genTopic, setGenTopic] = useState('Photosynthesis');
  const [genGrade, setGenGrade] = useState('Class 7');
  const [genCharacterName, setGenCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const userId = localStorage.getItem('vidyaverse_userId') || 'guest_user';

  // Live Real-Time Analytics State
  const [analytics, setAnalytics] = useState(() => {
    const key = `vidyaverse_story_realtime_${userId}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      userId,
      completedStories: [],
      storiesStarted: 0,
      totalLearningMinutes: 1,
      sessionStartTime: Date.now(),
      decisionsMade: 0,
      correctDecisions: 0,
      quizQuestionsAttempted: 0,
      quizQuestionsCorrect: 0,
      retentionScore: 100,
      favoriteCharacter: 'Leo the Leaf',
      characterPlayCounts: { 'Leo the Leaf': 1 },
      subjectBreakdown: {
        Biology: 1,
        Physics: 0,
        Chemistry: 0,
        Mathematics: 0,
        SpaceScience: 0
      },
      history: []
    };
  });

  // ── Load Stories on Mount ──────────────────────────────────────────
  useEffect(() => {
    loadStoriesCatalog();
  }, []);

  const loadStoriesCatalog = async () => {
    setLoading(true);
    const res = await api.getStories();
    if (res && res.stories && res.stories.length > 0) {
      setStories(res.stories);
      if (!selectedStory) {
        setSelectedStory(res.stories[0]);
      }
    } else {
      setStories(CURATED_STORIES);
      if (!selectedStory) {
        setSelectedStory(CURATED_STORIES[0]);
      }
    }
    setLoading(false);
  };

  // ── Live Real-Time Session Timer ───────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setAnalytics(prev => {
        if (!prev) return prev;
        const sessionMins = Math.floor((Date.now() - (prev.sessionStartTime || Date.now())) / 60000);
        const updated = {
          ...prev,
          totalLearningMinutes: Math.max(prev.totalLearningMinutes || 0, sessionMins + 1)
        };
        try {
          localStorage.setItem(`vidyaverse_story_realtime_${userId}`, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }, 15000); // Ticks every 15s to update real minutes
    return () => clearInterval(timer);
  }, [userId]);

  // ── Narration Audio Controller (Web Speech Synthesis) ──────────────
  const speakText = (text, rate = 0.95, pitch = 1.0) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsVoicePlaying(true);
    utterance.onend = () => setIsVoicePlaying(false);
    utterance.onerror = () => setIsVoicePlaying(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
  };

  // Trigger narration ONLY when in 'stage' cinema mode to not conflict with video
  useEffect(() => {
    if (activeView === 'player' && cinemaMode === 'stage' && selectedStory && playerPhase === 'scene') {
      const scene = selectedStory.scenes?.[currentSceneIdx];
      if (scene) {
        const fullText = `${scene.narration} ${scene.character_speaking} says: ${scene.dialogue}`;
        speakText(fullText, 0.95, isFirstPersonMode ? 1.05 : 1.0);
      }
    } else if (cinemaMode === 'video') {
      stopVoice();
    }
    return () => stopVoice();
  }, [activeView, cinemaMode, selectedStory, currentSceneIdx, playerPhase, isVoiceMuted]);

  // ── Start Story Adventure ──────────────────────────────────────────
  const startStory = (story, firstPerson = false, initialMode = 'video') => {
    setSelectedStory(story);
    setIsFirstPersonMode(firstPerson);
    setCinemaMode(initialMode);
    setCurrentSceneIdx(0);
    setPlayerPhase('scene');
    setSelectedOption(null);
    setDecisionFeedback(null);
    setQuizIdx(0);
    setQuizScore(0);
    setActiveView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track real-time character play count
    const charName = story.characters?.[0]?.name || 'Hero';
    setAnalytics(prev => {
      const counts = { ...(prev?.characterPlayCounts || {}) };
      counts[charName] = (counts[charName] || 0) + 1;
      let topChar = charName;
      let maxCount = 0;
      Object.entries(counts).forEach(([name, c]) => {
        if (c > maxCount) {
          maxCount = c;
          topChar = name;
        }
      });
      const updated = {
        ...prev,
        storiesStarted: (prev?.storiesStarted || 0) + 1,
        characterPlayCounts: counts,
        favoriteCharacter: topChar
      };
      try {
        localStorage.setItem(`vidyaverse_story_realtime_${userId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // ── Next Scene / Checkpoint Handler ────────────────────────────────
  const handleProceedScene = () => {
    stopVoice();
    const scene = selectedStory.scenes?.[currentSceneIdx];
    if (scene?.decision_point && scene.decision_point.has_decision && !decisionFeedback?.is_correct) {
      setPlayerPhase('decision');
    } else {
      if (currentSceneIdx + 1 < (selectedStory.scenes?.length || 1)) {
        setCurrentSceneIdx(prev => prev + 1);
        setSelectedOption(null);
        setDecisionFeedback(null);
        setPlayerPhase('scene');
      } else {
        setPlayerPhase('simulation');
      }
    }
  };

  // ── Decision Point Option Selection ────────────────────────────────
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id);
    setDecisionFeedback(opt);

    // Update real-time analytics dynamically
    setAnalytics(prev => {
      const decisionsMade = (prev?.decisionsMade || 0) + 1;
      const correctDecisions = (prev?.correctDecisions || 0) + (opt.is_correct ? 1 : 0);
      const totalAttempted = decisionsMade + (prev?.quizQuestionsAttempted || 0);
      const totalCorrect = correctDecisions + (prev?.quizQuestionsCorrect || 0);
      const retentionScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

      const updated = {
        ...prev,
        decisionsMade,
        correctDecisions,
        retentionScore
      };
      try {
        localStorage.setItem(`vidyaverse_story_realtime_${userId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (opt.is_correct) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      speakText(`Spot on! ${opt.feedback}`, 1.0, 1.1);
    } else {
      speakText(`Not quite. ${opt.feedback}`, 0.95, 0.95);
    }
  };

  // ── Quiz Option Selection ──────────────────────────────────────────
  const handleQuizAnswer = (choiceIdx) => {
    setSelectedQuizAnswer(choiceIdx);
    setShowQuizExplanation(true);
    const currentQ = selectedStory.quiz?.[quizIdx];
    const isCorrect = currentQ && choiceIdx === currentQ.correct_index;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });
    }

    // Update real-time analytics dynamically
    setAnalytics(prev => {
      const quizQuestionsAttempted = (prev?.quizQuestionsAttempted || 0) + 1;
      const quizQuestionsCorrect = (prev?.quizQuestionsCorrect || 0) + (isCorrect ? 1 : 0);
      const totalAttempted = (prev?.decisionsMade || 0) + quizQuestionsAttempted;
      const totalCorrect = (prev?.correctDecisions || 0) + quizQuestionsCorrect;
      const retentionScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

      const updated = {
        ...prev,
        quizQuestionsAttempted,
        quizQuestionsCorrect,
        retentionScore
      };
      try {
        localStorage.setItem(`vidyaverse_story_realtime_${userId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizAnswer(null);
    setShowQuizExplanation(false);
    if (quizIdx + 1 < (selectedStory.quiz?.length || 1)) {
      setQuizIdx(prev => prev + 1);
    } else {
      setPlayerPhase('celebration');
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
      saveProgressToServer();
    }
  };

  const saveProgressToServer = async () => {
    const finalScore = Math.round(((quizScore + 1) / (selectedStory.quiz?.length || 1)) * 100);

    setAnalytics(prev => {
      const completedList = prev?.completedStories || [];
      const updatedCompleted = completedList.includes(selectedStory.id) ? completedList : [...completedList, selectedStory.id];
      const subj = selectedStory.subject || 'Biology';
      const updatedSubj = {
        ...(prev?.subjectBreakdown || {}),
        [subj]: ((prev?.subjectBreakdown?.[subj]) || 0) + 1
      };
      const updated = {
        ...prev,
        completedStories: updatedCompleted,
        subjectBreakdown: updatedSubj,
        history: [
          {
            storyId: selectedStory.id,
            title: selectedStory.title,
            completedAt: new Date().toISOString(),
            score: finalScore
          },
          ...(prev?.history || []).slice(0, 10)
        ]
      };
      try {
        localStorage.setItem(`vidyaverse_story_realtime_${userId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    await api.saveStoryProgress({
      userId,
      storyId: selectedStory.id,
      completed: true,
      quizScore: finalScore,
      timeSpentSeconds: 300,
      simulationCompleted: true,
      subject: selectedStory.subject,
      favoriteCharacter: selectedStory.characters?.[0]?.name
    });
  };

  // ── Generate AI Story via Gemini API / Client Generator ────────────
  const handleGenerateStory = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await api.generateAIStory({
        subject: genSubject,
        topic: genTopic,
        grade: genGrade,
        isFirstPerson: isFirstPersonMode,
        characterName: genCharacterName
      });

      if (res && res.story) {
        setStories(prev => [res.story, ...prev]);
        setSelectedStory(res.story);
        startStory(res.story, isFirstPersonMode, 'video');
      }
    } catch (err) {
      console.error('Failed to generate story:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 16px 60px' }}>

      {/* ── Top Navigation Sub-Bar ───────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
        paddingBottom: 16,
        borderBottom: '2.5px solid #17140d'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            backgroundColor: '#ff5b57',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: 12,
            border: '2.5px solid #17140d',
            boxShadow: '3px 3px 0 #17140d',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Film size={20} />
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 16 }}>
              StoryVerse Animated Cinema
            </span>
          </div>

          <span style={{
            backgroundColor: '#ffc531',
            color: '#17140d',
            padding: '4px 10px',
            borderRadius: 9999,
            fontSize: 11.5,
            fontWeight: 800,
            border: '1.5px solid #17140d'
          }}>
            🎬 CARTOON VIDEOS & PIXAR ADVENTURES
          </span>
        </div>

        {/* View Switchers (Database Schema removed) */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'catalog', label: 'Adventures Catalog', icon: BookOpen },
            { id: 'generator', label: 'AI Story Studio', icon: Wand2 },
            { id: 'analytics', label: 'Learning Stats (Real-Time)', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stopVoice();
                  setActiveView(tab.id);
                }}
                className="btn-candy"
                style={{
                  backgroundColor: isActive ? '#ffc531' : '#ffffff',
                  color: '#17140d',
                  fontSize: 13,
                  padding: '8px 14px',
                  boxShadow: isActive ? '3px 3px 0 #17140d' : '2px 2px 0 #17140d'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VIEW 1: CATALOG VIEW (NETFLIX KIDS CARTOON GALLERY)
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'catalog' && (
        <div>
          {/* Spotlight Banner (Featured Cartoon Video & Adventure) */}
          {selectedStory && (
            <div style={{
              background: selectedStory.cover_gradient,
              border: '3px solid #17140d',
              borderRadius: 24,
              padding: '36px 32px',
              color: '#ffffff',
              boxShadow: '8px 8px 0 #17140d',
              marginBottom: 36,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -10, right: 20, fontSize: 120, opacity: 0.15, userSelect: 'none' }}>
                🚀
              </div>

              <div style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: '#ffc531', color: '#17140d',
                    padding: '4px 12px', borderRadius: 9999,
                    fontSize: 12, fontWeight: 800, border: '2px solid #17140d'
                  }}>
                    🌟 FEATURED CARTOON VIDEO & LAB
                  </span>
                  <span style={{
                    backgroundColor: '#2bd980', color: '#17140d',
                    padding: '4px 12px', borderRadius: 9999,
                    fontSize: 12, fontWeight: 800, border: '2px solid #17140d'
                  }}>
                    🎬 Animated Cartoon Video Included
                  </span>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff',
                    padding: '4px 12px', borderRadius: 9999,
                    fontSize: 12, fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.6)'
                  }}>
                    {selectedStory.subject} • {selectedStory.grade}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800, lineHeight: 1.1, marginBottom: 12,
                  textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
                }}>
                  {selectedStory.title}
                </h2>

                <p style={{ fontSize: 16, lineHeight: 1.6, color: '#f0fdf4', marginBottom: 24 }}>
                  {selectedStory.subtitle}
                </p>

                {/* Cast preview row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cast:
                  </span>
                  {selectedStory.characters?.map((c, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '4px 12px', borderRadius: 9999,
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      fontSize: 13, fontWeight: 700
                    }}>
                      <span>{c.avatar}</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>

                {/* Action Play Buttons */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => startStory(selectedStory, false, 'video')}
                    className="btn-candy"
                    style={{
                      backgroundColor: '#ffc531', color: '#17140d',
                      padding: '14px 26px', fontSize: 16, gap: 10,
                      boxShadow: '4px 4px 0 #17140d'
                    }}
                  >
                    <Video size={20} /> Watch Cartoon Video & Learn
                  </button>

                  <button
                    onClick={() => startStory(selectedStory, false, 'stage')}
                    className="btn-candy"
                    style={{
                      backgroundColor: '#ffffff', color: '#17140d',
                      padding: '14px 22px', fontSize: 15, gap: 10,
                      boxShadow: '4px 4px 0 #17140d'
                    }}
                  >
                    <Play size={18} fill="#17140d" /> Multi-Actor Stage
                  </button>

                  <button
                    onClick={() => startStory(selectedStory, true, 'stage')}
                    className="btn-candy"
                    style={{
                      backgroundColor: '#efffed', color: '#096b62',
                      padding: '14px 20px', fontSize: 14.5, gap: 8,
                      boxShadow: '4px 4px 0 #17140d'
                    }}
                  >
                    <User size={18} /> "Become the Character" (RPG)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Grid */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
              Explore Cartoon Adventures & Videos ({stories.length})
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24
            }}>
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="memphis-card"
                  style={{
                    backgroundColor: '#ffffff',
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedStory(story)}
                >
                  {/* Colored Header Banner */}
                  <div style={{
                    background: story.cover_gradient || 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    padding: '20px 22px',
                    color: '#ffffff',
                    borderBottom: '3px solid #17140d'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        backgroundColor: '#ffc531', color: '#17140d',
                        padding: '2px 8px', borderRadius: 6, border: '1.5px solid #17140d'
                      }}>
                        {story.grade}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        backgroundColor: '#2bd980', color: '#17140d',
                        padding: '2px 8px', borderRadius: 6, border: '1.5px solid #17140d'
                      }}>
                        🎬 Cartoon Video
                      </span>
                    </div>

                    <h4 style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1.2
                    }}>
                      {story.title}
                    </h4>
                  </div>

                  {/* Body Details */}
                  <div style={{ padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 13.5, color: '#444', lineHeight: 1.5, margin: 0 }}>
                      {story.subtitle}
                    </p>

                    {/* Simulation badge */}
                    {story.simulation_target && (
                      <div style={{
                        backgroundColor: '#efffed', border: '1.5px solid #12b3a4',
                        borderRadius: 10, padding: '6px 10px', fontSize: 12,
                        color: '#096b62', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <Beaker size={14} />
                        <span><strong>Simulation:</strong> {story.simulation_target.name}</span>
                      </div>
                    )}

                    {/* Cast preview */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#666' }}>Characters:</span>
                      {story.characters?.slice(0, 3).map((c, i) => (
                        <span key={i} title={c.name} style={{ fontSize: 18 }}>{c.avatar}</span>
                      ))}
                    </div>

                    {/* Launch buttons */}
                    <div style={{ display: 'flex', gap: 8, paddingTop: 6 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); startStory(story, false, 'video'); }}
                        className="btn-candy primary"
                        style={{ flex: 1, padding: '10px 0', fontSize: 13, gap: 6 }}
                      >
                        <Video size={14} /> Play Video
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); startStory(story, false, 'stage'); }}
                        className="btn-candy secondary"
                        style={{ padding: '10px 14px', fontSize: 13 }}
                        title="Interactive Cartoon Stage"
                      >
                        <Play size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 2: THE ANIMATED STORYVERSE CINEMA (THE PLAYER)
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'player' && selectedStory && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #17140d',
          borderRadius: 24,
          boxShadow: '10px 10px 0 #17140d',
          overflow: 'hidden'
        }}>
          {/* Top Cinema Control Bar */}
          <div style={{
            backgroundColor: '#17140d', color: '#ffffff',
            padding: '14px 24px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => { stopVoice(); setActiveView('catalog'); }}
                style={{
                  backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)',
                  color: '#ffffff', borderRadius: 9999, padding: '6px 14px',
                  cursor: 'pointer', fontSize: 12, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <ArrowLeft size={14} /> Exit Cinema
              </button>

              <div>
                <span style={{ fontSize: 11, color: '#ffc531', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isFirstPersonMode ? '🎮 BECOME THE CHARACTER MODE' : '🎬 CARTOON STORY CINEMA'}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#f5efe2' }}>
                  {selectedStory.title}
                </h3>
              </div>
            </div>

            {/* Cinema Presentation Mode Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: 12 }}>
              <button
                onClick={() => { stopVoice(); setCinemaMode('video'); }}
                style={{
                  backgroundColor: cinemaMode === 'video' ? '#ff5b57' : 'transparent',
                  color: '#ffffff', border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 12, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Video size={14} />
                <span>Cartoon Video</span>
              </button>

              <button
                onClick={() => setCinemaMode('stage')}
                style={{
                  backgroundColor: cinemaMode === 'stage' ? '#ffc531' : 'transparent',
                  color: cinemaMode === 'stage' ? '#17140d' : '#ffffff',
                  border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 12, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Layers size={14} />
                <span>Multi-Actor Stage</span>
              </button>

              <button
                onClick={() => { stopVoice(); setCinemaMode('ai_storyboard'); }}
                style={{
                  backgroundColor: cinemaMode === 'ai_storyboard' ? '#8b5cf6' : 'transparent',
                  color: '#ffffff', border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 12, fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Clapperboard size={14} />
                <span>AI Video Prompts</span>
              </button>
            </div>

            {/* Audio & Narration Controls (Active for Stage Mode) */}
            {cinemaMode === 'stage' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => {
                    if (isVoicePlaying) {
                      stopVoice();
                    } else {
                      const scene = selectedStory.scenes?.[currentSceneIdx];
                      if (scene) {
                        speakText(`${scene.narration} ${scene.character_speaking} says: ${scene.dialogue}`);
                      }
                    }
                  }}
                  className="btn-candy"
                  style={{
                    backgroundColor: isVoicePlaying ? '#ff5b57' : '#ffc531',
                    color: '#17140d', padding: '6px 12px', fontSize: 12, gap: 6
                  }}
                >
                  {isVoicePlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isVoicePlaying ? 'Pause Voice' : 'Play Voice'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsVoiceMuted(!isVoiceMuted);
                    if (!isVoiceMuted) stopVoice();
                  }}
                  style={{
                    backgroundColor: 'transparent', border: '2px solid rgba(255,255,255,0.4)',
                    color: isVoiceMuted ? '#ff5b57' : '#ffffff', borderRadius: 9999, padding: '6px 10px',
                    cursor: 'pointer', fontSize: 12
                  }}
                  title={isVoiceMuted ? 'Unmute Narration' : 'Mute Narration'}
                >
                  {isVoiceMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>
            )}
          </div>

          {/* Cinema View Switcher Container */}
          <div style={{ padding: '24px 28px', backgroundColor: '#fdfbf7' }}>

            {/* ── MODE 1: CARTOON ANIMATED VIDEO ──────────────────────── */}
            {cinemaMode === 'video' && (
              <CartoonVideoPlayer
                story={selectedStory}
                onOpenCheckpoint={(sceneIdx) => {
                  setCurrentSceneIdx(sceneIdx);
                  setPlayerPhase('decision');
                  setCinemaMode('stage');
                }}
                onLaunchSimulation={() => setPlayerPhase('simulation')}
                onStartQuiz={() => setPlayerPhase('quiz')}
              />
            )}

            {/* ── MODE 2: MULTI-ACTOR ANIMATED STAGE ───────────────────── */}
            {cinemaMode === 'stage' && (
              <div>
                {/* Scene Progress Indicator */}
                <div style={{
                  backgroundColor: '#e8e2d8', height: 8, width: '100%',
                  borderRadius: 4, overflow: 'hidden', marginBottom: 20
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((currentSceneIdx + 1) / (selectedStory.scenes?.length || 1)) * 100}%`,
                    backgroundColor: '#ff5b57',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>

                {(playerPhase === 'scene' || playerPhase === 'decision') && (
                  <div>
                    {(() => {
                      const currentScene = selectedStory.scenes?.[currentSceneIdx];
                      const theme = SCENE_THEMES[currentScene?.background_type] || SCENE_THEMES.forest;

                      return (
                        <div style={{
                          background: theme.gradient,
                          minHeight: 460,
                          position: 'relative',
                          padding: '32px 28px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderRadius: 20,
                          border: '3px solid #17140d',
                          boxShadow: '6px 6px 0 #17140d',
                          overflow: 'hidden'
                        }}>
                          {/* Animated Environment Floaters */}
                          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                            {theme.decorations.map((item, idx) => (
                              <span
                                key={idx}
                                style={{
                                  position: 'absolute',
                                  fontSize: idx % 2 === 0 ? '36px' : '24px',
                                  top: `${15 + (idx * 16)}%`,
                                  left: `${8 + (idx * 18)}%`,
                                  opacity: 0.25,
                                  animation: `float ${3 + idx}s ease-in-out infinite alternate`,
                                  userSelect: 'none'
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          {/* Scene Tag */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, marginBottom: 14 }}>
                            <span style={{
                              backgroundColor: 'rgba(23, 20, 13, 0.85)', color: '#ffc531',
                              border: '2px solid #ffc531', borderRadius: 9999,
                              padding: '4px 14px', fontSize: 12, fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              🎬 SCENE {currentScene?.scene_number || 1}: {currentScene?.title}
                            </span>

                            <span style={{
                              backgroundColor: '#ffffff', color: '#17140d',
                              border: '2px solid #17140d', borderRadius: 9999,
                              padding: '4px 12px', fontSize: 12, fontWeight: 800
                            }}>
                              📍 Environment: {theme.name}
                            </span>
                          </div>

                          {/* Multi-Actor Stage Viewport */}
                          <MultiActorStage
                            story={selectedStory}
                            currentScene={currentScene}
                            isSpeaking={isVoicePlaying}
                            isFirstPerson={isFirstPersonMode}
                            speakText={speakText}
                            stopVoice={stopVoice}
                          />
                        </div>
                      );
                    })()}

                    {/* Bottom Interactive Decision Checkpoint Area */}
                    <div style={{ marginTop: 24 }}>
                      {playerPhase === 'decision' ? (
                        <div style={{
                          backgroundColor: '#ffffff',
                          border: '3px solid #17140d',
                          borderRadius: 20,
                          padding: '24px 26px',
                          boxShadow: '6px 6px 0 #17140d',
                          animation: 'fadeIn 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 28 }}>🚨</span>
                            <div>
                              <span style={{
                                backgroundColor: '#ff5b57', color: '#fff',
                                padding: '2px 8px', borderRadius: 6,
                                fontSize: 11, fontWeight: 800, border: '1.5px solid #17140d'
                              }}>
                                INTERACTIVE DECISION CHECKPOINT
                              </span>
                              <h4 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 0' }}>
                                {selectedStory.scenes?.[currentSceneIdx]?.decision_point?.prompt}
                              </h4>
                            </div>
                          </div>

                          {/* Options A, B, C */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                            {selectedStory.scenes?.[currentSceneIdx]?.decision_point?.options?.map((opt) => {
                              const isSelected = selectedOption === opt.id;
                              let bg = '#f5efe2';
                              let borderCol = '#17140d';

                              if (isSelected && decisionFeedback) {
                                bg = decisionFeedback.is_correct ? '#d1fae5' : '#fee2e2';
                                borderCol = decisionFeedback.is_correct ? '#059669' : '#dc2626';
                              }

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleSelectOption(opt)}
                                  style={{
                                    padding: '14px 18px',
                                    borderRadius: 14,
                                    border: `2.5px solid ${borderCol}`,
                                    backgroundColor: bg,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: '#17140d',
                                    boxShadow: '2px 2px 0 #17140d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    transition: 'transform 0.1s'
                                  }}
                                >
                                  <span style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    backgroundColor: '#17140d', color: '#ffffff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontWeight: 800, flexShrink: 0
                                  }}>
                                    {opt.id}
                                  </span>
                                  <span>{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Instant Explanatory Feedback */}
                          {decisionFeedback && (
                            <div style={{
                              padding: '14px 18px',
                              borderRadius: 12,
                              backgroundColor: decisionFeedback.is_correct ? '#ecfdf5' : '#fef2f2',
                              border: `2px solid ${decisionFeedback.is_correct ? '#10b981' : '#ef4444'}`,
                              marginBottom: 16
                            }}>
                              <div style={{
                                fontWeight: 800,
                                fontSize: 14,
                                color: decisionFeedback.is_correct ? '#065f46' : '#991b1b',
                                marginBottom: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                              }}>
                                {decisionFeedback.is_correct ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <span>{decisionFeedback.is_correct ? 'Correct Scientific Choice!' : 'Science Check & Retry:'}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: 13, color: '#333', lineHeight: 1.5 }}>
                                {decisionFeedback.feedback}
                              </p>
                            </div>
                          )}

                          {/* Continue Button */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              disabled={!decisionFeedback?.is_correct}
                              onClick={handleProceedScene}
                              className="btn-candy primary"
                              style={{
                                padding: '12px 24px', fontSize: 15,
                                opacity: decisionFeedback?.is_correct ? 1 : 0.45,
                                cursor: decisionFeedback?.is_correct ? 'pointer' : 'not-allowed'
                              }}
                            >
                              <span>Continue Adventure</span>
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            disabled={currentSceneIdx === 0}
                            onClick={() => {
                              stopVoice();
                              setCurrentSceneIdx(prev => Math.max(0, prev - 1));
                            }}
                            className="btn-candy secondary"
                            style={{
                              padding: '10px 18px', fontSize: 13,
                              opacity: currentSceneIdx === 0 ? 0.4 : 1,
                              cursor: currentSceneIdx === 0 ? 'not-allowed' : 'pointer'
                            }}
                          >
                            ← Previous Scene
                          </button>

                          <div style={{ display: 'flex', gap: 10 }}>
                            <button
                              onClick={() => setCinemaMode('video')}
                              className="btn-candy"
                              style={{ backgroundColor: '#ffffff', color: '#17140d', fontSize: 13, padding: '10px 16px', gap: 6 }}
                            >
                              <Video size={15} /> Switch to Video
                            </button>

                            <button
                              onClick={handleProceedScene}
                              className="btn-candy primary"
                              style={{ padding: '12px 24px', fontSize: 15, gap: 8 }}
                            >
                              <span>Next Scene</span>
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── MODE 3: AI VIDEO STORYBOARD & PROMPTS ───────────────── */}
            {cinemaMode === 'ai_storyboard' && (
              <AIVideoStudio story={selectedStory} />
            )}

            {/* ── STAGE 2: DIGITAL SIMULATION LAUNCHER ─────────────────── */}
            {playerPhase === 'simulation' && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                borderRadius: 20,
                padding: '32px 28px',
                boxShadow: '6px 6px 0 #17140d',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#ffc531', color: '#17140d',
                  padding: '4px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 800,
                  display: 'inline-block', border: '2px solid #17140d', marginBottom: 12
                }}>
                  PHASE 2: HANDS-ON VIRTUAL EXPERIMENT
                </div>

                <h3 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 28, fontWeight: 800, margin: '0 0 10px'
                }}>
                  Launch Simulation: {selectedStory.simulation_target?.name}
                </h3>

                <p style={{ maxWidth: 680, margin: '0 auto 24px auto', fontSize: 15, color: '#444', lineHeight: 1.6 }}>
                  {selectedStory.simulation_target?.learning_hook}
                </p>

                {/* Embedded Simulation Frame */}
                {selectedStory.simulation_target?.url && (
                  <div style={{
                    width: '100%',
                    height: 520,
                    borderRadius: 16,
                    border: '3px solid #17140d',
                    boxShadow: '6px 6px 0 #17140d',
                    overflow: 'hidden',
                    marginBottom: 24,
                    backgroundColor: '#000'
                  }}>
                    <iframe
                      src={selectedStory.simulation_target.url}
                      title={selectedStory.simulation_target.name}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                  <button
                    onClick={() => setPlayerPhase('quiz')}
                    className="btn-candy primary"
                    style={{ padding: '14px 28px', fontSize: 16, gap: 10 }}
                  >
                    <span>I Completed The Lab · Take Mastery Quiz</span>
                    <Award size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STAGE 3: MASTERY QUIZ ───────────────────────────────── */}
            {playerPhase === 'quiz' && selectedStory.quiz && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                borderRadius: 20,
                padding: '32px 28px',
                boxShadow: '6px 6px 0 #17140d',
                maxWidth: 780,
                margin: '0 auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <span style={{
                    backgroundColor: '#17140d', color: '#ffc531',
                    padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 800
                  }}>
                    QUESTION {quizIdx + 1} OF {selectedStory.quiz.length}
                  </span>

                  <span style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>
                    Score: {quizScore} / {selectedStory.quiz.length}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 22, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.35
                }}>
                  {selectedStory.quiz[quizIdx]?.question}
                </h3>

                {/* Question Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {selectedStory.quiz[quizIdx]?.options?.map((choice, cIdx) => {
                    const isSelected = selectedQuizAnswer === cIdx;
                    const isCorrect = cIdx === selectedStory.quiz[quizIdx].correct_index;

                    let bg = '#f5efe2';
                    let borderCol = '#17140d';

                    if (showQuizExplanation) {
                      if (isCorrect) {
                        bg = '#d1fae5';
                        borderCol = '#059669';
                      } else if (isSelected) {
                        bg = '#fee2e2';
                        borderCol = '#dc2626';
                      }
                    }

                    return (
                      <button
                        key={cIdx}
                        disabled={showQuizExplanation}
                        onClick={() => handleQuizAnswer(cIdx)}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 14,
                          border: `2.5px solid ${borderCol}`,
                          backgroundColor: bg,
                          textAlign: 'left',
                          fontSize: 14.5,
                          fontWeight: 700,
                          cursor: showQuizExplanation ? 'default' : 'pointer',
                          boxShadow: '2px 2px 0 #17140d',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12
                        }}
                      >
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showQuizExplanation && (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 12,
                    backgroundColor: '#eff6ff',
                    border: '2px solid #3b82f6',
                    marginBottom: 20
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#1e40af', marginBottom: 4 }}>
                      💡 Concept Explanation:
                    </div>
                    <p style={{ margin: 0, fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                      {selectedStory.quiz[quizIdx]?.explanation}
                    </p>
                  </div>
                )}

                {showQuizExplanation && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleNextQuizQuestion}
                      className="btn-candy primary"
                      style={{ padding: '12px 24px', fontSize: 15, gap: 8 }}
                    >
                      <span>{quizIdx + 1 < selectedStory.quiz.length ? 'Next Question' : 'View Results'}</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── STAGE 4: CELEBRATION & BADGE REWARD ─────────────────── */}
            {playerPhase === 'celebration' && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                borderRadius: 20,
                padding: '44px 32px',
                boxShadow: '8px 8px 0 #17140d',
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto'
              }}>
                <div style={{ fontSize: 64, marginBottom: 12, animation: 'jump 0.8s infinite' }}>
                  🎉
                </div>

                <div style={{
                  backgroundColor: '#ffc531', color: '#17140d',
                  padding: '4px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 800,
                  display: 'inline-block', border: '2px solid #17140d', marginBottom: 12
                }}>
                  ADVENTURE & QUIZ COMPLETED!
                </div>

                <h2 style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 32, fontWeight: 800, margin: '0 0 12px'
                }}>
                  Phenomenal Science Work, Explorer!
                </h2>

                <p style={{ fontSize: 15, color: '#555', marginBottom: 24 }}>
                  You solved the narrative challenges, ran the digital experiment, and demonstrated mastery in {selectedStory.topic}!
                </p>

                {/* Score & XP Card */}
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: 16,
                  marginBottom: 28, flexWrap: 'wrap'
                }}>
                  <div style={{
                    backgroundColor: '#efffed', border: '2px solid #10b981',
                    borderRadius: 14, padding: '14px 24px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#047857' }}>
                      {quizScore} / {selectedStory.quiz.length}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#065f46' }}>
                      Quiz Score
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#fef3c7', border: '2px solid #f59e0b',
                    borderRadius: 14, padding: '14px 24px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#b45309' }}>
                      +250 XP
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#78350f' }}>
                      Experience Points
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f3e8ff', border: '2px solid #8b5cf6',
                    borderRadius: 14, padding: '14px 24px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#6d28d9' }}>
                      🏆 Master
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#5b21b6' }}>
                      Badge Earned
                    </div>
                  </div>
                </div>

                {/* Return Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      stopVoice();
                      setActiveView('catalog');
                    }}
                    className="btn-candy primary"
                    style={{ padding: '12px 24px', fontSize: 15 }}
                  >
                    Play Another Adventure
                  </button>

                  <button
                    onClick={() => setActiveView('analytics')}
                    className="btn-candy secondary"
                    style={{ padding: '12px 24px', fontSize: 15 }}
                  >
                    View Real-Time Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 3: TEACHER & STUDENT AI STORY GENERATOR STUDIO
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'generator' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #17140d',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '8px 8px 0 #17140d'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <span style={{
                backgroundColor: '#ffc531', color: '#17140d',
                padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                border: '1.5px solid #17140d'
              }}>
                ZERO-CODE AI ADVENTURE STUDIO
              </span>
              <h3 style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 0' }}>
                Generate Custom Pixar Adventure & Videos with Gemini
              </h3>
            </div>

            <button
              onClick={() => setActiveView('catalog')}
              className="btn-candy secondary"
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              ← Back to Catalog
            </button>
          </div>

          <p style={{ fontSize: 15, color: '#555', marginBottom: 28, maxWidth: 800 }}>
            Teachers and students can type any STEM chapter or village science question. Gemini AI creates a full Pixar-style story with animated cartoon video mappings, characters, voice dialogues, decision checkpoints, virtual labs, and quizzes!
          </p>

          <form onSubmit={handleGenerateStory} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
                Subject
              </label>
              <select
                value={genSubject}
                onChange={(e) => setGenSubject(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '2.5px solid #17140d', backgroundColor: '#fdfbf7',
                  fontSize: 14, fontWeight: 700
                }}
              >
                <option value="Biology">Biology (Life Sciences)</option>
                <option value="Physics">Physics (Mechanics, Energy & Circuits)</option>
                <option value="Chemistry">Chemistry (Matter & Reactions)</option>
                <option value="SpaceScience">Astronomy & Space Science</option>
                <option value="Mathematics">Applied Mathematics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
                Class / Grade Level
              </label>
              <select
                value={genGrade}
                onChange={(e) => setGenGrade(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '2.5px solid #17140d', backgroundColor: '#fdfbf7',
                  fontSize: 14, fontWeight: 700
                }}
              >
                <option value="Class 6">Class 6 (Middle School)</option>
                <option value="Class 7">Class 7 (Middle School)</option>
                <option value="Class 8">Class 8 (Middle School)</option>
                <option value="Class 9">Class 9 (High School)</option>
                <option value="Class 10">Class 10 (Board Exam Level)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
                Specific Topic or Question
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Gravity, Electric Circuit, Water Cycle"
                required
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '2.5px solid #17140d', backgroundColor: '#fdfbf7',
                  fontSize: 14, fontWeight: 700
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
                Hero Character Name (Optional)
              </label>
              <input
                type="text"
                value={genCharacterName}
                onChange={(e) => setGenCharacterName(e.target.value)}
                placeholder="e.g. Leo, Priya, Tara, Arjun"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12,
                  border: '2.5px solid #17140d', backgroundColor: '#fdfbf7',
                  fontSize: 14, fontWeight: 700
                }}
              />
            </div>
          </form>

          {/* Roleplay Mode Option */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            backgroundColor: '#f5efe2', padding: '14px 20px', borderRadius: 14,
            border: '2px solid #17140d', marginBottom: 28
          }}>
            <input
              type="checkbox"
              id="firstPersonCheck"
              checked={isFirstPersonMode}
              onChange={(e) => setIsFirstPersonMode(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label htmlFor="firstPersonCheck" style={{ fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
              Enable "Become the Character Mode" (Student roleplays in 1st-person: "You are Leo the Leaf saving the forest!")
            </label>
          </div>

          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="btn-candy primary"
            style={{
              padding: '14px 32px', fontSize: 16, gap: 10,
              opacity: isGenerating ? 0.6 : 1, cursor: isGenerating ? 'wait' : 'pointer'
            }}
          >
            <Sparkles size={18} />
            <span>{isGenerating ? 'Gemini is Crafting Cartoon Adventure & Video...' : 'Generate Cartoon Adventure Now'}</span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 4: STUDENT RETENTION & LEARNING ANALYTICS (REAL-TIME CHART.JS)
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'analytics' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #17140d',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '8px 8px 0 #17140d'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  backgroundColor: '#2bd980', color: '#17140d',
                  padding: '3px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 900,
                  border: '1.5px solid #17140d', display: 'inline-flex', alignItems: 'center', gap: 6
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#059669', animation: 'pulse 1.5s infinite' }} />
                  LIVE REAL-TIME DATA STREAM
                </span>
                <span style={{ fontSize: 12, color: '#666', fontWeight: 700 }}>
                  Active User: {userId}
                </span>
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 0' }}>
                Your Real-Time Learning Analytics
              </h3>
            </div>

            <button
              onClick={() => setActiveView('catalog')}
              className="btn-candy secondary"
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              ← Back to Catalog
            </button>
          </div>

          {/* Metric KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 18,
            marginBottom: 36
          }}>
            {[
              {
                label: 'Retention Score',
                val: `${analytics?.retentionScore !== undefined ? analytics.retentionScore : 100}%`,
                sub: `${analytics?.correctDecisions || 0} / ${analytics?.decisionsMade || 0} decisions correct`,
                bg: '#efffed', col: '#047857'
              },
              {
                label: 'Time Spent Learning',
                val: `${Math.max(1, analytics?.totalLearningMinutes || 0)} min${(analytics?.totalLearningMinutes || 0) === 1 ? '' : 's'}`,
                sub: 'Live active session timer',
                bg: '#fef3c7', col: '#b45309'
              },
              {
                label: 'Stories Completed',
                val: `${analytics?.completedStories?.length || 0}`,
                sub: `${analytics?.storiesStarted || 0} stories explored`,
                bg: '#eff6ff', col: '#1d4ed8'
              },
              {
                label: 'Favorite Character',
                val: analytics?.favoriteCharacter || 'Leo the Leaf',
                sub: 'Most played guide',
                bg: '#fdf4ff', col: '#a21caf'
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: kpi.bg,
                  border: '2.5px solid #17140d',
                  borderRadius: 18,
                  padding: '20px',
                  boxShadow: '4px 4px 0 #17140d'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: '#444', textTransform: 'uppercase' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: kpi.col, margin: '6px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {kpi.val}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Chart.js Real-Time Visualizations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 28
          }}>
            {/* Chart 1: Subject Engagement Distribution */}
            <div style={{
              backgroundColor: '#fdfbf7',
              border: '2.5px solid #17140d',
              borderRadius: 20,
              padding: '24px',
              boxShadow: '4px 4px 0 #17140d'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  Real-Time Subject Distribution
                </h4>
                <span style={{ fontSize: 11, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 9999, fontWeight: 800 }}>
                  Live Data
                </span>
              </div>
              <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut
                  data={{
                    labels: ['Biology', 'Physics', 'Chemistry', 'Space Science', 'Mathematics'],
                    datasets: [
                      {
                        data: [
                          analytics?.subjectBreakdown?.Biology || (analytics?.completedStories?.includes('leo_leaf') ? 1 : 1),
                          analytics?.subjectBreakdown?.Physics || (analytics?.completedStories?.includes('eddy_electron') ? 1 : 0),
                          analytics?.subjectBreakdown?.Chemistry || (analytics?.completedStories?.includes('atomia_quest') ? 1 : 0),
                          analytics?.subjectBreakdown?.SpaceScience || 0,
                          analytics?.subjectBreakdown?.Mathematics || 0
                        ],
                        backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'],
                        borderColor: '#17140d',
                        borderWidth: 2,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>
            </div>

            {/* Chart 2: Daily Learning Minutes */}
            <div style={{
              backgroundColor: '#fdfbf7',
              border: '2.5px solid #17140d',
              borderRadius: 20,
              padding: '24px',
              boxShadow: '4px 4px 0 #17140d'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                  Real-Time Session Velocity (Minutes)
                </h4>
                <span style={{ fontSize: 11, backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 9999, fontWeight: 800 }}>
                  Active Today
                </span>
              </div>
              <div style={{ height: 240 }}>
                <Bar
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
                    datasets: [
                      {
                        label: 'Minutes Spent',
                        data: [15, 20, 10, 25, 18, 30, Math.max(1, analytics?.totalLearningMinutes || 0)],
                        backgroundColor: '#ffc531',
                        borderColor: '#17140d',
                        borderWidth: 2,
                        borderRadius: 6
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CSS Animations for Characters & Environment ─────────── */}
      <style>{`
        @keyframes walk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(4deg); }
        }
        @keyframes jump {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-16px) scale(1.1); }
        }
        @keyframes think {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes work {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-6deg); }
          75% { transform: rotate(6deg); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-14px) rotate(8deg); }
        }
        .animate-walk { animation: walk 0.8s ease-in-out infinite; }
        .animate-jump { animation: jump 0.6s ease-in-out infinite; }
        .animate-think { animation: think 1.2s ease-in-out infinite; }
        .animate-work { animation: work 0.8s ease-in-out infinite; }
        .animate-idle { animation: float 2.5s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}
