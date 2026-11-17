import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Volume2,
  Mic,
  MicOff,
  Compass,
  Beaker,
  Camera,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Layers,
  ChevronRight,
  Flame,
  ArrowRight,
  RefreshCw,
  Cpu,
  Brain,
  Lightbulb,
} from 'lucide-react';
import {
  queryMentorAI,
  MENTOR_PERSONAS,
  LEARNING_STYLES,
  MENTOR_CURATED_KNOWLEDGE,
  getMentorSessionAnalytics,
  logConceptInteraction,
} from '../services/mentorAiEngine';

export default function MentorAI({ currentLang = 'en', onNavigate }) {
  // Mentor & Student Context States
  const [selectedPersona, setSelectedPersona] = useState('kalam');
  const [selectedStyle, setSelectedStyle] = useState('visual');
  const [studentGrade, setStudentGrade] = useState('Class 8-10');

  // Interactive Tab Modes
  // 'ask' | 'misconceptions' | 'experiments' | 'analytics'
  const [activeMode, setActiveMode] = useState('ask');

  // Doubt Query & Loading States
  const [inputQuery, setInputQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Audio & Speech States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interactive Quiz State inside the lesson
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState(false);

  // Session Analytics
  const [analytics, setAnalytics] = useState(getMentorSessionAnalytics());

  // Recognition ref
  const speechRecognitionRef = useRef(null);

  // Load initial default question on mount
  useEffect(() => {
    handleLoadPredefined('pump_compression');
  }, []);

  // Update analytics on state change
  const refreshAnalytics = () => {
    setAnalytics(getMentorSessionAnalytics());
  };

  // 1. Submit Query to MentorAI
  const handleAskMentor = async (queryText = inputQuery) => {
    const q = (queryText || '').trim();
    if (!q) return;

    setIsQuerying(true);
    setSelectedQuizOption(null);
    setHasAnsweredQuiz(false);

    try {
      const response = await queryMentorAI({
        question: q,
        grade: studentGrade,
        learningStyle: selectedStyle,
        persona: selectedPersona,
        language: currentLang,
      });

      if (response && response.data) {
        setCurrentLesson(response.data);
        refreshAnalytics();
      }
    } catch (err) {
      console.error('Failed to query MentorAI:', err);
    } finally {
      setIsQuerying(false);
      setInputQuery('');
    }
  };

  // 2. Load Predefined Core Knowledge Lesson
  const handleLoadPredefined = (knowledgeKey) => {
    const item = MENTOR_CURATED_KNOWLEDGE[knowledgeKey];
    if (item) {
      setCurrentLesson(item);
      setSelectedQuizOption(null);
      setHasAnsweredQuiz(false);
    }
  };

  // 3. Handle Interactive Quiz Choice
  const handleQuizSelection = (index, option) => {
    if (hasAnsweredQuiz) return;
    setSelectedQuizOption(index);
    setHasAnsweredQuiz(true);

    if (currentLesson) {
      logConceptInteraction({
        conceptName: currentLesson.concept,
        wasCorrect: option.correct,
        isWeakConcept: !option.correct,
      });
      refreshAnalytics();
    }
  };

  // 4. Voice Input (Speech to Text)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. You can type your doubt in the box!');
      return;
    }

    if (isListening) {
      if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        setInputQuery(spoken);
        handleAskMentor(spoken);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // 5. Speech Synthesis Audio Readout
  const handleReadAloud = (textToRead) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const text =
        textToRead ||
        (currentLesson
          ? `${currentLesson.intuition}. ${currentLesson.explanation.join(' ')}`
          : 'Welcome to MentorAI.');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const activePersonaData = MENTOR_PERSONAS[selectedPersona] || MENTOR_PERSONAS.kalam;

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      
      {/* ================= 1. MENTOR HEADER & CONTEXT BAR ================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              backgroundColor: '#6b5be6',
              border: '3px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              flexShrink: 0,
            }}
          >
            {activePersonaData.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 26, margin: 0 }}>MentorAI — Intelligent STEM Tutor</h3>
              <span
                style={{
                  backgroundColor: '#2bd980',
                  color: '#17140d',
                  fontSize: 11,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1.5px solid #17140d',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#047857', animation: 'pulse 1.5s infinite' }} />
                SOCRATIC AI ACTIVE
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: '#555', fontWeight: 600, margin: '4px 0 0' }}>
              {activePersonaData.title} • {activePersonaData.tagline}
            </p>
          </div>
        </div>

        {/* Learning Persona / Mentor Selector Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.values(MENTOR_PERSONAS).map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  backgroundColor: isSelected ? '#ffc531' : '#ffffff',
                  boxShadow: isSelected ? '3px 3px 0 #17140d' : '1.5px 1.5px 0 #17140d',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: 12.5,
                  transition: 'all 0.15s',
                }}
              >
                <span>{p.avatar}</span>
                <span>{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. STUDENT CONTEXT CONTROLS (GRADE & LEARNING STYLE) ================= */}
      <div
        style={{
          backgroundColor: '#f5efe2',
          borderRadius: 16,
          border: '2.5px solid #17140d',
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Grade Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#17140d' }}>
            🎓 Grade:
          </span>
          {['Class 6-8', 'Class 9-10', 'Class 11-12'].map((g) => (
            <button
              key={g}
              onClick={() => setStudentGrade(g)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                border: '1.5px solid #17140d',
                backgroundColor: studentGrade === g ? '#6b5be6' : '#ffffff',
                color: studentGrade === g ? '#ffffff' : '#17140d',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Learning Persona / Style Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#17140d' }}>
            🎨 Learning Style:
          </span>
          {Object.values(LEARNING_STYLES).map((s) => {
            const isCurrent = selectedStyle === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1.5px solid #17140d',
                  backgroundColor: isCurrent ? '#12b3a4' : '#ffffff',
                  color: isCurrent ? '#ffffff' : '#17140d',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title={s.desc}
              >
                <span>{s.icon}</span>
                <span>{s.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 3. FEATURE MODES SUB-NAV ================= */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2.5px solid #17140d', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'ask', label: '💬 Socratic Classroom (Ask Doubts)', color: '#6b5be6' },
          { id: 'misconceptions', label: '🔍 Misconception Buster (Gap Detector)', color: '#ff5b57' },
          { id: 'experiments', label: '🛠️ Pocket Lab DIY Experiments', color: '#12b3a4' },
          { id: 'analytics', label: '📊 Student Mastery Radar', color: '#ffc531' },
        ].map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              style={{
                padding: '9px 18px',
                borderRadius: 12,
                border: '2px solid #17140d',
                backgroundColor: isActive ? tab.color : '#ffffff',
                color: isActive ? '#ffffff' : '#17140d',
                boxShadow: isActive ? '3px 3px 0 #17140d' : 'none',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 13.5,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= 4. TAB MODE: ASK SOCRATIC MENTOR ================= */}
      {activeMode === 'ask' && (
        <div>
          {/* Preset Curiosity Triggers */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#17140d' }}>
                💡 Popular Village & Daily Life STEM Curiosities:
              </span>
              <span style={{ fontSize: 11, color: '#777', fontWeight: 700 }}>
                Click any curiosity to explore!
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              {[
                { id: 'pump_compression', q: '🚲 Why does my bicycle pump barrel get hot?', icon: '🔥' },
                { id: 'sky_scattering', q: '🌅 Why is the sky blue and sunset orange-red?', icon: '🌈' },
                { id: 'cooker_pressure', q: '🍲 Why does a pressure cooker cook 3x faster?', icon: '💨' },
                { id: 'ice_floating', q: '🧊 Why does solid ice float on liquid water?', icon: '💧' },
                { id: 'photosynthesis_energy', q: '🌱 How do green leaves make food from sunlight?', icon: '☀️' },
                { id: 'gravity_free_fall', q: '⚖️ Do heavy cricket balls fall faster than light balls?', icon: '🍎' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoadPredefined(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '2px solid #17140d',
                    backgroundColor: currentLesson && currentLesson.id === item.id ? '#ffc531' : '#fcfaf6',
                    boxShadow: currentLesson && currentLesson.id === item.id ? '3px 3px 0 #17140d' : '1.5px 1.5px 0 #17140d',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ask Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskMentor();
            }}
            style={{ display: 'flex', gap: 10, marginBottom: 28 }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Ask any science question (e.g. Why does salt melt ice? How do bats navigate in darkness?)"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isQuerying}
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 20px',
                  borderRadius: 9999,
                  border: '2.5px solid #17140d',
                  fontSize: 14.5,
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: '3px 3px 0 #17140d',
                  backgroundColor: '#ffffff',
                }}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isListening ? '#ff5b57' : '#6b5be6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 6,
                }}
                title={isListening ? 'Listening... click to stop' : 'Click to speak your question in your mother tongue'}
              >
                {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isQuerying || !inputQuery.trim()}
              className="btn-candy primary"
              style={{ padding: '14px 28px', fontSize: 14.5, borderRadius: 9999, gap: 8 }}
            >
              <Send size={16} />
              {isQuerying ? 'Mentoring...' : 'Ask Mentor'}
            </button>
          </form>

          {/* Loading Indicator */}
          {isQuerying && (
            <div
              style={{
                backgroundColor: '#fffdf5',
                border: '2.5px dashed #6b5be6',
                borderRadius: 16,
                padding: '24px',
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 36, animation: 'float 1.2s infinite alternate', marginBottom: 8 }}>
                🔬
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#6b5be6' }}>
                Dr. APJ Mentor is formulating your personalized Socratic lesson...
              </div>
              <p style={{ fontSize: 12.5, color: '#666', margin: '4px 0 0' }}>
                Connecting to NCERT curriculum, generating everyday village analogies & micro-experiments.
              </p>
            </div>
          )}

          {/* ================= 5. ACTIVE LESSON WORKBENCH ================= */}
          {currentLesson && !isQuerying && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Card 1: Hook & Intuition */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '3px solid #17140d',
                  borderRadius: 18,
                  padding: '22px 26px',
                  boxShadow: '5px 5px 0 #17140d',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#6b5be6' }}>
                        {currentLesson.subject || 'Physical Sciences'} • {currentLesson.grade || studentGrade}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 900, backgroundColor: '#2bd980', color: '#17140d', padding: '1px 6px', borderRadius: 4, border: '1px solid #17140d' }}>
                        VERIFIED NCERT PEDAGOGY
                      </span>
                    </div>
                    <h4 style={{ fontSize: 24, margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
                      {currentLesson.concept}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleReadAloud()}
                    className="btn-candy teal"
                    style={{ padding: '6px 14px', fontSize: 12 }}
                  >
                    <Volume2 size={14} />
                    {isSpeaking ? 'Reading Aloud...' : 'Listen in Audio'}
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#fffae5',
                    border: '2px solid #17140d',
                    borderRadius: 12,
                    padding: '14px 18px',
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    fontWeight: 600,
                    color: '#17140d',
                    marginBottom: 16,
                  }}
                >
                  💡 <strong>Intuition:</strong> {currentLesson.intuition}
                </div>

                {/* Multi-Step Socratic Explanation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {currentLesson.explanation &&
                    currentLesson.explanation.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          backgroundColor: '#f5efe2',
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: '1.5px solid #17140d',
                        }}
                      >
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#6b5be6',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 900,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: 13.5, lineHeight: 1.5, color: '#222', fontWeight: 600 }}>
                          {step}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Card 2: Visual Schematic & Mental Model Diagram */}
              {currentLesson.visualSchematic && (
                <div
                  style={{
                    backgroundColor: '#17140d',
                    color: '#ffffff',
                    border: '3px solid #17140d',
                    borderRadius: 18,
                    padding: '20px 24px',
                    boxShadow: '5px 5px 0 #17140d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Brain size={18} color="#ffc531" />
                      <span style={{ color: '#ffc531', fontWeight: 800, fontSize: 13.5, fontFamily: 'var(--font-display)' }}>
                        VISUAL SCHEMATIC & MENTAL MODEL
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: '#aaa', fontWeight: 700 }}>
                      Spatial Deduction
                    </span>
                  </div>

                  <pre
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      backgroundColor: '#262218',
                      padding: '14px 18px',
                      borderRadius: 10,
                      overflowX: 'auto',
                      border: '1px solid #443c2c',
                      color: '#2bd980',
                    }}
                  >
                    {currentLesson.visualSchematic}
                  </pre>
                </div>
              )}

              {/* Card 3: Misconception Buster (Red Myth vs Green Truth) */}
              {currentLesson.misconception && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '3px solid #17140d',
                    borderRadius: 18,
                    padding: '20px 24px',
                    boxShadow: '5px 5px 0 #17140d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertTriangle size={20} color="#ff5b57" />
                    <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)', color: '#17140d' }}>
                      ⚡ COMMON MISCONCEPTION BUSTER
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    <div
                      style={{
                        backgroundColor: '#fff2f1',
                        border: '2px solid #ff5b57',
                        borderRadius: 12,
                        padding: '12px 16px',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#c72c21', textTransform: 'uppercase', marginBottom: 4 }}>
                        ❌ The Common Student Myth:
                      </div>
                      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                        {currentLesson.misconception.myth}
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#efffed',
                        border: '2px solid #2bd980',
                        borderRadius: 12,
                        padding: '12px 16px',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#047857', textTransform: 'uppercase', marginBottom: 4 }}>
                        ✅ The Real Scientific Truth:
                      </div>
                      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                        {currentLesson.misconception.reality}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 4: 60-Second DIY Experiment (Tabletop Proof) */}
              {currentLesson.diyExperiment && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '3px solid #17140d',
                    borderRadius: 18,
                    padding: '20px 24px',
                    boxShadow: '5px 5px 0 #17140d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Beaker size={20} color="#12b3a4" />
                    <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)', color: '#17140d' }}>
                      🔬 TRY THIS RIGHT NOW (60-SECOND DIY EXPERIMENT)
                    </span>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 800, color: '#12b3a4', marginBottom: 6 }}>
                    {currentLesson.diyExperiment.title}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 800, color: '#666', marginBottom: 10 }}>
                    📦 Everyday Items Needed: {currentLesson.diyExperiment.items.join(', ')}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {currentLesson.diyExperiment.steps.map((st, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 13,
                          color: '#333',
                          fontWeight: 600,
                          backgroundColor: '#f0fbfa',
                          padding: '8px 12px',
                          borderRadius: 8,
                          borderLeft: '4px solid #12b3a4',
                        }}
                      >
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 5: Interactive Socratic Understanding Check (Quiz) */}
              {currentLesson.checkQuestion && (
                <div
                  style={{
                    backgroundColor: '#fffae5',
                    border: '3px solid #17140d',
                    borderRadius: 18,
                    padding: '22px 24px',
                    boxShadow: '5px 5px 0 #17140d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HelpCircle size={20} color="#ff5b57" />
                      <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)', color: '#17140d' }}>
                        🎯 MENTOR CHECK FOR UNDERSTANDING
                      </span>
                    </div>
                    <span style={{ fontSize: 11, backgroundColor: '#ffc531', padding: '2px 8px', borderRadius: 6, border: '1.5px solid #17140d', fontWeight: 800 }}>
                      +50 XP
                    </span>
                  </div>

                  <p style={{ fontSize: 14.5, fontWeight: 700, color: '#17140d', marginBottom: 14 }}>
                    {currentLesson.checkQuestion.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {currentLesson.checkQuestion.options.map((opt, oIdx) => {
                      const isChosen = selectedQuizOption === oIdx;
                      let bg = '#ffffff';
                      if (hasAnsweredQuiz) {
                        if (opt.correct) bg = '#efffed';
                        else if (isChosen) bg = '#fff2f1';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizSelection(oIdx, opt)}
                          disabled={hasAnsweredQuiz}
                          style={{
                            textAlign: 'left',
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: '2px solid #17140d',
                            backgroundColor: bg,
                            cursor: hasAnsweredQuiz ? 'default' : 'pointer',
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#17140d',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{opt.text}</span>
                            {hasAnsweredQuiz && opt.correct && <CheckCircle2 size={16} color="#047857" />}
                          </div>

                          {/* Instant Feedback on Choice */}
                          {hasAnsweredQuiz && (isChosen || opt.correct) && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 11.5,
                                color: opt.correct ? '#047857' : '#c72c21',
                                fontWeight: 800,
                              }}
                            >
                              {opt.feedback}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card 6: Direct Platform Launchpads (Deep-Links) */}
              {currentLesson.connections && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '3px solid #17140d',
                    borderRadius: 18,
                    padding: '20px 24px',
                    boxShadow: '5px 5px 0 #17140d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Compass size={20} color="#6b5be6" />
                    <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)', color: '#17140d' }}>
                      🚀 NEXT RECOMMENDED LEARNING ADVENTURES
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>
                    Continue exploring this exact principle through interactive simulations, 3D camera scanning, and video stories:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                    {/* Launchpad 1: PhET Virtual Lab */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('labs')}
                        className="btn-candy teal"
                        style={{ padding: '12px 16px', fontSize: 12.5, justifyContent: 'flex-start', textAlign: 'left' }}
                      >
                        <Beaker size={16} />
                        <span style={{ flex: 1 }}>{currentLesson.connections.labTitle || 'Open Virtual Lab Simulation'}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    {/* Launchpad 2: Object Scanner */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('scanner')}
                        className="btn-candy primary"
                        style={{ padding: '12px 16px', fontSize: 12.5, justifyContent: 'flex-start', textAlign: 'left' }}
                      >
                        <Camera size={16} />
                        <span style={{ flex: 1 }}>{currentLesson.connections.scannerTitle || 'Scan Object with Camera'}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    {/* Launchpad 3: StoryVerse Learning */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('stories')}
                        className="btn-candy purple"
                        style={{ padding: '12px 16px', fontSize: 12.5, justifyContent: 'flex-start', textAlign: 'left', backgroundColor: '#3aa0ff', color: '#fff' }}
                      >
                        <BookOpen size={16} />
                        <span style={{ flex: 1 }}>Watch StoryVerse Cartoon</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    {/* Launchpad 4: Treasure Hunt */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('hunt')}
                        className="btn-candy yellow"
                        style={{ padding: '12px 16px', fontSize: 12.5, justifyContent: 'flex-start', textAlign: 'left' }}
                      >
                        <Compass size={16} />
                        <span style={{ flex: 1 }}>Test in Treasure Hunt</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= 6. TAB MODE: MISCONCEPTION BUSTER (GAP DETECTOR) ================= */}
      {activeMode === 'misconceptions' && (
        <div>
          <div style={{ backgroundColor: '#fff2f1', border: '2px solid #ff5b57', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 18, color: '#c72c21', fontFamily: 'var(--font-display)' }}>
              🎯 Misconception Pulse Check: Do You Fall Into These Science Traps?
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#444' }}>
              Over 80% of students harbor subtle misconceptions because of common intuition. Tap each trap to see the genuine scientific reality:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {[
              {
                concept: 'Gravity in Space',
                myth: 'Astronauts float in the ISS because there is zero gravity in space.',
                fact: 'Gravity at ISS orbit is still 90% as strong as on Earth! Astronauts float because they and the space station are in continuous free-fall around Earth.',
                key: 'gravity_free_fall',
              },
              {
                concept: 'Why Pump Gets Warm',
                myth: 'A bicycle pump heats up purely from mechanical friction of the rubber seal.',
                fact: 'Friction accounts for <15% of the heat! Adiabatic thermodynamic gas compression does work on air molecules, raising kinetic energy.',
                key: 'pump_compression',
              },
              {
                concept: 'Ocean vs Sky Color',
                myth: 'The sky is blue because it reflects the ocean waters.',
                fact: 'The opposite is true! Nitrogen and oxygen gas molecules scatter short blue wavelengths 10x more than red rays (Rayleigh Scattering).',
                key: 'sky_scattering',
              },
              {
                concept: 'Ice Density & Lattice',
                myth: 'Ice floats because air bubbles are trapped inside during freezing.',
                fact: 'Pure bubble-free ice floats! Hydrogen bonds form an open hexagonal crystal lattice, causing water to expand by 9% upon freezing.',
                key: 'ice_floating',
              },
              {
                concept: 'Plant Respiration',
                myth: 'Plants only do photosynthesis and never breathe or consume oxygen.',
                fact: 'Plant cells have mitochondria and breathe oxygen 24 hours a day! In daytime, photosynthesis simply produces more O2 than they consume.',
                key: 'photosynthesis_energy',
              },
              {
                concept: 'Boiling Stove Flame',
                myth: 'Turning the gas stove to high after a cooker whistles makes it cook even faster.',
                fact: 'Water is pinned at 121°C inside! High flame only wastes gas by venting extra steam; cooking speed remains exactly the same.',
                key: 'cooker_pressure',
              },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #17140d',
                  borderRadius: 14,
                  padding: '16px 18px',
                  boxShadow: '3px 3px 0 #17140d',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#6b5be6', textTransform: 'uppercase' }}>
                      {m.concept}
                    </span>
                    <span style={{ fontSize: 10, backgroundColor: '#ff5b57', color: '#fff', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>
                      TRAP
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#c72c21', marginBottom: 6 }}>
                    ❌ Myth: "{m.myth}"
                  </div>
                  <div style={{ fontSize: 12.5, color: '#047857', fontWeight: 600, lineHeight: 1.45, marginBottom: 12 }}>
                    ✅ Truth: {m.fact}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleLoadPredefined(m.key);
                    setActiveMode('ask');
                  }}
                  className="btn-candy primary"
                  style={{ padding: '6px 12px', fontSize: 11.5, alignSelf: 'flex-start' }}
                >
                  Explore Socratic Lesson →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 7. TAB MODE: POCKET LAB DIY EXPERIMENTS ================= */}
      {activeMode === 'experiments' && (
        <div>
          <div style={{ backgroundColor: '#f0fbfa', border: '2px solid #12b3a4', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 18, color: '#0f766e', fontFamily: 'var(--font-display)' }}>
              🛠️ Pocket Lab: 60-Second DIY Science You Can Do at Home
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: '#444' }}>
              No expensive glassware or chemicals required. Test real physics, chemistry, and biology with everyday kitchen utensils:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {Object.values(MENTOR_CURATED_KNOWLEDGE).map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #17140d',
                  borderRadius: 14,
                  padding: '16px 18px',
                  boxShadow: '3px 3px 0 #17140d',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#12b3a4', textTransform: 'uppercase', marginBottom: 4 }}>
                    {item.subject} • {item.grade}
                  </div>
                  <h5 style={{ fontSize: 16, margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
                    🔬 {item.diyExperiment.title}
                  </h5>
                  <div style={{ fontSize: 11.5, color: '#666', fontWeight: 700, marginBottom: 8 }}>
                    📦 Items: {item.diyExperiment.items.join(', ')}
                  </div>
                  <p style={{ fontSize: 12.5, color: '#333', lineHeight: 1.45, fontWeight: 500, margin: '0 0 12px' }}>
                    {item.diyExperiment.steps[0]}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleLoadPredefined(item.id);
                    setActiveMode('ask');
                  }}
                  className="btn-candy teal"
                  style={{ padding: '6px 12px', fontSize: 11.5, alignSelf: 'flex-start' }}
                >
                  View Full Experiment & Quiz →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 8. TAB MODE: STUDENT MASTERY RADAR ================= */}
      {activeMode === 'analytics' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
              marginBottom: 24,
            }}
          >
            {[
              { label: 'Doubts Explored', val: analytics.doubtsAsked, color: '#6b5be6', icon: Lightbulb },
              { label: 'Concepts Mastered', val: analytics.conceptsMastered.length, color: '#2bd980', icon: Award },
              { label: 'Weak Concepts Flagged', val: analytics.weakConcepts.length, color: '#ff5b57', icon: AlertTriangle },
              { label: 'Misconceptions Cleared', val: analytics.misconceptionsResolved, color: '#12b3a4', icon: CheckCircle2 },
            ].map((stat, sIdx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={sIdx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2.5px solid #17140d',
                    borderRadius: 14,
                    padding: '16px 18px',
                    boxShadow: '3px 3px 0 #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      border: '2px solid #17140d',
                    }}
                  >
                    <IconComp size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-display)', margin: 0 }}>
                      {stat.val}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#555', fontWeight: 700 }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Concepts Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {/* Mastered Concepts */}
            <div
              style={{
                backgroundColor: '#efffed',
                border: '2.5px solid #2bd980',
                borderRadius: 14,
                padding: '18px 20px',
              }}
            >
              <h5 style={{ margin: '0 0 10px', fontSize: 16, color: '#047857', fontFamily: 'var(--font-display)' }}>
                ✅ Mastered Concepts ({analytics.conceptsMastered.length})
              </h5>
              {analytics.conceptsMastered.length === 0 ? (
                <p style={{ fontSize: 12.5, color: '#666', fontStyle: 'italic', margin: 0 }}>
                  No concepts mastered yet. Answer the check-quiz correctly after asking a doubt!
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {analytics.conceptsMastered.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #047857',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: '#047857',
                      }}
                    >
                      ★ {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Weak Concepts / Focus Radar */}
            <div
              style={{
                backgroundColor: '#fff2f1',
                border: '2.5px solid #ff5b57',
                borderRadius: 14,
                padding: '18px 20px',
              }}
            >
              <h5 style={{ margin: '0 0 10px', fontSize: 16, color: '#c72c21', fontFamily: 'var(--font-display)' }}>
                ⚠️ Needs Focus / Revision ({analytics.weakConcepts.length})
              </h5>
              {analytics.weakConcepts.length === 0 ? (
                <p style={{ fontSize: 12.5, color: '#666', fontStyle: 'italic', margin: 0 }}>
                  Zero weak concepts detected! Your foundational scientific intuition is rock-solid.
                </p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {analytics.weakConcepts.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #ff5b57',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: '#c72c21',
                      }}
                    >
                      ⚡ {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
