import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Sparkles, Play, Pause, RotateCcw, Volume2, VolumeX,
  ChevronRight, Award, Compass, ArrowLeft, Wand2, BarChart3, Database,
  CheckCircle2, AlertCircle, HelpCircle, User, Zap, Film, Beaker,
  Maximize2, Eye, Flame, Star
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
import { Bar, Doughnut, Line as LineChart } from 'react-chartjs-2';
import { api } from '../services/api';

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

/* ─── Animated Character Puppet Component ──────────────────────── */
function AnimatedCharacter({ character, action, isSpeaking, isFirstPerson }) {
  const getActionClass = () => {
    switch (action) {
      case 'walk': return 'animate-walk';
      case 'celebrate': return 'animate-jump';
      case 'think': return 'animate-think';
      case 'experiment': return 'animate-work';
      default: return 'animate-idle';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
      {/* Speech bubble thought indicator */}
      {isSpeaking && (
        <div style={{
          position: 'absolute', top: -38,
          background: '#ffffff', border: '2.5px solid #17140d',
          borderRadius: '999px', padding: '4px 12px',
          fontSize: '11px', fontWeight: 800, color: '#17140d',
          boxShadow: '3px 3px 0 #17140d', whiteSpace: 'nowrap',
          animation: 'bounce 1s infinite alternate'
        }}>
          💬 Speaking...
        </div>
      )}

      {/* Main Avatar Circle */}
      <div
        className={getActionClass()}
        style={{
          width: 96, height: 96,
          borderRadius: '50%',
          backgroundColor: '#ffc531',
          border: '4px solid #17140d',
          boxShadow: '6px 6px 0 #17140d',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px',
          transition: 'transform 0.3s ease',
          transform: isSpeaking ? 'scale(1.08)' : 'scale(1)',
          position: 'relative',
        }}
      >
        {character?.avatar || '🧑‍🔬'}

        {/* Emotion icon indicator */}
        <span style={{
          position: 'absolute', bottom: -4, right: -4,
          backgroundColor: '#ffffff', border: '2px solid #17140d',
          borderRadius: '50%', width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
        }}>
          {action === 'celebrate' ? '🎉' : action === 'think' ? '💡' : action === 'experiment' ? '⚗️' : '✨'}
        </span>
      </div>

      {/* Character Name Tag */}
      <div style={{
        marginTop: 8,
        backgroundColor: '#17140d',
        color: '#ffffff',
        padding: '3px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 800,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        {isFirstPerson ? '🌟 YOU' : character?.name || 'Hero'}
      </div>
    </div>
  );
}

export default function StoryMode() {
  // Navigation views: 'catalog' | 'player' | 'generator' | 'analytics' | 'supabase_sql'
  const [activeView, setActiveView] = useState('catalog');

  // Stories Catalog
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Analytics
  const [analytics, setAnalytics] = useState(null);

  const userId = localStorage.getItem('vidyaverse_userId') || 'guest_user';

  // ── Load Stories & Analytics on Mount ──────────────────────────────
  useEffect(() => {
    loadStoriesCatalog();
    loadAnalytics();
  }, []);

  const loadStoriesCatalog = async () => {
    setLoading(true);
    const res = await api.getStories();
    if (res && res.stories) {
      setStories(res.stories);
      if (!selectedStory && res.stories.length > 0) {
        setSelectedStory(res.stories[0]);
      }
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    const res = await api.getStoryAnalytics(userId);
    if (res && res.analytics) {
      setAnalytics(res.analytics);
    }
  };

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

  // Trigger narration whenever current scene or phase updates
  useEffect(() => {
    if (activeView === 'player' && selectedStory && playerPhase === 'scene') {
      const scene = selectedStory.scenes[currentSceneIdx];
      if (scene) {
        const fullText = `${scene.narration} ${scene.character_speaking} says: ${scene.dialogue}`;
        speakText(fullText, 0.95, isFirstPersonMode ? 1.05 : 1.0);
      }
    }
    return () => stopVoice();
  }, [activeView, selectedStory, currentSceneIdx, playerPhase, isVoiceMuted]);

  // ── Start Story Adventure ──────────────────────────────────────────
  const startStory = (story, firstPerson = false) => {
    setSelectedStory(story);
    setIsFirstPersonMode(firstPerson);
    setCurrentSceneIdx(0);
    setPlayerPhase('scene');
    setSelectedOption(null);
    setDecisionFeedback(null);
    setQuizIdx(0);
    setQuizScore(0);
    setActiveView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Next Scene / Checkpoint Handler ────────────────────────────────
  const handleProceedScene = () => {
    stopVoice();
    const scene = selectedStory.scenes[currentSceneIdx];
    if (scene.decision_point && scene.decision_point.has_decision && !decisionFeedback?.is_correct) {
      setPlayerPhase('decision');
    } else {
      if (currentSceneIdx + 1 < selectedStory.scenes.length) {
        setCurrentSceneIdx(prev => prev + 1);
        setSelectedOption(null);
        setDecisionFeedback(null);
        setPlayerPhase('scene');
      } else {
        // Story completed -> Transition to Simulation or Quiz
        setPlayerPhase('simulation');
      }
    }
  };

  // ── Decision Point Option Selection ────────────────────────────────
  const handleSelectOption = (opt) => {
    setSelectedOption(opt.id);
    setDecisionFeedback(opt);

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
    const currentQ = selectedStory.quiz[quizIdx];
    const isCorrect = choiceIdx === currentQ.correct_index;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      if (quizIdx + 1 < selectedStory.quiz.length) {
        setQuizIdx(prev => prev + 1);
        setSelectedQuizAnswer(null);
        setShowQuizExplanation(false);
      } else {
        // Quiz Complete!
        setPlayerPhase('celebration');
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
        // Save progress to backend
        api.saveStoryProgress({
          userId,
          storyId: selectedStory.id,
          storyTitle: selectedStory.title,
          completed: true,
          quizScore: Math.round(((quizScore + (isCorrect ? 1 : 0)) / selectedStory.quiz.length) * 100),
          timeSpentSeconds: 240,
          decisionsCount: selectedStory.scenes.length
        });
        loadAnalytics();
      }
    }, 2000);
  };

  // ── AI Story Generator Handler ─────────────────────────────────────
  const handleGenerateStory = async (e) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await api.generateAIStory({
        subject: genSubject,
        topic: genTopic.trim(),
        grade: genGrade,
        isFirstPerson: isFirstPersonMode,
        characterName: genCharacterName.trim()
      });

      if (res && res.story) {
        setStories(prev => [res.story, ...prev]);
        setSelectedStory(res.story);
        setIsGenerating(false);
        startStory(res.story, isFirstPersonMode);
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER VIEWS
  // ══════════════════════════════════════════════════════════════════

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#17140d' }}>
      
      {/* ── Navigation Strip ────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 28,
        backgroundColor: '#ffffff', border: '3px solid #17140d',
        borderRadius: 20, padding: '14px 22px', boxShadow: '5px 5px 0 #17140d'
      }}>
        {/* Brand pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: '#ff5b57', border: '2.5px solid #17140d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, boxShadow: '2px 2px 0 #17140d'
          }}>
            🎬
          </div>
          <div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              StoryVerse <span style={{ color: '#ff5b57' }}>Learning Mode</span>
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: '#555', fontWeight: 600 }}>
              Disney/Pixar Cartoon Adventures • Voice Narration • Decisions • PhET Simulations
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => { stopVoice(); setActiveView('catalog'); }}
            className={`btn-candy ${activeView === 'catalog' ? 'primary' : 'secondary'}`}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            <Film size={15} /> Story Adventures ({stories.length})
          </button>

          <button
            onClick={() => { stopVoice(); setActiveView('generator'); }}
            className={`btn-candy ${activeView === 'generator' ? 'teal' : 'secondary'}`}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            <Wand2 size={15} /> AI Story Creator
          </button>

          <button
            onClick={() => { stopVoice(); setActiveView('analytics'); }}
            className={`btn-candy ${activeView === 'analytics' ? 'violet' : 'secondary'}`}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            <BarChart3 size={15} /> Learning Stats
          </button>

          <button
            onClick={() => setActiveView('supabase_sql')}
            className={`btn-candy ${activeView === 'supabase_sql' ? 'primary' : 'secondary'}`}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            <Database size={15} /> Supabase Schema
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VIEW 1: STORY CATALOG & NETFLIX KIDS CAROUSEL
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'catalog' && (
        <div>
          {/* Spotlight Banner (Featured Pixar Adventure) */}
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
              {/* Floating cartoon props */}
              <div style={{ position: 'absolute', top: -10, right: 20, fontSize: 120, opacity: 0.15, userSelect: 'none' }}>
                🚀
              </div>

              <div style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{
                    backgroundColor: '#ffc531', color: '#17140d',
                    padding: '4px 12px', borderRadius: 9999,
                    fontSize: 12, fontWeight: 800, border: '2px solid #17140d'
                  }}>
                    🌟 FEATURED ADVENTURE
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

                {/* Character preview row */}
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

                {/* Dual Play Buttons */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => startStory(selectedStory, false)}
                    className="btn-candy"
                    style={{
                      backgroundColor: '#ffc531', color: '#17140d',
                      padding: '14px 26px', fontSize: 16, gap: 10,
                      boxShadow: '4px 4px 0 #17140d'
                    }}
                  >
                    <Play size={20} fill="#17140d" /> Watch & Play Story
                  </button>

                  <button
                    onClick={() => startStory(selectedStory, true)}
                    className="btn-candy"
                    style={{
                      backgroundColor: '#ffffff', color: '#17140d',
                      padding: '14px 24px', fontSize: 15, gap: 10,
                      boxShadow: '4px 4px 0 #17140d'
                    }}
                  >
                    <User size={18} /> "Become the Character" Mode (RPG)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Grid */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
              Explore Cartoon Adventures ({stories.length})
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
                      <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.9 }}>
                        {story.scenes?.length || 3} Interactive Scenes
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
                        onClick={(e) => { e.stopPropagation(); startStory(story, false); }}
                        className="btn-candy primary"
                        style={{ flex: 1, padding: '10px 0', fontSize: 13 }}
                      >
                        <Play size={14} /> Play
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); startStory(story, true); }}
                        className="btn-candy secondary"
                        style={{ padding: '10px 14px', fontSize: 13 }}
                        title="Play in First Person Roleplay"
                      >
                        <User size={14} /> RPG
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
                  {isFirstPersonMode ? '🎮 BECOME THE CHARACTER MODE' : '🎬 CARTOON ADVENTURE'}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#f5efe2' }}>
                  {selectedStory.title}
                </h3>
              </div>
            </div>

            {/* Audio & Narration Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => {
                  if (isVoicePlaying) {
                    stopVoice();
                  } else {
                    const scene = selectedStory.scenes[currentSceneIdx];
                    speakText(`${scene.narration} ${scene.character_speaking} says: ${scene.dialogue}`);
                  }
                }}
                className="btn-candy"
                style={{
                  backgroundColor: isVoicePlaying ? '#ff5b57' : '#ffc531',
                  color: '#17140d', padding: '6px 14px', fontSize: 12, gap: 6
                }}
              >
                {isVoicePlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isVoicePlaying ? 'Pause Voice' : 'Play Voice'}</span>
              </button>

              <button
                onClick={() => {
                  stopVoice();
                  const scene = selectedStory.scenes[currentSceneIdx];
                  speakText(`${scene.narration} ${scene.character_speaking} says: ${scene.dialogue}`);
                }}
                style={{
                  backgroundColor: 'transparent', border: '2px solid #ffc531',
                  color: '#ffc531', borderRadius: 9999, padding: '6px 12px',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4
                }}
                title="Replay Scene Narration"
              >
                <RotateCcw size={14} /> Replay
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
          </div>

          {/* Scene Progress Indicator */}
          <div style={{
            backgroundColor: '#e8e2d8', height: 8, width: '100%',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentSceneIdx + 1) / selectedStory.scenes.length) * 100}%`,
              backgroundColor: '#ff5b57',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>

          {/* ── STAGE 1: ANIMATED SCENE DISPLAY ─────────────────────── */}
          {(playerPhase === 'scene' || playerPhase === 'decision') && (
            <div>
              {/* Animated Cartoon Stage Viewport */}
              {(() => {
                const currentScene = selectedStory.scenes[currentSceneIdx];
                const theme = SCENE_THEMES[currentScene.background_type] || SCENE_THEMES.forest;
                const speaker = selectedStory.characters?.find(c => c.name === currentScene.character_speaking) || {
                  name: currentScene.character_speaking,
                  avatar: '🧑‍🔬'
                };

                return (
                  <div style={{
                    background: theme.gradient,
                    minHeight: 460,
                    position: 'relative',
                    padding: '36px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderBottom: '3px solid #17140d',
                    overflow: 'hidden'
                  }}>
                    {/* Animated Environment Floaters (Sunbeams/Bubbles/Stars) */}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                      <span style={{
                        backgroundColor: 'rgba(23, 20, 13, 0.85)', color: '#ffc531',
                        border: '2px solid #ffc531', borderRadius: 9999,
                        padding: '4px 14px', fontSize: 12, fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        🎬 SCENE {currentScene.scene_number}: {currentScene.title}
                      </span>

                      <span style={{
                        backgroundColor: '#ffffff', color: '#17140d',
                        border: '2px solid #17140d', borderRadius: 9999,
                        padding: '4px 12px', fontSize: 12, fontWeight: 800
                      }}>
                        📍 Environment: {theme.name}
                      </span>
                    </div>

                    {/* Center Animated Character & Action */}
                    <div style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      gap: 32, my: 20, zIndex: 10
                    }}>
                      <AnimatedCharacter
                        character={speaker}
                        action={currentScene.character_action}
                        isSpeaking={isVoicePlaying}
                        isFirstPerson={isFirstPersonMode && currentScene.character_speaking === selectedStory.characters[0]?.name}
                      />
                    </div>

                    {/* Disney/Pixar Dialogue Subtitle Box */}
                    <div style={{
                      backgroundColor: 'rgba(23, 20, 13, 0.92)',
                      border: '3px solid #ffc531',
                      borderRadius: 20,
                      padding: '22px 26px',
                      color: '#ffffff',
                      boxShadow: '6px 6px 0 #17140d',
                      zIndex: 10,
                      backdropFilter: 'blur(6px)'
                    }}>
                      <div style={{ fontSize: 13, color: '#ffc531', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                        🎙️ {speaker.name} says:
                      </div>

                      <p style={{
                        fontSize: 18, fontWeight: 700, lineHeight: 1.5,
                        color: '#fef08a', margin: '0 0 10px 0',
                        fontFamily: "'Bricolage Grotesque', sans-serif"
                      }}>
                        "{currentScene.dialogue}"
                      </p>

                      <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                        📖 {currentScene.narration}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Interactive Control & Checkpoint Area */}
              <div style={{ padding: '28px 32px', backgroundColor: '#f5efe2' }}>
                {/* Decision Checkpoint Modal when phase === 'decision' */}
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
                          {selectedStory.scenes[currentSceneIdx]?.decision_point?.prompt}
                        </h4>
                      </div>
                    </div>

                    {/* Options A, B, C */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                      {selectedStory.scenes[currentSceneIdx]?.decision_point?.options?.map((opt) => {
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
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#17140d',
                              boxShadow: '3px 3px 0 #17140d',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.15s'
                            }}
                          >
                            <span><strong>Option {opt.id}:</strong> {opt.text}</span>
                            {isSelected && decisionFeedback && (
                              <span>{decisionFeedback.is_correct ? '✅' : '❌'}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback and Continue */}
                    {decisionFeedback && (
                      <div style={{
                        backgroundColor: decisionFeedback.is_correct ? '#ecfdf5' : '#fef2f2',
                        border: `2px solid ${decisionFeedback.is_correct ? '#10b981' : '#ef4444'}`,
                        borderRadius: 12, padding: '12px 16px', marginBottom: 16,
                        fontSize: 14, color: decisionFeedback.is_correct ? '#065f46' : '#991b1b',
                        fontWeight: 600
                      }}>
                        {decisionFeedback.feedback}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      {decisionFeedback && decisionFeedback.is_correct ? (
                        <button
                          onClick={() => {
                            if (currentSceneIdx + 1 < selectedStory.scenes.length) {
                              setCurrentSceneIdx(prev => prev + 1);
                              setSelectedOption(null);
                              setDecisionFeedback(null);
                              setPlayerPhase('scene');
                            } else {
                              setPlayerPhase('simulation');
                            }
                          }}
                          className="btn-candy primary"
                          style={{ padding: '10px 24px', fontSize: 14 }}
                        >
                          Continue Adventure ➔
                        </button>
                      ) : (
                        <span style={{ fontSize: 13, color: '#666', fontStyle: 'italic', alignSelf: 'center' }}>
                          Select the correct scientific action to move forward!
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard Scene Action Bar */
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#666' }}>
                        Scene {currentSceneIdx + 1} of {selectedStory.scenes.length}
                      </span>
                    </div>

                    <button
                      onClick={handleProceedScene}
                      className="btn-candy teal"
                      style={{ padding: '12px 28px', fontSize: 15, gap: 8 }}
                    >
                      <span>
                        {currentSceneIdx + 1 < selectedStory.scenes.length ? 'Next Scene' : 'Complete Story & Launch Simulation'}
                      </span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 2: PHET / INTERACTIVE SIMULATION INTEGRATION ── */}
          {playerPhase === 'simulation' && (
            <div style={{ padding: '36px 32px', backgroundColor: '#f0fbfa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{
                    backgroundColor: '#12b3a4', color: '#ffffff',
                    padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                    border: '1.5px solid #17140d'
                  }}>
                    PHASE 2: DIRECT HANDS-ON SIMULATION
                  </span>
                  <h3 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 0' }}>
                    {selectedStory.simulation_target?.name || 'Interactive Science Lab'}
                  </h3>
                  <p style={{ fontSize: 14, color: '#096b62', margin: '4px 0 0' }}>
                    💡 {selectedStory.simulation_target?.learning_hook}
                  </p>
                </div>

                <button
                  onClick={() => setPlayerPhase('quiz')}
                  className="btn-candy primary"
                  style={{ padding: '12px 24px', fontSize: 15 }}
                >
                  Proceed to Mastery Quiz ➔
                </button>
              </div>

              {/* Embedded Simulation Iframe */}
              <div style={{
                border: '3px solid #17140d', borderRadius: 20,
                overflow: 'hidden', boxShadow: '6px 6px 0 #17140d',
                backgroundColor: '#ffffff'
              }}>
                <iframe
                  src={selectedStory.simulation_target?.url || 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html'}
                  title="PhET Simulation"
                  style={{ width: '100%', height: 580, border: 'none' }}
                  allow="fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* ── STAGE 3: POST-STORY MASTERY QUIZ ───────────────────── */}
          {playerPhase === 'quiz' && (
            <div style={{ padding: '36px 32px', backgroundColor: '#fffbf0' }}>
              <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <span style={{
                    backgroundColor: '#ffc531', color: '#17140d',
                    padding: '4px 14px', borderRadius: 9999,
                    fontSize: 12, fontWeight: 800, border: '2px solid #17140d'
                  }}>
                    🎯 POST-ADVENTURE MASTERY QUIZ
                  </span>
                  <h3 style={{ fontSize: 26, fontWeight: 800, margin: '8px 0 0' }}>
                    Question {quizIdx + 1} of {selectedStory.quiz.length}
                  </h3>
                  <p style={{ fontSize: 14, color: '#666', margin: '4px 0 0' }}>
                    Score: {quizScore} / {quizIdx}
                  </p>
                </div>

                {/* Question Card */}
                {(() => {
                  const q = selectedStory.quiz[quizIdx];
                  return (
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '3px solid #17140d',
                      borderRadius: 20,
                      padding: '28px 26px',
                      boxShadow: '6px 6px 0 #17140d',
                      marginBottom: 20
                    }}>
                      <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, lineHeight: 1.4 }}>
                        {q.question}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {q.options.map((opt, idx) => {
                          const isSelected = selectedQuizAnswer === idx;
                          let bg = '#f5efe2';
                          let borderCol = '#17140d';

                          if (showQuizExplanation) {
                            if (idx === q.correct_index) {
                              bg = '#d1fae5';
                              borderCol = '#059669';
                            } else if (isSelected) {
                              bg = '#fee2e2';
                              borderCol = '#dc2626';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => !showQuizExplanation && handleQuizAnswer(idx)}
                              disabled={showQuizExplanation}
                              style={{
                                padding: '14px 18px',
                                borderRadius: 14,
                                border: `2.5px solid ${borderCol}`,
                                backgroundColor: bg,
                                textAlign: 'left',
                                cursor: showQuizExplanation ? 'default' : 'pointer',
                                fontWeight: 700,
                                fontSize: 14,
                                color: '#17140d',
                                boxShadow: '2px 2px 0 #17140d'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizExplanation && (
                        <div style={{
                          marginTop: 18,
                          backgroundColor: '#ecfdf5',
                          border: '2px solid #10b981',
                          borderRadius: 12, padding: '12px 16px',
                          fontSize: 13, color: '#065f46', fontWeight: 600
                        }}>
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ── STAGE 4: CELEBRATION & REWARDS ─────────────────────── */}
          {playerPhase === 'celebration' && (
            <div style={{ padding: '60px 32px', textAlign: 'center', backgroundColor: '#efffed' }}>
              <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>

              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 36, fontWeight: 800, margin: '0 0 8px' }}>
                Adventure Completed!
              </h2>

              <p style={{ fontSize: 16, color: '#047857', fontWeight: 600, maxWidth: 540, margin: '0 auto 24px' }}>
                You guided your characters through scientific challenges, experimented with simulations, and aced the quiz!
              </p>

              {/* Scorecard */}
              <div style={{
                display: 'inline-flex', gap: 24,
                backgroundColor: '#ffffff', border: '3px solid #17140d',
                borderRadius: 20, padding: '20px 36px', boxShadow: '6px 6px 0 #17140d',
                marginBottom: 32
              }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#ff5b57' }}>
                    {quizScore} / {selectedStory.quiz.length}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#666' }}>Quiz Score</div>
                </div>

                <div style={{ width: 2, backgroundColor: '#e2e8f0' }} />

                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#ffc531' }}>+250</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#666' }}>XP Earned</div>
                </div>

                <div style={{ width: 2, backgroundColor: '#e2e8f0' }} />

                <div>
                  <div style={{ fontSize: 28 }}>🏅</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#666' }}>Mastery Badge</div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => { stopVoice(); setActiveView('catalog'); }}
                  className="btn-candy primary"
                  style={{ padding: '14px 32px', fontSize: 16 }}
                >
                  Back to Adventure Library ➔
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 3: TEACHER & CREATOR AI STORY GENERATOR STUDIO
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'generator' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #17140d',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '8px 8px 0 #17140d'
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span style={{
                backgroundColor: '#12b3a4', color: '#ffffff',
                padding: '4px 14px', borderRadius: 9999,
                fontSize: 12, fontWeight: 800, border: '2px solid #17140d'
              }}>
                🪄 GEMINI AI EDUCATIONAL CARTOON STUDIO
              </span>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, margin: '8px 0 6px' }}>
                Generate a Pixar-Style Adventure with No Code
              </h3>
              <p style={{ fontSize: 14, color: '#555', margin: 0 }}>
                Teachers & students: Enter any science or math topic. Gemini AI will automatically script characters, dialogues, decision checkpoints, simulations, and quiz questions!
              </p>
            </div>

            <form onSubmit={handleGenerateStory}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 18 }}>
                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                    Subject:
                  </label>
                  <select
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: 12, border: '2px solid #17140d',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      backgroundColor: '#f5efe2', fontWeight: 700
                    }}
                  >
                    <option value="Biology">Biology (Cells, Genetics, Ecology)</option>
                    <option value="Physics">Physics (Mechanics, Electricity, Light)</option>
                    <option value="Chemistry">Chemistry (Atoms, Bonding, Reactions)</option>
                    <option value="Mathematics">Mathematics (Fractions, Geometry, Algebra)</option>
                    <option value="Space Science">Space Science & Astronomy</option>
                    <option value="Environmental Science">Environmental Science & Ecology</option>
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                    Class / Grade Level:
                  </label>
                  <select
                    value={genGrade}
                    onChange={(e) => setGenGrade(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: 12, border: '2px solid #17140d',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      backgroundColor: '#f5efe2', fontWeight: 700
                    }}
                  >
                    {['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic Input */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                  Curriculum Topic / Concept:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Newton's 3rd Law, Photosynthesis, Water Cycle, Pythagorean Theorem..."
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    borderRadius: 12, border: '2px solid #17140d',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>

              {/* Roleplay Mode Option */}
              <div style={{
                backgroundColor: '#efffed',
                border: '2px solid #12b3a4',
                borderRadius: 14, padding: '16px 20px',
                marginBottom: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#096b62' }}>
                    🎮 "Become the Character" Mode (1st-Person RPG)
                  </div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                    The student is cast as the lead character (e.g. "You are Leo the Leaf") with choices directing survival.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFirstPersonMode(!isFirstPersonMode)}
                  className="btn-candy"
                  style={{
                    backgroundColor: isFirstPersonMode ? '#2bd980' : '#ffffff',
                    color: '#17140d', fontSize: 13, padding: '6px 14px'
                  }}
                >
                  {isFirstPersonMode ? '✓ Roleplay Enabled' : 'Enable RPG Mode'}
                </button>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-candy primary"
                  style={{
                    padding: '14px 36px', fontSize: 16, gap: 10,
                    width: '100%', maxWidth: 380
                  }}
                >
                  <Wand2 size={20} />
                  <span>{isGenerating ? 'Gemini AI is Scripting Adventure...' : '⚡ Generate StoryVerse Adventure'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 4: LEARNING ANALYTICS DASHBOARD (CHART.JS)
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'analytics' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #17140d',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '8px 8px 0 #17140d'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{
                backgroundColor: '#6b5be6', color: '#ffffff',
                padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                border: '1.5px solid #17140d'
              }}>
                STUDENT STORY ANALYTICS
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 0' }}>
                Concept Retention & Storyverse Progress
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

          {/* Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16, marginBottom: 32
          }}>
            <div style={{
              backgroundColor: '#efffed', border: '2.5px solid #17140d',
              borderRadius: 16, padding: '18px 20px', boxShadow: '3px 3px 0 #17140d'
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#096b62', textTransform: 'uppercase' }}>Stories Completed</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#17140d', marginTop: 4 }}>
                {analytics?.completedStoriesCount || 4}
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff8e6', border: '2.5px solid #17140d',
              borderRadius: 16, padding: '18px 20px', boxShadow: '3px 3px 0 #17140d'
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>Time Spent Learning</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#17140d', marginTop: 4 }}>
                {analytics?.totalLearningMinutes || 48} mins
              </div>
            </div>

            <div style={{
              backgroundColor: '#f4f2ff', border: '2.5px solid #17140d',
              borderRadius: 16, padding: '18px 20px', boxShadow: '3px 3px 0 #17140d'
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#6b5be6', textTransform: 'uppercase' }}>Knowledge Retention</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#17140d', marginTop: 4 }}>
                {analytics?.retentionScore || 92}%
              </div>
            </div>

            <div style={{
              backgroundColor: '#fff0f0', border: '2.5px solid #17140d',
              borderRadius: 16, padding: '18px 20px', boxShadow: '3px 3px 0 #17140d'
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ff5b57', textTransform: 'uppercase' }}>Favourite Character</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#17140d', marginTop: 8 }}>
                🍃 Leo the Leaf
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24
          }}>
            {/* Chart 1: Subject Distribution (Doughnut) */}
            <div style={{
              border: '2.5px solid #17140d', borderRadius: 18,
              padding: '20px', backgroundColor: '#fcfbf8',
              boxShadow: '4px 4px 0 #17140d'
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
                Stories Completed by Subject
              </h4>
              <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut
                  data={{
                    labels: ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Space Science'],
                    datasets: [{
                      data: [3, 2, 2, 1, 1],
                      backgroundColor: ['#10b981', '#f59e0b', '#6366f1', '#ff5b57', '#3b82f6'],
                      borderColor: '#17140d',
                      borderWidth: 2,
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { font: { family: "'DM Sans', sans-serif", weight: 700 } } }
                    }
                  }}
                />
              </div>
            </div>

            {/* Chart 2: Weekly Learning Minutes (Bar) */}
            <div style={{
              border: '2.5px solid #17140d', borderRadius: 18,
              padding: '20px', backgroundColor: '#fcfbf8',
              boxShadow: '4px 4px 0 #17140d'
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
                Weekly Interactive Learning (Minutes)
              </h4>
              <div style={{ height: 240 }}>
                <Bar
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                      label: 'Minutes',
                      data: [12, 18, 8, 24, 15, 30, 20],
                      backgroundColor: '#ffc531',
                      borderColor: '#17140d',
                      borderWidth: 2,
                      borderRadius: 6,
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { grid: { color: '#e2e8f0' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW 5: SUPABASE SCHEMA & DATABASE INTEGRATION GUIDE
         ══════════════════════════════════════════════════════════════ */}
      {activeView === 'supabase_sql' && (
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
                backgroundColor: '#2bd980', color: '#17140d',
                padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                border: '1.5px solid #17140d'
              }}>
                SUPABASE PRODUCTION TABLES
              </span>
              <h3 style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 0' }}>
                StoryVerse PostgreSQL Schema
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

          <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
            Run this in your **Supabase SQL Editor** to enable permanent persistence for stories, student choices, and quiz analytics:
          </p>

          <pre style={{
            backgroundColor: '#17140d', color: '#86efac',
            padding: '20px 24px', borderRadius: 16,
            fontSize: 13, fontFamily: 'monospace',
            overflowX: 'auto', lineHeight: 1.6,
            border: '3px solid #17140d'
          }}>
{`-- 1. Stories Catalog Table
create table public.stories (
  id text primary key,
  title text not null,
  subtitle text,
  subject text not null,
  topic text not null,
  grade text not null,
  cover_gradient text,
  characters jsonb default '[]'::jsonb,
  learning_objectives text[],
  scenes jsonb not null,
  simulation_target jsonb,
  quiz jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Story Progress Table (Tracks completion & retention)
create table public.story_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  story_id text references public.stories(id),
  completed boolean default false,
  quiz_score integer default 0,
  time_spent_seconds integer default 0,
  simulation_completed boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Story Choices Table (Tracks student decisions at checkpoints)
create table public.story_choices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  story_id text references public.stories(id),
  scene_number integer not null,
  option_chosen text not null,
  is_correct boolean not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.stories enable row level security;
alter table public.story_progress enable row level security;
alter table public.story_choices enable row level security;

create policy "Stories viewable by all." on public.stories for select using (true);
create policy "Users track their own story progress." on public.story_progress for all using (auth.uid() = user_id);
create policy "Users track their own story choices." on public.story_choices for all using (auth.uid() = user_id);`}
          </pre>
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
