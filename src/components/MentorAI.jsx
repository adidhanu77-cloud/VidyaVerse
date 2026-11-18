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
  X,
  FileText,
  Sliders,
} from 'lucide-react';
import {
  queryMentorAI,
  fetchGradeMisconceptions,
  fetchGradeExperiments,
  fetchSocraticLesson,
  normalizeGradeBracket,
  GRADE_CURIOSITY_DOUBTS,
  MENTOR_PERSONAS,
  LEARNING_STYLES,
  getMentorSessionAnalytics,
  logConceptInteraction,
} from '../services/mentorAiEngine';

export default function MentorAI({ currentLang = 'en', onNavigate }) {
  // Student Context States
  const [selectedPersona, setSelectedPersona] = useState('kalam');
  const [selectedStyle, setSelectedStyle] = useState('visual');
  const [studentGrade, setStudentGrade] = useState('Class 9-10');

  // Interactive Tab Modes: 'ask' | 'misconceptions' | 'experiments' | 'analytics'
  const [activeMode, setActiveMode] = useState('ask');

  // Doubt Query & Loading States
  const [inputQuery, setInputQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Grade-Specific Content Lists
  const [gradeMisconceptions, setGradeMisconceptions] = useState([]);
  const [gradeExperiments, setGradeExperiments] = useState([]);
  const [isLoadingGradeContent, setIsLoadingGradeContent] = useState(false);

  // Dedicated Experiment Modal
  const [activeExperimentModal, setActiveExperimentModal] = useState(null);
  const [checkedMaterials, setCheckedMaterials] = useState({});
  const [experimentQuizState, setExperimentQuizState] = useState({ answeredIndex: null, isCorrect: null });

  // Audio & Speech States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Interactive Quiz State inside the lesson
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState(false);

  // Session Analytics
  const [analytics, setAnalytics] = useState(getMentorSessionAnalytics());
  const speechRecognitionRef = useRef(null);

  // 1. Initial Load and Grade Switch Handler
  useEffect(() => {
    loadGradeContent(studentGrade);
  }, [studentGrade]);

  const loadGradeContent = async (grade) => {
    setIsLoadingGradeContent(true);
    const bracket = normalizeGradeBracket(grade);

    try {
      // 1. Load grade-specific misconceptions
      const miscs = await fetchGradeMisconceptions(bracket);
      setGradeMisconceptions(miscs || []);

      // 2. Load grade-specific experiments
      const exps = await fetchGradeExperiments(bracket);
      setGradeExperiments(exps || []);

      // 3. Load first default curiosity lesson for this grade
      const doubts = GRADE_CURIOSITY_DOUBTS[bracket] || GRADE_CURIOSITY_DOUBTS['Class 9-10'];
      const defaultDoubt = doubts[0];
      if (defaultDoubt) {
        const lesson = await fetchSocraticLesson({
          conceptId: defaultDoubt.id,
          conceptName: defaultDoubt.q.replace(/^[^\s]+\s*/, ''),
          grade: bracket,
          learningStyle: selectedStyle,
          persona: selectedPersona,
          language: currentLang,
        });
        if (lesson) {
          setCurrentLesson(lesson);
          setSelectedQuizOption(null);
          setHasAnsweredQuiz(false);
        }
      }
    } catch (e) {
      console.warn('Failed to load grade content:', e);
    } finally {
      setIsLoadingGradeContent(false);
    }
  };

  const refreshAnalytics = () => {
    setAnalytics(getMentorSessionAnalytics());
  };

  // 2. Submit Query to MentorAI
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

  // 3. Explore Dedicated Socratic Lesson from Misconception or Curiosity Click
  const handleExploreSocraticLesson = async (conceptKey, conceptTitle) => {
    setIsQuerying(true);
    setSelectedQuizOption(null);
    setHasAnsweredQuiz(false);
    setActiveMode('ask');

    try {
      const lesson = await fetchSocraticLesson({
        conceptId: conceptKey,
        conceptName: conceptTitle,
        grade: studentGrade,
        learningStyle: selectedStyle,
        persona: selectedPersona,
        language: currentLang,
      });
      if (lesson) {
        setCurrentLesson(lesson);
        refreshAnalytics();
      }
    } catch (err) {
      console.error('Failed to explore Socratic lesson:', err);
    } finally {
      setIsQuerying(false);
    }
  };

  // 4. View Full Experiment Modal
  const handleOpenExperimentModal = (exp) => {
    setActiveExperimentModal(exp);
    setCheckedMaterials({});
    setExperimentQuizState({ answeredIndex: null, isCorrect: null });
  };

  const toggleMaterialCheck = (idx) => {
    setCheckedMaterials((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 5. Handle Interactive Quiz Choice
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

  // 6. Voice Input (Speech to Text)
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

  // 7. Speech Synthesis Audio Readout
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
  const currentBracket = normalizeGradeBracket(studentGrade);
  const activeDoubts = GRADE_CURIOSITY_DOUBTS[currentBracket] || GRADE_CURIOSITY_DOUBTS['Class 9-10'];

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff', position: 'relative' }}>
      
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
                REAL-TIME ADAPTIVE
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

      {/* ================= 2. STUDENT CONTEXT CONTROLS (GRADE SELECTION & ADAPTIVE DIFFICULTY) ================= */}
      <div
        style={{
          backgroundColor: '#f5efe2',
          borderRadius: 16,
          border: '2.5px solid #17140d',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        {/* Grade Selector with Dynamic Difficulty Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, fontWeight: 900, textTransform: 'uppercase', color: '#17140d', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders size={15} color="#6b5be6" /> Select Grade Level:
          </span>
          {[
            { id: 'Class 6-8', label: 'Class 6-8', badge: '🟢 Foundational', color: '#2bd980' },
            { id: 'Class 9-10', label: 'Class 9-10', badge: '🟡 Secondary / Boards', color: '#ffc531' },
            { id: 'Class 11-12', label: 'Class 11-12', badge: '🔴 Advanced / JEE / NEET', color: '#ff5b57' },
          ].map((g) => {
            const isSelected = studentGrade === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setStudentGrade(g.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  border: '2px solid #17140d',
                  backgroundColor: isSelected ? '#17140d' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#17140d',
                  boxShadow: isSelected ? '3px 3px 0 #ffc531' : '1.5px 1.5px 0 #17140d',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span>{g.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '1px 6px',
                    borderRadius: 4,
                    backgroundColor: isSelected ? g.color : '#f0f0f0',
                    color: '#17140d',
                    fontWeight: 900,
                  }}
                >
                  {g.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Learning Persona / Style Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#17140d' }}>
            🎨 Style:
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
                  padding: '5px 10px',
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
          { id: 'ask', label: `💬 Socratic Classroom (${currentBracket})`, color: '#6b5be6' },
          { id: 'misconceptions', label: `🔍 Misconception Buster (${currentBracket})`, color: '#ff5b57' },
          { id: 'experiments', label: `🛠️ Pocket Lab DIY Experiments (${currentBracket})`, color: '#12b3a4' },
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
          {/* Preset Curiosity Triggers Calibrated to Grade */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: '#17140d' }}>
                💡 {currentBracket} Curiosity Doubts & Core Laws:
              </span>
              <span style={{ fontSize: 11, color: '#6b5be6', fontWeight: 800 }}>
                ⚡ Auto-calibrated for {studentGrade} difficulty
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
              {activeDoubts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleExploreSocraticLesson(item.id, item.q.replace(/^[^\s]+\s*/, ''))}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '2px solid #17140d',
                    backgroundColor: currentLesson && (currentLesson.id === item.id || currentLesson.concept.includes(item.id)) ? '#ffc531' : '#fcfaf6',
                    boxShadow: currentLesson && (currentLesson.id === item.id || currentLesson.concept.includes(item.id)) ? '3px 3px 0 #17140d' : '1.5px 1.5px 0 #17140d',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 12.5,
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
                placeholder={`Ask any doubt for ${studentGrade} (e.g. why does a pressure cooker whistle? How does Lenz's law work?)`}
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
              {isQuerying ? 'Formulating...' : 'Ask Mentor'}
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
                Dr. APJ Mentor is formulating your personalized Socratic lesson for {studentGrade}...
              </div>
              <p style={{ fontSize: 12.5, color: '#666', margin: '4px 0 0' }}>
                Connecting to NCERT curriculum, generating everyday village analogies, derivations & micro-experiments.
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
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          backgroundColor: currentLesson.difficulty === 'Advanced' ? '#ff5b57' : currentLesson.difficulty === 'Secondary' ? '#ffc531' : '#2bd980',
                          color: '#17140d',
                          padding: '2px 8px',
                          borderRadius: 4,
                          border: '1px solid #17140d',
                        }}
                      >
                        {currentLesson.difficulty || currentBracket} RIGOR
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
                          padding: '12px 16px',
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
                        <span style={{ fontSize: 13.5, lineHeight: 1.55, color: '#222', fontWeight: 600 }}>
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
                        VISUAL SCHEMATIC & MENTAL MODEL ({currentLesson.grade || studentGrade})
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
                      ⚡ {currentLesson.grade || studentGrade} MISCONCEPTION BUSTER
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
                      🔬 TABLETOP EXPERIMENT ({currentLesson.grade || studentGrade})
                    </span>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 800, color: '#12b3a4', marginBottom: 6 }}>
                    {currentLesson.diyExperiment.title}
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 800, color: '#666', marginBottom: 10 }}>
                    📦 Everyday Items Needed: {Array.isArray(currentLesson.diyExperiment.items) ? currentLesson.diyExperiment.items.join(', ') : currentLesson.diyExperiment.items}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {currentLesson.diyExperiment.steps &&
                      currentLesson.diyExperiment.steps.map((st, i) => (
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
                        🎯 MENTOR CHECK QUESTION ({currentLesson.grade || studentGrade})
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
                    {currentLesson.checkQuestion.options &&
                      currentLesson.checkQuestion.options.map((opt, oIdx) => {
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
                      🚀 NEXT RECOMMENDED LEARNING ADVENTURES ({currentBracket})
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: '#555', marginBottom: 14 }}>
                    Explore this exact principle hands-on through PhET simulations, 3D camera scanning, and video stories:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
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
          <div style={{ backgroundColor: '#fff2f1', border: '2.5px solid #ff5b57', borderRadius: 16, padding: '18px 22px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#c72c21', fontFamily: 'var(--font-display)' }}>
                🎯 {currentBracket} Misconception Radar: Science Cognitive Traps
              </h4>
              <span style={{ fontSize: 11, backgroundColor: '#ff5b57', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 900 }}>
                {currentBracket} DIFFICULTY
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.5 }}>
              Concepts calibrated strictly for <strong>{studentGrade}</strong>. Tap "Explore Socratic Lesson" to fetch real backend mechanisms and derivations:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {gradeMisconceptions.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #17140d',
                  borderRadius: 14,
                  padding: '18px 20px',
                  boxShadow: '4px 4px 0 #17140d',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 900, color: '#6b5be6', textTransform: 'uppercase' }}>
                      {m.concept}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        backgroundColor: m.difficulty === 'Advanced' ? '#ff5b57' : m.difficulty === 'Secondary / Boards' ? '#ffc531' : '#2bd980',
                        color: '#17140d',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontWeight: 900,
                        border: '1px solid #17140d',
                      }}
                    >
                      {m.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#c72c21', marginBottom: 8, lineHeight: 1.4 }}>
                    ❌ Common Trap: "{m.myth}"
                  </div>
                  <div style={{ fontSize: 13, color: '#047857', fontWeight: 600, lineHeight: 1.5, marginBottom: 14 }}>
                    ✅ Scientific Reality: {m.fact}
                  </div>
                </div>

                <button
                  onClick={() => handleExploreSocraticLesson(m.key, m.concept)}
                  className="btn-candy primary"
                  style={{ padding: '8px 14px', fontSize: 12, alignSelf: 'flex-start', gap: 6 }}
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
          <div style={{ backgroundColor: '#f0fbfa', border: '2.5px solid #12b3a4', borderRadius: 16, padding: '18px 22px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
              <h4 style={{ margin: 0, fontSize: 18, color: '#0f766e', fontFamily: 'var(--font-display)' }}>
                🛠️ {currentBracket} Pocket Lab: Hands-On Science Workbench
              </h4>
              <span style={{ fontSize: 11, backgroundColor: '#12b3a4', color: '#fff', padding: '2px 8px', borderRadius: 6, fontWeight: 900 }}>
                {currentBracket} EXPERIMENTS
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.5 }}>
              Authentic tabletop experiments for <strong>{studentGrade}</strong>. Click "View Full Experiment & Quiz" to open the interactive worksheet:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {gradeExperiments.map((exp) => (
              <div
                key={exp.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #17140d',
                  borderRadius: 14,
                  padding: '18px 20px',
                  boxShadow: '4px 4px 0 #17140d',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 900, color: '#12b3a4', textTransform: 'uppercase' }}>
                      {exp.subject}
                    </span>
                    <span style={{ fontSize: 10, backgroundColor: '#f5efe2', color: '#17140d', padding: '1px 6px', borderRadius: 4, fontWeight: 900, border: '1px solid #17140d' }}>
                      {exp.difficulty}
                    </span>
                  </div>

                  <h5 style={{ fontSize: 16, margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
                    🔬 {exp.title}
                  </h5>

                  <div style={{ fontSize: 12, color: '#555', fontWeight: 800, marginBottom: 8 }}>
                    📦 Materials: {Array.isArray(exp.items) ? exp.items.join(', ') : exp.items}
                  </div>

                  <div style={{ fontSize: 12.5, color: '#222', lineHeight: 1.45, fontWeight: 600, backgroundColor: '#f5efe2', padding: '8px 10px', borderRadius: 8, marginBottom: 14 }}>
                    ⚖️ <strong>Principle:</strong> {exp.principle}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleOpenExperimentModal(exp)}
                    className="btn-candy teal"
                    style={{ padding: '8px 14px', fontSize: 12, gap: 6 }}
                  >
                    View Full Experiment & Quiz 🧪
                  </button>

                  <button
                    onClick={() => handleExploreSocraticLesson(exp.id, exp.title)}
                    className="btn-candy secondary"
                    style={{ padding: '8px 12px', fontSize: 12 }}
                  >
                    Socratic Theory →
                  </button>
                </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
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

      {/* ================= 9. DEDICATED FULL EXPERIMENT & QUIZ WORKBENCH MODAL ================= */}
      {activeExperimentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23, 20, 13, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setActiveExperimentModal(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '3px solid #17140d',
              borderRadius: 20,
              boxShadow: '8px 8px 0 #17140d',
              maxWidth: 720,
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '28px 30px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#12b3a4', textTransform: 'uppercase' }}>
                    {activeExperimentModal.subject} • {activeExperimentModal.grade}
                  </span>
                  <span style={{ fontSize: 10, backgroundColor: '#2bd980', color: '#17140d', padding: '1px 6px', borderRadius: 4, fontWeight: 900, border: '1px solid #17140d' }}>
                    VERIFIED REAL DATA
                  </span>
                </div>
                <h3 style={{ fontSize: 22, margin: 0, fontFamily: 'var(--font-display)' }}>
                  🔬 {activeExperimentModal.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveExperimentModal(null)}
                style={{
                  background: '#f5efe2',
                  border: '2px solid #17140d',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scientific Principle */}
            <div style={{ backgroundColor: '#f0fbfa', border: '2px solid #12b3a4', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#0f766e', textTransform: 'uppercase', marginBottom: 2 }}>
                ⚖️ Governing Scientific Law & Formula:
              </div>
              <div style={{ fontSize: 13.5, color: '#17140d', fontWeight: 600 }}>
                {activeExperimentModal.principle}
              </div>
            </div>

            {/* Checklist of Materials */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8, color: '#17140d' }}>
                📦 Materials Checklist (Tap to check):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Array.isArray(activeExperimentModal.items) &&
                  activeExperimentModal.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleMaterialCheck(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #17140d',
                        backgroundColor: checkedMaterials[idx] ? '#efffed' : '#ffffff',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 700,
                        transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedMaterials[idx])}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ textDecoration: checkedMaterials[idx] ? 'line-through' : 'none', color: checkedMaterials[idx] ? '#047857' : '#17140d' }}>
                        {item}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8, color: '#17140d' }}>
                📋 Hands-on Step-by-Step Procedure:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.isArray(activeExperimentModal.steps) &&
                  activeExperimentModal.steps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: 10,
                        backgroundColor: '#f5efe2',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid #17140d',
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: '#12b3a4',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: 13, color: '#222', fontWeight: 600, lineHeight: 1.5 }}>
                        {step}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Experiment Conceptual Quiz */}
            <div style={{ backgroundColor: '#fffae5', border: '2px solid #17140d', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#ff5b57', textTransform: 'uppercase', marginBottom: 6 }}>
                🎯 Laboratory Verification Quiz (+30 XP)
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 10px', color: '#17140d' }}>
                What proves the scientific principle during this experiment?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { text: 'A) The observed values match the theoretical formula prediction.', correct: true, feedback: 'Correct! Scientific truth is validated when experimental measurements match the mathematical model!' },
                  { text: 'B) The materials disappear completely from existence.', correct: false, feedback: 'Incorrect. Conservation of mass dictates matter cannot be destroyed.' },
                  { text: 'C) The temperature always rises to infinity.', correct: false, feedback: 'Incorrect. Energy transfer is strictly bounded by the laws of thermodynamics.' },
                ].map((qOpt, qIdx) => {
                  const isPicked = experimentQuizState.answeredIndex === qIdx;
                  let optBg = '#ffffff';
                  if (experimentQuizState.answeredIndex !== null) {
                    if (qOpt.correct) optBg = '#efffed';
                    else if (isPicked) optBg = '#fff2f1';
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setExperimentQuizState({ answeredIndex: qIdx, isCorrect: qOpt.correct })}
                      disabled={experimentQuizState.answeredIndex !== null}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #17140d',
                        backgroundColor: optBg,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: experimentQuizState.answeredIndex !== null ? 'default' : 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{qOpt.text}</span>
                        {experimentQuizState.answeredIndex !== null && qOpt.correct && <CheckCircle2 size={15} color="#047857" />}
                      </div>
                      {experimentQuizState.answeredIndex !== null && (isPicked || qOpt.correct) && (
                        <div style={{ marginTop: 4, fontSize: 11, color: qOpt.correct ? '#047857' : '#c72c21', fontWeight: 800 }}>
                          {qOpt.feedback}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => {
                  const expTitle = activeExperimentModal.title;
                  setActiveExperimentModal(null);
                  handleExploreSocraticLesson(activeExperimentModal.id, expTitle);
                }}
                className="btn-candy primary"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                Open Full Socratic Lesson 🚀
              </button>
              <button
                onClick={() => setActiveExperimentModal(null)}
                className="btn-candy secondary"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
