import React, { useState, useEffect, useRef } from 'react';
import {
  ClipboardCheck, Clock, CheckCircle2, XCircle, AlertCircle,
  Flag, ArrowRight, ArrowLeft, RefreshCw, Trophy, Sparkles,
  ChevronDown, BookOpen, Compass, Award, ShieldCheck, HelpCircle,
  MessageSquare, Send, Smartphone, Share2, ExternalLink, Eye
} from 'lucide-react';
import { getQuestionsForGrade } from '../data/assessmentQuestions';
import {
  evaluateAssessment,
  saveAssessmentLocally,
  getLatestAssessment,
  checkWeeklyStatus
} from '../services/assessmentEngine';
import { api } from '../services/api';

const GRADE_LIST = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

export default function SkillAssessment({ onNavigate }) {
  // 1. Student profile & grade detection
  const [selectedGrade, setSelectedGrade] = useState('Class 9');
  const [profileName, setProfileName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentName, setParentName] = useState('');

  // Twilio Parent Notification states
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [parentSendStatus, setParentSendStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [parentReportResult, setParentReportResult] = useState(null);
  const [showParentPreview, setShowParentPreview] = useState(false);

  // 2. Exam lifecycle states: 'ready' | 'active' | 'review'
  const [examState, setExamState] = useState('ready');
  const [questions, setQuestions] = useState([]);
  const [tierInfo, setTierInfo] = useState({ tier: 'Class 9-10', displayGrade: 'Class 9' });

  // 3. Test progression
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [qIndex]: boolean }
  const [timeLeftSec, setTimeLeftSec] = useState(40 * 60); // 40 minutes for 40 questions
  const [filterSubject, setFilterSubject] = useState('All');
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'incorrect' | 'correct'

  // 4. Results & Weekly Status
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [weeklyStatus, setWeeklyStatus] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerRef = useRef(null);

  // Load user profile & weekly status on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('vidyaverse_profile') || localStorage.getItem('stemverse_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.grade) setSelectedGrade(parsed.grade);
        if (parsed.name) setProfileName(parsed.name);
        if (parsed.parentPhone) setParentPhone(parsed.parentPhone);
        if (parsed.parentName) setParentName(parsed.parentName);
      }
    } catch {}

    const status = checkWeeklyStatus();
    setWeeklyStatus(status);
    if (status.latestResult) {
      setAssessmentResult(status.latestResult);
    }
  }, []);

  // Update questions whenever grade changes
  useEffect(() => {
    const qData = getQuestionsForGrade(selectedGrade);
    setQuestions(qData.questions);
    setTierInfo(qData);
  }, [selectedGrade]);

  // Timer countdown during active exam
  useEffect(() => {
    if (examState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeftSec(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, answers]);

  // ── Actions
  function handleStartExam() {
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeftSec(40 * 60);
    setFilterSubject('All');
    setExamState('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectOption(optIdx) {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  }

  function handleToggleFlag(qIdx) {
    setFlagged(prev => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }

  async function dispatchParentNotification(targetResult = assessmentResult, phoneToUse = parentPhone) {
    if (!phoneToUse || phoneToUse.replace(/\D/g, '').length < 10) {
      setParentSendStatus('error');
      return;
    }
    setParentSendStatus('sending');
    try {
      const prog = JSON.parse(localStorage.getItem('vidyaverse_progress') || '{}');
      const payload = {
        studentName: profileName || 'Your Child',
        parentName: parentName || 'Parent',
        parentPhone: phoneToUse,
        grade: selectedGrade,
        assessmentScore: targetResult?.totalCorrect ?? 0,
        totalQuestions: 40,
        percentage: targetResult?.percentage ?? 0,
        masteryTier: targetResult?.masteryTier ?? 'Proficient',
        sectionBreakdown: targetResult?.sectionBreakdown ?? {},
        streak: prog.streak || 1,
        badges: prog.badges || [],
        totalXP: prog.totalXP || 250,
        channels: [
          notifyWhatsApp ? 'whatsapp' : null,
          notifySms ? 'sms' : null
        ].filter(Boolean)
      };

      const res = await api.sendParentReport(payload);
      setParentReportResult(res?.data || res);
      setParentSendStatus('sent');

      // Update parent phone in profile for future weekly assessments
      try {
        const storedProfile = JSON.parse(localStorage.getItem('vidyaverse_profile') || '{}');
        storedProfile.parentPhone = phoneToUse;
        if (parentName) storedProfile.parentName = parentName;
        localStorage.setItem('vidyaverse_profile', JSON.stringify(storedProfile));
      } catch {}
    } catch (err) {
      console.warn('Error sending parent notification:', err);
      setParentSendStatus('error');
    }
  }

  async function handleSubmitExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitModal(false);

    const timeSpent = (40 * 60) - timeLeftSec;
    const computed = evaluateAssessment({
      answers,
      questions,
      grade: selectedGrade,
      timeSpentSec: timeSpent
    });

    setAssessmentResult(computed);
    await saveAssessmentLocally(computed);

    // If parent phone number is already configured, auto-dispatch notification in background
    if (parentPhone && parentPhone.replace(/\D/g, '').length >= 10) {
      dispatchParentNotification(computed, parentPhone);
    }

    const updatedStatus = checkWeeklyStatus();
    setWeeklyStatus(updatedStatus);
    setExamState('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Format time remaining MM:SS
  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentIndex] || {};

  // ===================================================================
  // RENDER VIEW 1: ACTIVE EXAM SCREEN
  // ===================================================================
  if (examState === 'active') {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top Floating Control Bar */}
        <div style={{
          position: 'sticky', top: 76, zIndex: 40,
          background: '#ffffff', border: '3px solid #17140d', borderRadius: 16,
          boxShadow: '4px 4px 0 #17140d', padding: '14px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14
        }}>
          {/* Grade & Subject Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{
              background: '#804dee', color: '#fff', padding: '5px 12px',
              borderRadius: 999, fontWeight: 800, fontSize: 13, border: '2px solid #17140d'
            }}>
              📝 {selectedGrade} Weekly Benchmark
            </span>

            <span style={{ fontSize: 13, fontWeight: 700, color: '#555' }}>
              Answered: <strong style={{ color: '#17140d' }}>{answeredCount}</strong> / {questions.length}
            </span>
          </div>

          {/* Timer Clock */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: timeLeftSec < 300 ? '#fff0f0' : '#f5efe2',
            border: '2px solid #17140d', borderRadius: 999, padding: '6px 16px',
            color: timeLeftSec < 300 ? '#ff5b57' : '#17140d',
            fontWeight: 800, fontSize: 16,
            boxShadow: '2px 2px 0 #17140d'
          }}>
            <Clock size={18} />
            <span>{timeFormatted}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            style={{
              background: '#2bd980', color: '#17140d', border: '2px solid #17140d',
              borderRadius: 10, padding: '8px 18px', fontWeight: 800, fontSize: 13.5,
              cursor: 'pointer', boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', gap: 6
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #17140d'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 #17140d'; }}
          >
            <CheckCircle2 size={16} />
            Finish & Submit Exam
          </button>
        </div>

        {/* Section Navigation Tabs (Physics, Chemistry, Maths, Biology) */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
          {[
            { label: '⚛️ Physics (Q1-10)', range: [0, 9], subject: 'Physics', color: '#ff5b57' },
            { label: '🧪 Chemistry (Q11-20)', range: [10, 19], subject: 'Chemistry', color: '#12b3a4' },
            { label: '📐 Mathematics (Q21-30)', range: [20, 29], subject: 'Mathematics', color: '#6b5be6' },
            { label: '🧬 Biology (Q31-40)', range: [30, 39], subject: 'Biology', color: '#2bd980' }
          ].map(sec => {
            const isCurrentSection = currentIndex >= sec.range[0] && currentIndex <= sec.range[1];
            return (
              <button
                key={sec.label}
                onClick={() => setCurrentIndex(sec.range[0])}
                style={{
                  padding: '8px 14px', borderRadius: 999, border: '2px solid #17140d',
                  background: isCurrentSection ? sec.color : '#ffffff',
                  color: isCurrentSection ? '#ffffff' : '#17140d',
                  fontWeight: 800, fontSize: 13, cursor: 'pointer',
                  boxShadow: isCurrentSection ? '3px 3px 0 #17140d' : '1px 1px 0 #17140d',
                  whiteSpace: 'nowrap', transition: 'all 0.15s'
                }}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Exam Split Workspace: Left 40-Grid / Right Active Question */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>

          {/* Active Question Card */}
          <div style={{
            background: '#ffffff', border: '3px solid #17140d', borderRadius: 20,
            boxShadow: '6px 6px 0 #17140d', padding: '28px 32px'
          }}>
            {/* Question Meta Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  background: '#ffc531', color: '#17140d', border: '2px solid #17140d',
                  borderRadius: 8, padding: '4px 10px', fontWeight: 800, fontSize: 13
                }}>
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <span style={{
                  background: getSubjectBadgeColor(currentQ.subject), color: '#fff',
                  border: '1.5px solid #17140d', borderRadius: 999, padding: '3px 10px',
                  fontWeight: 800, fontSize: 11.5, textTransform: 'uppercase'
                }}>
                  {currentQ.subject}
                </span>

                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#666' }}>
                  • {currentQ.topic}
                </span>
              </div>

              {/* Flag Button */}
              <button
                onClick={() => handleToggleFlag(currentIndex)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8, border: '2px solid #17140d',
                  background: flagged[currentIndex] ? '#ffc531' : '#f5efe2',
                  color: '#17140d', fontWeight: 800, fontSize: 12, cursor: 'pointer'
                }}
              >
                <Flag size={14} fill={flagged[currentIndex] ? '#17140d' : 'none'} />
                {flagged[currentIndex] ? 'Flagged for Review' : 'Flag Question'}
              </button>
            </div>

            {/* Question Statement */}
            <h3 style={{
              fontSize: 'clamp(17px, 2vw, 20px)', lineHeight: 1.5, color: '#17140d',
              marginBottom: 26, fontWeight: 700
            }}>
              {currentQ.question}
            </h3>

            {/* 4 Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              {(currentQ.options || []).map((opt, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 18px', borderRadius: 12,
                      border: isSelected ? '3px solid #804dee' : '2px solid #17140d',
                      background: isSelected ? '#f5f0ff' : '#ffffff',
                      textAlign: 'left', cursor: 'pointer',
                      boxShadow: isSelected ? '4px 4px 0 #804dee' : '2px 2px 0 #17140d',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#faf7f2';
                        e.currentTarget.style.borderColor = '#17140d';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, borderRadius: 8, border: '2px solid #17140d',
                      background: isSelected ? '#804dee' : '#f5efe2',
                      color: isSelected ? '#ffffff' : '#17140d',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14, flexShrink: 0
                    }}>
                      {letter}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: isSelected ? 700 : 500, color: '#17140d', lineHeight: 1.4 }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #f0e6d6', paddingTop: 20 }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 10, border: '2px solid #17140d',
                  background: currentIndex === 0 ? '#e0dbcf' : '#ffffff',
                  color: currentIndex === 0 ? '#888' : '#17140d',
                  fontWeight: 800, fontSize: 13, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {answers[currentIndex] !== undefined && (
                  <button
                    onClick={() => {
                      setAnswers(prev => {
                        const copy = { ...prev };
                        delete copy[currentIndex];
                        return copy;
                      });
                    }}
                    style={{
                      background: '#fff0f0', color: '#ff5b57', border: '1.5px solid #ff5b57',
                      borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Clear Response
                  </button>
                )}

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 10, border: '2px solid #17140d',
                      background: '#ffc531', color: '#17140d',
                      fontWeight: 800, fontSize: 13.5, cursor: 'pointer',
                      boxShadow: '3px 3px 0 #17140d'
                    }}
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 10, border: '2px solid #17140d',
                      background: '#2bd980', color: '#17140d',
                      fontWeight: 800, fontSize: 13.5, cursor: 'pointer',
                      boxShadow: '3px 3px 0 #17140d'
                    }}
                  >
                    Review & Submit <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette (1 to 40 Matrix) */}
          <div style={{
            background: '#ffffff', border: '3px solid #17140d', borderRadius: 16,
            boxShadow: '4px 4px 0 #17140d', padding: '18px 16px'
          }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#17140d', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Question Palette</span>
              <span style={{ fontSize: 11, background: '#f5efe2', padding: '2px 8px', borderRadius: 6, border: '1px solid #17140d' }}>
                40 Qs Total
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, fontWeight: 700, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, background: '#2bd980', border: '1px solid #17140d', borderRadius: 3 }} />
                <span>Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, background: '#ffc531', border: '1px solid #17140d', borderRadius: 3 }} />
                <span>Flagged</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, background: '#ffffff', border: '1px solid #17140d', borderRadius: 3 }} />
                <span>Unvisited</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 12, height: 12, background: '#804dee', border: '1px solid #17140d', borderRadius: 3 }} />
                <span>Current</span>
              </div>
            </div>

            {/* 40 Numbers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isFlagged = flagged[idx];
                const isCurrent = idx === currentIndex;

                let bg = '#ffffff';
                let color = '#17140d';
                if (isCurrent) {
                  bg = '#804dee';
                  color = '#ffffff';
                } else if (isFlagged) {
                  bg = '#ffc531';
                } else if (isAnswered) {
                  bg = '#2bd980';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: 36, borderRadius: 8, border: isCurrent ? '2.5px solid #17140d' : '1.5px solid #17140d',
                      background: bg, color: color, fontWeight: 800, fontSize: 12,
                      cursor: 'pointer', transition: 'transform 0.1s',
                      boxShadow: isCurrent ? '2px 2px 0 #17140d' : 'none'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(23,20,13,0.6)',
            backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}>
            <div style={{
              background: '#ffffff', border: '3.5px solid #17140d', borderRadius: 20,
              boxShadow: '8px 8px 0 #17140d', maxWidth: 480, width: '100%', padding: '28px 24px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#17140d', marginBottom: 10 }}>
                Ready to Submit Your Weekly Assessment?
              </h3>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, marginBottom: 20 }}>
                You have answered <strong>{answeredCount} of 40</strong> questions.
                {40 - answeredCount > 0 && (
                  <span style={{ color: '#ff5b57', display: 'block', marginTop: 6, fontWeight: 700 }}>
                    ⚠️ You have {40 - answeredCount} unanswered questions remaining.
                  </span>
                )}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    padding: '10px 20px', borderRadius: 10, border: '2px solid #17140d',
                    background: '#f5efe2', color: '#17140d', fontWeight: 800, fontSize: 13, cursor: 'pointer'
                  }}
                >
                  Return to Test
                </button>
                <button
                  onClick={handleSubmitExam}
                  style={{
                    padding: '10px 22px', borderRadius: 10, border: '2px solid #17140d',
                    background: '#2bd980', color: '#17140d', fontWeight: 800, fontSize: 13.5,
                    cursor: 'pointer', boxShadow: '3px 3px 0 #17140d'
                  }}
                >
                  Confirm & Calculate Career Path
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===================================================================
  // RENDER VIEW 2: POST-EXAM RESULTS & DETAILED DIAGNOSTIC REPORT
  // ===================================================================
  if (examState === 'review' && assessmentResult) {
    const res = assessmentResult;
    const filteredQuestions = (res.detailedAnswers || []).filter(item => {
      if (reviewFilter === 'incorrect') return !item.isCorrect;
      if (reviewFilter === 'correct') return item.isCorrect;
      return true;
    });

    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Celebration & Score Header */}
        <div style={{
          background: '#ffffff', border: '3px solid #17140d', borderRadius: 20,
          boxShadow: '6px 6px 0 #17140d', padding: '32px 36px', marginBottom: 28,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#2bd980', color: '#17140d', border: '1.5px solid #17140d', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 800 }}>
                  WEEKLY TEST COMPLETED ✅
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#666' }}>
                  {res.grade} • Week {res.weekNumber}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#17140d', margin: 0 }}>
                Performance Diagnostic: <span style={{ color: '#804dee' }}>{res.masteryTier}</span>
              </h2>

              <p style={{ color: '#555', fontSize: 15, margin: '8px 0 0', fontWeight: 500 }}>
                Completed on {new Date(res.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                Your live results are synchronized with the <strong>Career Navigator</strong>.
              </p>
            </div>

            {/* Score Big Pill */}
            <div style={{
              background: '#f5f0ff', border: '3px solid #804dee', borderRadius: 18,
              padding: '16px 28px', textAlign: 'center', boxShadow: '4px 4px 0 #804dee'
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#804dee', textTransform: 'uppercase' }}>Overall Score</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#17140d', lineHeight: 1.1 }}>
                {res.totalCorrect} <span style={{ fontSize: 20, color: '#666' }}>/ 40</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#2bd980' }}>
                {res.percentage}% Accuracy
              </span>
            </div>
          </div>
        </div>

        {/* 4 Subject Performance Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 30 }}>
          {[
            { name: 'Physics', icon: '⚛️', score: res.sectionBreakdown?.Physics?.score || 0, color: '#ff5b57', bg: '#fff0f0' },
            { name: 'Chemistry', icon: '🧪', score: res.sectionBreakdown?.Chemistry?.score || 0, color: '#12b3a4', bg: '#f0fbfa' },
            { name: 'Mathematics', icon: '📐', score: res.sectionBreakdown?.Mathematics?.score || 0, color: '#6b5be6', bg: '#f4f2ff' },
            { name: 'Biology', icon: '🧬', score: res.sectionBreakdown?.Biology?.score || 0, color: '#2bd980', bg: '#efffed' }
          ].map(sub => {
            const pct = Math.round((sub.score / 10) * 100);
            return (
              <div
                key={sub.name}
                style={{
                  background: '#ffffff', border: '2.5px solid #17140d', borderRadius: 16,
                  padding: '18px 20px', boxShadow: '4px 4px 0 #17140d'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{sub.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 16, color: '#17140d' }}>{sub.name}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: sub.color }}>
                    {sub.score} / 10
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: 10, background: '#f5efe2', borderRadius: 999, border: '1.5px solid #17140d', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: sub.color, transition: 'width 0.5s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, fontWeight: 700, color: '#666' }}>
                  <span>{pct}% Mastery</span>
                  <span>{sub.score >= 8 ? '🌟 Strong' : sub.score >= 5 ? '⚡ Proficient' : '🔍 Needs Review'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* HIGH-IMPACT REAL-TIME CAREER ROADMAP LAUNCHER BANNER */}
        <div style={{
          background: '#ffc531', border: '3.5px solid #17140d', borderRadius: 20,
          boxShadow: '8px 8px 0 #17140d', padding: '28px 32px', marginBottom: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={18} color="#17140d" />
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#17140d' }}>
                Real-Time Career Intelligence Generated
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, color: '#17140d', margin: '0 0 6px' }}>
              Your Tailored STEM Career Workflow is Ready!
            </h3>
            <p style={{ fontSize: 14.5, color: '#2b261b', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
              Driven directly by your scores in Physics ({res.sectionBreakdown?.Physics?.score}/10), Chemistry ({res.sectionBreakdown?.Chemistry?.score}/10), Mathematics ({res.sectionBreakdown?.Mathematics?.score}/10) and Biology ({res.sectionBreakdown?.Biology?.score}/10), your end-to-end career workflow has been calculated with entrance exams, elite institutes, research labs, and salary milestones.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('careers');
            }}
            style={{
              background: '#17140d', color: '#ffffff', border: 'none',
              borderRadius: 14, padding: '16px 28px', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '4px 4px 0 #ffffff', flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <span>Open Career Workflow</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TWILIO PARENT NOTIFICATION CARD (WHATSAPP & SMS)
            ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#ffffff', border: '3.5px solid #17140d', borderRadius: 20,
          boxShadow: '6px 6px 0 #17140d', padding: '28px 32px', marginBottom: 36,
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>📲</span>
                <span style={{
                  background: '#25D366', color: '#ffffff', border: '1.5px solid #17140d',
                  borderRadius: 999, padding: '3px 12px', fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase'
                }}>
                  Twilio WhatsApp & SMS Notifications
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#666' }}>
                  Real-Time Parent Tracking
                </span>
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 800, color: '#17140d', margin: '0 0 6px' }}>
                Send Assessment Marks & Analytics to Parents
              </h3>
              <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.5 }}>
                Keep parents informed with an automatic report of your <strong>{res.totalCorrect}/40 ({res.percentage}%) score</strong>, subject-wise performance in Physics, Chemistry, Math & Biology, active learning streak, and earned badges.
              </p>
            </div>
          </div>

          {/* Delivery Status Toast */}
          {parentSendStatus === 'sent' && (
            <div style={{
              background: '#e8fbf2', border: '2px solid #2bd980', borderRadius: 12,
              padding: '12px 16px', marginBottom: 18, color: '#17140d', fontWeight: 700, fontSize: 13.5,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="#2bd980" />
                <span>
                  Report dispatched successfully to <strong>{parentPhone}</strong> via Twilio WhatsApp & SMS!
                </span>
              </div>
              {parentReportResult?.directWhatsAppUrl && (
                <a
                  href={parentReportResult.directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, background: '#25D366', color: '#fff',
                    textDecoration: 'none', fontWeight: 800, fontSize: 12, border: '1.5px solid #17140d'
                  }}
                >
                  <Share2 size={14} /> Open in WhatsApp Web / App
                </a>
              )}
            </div>
          )}

          {parentSendStatus === 'error' && (
            <div style={{
              background: '#fff0f0', border: '2px solid #ff5b57', borderRadius: 12,
              padding: '10px 14px', marginBottom: 16, color: '#ff5b57', fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <AlertCircle size={16} />
              <span>Please enter a valid 10-digit mobile number for your parent.</span>
            </div>
          )}

          {/* Input Controls Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Parent WhatsApp / Mobile Number:
              </label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} color="#888" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={parentPhone}
                  onChange={e => setParentPhone(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                    border: '2px solid #17140d', fontSize: 13.5, fontWeight: 700, boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 800, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                Parent Name (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '2px solid #17140d', fontSize: 13.5, fontWeight: 700, boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Delivery Channel Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={e => setNotifyWhatsApp(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#25D366' }}
              />
              <span>💬 WhatsApp (Full Performance Scorecard)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={notifySms}
                onChange={e => setNotifySms(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#ff5b57' }}
              />
              <span>📱 SMS Text Message (Instant Summary)</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => dispatchParentNotification(res, parentPhone)}
              disabled={parentSendStatus === 'sending'}
              style={{
                background: '#25D366', color: '#ffffff', border: '2.5px solid #17140d',
                borderRadius: 12, padding: '12px 22px', fontWeight: 800, fontSize: 14,
                cursor: parentSendStatus === 'sending' ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '3px 3px 0 #17140d',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #17140d'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 #17140d'; }}
            >
              <Send size={16} />
              <span>{parentSendStatus === 'sending' ? 'Dispatching...' : '🚀 Send Report to Parent via Twilio'}</span>
            </button>

            {parentPhone && (
              <a
                href={`https://wa.me/${parentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `🎓 *VidyaVerse Student Performance Report*\n\n` +
                  `Dear Parent, ${profileName || 'Your Child'} (${selectedGrade}) has completed this week's Skill Assessment:\n\n` +
                  `📊 *Score:* ${res.totalCorrect}/40 (${res.percentage}% - ${res.masteryTier})\n` +
                  `• ⚛️ Physics: ${res.sectionBreakdown?.Physics?.score || 0}/10\n` +
                  `• 🧪 Chemistry: ${res.sectionBreakdown?.Chemistry?.score || 0}/10\n` +
                  `• 📐 Mathematics: ${res.sectionBreakdown?.Mathematics?.score || 0}/10\n` +
                  `• 🧬 Biology: ${res.sectionBreakdown?.Biology?.score || 0}/10\n\n` +
                  `🎯 *Predicted Career Fit:* Generated live in Career Navigator\n` +
                  `🔥 *Consistency:* Active Learning Streak & Badges Logged\n\n` +
                  `📱 Check progress live on VidyaVerse!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#ffffff', color: '#17140d', border: '2px solid #17140d',
                  borderRadius: 12, padding: '11px 18px', fontWeight: 800, fontSize: 13,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                  boxShadow: '2px 2px 0 #17140d'
                }}
              >
                <Share2 size={15} color="#25D366" />
                <span>Send Directly via WhatsApp ➔</span>
              </a>
            )}

            <button
              onClick={() => setShowParentPreview(!showParentPreview)}
              style={{
                background: '#f5efe2', color: '#17140d', border: '2px solid #17140d',
                borderRadius: 12, padding: '11px 16px', fontWeight: 800, fontSize: 13,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6
              }}
            >
              <Eye size={15} />
              <span>{showParentPreview ? 'Hide Message Preview' : '👁️ Preview Message'}</span>
            </button>
          </div>

          {/* Expandable Preview Card */}
          {showParentPreview && (
            <div style={{
              marginTop: 18, background: '#f5efe2', border: '2px solid #17140d',
              borderRadius: 14, padding: '16px 20px', fontFamily: 'monospace', fontSize: 12.5,
              whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#17140d'
            }}>
              <strong>📱 WhatsApp Message Preview to Parent ({parentPhone || 'Parent Phone'}):</strong>
              <div style={{ height: 1, background: '#17140d', margin: '8px 0 12px' }} />
              {`🎓 *VidyaVerse - Weekly Student Performance Report* 🚀\n` +
`📅 Date: ${new Date().toLocaleDateString()}\n\n` +
`Dear ${parentName || 'Parent'},\n` +
`Here is the verified weekly learning & STEM skill assessment report for *${profileName || 'Your Child'}* (${selectedGrade}):\n\n` +
`📊 *WEEKLY 40-QUESTION TEST RESULTS:*\n` +
`• Overall Score: *${res.totalCorrect} / 40 (${res.percentage}%)*\n` +
`• Performance Tier: *${res.masteryTier}*\n` +
`• ⚛️ Physics: *${res.sectionBreakdown?.Physics?.score || 0} / 10*\n` +
`• 🧪 Chemistry: *${res.sectionBreakdown?.Chemistry?.score || 0} / 10*\n` +
`• 📐 Mathematics: *${res.sectionBreakdown?.Mathematics?.score || 0} / 10*\n` +
`• 🧬 Biology: *${res.sectionBreakdown?.Biology?.score || 0} / 10*\n\n` +
`🎯 *PREDICTED CAREER PATHWAY:*\n` +
`• Calculated live in Career Navigator from physics, chemistry & math test scores.\n\n` +
`🔥 *STUDY CONSISTENCY & BADGES:*\n` +
`• Daily Learning Streak: *Active & Logged* 🔥\n` +
`• STEM Badges Earned: *Updated on student dashboard* 🏆\n\n` +
`💡 *MENTOR RECOMMENDATION:* Encourage ${profileName || 'your child'} to spend 15 mins reviewing missed concepts in our AI Socratic Classroom.`}
            </div>
          )}
        </div>

        {/* Action Controls: Retake & Review Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'all', label: `All 40 Questions` },
              { id: 'incorrect', label: `Incorrect (${40 - res.totalCorrect})` },
              { id: 'correct', label: `Correct (${res.totalCorrect})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                style={{
                  padding: '7px 14px', borderRadius: 8, border: '2px solid #17140d',
                  background: reviewFilter === f.id ? '#17140d' : '#ffffff',
                  color: reviewFilter === f.id ? '#ffffff' : '#17140d',
                  fontWeight: 800, fontSize: 12.5, cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartExam}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, border: '2px solid #17140d',
              background: '#ffffff', color: '#17140d', fontWeight: 800, fontSize: 13,
              cursor: 'pointer', boxShadow: '2px 2px 0 #17140d'
            }}
          >
            <RefreshCw size={15} /> Retake Practice Assessment
          </button>
        </div>

        {/* 40-Question Detailed Explanations List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 50 }}>
          {filteredQuestions.map((q) => {
            const originalQ = questions[q.index - 1] || {};
            return (
              <div
                key={q.index}
                style={{
                  background: '#ffffff', border: '2px solid #17140d', borderRadius: 14,
                  padding: '18px 22px', boxShadow: '3px 3px 0 #17140d'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: q.isCorrect ? '#2bd980' : '#ff5b57',
                      color: '#17140d', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 12, border: '1.5px solid #17140d'
                    }}>
                      {q.index}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#17140d' }}>
                      {q.subject} • {q.topic}
                    </span>
                  </div>

                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                    background: q.isCorrect ? '#efffed' : '#fff0f0',
                    color: q.isCorrect ? '#2bd980' : '#ff5b57',
                    border: `1.5px solid ${q.isCorrect ? '#2bd980' : '#ff5b57'}`
                  }}>
                    {q.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
                  </span>
                </div>

                <p style={{ fontSize: 14.5, fontWeight: 600, color: '#17140d', margin: '0 0 12px' }}>
                  {originalQ.question}
                </p>

                {/* Selected vs Correct */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, marginBottom: 12 }}>
                  <div style={{ color: q.isCorrect ? '#2bd980' : '#ff5b57', fontWeight: 700 }}>
                    Your Answer: {q.studentChoice !== null ? originalQ.options?.[q.studentChoice] : 'Unanswered'}
                  </div>
                  {!q.isCorrect && (
                    <div style={{ color: '#2bd980', fontWeight: 700 }}>
                      Correct Answer: {originalQ.options?.[q.correctIndex]}
                    </div>
                  )}
                </div>

                {/* NCERT Conceptual Breakdown */}
                <div style={{
                  background: '#f5efe2', border: '1.5px solid #17140d', borderRadius: 10,
                  padding: '10px 14px', fontSize: 13, color: '#333', lineHeight: 1.5
                }}>
                  <strong style={{ color: '#17140d' }}>💡 NCERT Conceptual Principle:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===================================================================
  // RENDER VIEW 3: READY / LANDING SCREEN (BEFORE TEST STARTS)
  // ===================================================================
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero Welcome Card */}
      <div style={{
        background: '#ffffff', border: '3.5px solid #17140d', borderRadius: 24,
        boxShadow: '8px 8px 0 #17140d', padding: '36px 40px', marginBottom: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f5f0ff', border: '2px solid #804dee', borderRadius: 999, padding: '4px 14px', marginBottom: 14 }}>
              <Award size={16} color="#804dee" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#804dee', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Official Weekly STEM Assessment Benchmark
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 800, color: '#17140d', margin: '0 0 12px', lineHeight: 1.15 }}>
              Class Skill Assessment & Live Career Pipeline
            </h1>

            <p style={{ fontSize: 15.5, color: '#4a4642', lineHeight: 1.6, margin: 0 }}>
              Take your mandatory 40-question weekly test spanning <strong>Physics, Chemistry, Mathematics & Biology</strong>.
              Your real-time score directly feeds into the <strong>Career Navigator</strong> to map out your long-term career roadmap from high school to elite institutes.
            </p>
          </div>

          {/* Grade Selector Box */}
          <div style={{
            background: '#f5efe2', border: '2.5px solid #17140d', borderRadius: 18,
            padding: '20px 24px', boxShadow: '4px 4px 0 #17140d', textAlign: 'center', minWidth: 220
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#666', textTransform: 'uppercase', marginBottom: 6 }}>
              Testing Level (From Profile)
            </div>

            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '2px solid #17140d', background: '#ffffff',
                fontWeight: 800, fontSize: 15, color: '#17140d', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", outline: 'none'
              }}
            >
              {GRADE_LIST.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <span style={{ display: 'block', marginTop: 8, fontSize: 11.5, color: '#777', fontWeight: 600 }}>
              Curriculum: {tierInfo.tier}
            </span>
          </div>
        </div>

        {/* Test Spec Highlights */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginTop: 28, paddingTop: 24, borderTop: '2.5px solid #f0e6d6'
        }}>
          {[
            { title: '40 Mixed Questions', desc: '10 Phy, 10 Chem, 10 Math, 10 Bio', icon: '📝', color: '#ff5b57' },
            { title: '40 Minutes Timed', desc: '1 minute per question benchmark', icon: '⏳', color: '#ffc531' },
            { title: 'Once Per Week', desc: 'Continuous performance tracking', icon: '📅', color: '#12b3a4' },
            { title: 'Live Career Roadmap', desc: 'Direct Career Navigator workflow', icon: '🎯', color: '#804dee' }
          ].map(spec => (
            <div key={spec.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: spec.color,
                border: '2px solid #17140d', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 22, flexShrink: 0
              }}>
                {spec.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#17140d' }}>{spec.title}</div>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{spec.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Weekly Test Status Card */}
      {weeklyStatus?.latestResult ? (
        <div style={{
          background: '#ffffff', border: '3px solid #17140d', borderRadius: 20,
          boxShadow: '6px 6px 0 #17140d', padding: '26px 30px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <span style={{ background: '#2bd980', color: '#17140d', border: '1.5px solid #17140d', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 800 }}>
              LATEST RESULT LOGGED ✅
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#17140d', margin: '8px 0 4px' }}>
              Score: {weeklyStatus.latestResult.totalCorrect} / 40 ({weeklyStatus.latestResult.percentage}%) • {weeklyStatus.latestResult.masteryTier}
            </h3>
            <p style={{ fontSize: 13.5, color: '#666', margin: 0 }}>
              Completed on {new Date(weeklyStatus.latestResult.completedAt).toLocaleDateString()}.
              {weeklyStatus.daysRemaining > 0 && ` Next official weekly cycle unlocks in ${weeklyStatus.daysRemaining} days.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setAssessmentResult(weeklyStatus.latestResult);
                setExamState('review');
              }}
              style={{
                padding: '10px 18px', borderRadius: 10, border: '2px solid #17140d',
                background: '#ffffff', color: '#17140d', fontWeight: 800, fontSize: 13,
                cursor: 'pointer', boxShadow: '2px 2px 0 #17140d'
              }}
            >
              Review Test Solutions 📋
            </button>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('careers');
              }}
              style={{
                padding: '10px 20px', borderRadius: 10, border: '2px solid #17140d',
                background: '#ffc531', color: '#17140d', fontWeight: 800, fontSize: 13.5,
                cursor: 'pointer', boxShadow: '3px 3px 0 #17140d', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>View Career Workflow</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : null}

      {/* Start Button Bar */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <button
          onClick={handleStartExam}
          style={{
            background: '#804dee', color: '#ffffff', border: '3.5px solid #17140d',
            borderRadius: 16, padding: '18px 42px', fontWeight: 800, fontSize: 18,
            cursor: 'pointer', boxShadow: '6px 6px 0 #17140d', display: 'inline-flex',
            alignItems: 'center', gap: 12, transition: 'all 0.15s cubic-bezier(0.2,0,0,1)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = '9px 9px 0 #17140d'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '6px 6px 0 #17140d'; }}
        >
          <span>Start Weekly 40-Question Assessment</span>
          <ArrowRight size={22} />
        </button>
      </div>

    </div>
  );
}

function getSubjectBadgeColor(subject) {
  const map = {
    Physics: '#ff5b57',
    Chemistry: '#12b3a4',
    Mathematics: '#6b5be6',
    Biology: '#2bd980'
  };
  return map[subject] || '#804dee';
}
