import React, { useState, useEffect } from 'react';
import {
  Compass, CheckCircle2, ArrowRight, Sparkles, Briefcase,
  Clock, RefreshCw, ChevronRight, BarChart3
} from 'lucide-react';
import { generateCareerWorkflowFromAssessment } from '../services/careerWorkflowEngine';
import { getLatestAssessment, checkWeeklyStatus } from '../services/assessmentEngine';

/* ── Colour palette helper ─────────────────────────── */
const STAGE_ICONS = ['🏫', '🎯', '🎓', '🔬', '💼', '🌾'];

export default function CareerNavigator({ onNavigate }) {
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [careerWorkflow, setCareerWorkflow] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' | 'classic'
  const [studentName, setStudentName] = useState('');

  /* ── Load assessment data on mount ─────────────── */
  useEffect(() => {
    const status = checkWeeklyStatus();
    setWeeklyStatus(status);

    const latest = getLatestAssessment();
    setLatestAssessment(latest);

    // Load profile name
    try {
      const prof = localStorage.getItem('vidyaverse_profile') || localStorage.getItem('stemverse_profile');
      if (prof) {
        const parsed = JSON.parse(prof);
        if (parsed.name) setStudentName(parsed.name);
      }
    } catch {}

    if (latest) {
      buildCareerWorkflow(latest);
    }
  }, []);

  async function buildCareerWorkflow(assessment) {
    setGenerating(true);
    try {
      const workflow = await generateCareerWorkflowFromAssessment(assessment, { name: studentName });
      setCareerWorkflow(workflow);
    } catch (err) {
      console.error('[CareerNavigator] Workflow gen error:', err);
    }
    setGenerating(false);
  }

  async function handleRefresh() {
    const latest = getLatestAssessment();
    if (latest) {
      setLatestAssessment(latest);
      await buildCareerWorkflow(latest);
    }
  }

  /* ══════════════════════════════════════════════════════════
     SECTION A: NO ASSESSMENT DATA YET → Prompt Student
  ══════════════════════════════════════════════════════════ */
  if (!latestAssessment) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
        {/* CTA Card: Take Assessment First */}
        <div style={{
          background: '#ffffff', border: '3.5px solid #17140d', borderRadius: 24,
          boxShadow: '8px 8px 0 #17140d', padding: '52px 44px', textAlign: 'center',
          marginBottom: 36
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800, color: '#17140d', margin: '0 0 14px' }}>
            Career Workflow Requires Your Test Results
          </h2>
          <p style={{ fontSize: 16, color: '#555', maxWidth: 620, margin: '0 auto 28px', lineHeight: 1.65 }}>
            Your personalized career roadmap is calculated <strong>in real-time</strong> from your actual test scores in Physics, Chemistry, Mathematics & Biology.
            Take the weekly 40-question <strong>Skill Assessment</strong> first to unlock your tailored end-to-end career workflow.
          </p>

          <button
            onClick={() => onNavigate && onNavigate('assessment')}
            style={{
              background: '#804dee', color: '#ffffff', border: '3.5px solid #17140d',
              borderRadius: 16, padding: '16px 36px', fontWeight: 800, fontSize: 17,
              cursor: 'pointer', boxShadow: '6px 6px 0 #17140d', display: 'inline-flex',
              alignItems: 'center', gap: 10, transition: 'all 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '8px 8px 0 #17140d'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '6px 6px 0 #17140d'; }}
          >
            Take Skill Assessment Now →
          </button>
        </div>

        {/* Classic Manual Explorer (always available) */}
        <ClassicCareerExplorer />
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     SECTION B: ASSESSMENT PRESENT → Show Workflow
  ══════════════════════════════════════════════════════════ */
  const res = latestAssessment;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { id: 'workflow', label: '🚀 My Real-Time Career Workflow', desc: 'From your test scores' },
          { id: 'classic', label: '🗺️ Passion Explorer', desc: 'Manual career discovery' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px', borderRadius: 14, border: '2.5px solid #17140d',
              background: activeTab === tab.id ? '#17140d' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#17140d',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '4px 4px 0 #804dee' : '3px 3px 0 #17140d',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
            <span style={{ display: 'block', fontWeight: 500, fontSize: 11, opacity: 0.75, marginTop: 2 }}>
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ── TAB: CLASSIC PASSION EXPLORER ── */}
      {activeTab === 'classic' && <ClassicCareerExplorer />}

      {/* ── TAB: REAL-TIME WORKFLOW ── */}
      {activeTab === 'workflow' && (
        <>
          {/* Score Summary + Refresh Bar */}
          <div style={{
            background: '#ffffff', border: '3px solid #17140d', borderRadius: 18,
            boxShadow: '5px 5px 0 #17140d', padding: '20px 26px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#804dee', letterSpacing: '.06em' }}>
                Career Workflow Source: Weekly Assessment Test Results
              </span>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '⚛️ Physics', val: `${res.sectionBreakdown?.Physics?.score || 0}/10`, c: '#ff5b57' },
                  { label: '🧪 Chemistry', val: `${res.sectionBreakdown?.Chemistry?.score || 0}/10`, c: '#12b3a4' },
                  { label: '📐 Maths', val: `${res.sectionBreakdown?.Mathematics?.score || 0}/10`, c: '#6b5be6' },
                  { label: '🧬 Biology', val: `${res.sectionBreakdown?.Biology?.score || 0}/10`, c: '#2bd980' },
                  { label: '🎯 Total', val: `${res.totalCorrect}/40 (${res.percentage}%)`, c: '#17140d' }
                ].map(s => (
                  <div key={s.label} style={{
                    background: '#f5efe2', border: '1.5px solid #17140d', borderRadius: 8,
                    padding: '4px 12px', fontWeight: 800, fontSize: 13
                  }}>
                    {s.label} <span style={{ color: s.c }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleRefresh}
                disabled={generating}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 10, border: '2px solid #17140d',
                  background: generating ? '#e0dbcf' : '#ffffff', color: '#17140d',
                  fontWeight: 800, fontSize: 13, cursor: generating ? 'not-allowed' : 'pointer',
                  boxShadow: '2px 2px 0 #17140d'
                }}
              >
                <RefreshCw size={14} style={{ animation: generating ? 'spin 1s linear infinite' : 'none' }} />
                {generating ? 'Generating…' : 'Regenerate Workflow'}
              </button>

              <button
                onClick={() => onNavigate && onNavigate('assessment')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', borderRadius: 10, border: '2px solid #17140d',
                  background: '#ffc531', color: '#17140d',
                  fontWeight: 800, fontSize: 13, cursor: 'pointer',
                  boxShadow: '2px 2px 0 #17140d'
                }}
              >
                <BarChart3 size={14} /> View Full Test Report
              </button>
            </div>
          </div>

          {/* Loading Spinner */}
          {generating && (
            <div style={{
              background: '#f4f2ff', border: '2.5px solid #804dee', borderRadius: 16,
              padding: '28px', textAlign: 'center', marginBottom: 24
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚙️</div>
              <p style={{ fontWeight: 700, color: '#804dee', fontSize: 15 }}>
                Calculating your personalized career roadmap from live test data…
              </p>
            </div>
          )}

          {/* Workflow Sections */}
          {careerWorkflow && !generating && (
            <>
              {/* Primary Track Badge */}
              <div style={{
                background: `linear-gradient(135deg, ${careerWorkflow.primaryTrack?.color || '#804dee'}18 0%, #ffffff 100%)`,
                border: `3.5px solid ${careerWorkflow.primaryTrack?.color || '#804dee'}`,
                borderRadius: 20, padding: '28px 32px', marginBottom: 24,
                boxShadow: `6px 6px 0 ${careerWorkflow.primaryTrack?.color || '#804dee'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{
                        background: careerWorkflow.primaryTrack?.color || '#804dee', color: '#fff',
                        border: '1.5px solid #17140d', borderRadius: 999, padding: '4px 12px',
                        fontWeight: 800, fontSize: 11.5, letterSpacing: '.05em', textTransform: 'uppercase'
                      }}>
                        {careerWorkflow.primaryTrack?.badge || '🎯 TOP CAREER MATCH'}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: careerWorkflow.primaryTrack?.color }}>
                        {careerWorkflow.primaryTrack?.matchPercentage}% Score Match
                      </span>
                    </div>

                    <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#17140d', margin: '0 0 6px' }}>
                      {careerWorkflow.primaryTrack?.title}
                    </h2>

                    <p style={{ fontSize: 14, fontWeight: 700, color: '#666', margin: '0 0 12px' }}>
                      🌐 {careerWorkflow.primaryTrack?.domain}
                    </p>

                    <p style={{ fontSize: 15, color: '#333', margin: '0 0 14px', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{careerWorkflow.primaryTrack?.tagline}"
                    </p>

                    <p style={{ fontSize: 14, color: '#444', margin: 0, lineHeight: 1.6, background: '#f5f0ff', borderRadius: 8, padding: '12px 14px', border: '1.5px solid #ccc5f0' }}>
                      <strong>Why this path for you:</strong> {careerWorkflow.primaryTrack?.rationale}
                    </p>
                  </div>

                  {/* Match Percentage Ring */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 100, height: 100, borderRadius: '50%',
                      border: `6px solid ${careerWorkflow.primaryTrack?.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                      background: '#fff', boxShadow: `0 0 0 3px ${careerWorkflow.primaryTrack?.color}30`
                    }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: '#17140d', lineHeight: 1 }}>
                        {careerWorkflow.primaryTrack?.matchPercentage}%
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#888' }}>MATCH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternate Tracks */}
              {(careerWorkflow.alternateTracks || []).length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#17140d', marginBottom: 14 }}>
                    🔀 Alternate Compatible Career Tracks
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {careerWorkflow.alternateTracks.map((track, idx) => (
                      <div key={idx} style={{
                        background: '#ffffff', border: '2.5px solid #17140d', borderRadius: 14,
                        padding: '18px 20px', boxShadow: '3px 3px 0 #17140d'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 800, color: '#17140d', margin: 0, flex: 1 }}>
                            {track.title}
                          </h4>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                            background: track.color || '#ffc531', color: '#17140d',
                            border: '1.5px solid #17140d', marginLeft: 8, flexShrink: 0
                          }}>
                            {track.matchPercentage}%
                          </span>
                        </div>
                        <p style={{ fontSize: 12.5, color: '#666', fontWeight: 700, margin: '0 0 6px' }}>
                          {track.domain}
                        </p>
                        <p style={{ fontSize: 13, color: '#444', margin: 0, lineHeight: 1.4 }}>
                          {track.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6-Stage Long Career Pipeline */}
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#17140d', marginBottom: 18 }}>
                📍 Your 6-Stage End-to-End Career Roadmap
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {(careerWorkflow.stages || []).map((stage, stageIdx) => {
                  const isOpen = expandedStage === stageIdx;

                  return (
                    <div key={stageIdx} style={{
                      background: '#ffffff', border: '3px solid #17140d', borderRadius: 18,
                      boxShadow: '4px 4px 0 #17140d', overflow: 'hidden'
                    }}>
                      {/* Stage Header Button */}
                      <button
                        onClick={() => setExpandedStage(isOpen ? null : stageIdx)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                          padding: '18px 22px', background: isOpen ? stage.color || '#ffc531' : '#ffffff',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderBottom: isOpen ? '2.5px solid #17140d' : 'none',
                          transition: 'background 0.15s'
                        }}
                      >
                        {/* Stage number badge */}
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                          background: stage.color || '#ffc531', border: '2.5px solid #17140d',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, boxShadow: '2px 2px 0 #17140d'
                        }}>
                          {stage.icon || STAGE_ICONS[stageIdx] || '📌'}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 800, background: '#17140d', color: '#fff',
                              borderRadius: 6, padding: '2px 8px', letterSpacing: '.05em'
                            }}>
                              STAGE {stage.stageNumber}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: isOpen ? '#17140d' : '#666' }}>
                              ⏰ {stage.timeframe}
                            </span>
                          </div>
                          <h4 style={{
                            fontSize: 'clamp(16px,2vw,20px)', fontWeight: 800,
                            color: '#17140d', margin: '4px 0 0'
                          }}>
                            {stage.title}
                          </h4>
                        </div>

                        <ChevronRight
                          size={22} color="#17140d"
                          style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                        />
                      </button>

                      {/* Expanded Stage Body */}
                      {isOpen && (
                        <div style={{ padding: '22px 28px' }}>
                          {/* Stage 1: Highlights */}
                          {stage.highlights && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#804dee', marginBottom: 4 }}>
                                🎯 Actionable Steps Right Now:
                              </span>
                              {stage.highlights.map((h, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                  <CheckCircle2 size={18} color="#2bd980" style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: 14, color: '#333', lineHeight: 1.5, fontWeight: 500 }}>{h}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Stage 2: Entrance Exams */}
                          {stage.exams && (
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ff5b57', marginBottom: 14, display: 'block' }}>
                                📋 Target Entrance Examinations:
                              </span>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                                {stage.exams.map((exam, idx) => (
                                  <div key={idx} style={{
                                    background: '#fff0f0', border: '2px solid #17140d', borderRadius: 12, padding: '14px 16px'
                                  }}>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: '#17140d', marginBottom: 4 }}>{exam.name}</div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#ff5b57', marginBottom: 4 }}>Target: {exam.target}</div>
                                    <div style={{ fontSize: 12.5, color: '#555', lineHeight: 1.4 }}>{exam.purpose}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stage 3: Colleges */}
                          {stage.institutes && (
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#12b3a4', marginBottom: 10, display: 'block' }}>
                                🎓 Degree: {stage.degree}
                              </span>
                              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {stage.institutes.map((inst, idx) => (
                                  <span key={idx} style={{
                                    background: '#f0fbfa', border: '1.5px solid #17140d', borderRadius: 8,
                                    padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#17140d'
                                  }}>
                                    🏛️ {inst}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stage 4: Research Labs */}
                          {stage.labs && (
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ffc531', marginBottom: 10, display: 'block' }}>
                                🔬 World-Class Research Destinations:
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {stage.labs.map((lab, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <ArrowRight size={16} color="#ffc531" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>{lab}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stage 5: Career Roles + Salary */}
                          {stage.roles && (
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#2bd980', marginBottom: 10, display: 'block' }}>
                                💼 High-Demand Career Designations:
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                {stage.roles.map((role, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Briefcase size={16} color="#2bd980" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: 14, color: '#333', fontWeight: 600 }}>{role}</span>
                                  </div>
                                ))}
                              </div>
                              {stage.salary && (
                                <div style={{ background: '#efffed', border: '2px solid #17140d', borderRadius: 10, padding: '12px 16px', fontWeight: 800, fontSize: 14 }}>
                                  💰 Expected Compensation: {stage.salary}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Stage 6: Village Impact */}
                          {stage.impact && (
                            <div style={{ background: '#f5efe2', border: '2px solid #17140d', borderRadius: 12, padding: '16px 20px' }}>
                              <div style={{ fontSize: 12, fontWeight: 800, color: '#ff5b57', textTransform: 'uppercase', marginBottom: 8 }}>
                                🌾 Rural India Social Impact Mission:
                              </div>
                              <p style={{ fontSize: 15, fontWeight: 700, color: '#17140d', margin: 0, lineHeight: 1.6 }}>
                                {stage.impact}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Immediate Action Plan */}
              {(careerWorkflow.immediateWeeklyActionPlan || []).length > 0 && (
                <div style={{
                  background: '#fff9e6', border: '3px solid #17140d', borderRadius: 18,
                  boxShadow: '5px 5px 0 #17140d', padding: '24px 28px', marginBottom: 28
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#17140d', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={20} /> This Week's Study Action Plan
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {careerWorkflow.immediateWeeklyActionPlan.map((action, idx) => (
                      <div key={idx} style={{
                        background: '#ffffff', border: '2px solid #17140d', borderRadius: 12, padding: '14px 18px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{
                            background: idx === 0 ? '#ff5b57' : '#ffc531', color: '#17140d',
                            border: '1.5px solid #17140d', borderRadius: 999, padding: '2px 10px',
                            fontWeight: 800, fontSize: 11
                          }}>
                            {action.priority}
                          </span>
                          {action.subject && (
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#666' }}>
                              {action.subject} • {action.topic}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 14, color: '#333', margin: '0 0 6px', lineHeight: 1.5 }}>{action.task}</p>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#804dee', margin: 0 }}>
                          📚 {action.recommendedResource}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Topics */}
              {(careerWorkflow.strongTopics || []).length > 0 && (
                <div style={{
                  background: '#efffed', border: '2.5px solid #17140d', borderRadius: 14,
                  padding: '18px 22px', marginBottom: 20
                }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#17140d', marginBottom: 12 }}>
                    ✅ Your Strongest Concepts (From This Test):
                  </h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {careerWorkflow.strongTopics.map((topic, idx) => (
                      <span key={idx} style={{
                        background: '#2bd980', color: '#17140d', border: '1.5px solid #17140d',
                        borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 13
                      }}>
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Attribution */}
              <div style={{
                fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 40,
                fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                <Sparkles size={14} />
                Career workflow computed live from assessment taken on {new Date(res.completedAt).toLocaleDateString()} •
                Source: {careerWorkflow.source === 'gemini_realtime_ai' ? 'Gemini AI + Live Scores' : 'VidyaVerse Real-Time Assessment Engine'}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CLASSIC PASSION EXPLORER (always available, passion-based)
═══════════════════════════════════════════════════════════════════ */
function ClassicCareerExplorer() {
  const careers = [
    {
      passion: '🚲 Loves fixing bicycles & tractor gears',
      title: 'Robotics & Electric Vehicle Engineer',
      skills: ['Kinematics & Torque', "Ohm's Law & Motor Controllers", 'CAD Simulation'],
      roadmap: 'Class 8-10 Physics → Polytechnic / ITI / JEE → B.Tech Mechanical & Mechatronics',
      villageImpact: 'Design solar tractors, low-cost EV rickshaws & automated village harvesters.',
      color: '#ff5b57',
    },
    {
      passion: '🌱 Loves watching plant crops & soil insects',
      title: 'Agritech & Genetic Bio-Engineer',
      skills: ['Plant Physiology', 'Cellular Chloroplast Genetics', 'Soil Chemistry & pH'],
      roadmap: 'Class 9-12 Biology & Chemistry → ICAR Entrance → BSc Agriculture / Biotech',
      villageImpact: 'Develop drought-resistant seeds, bio-fertilizers & pest-resilient millet varieties.',
      color: '#2bd980',
    },
    {
      passion: '💡 Loves connecting wires, bulbs & solar plates',
      title: 'Renewable Smart-Grid Engineer',
      skills: ['Circuit Dynamics', 'Solar Photovoltaic Inverters', 'Battery Chem Storage'],
      roadmap: 'Class 8-12 Physics & Math → Diploma / Engineering → Solar Microgrid Specialist',
      villageImpact: 'Build 24/7 solar microgrids and decentralized cold-storage for farmer produce.',
      color: '#ffc531',
    },
    {
      passion: '📱 Loves writing games, radio signals & phone antennas',
      title: 'Satellite & Telecommunications Specialist',
      skills: ['Electromagnetic Wave Spectrum', 'Python / Microcontroller Code', 'Signal Processing'],
      roadmap: 'Class 9-12 Math & Physics → ISRO / IIST / B.Tech ECE → Space & Telecom Scientist',
      villageImpact: 'Expand satellite internet coverage and monsoon disaster forecasting to remote villages.',
      color: '#6b5be6',
    },
  ];

  const [selectedCareer, setSelectedCareer] = useState(0);
  const active = careers[selectedCareer];

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: '#ffc531', border: '3px solid #17140d', boxShadow: '4px 4px 0 #17140d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={28} color="#17140d" strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>Passion-Based Career Discovery</h3>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Explore careers based on what you love doing</p>
          </div>
        </div>
        <span style={{ backgroundColor: '#ffc531', padding: '4px 12px', borderRadius: 9999, border: '2px solid #17140d', fontSize: 12, fontWeight: 800 }}>
          MANUAL EXPLORER
        </span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, color: '#17140d' }}>
        Step 1: Select What You Enjoy Doing Most:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 24 }}>
        {careers.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedCareer(i)}
            style={{
              textAlign: 'left', padding: '12px 14px', borderRadius: 12, border: '2.5px solid #17140d',
              backgroundColor: selectedCareer === i ? c.color : '#f5efe2',
              color: selectedCareer === i && (c.color === '#ff5b57' || c.color === '#6b5be6') ? '#fff' : '#17140d',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
              boxShadow: selectedCareer === i ? '3px 3px 0 #17140d' : 'none', transition: 'all 0.15s ease',
            }}
          >
            {c.passion}
          </button>
        ))}
      </div>

      <div style={{ borderRadius: 16, border: '3px solid #17140d', padding: '24px', backgroundColor: '#ffffff', boxShadow: '5px 5px 0 #17140d' }}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ff5b57', marginBottom: 2 }}>Target Career Pathway:</div>
        <h4 style={{ fontSize: 24, color: '#17140d', marginBottom: 16 }}>{active.title}</h4>

        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#12b3a4' }}>Foundational Concepts to Master:</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {active.skills.map((sk, idx) => (
              <span key={idx} style={{ backgroundColor: '#f5efe2', border: '2px solid #17140d', borderRadius: 6, padding: '3px 10px', fontSize: 12.5, fontWeight: 700 }}>
                ✓ {sk}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#6b5be6' }}>Educational Roadmap:</span>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#333', marginTop: 4, lineHeight: 1.5 }}>{active.roadmap}</p>
        </div>

        <div style={{ borderTop: '2px dashed #17140d', paddingTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ffc531' }}>Village & Community Impact:</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#17140d', marginTop: 4 }}>{active.villageImpact}</p>
        </div>
      </div>
    </div>
  );
}
