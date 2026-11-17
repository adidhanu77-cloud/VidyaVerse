import { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../services/api';

const API = `${API_BASE}/treasure-hunt`;
const USER_API = `${API_BASE}/user`;

const DISC = {
  physics:     { icon: '⚡', color: '#ff5b57', bg: '#fff0f0', label: 'Physics' },
  chemistry:   { icon: '🧪', color: '#12b3a4', bg: '#f0fbfa', label: 'Chemistry' },
  biology:     { icon: '🧬', color: '#6b5be6', bg: '#f4f2ff', label: 'Biology' },
  mathematics: { icon: '📐', color: '#ffc531', bg: '#fffbf0', label: 'Mathematics' },
};

// Node positions for the winding path (8 levels)
const NODE_POS = [
  { x: 90,  y: 370 }, // 1
  { x: 210, y: 260 }, // 2
  { x: 350, y: 185 }, // 3
  { x: 490, y: 260 }, // 4
  { x: 610, y: 370 }, // 5
  { x: 490, y: 455 }, // 6
  { x: 350, y: 435 }, // 7
  { x: 210, y: 455 }, // 8
];
const TREASURE_POS = { x: 90, y: 455 };
const SVG_W = 720, SVG_H = 530;

function pathD() {
  const pts = [...NODE_POS, TREASURE_POS];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], n = pts[i];
    const cx = (p.x + n.x) / 2, cy = (p.y + n.y) / 2;
    d += ` Q ${cx} ${p.y} ${n.x} ${n.y}`;
  }
  return d;
}

export default function TreasureHunt({ userId: propUserId }) {
  const userId = propUserId || localStorage.getItem('stemverse_userId') || 'guest_user';
  const [selPath, setSelPath] = useState('physics');
  const [pathsData, setPathsData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [badgeDefs, setBadgeDefs] = useState([]);
  const [quiz, setQuiz] = useState(null);      // { level, questions, currentQ, score, startTime, selected, showAnswer }
  const [result, setResult] = useState(null);  // level completion result
  const [loadingQ, setLoadingQ] = useState(false);
  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef(null);

  // ── Load paths + progress + badges on mount
  useEffect(() => {
    fetch(`${API}/paths`).then(r => r.json()).then(d => setPathsData(d.paths));
    fetch(`${API}/badges`).then(r => r.json()).then(d => setBadgeDefs(d.badges || []));
    loadProgress();
  }, []);

  function loadProgress() {
    fetch(`${API}/progress/${userId}`).then(r => r.json()).then(d => setProgress(d.progress));
  }

  // ── Timer
  useEffect(() => {
    if (quiz && !quiz.showResult) {
      timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [quiz?.currentQ, quiz?.showResult]);

  const disc = DISC[selPath];
  const levels = pathsData?.[selPath]?.levels || [];
  const done = progress?.completedLevels?.[selPath] || [];
  const stars = progress?.levelStars || {};

  function isAvailable(lvl) {
    if (lvl === 1) return true;
    return done.includes(lvl - 1);
  }

  async function openLevel(levelCfg) {
    if (!isAvailable(levelCfg.level)) return;
    setLoadingQ(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject: selPath, level: levelCfg.level, difficulty: levelCfg.difficulty, topic: levelCfg.topic }),
      });
      const data = await res.json();
      setQuiz({ level: levelCfg, questions: data.questions, currentQ: 0, score: 0, startTime: Date.now(), selected: null, showAnswer: false, showResult: false });
      setTimerSec(0);
    } catch (e) {
      alert('Could not load questions. Is the backend running?');
    }
    setLoadingQ(false);
  }

  function handleAnswer(idx) {
    if (quiz.showAnswer) return;
    const correct = quiz.questions[quiz.currentQ].correctAnswer;
    const newScore = quiz.score + (idx === correct ? 1 : 0);
    setQuiz(q => ({ ...q, selected: idx, showAnswer: true, score: newScore }));

    setTimeout(() => {
      if (quiz.currentQ + 1 >= quiz.questions.length) {
        // End of quiz
        submitLevel(newScore, quiz.questions.length);
      } else {
        setQuiz(q => ({ ...q, currentQ: q.currentQ + 1, selected: null, showAnswer: false }));
        setTimerSec(0);
      }
    }, 1400);
  }

  async function submitLevel(score, total) {
    const timeTaken = Math.round((Date.now() - quiz.startTime) / 1000);
    try {
      const res = await fetch(`${API}/complete-level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject: selPath, level: quiz.level.level, score, totalQuestions: total, timeTaken }),
      });
      const data = await res.json();
      setResult({ ...data, score, total });
      setQuiz(q => ({ ...q, showResult: true }));
      loadProgress();
      // Also update localStorage progress snapshot
      fetch(`${API}/progress/${userId}`).then(r => r.json()).then(d => {
        localStorage.setItem('stemverse_progress', JSON.stringify(d.progress));
      });
    } catch (e) {
      console.error(e);
    }
  }

  function closeQuiz() {
    setQuiz(null);
    setResult(null);
    setTimerSec(0);
  }

  const earnedBadges = badgeDefs.filter(b => progress?.badges?.includes(b.id));

  // ══════════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#17140d' }}>
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ background: '#ffc531', color: '#17140d', border: '2px solid #17140d', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          🧭 STEM Treasure Hunt
        </span>
        <span style={{ fontSize: 12, color: '#7a7068', fontWeight: 600 }}>Complete missions · Earn XP · Collect Badges</span>
      </div>

      <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, marginBottom: 4, lineHeight: 1.1 }}>
        Explore · Learn · <span style={{ background: '#ffc531', padding: '0 6px', borderRadius: 6 }}>Earn</span>
      </h2>
      <p style={{ fontSize: 14, color: '#5a5450', marginBottom: 24 }}>
        Choose a subject path, complete levels with AI-generated questions, and earn streaks & badges!
      </p>

      {/* Subject Path Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {Object.entries(DISC).map(([key, d]) => (
          <button key={key}
            onClick={() => setSelPath(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', border: '2.5px solid #17140d', borderRadius: 999,
              cursor: 'pointer', fontWeight: 800, fontSize: 14,
              background: selPath === key ? d.color : '#fff',
              color: selPath === key ? '#fff' : '#17140d',
              boxShadow: selPath === key ? '4px 4px 0 #17140d' : '2px 2px 0 #17140d',
              transform: selPath === key ? 'translate(-1px,-1px)' : 'none',
              transition: 'all .15s',
            }}>
            <span style={{ fontSize: 18 }}>{d.icon}</span> {d.label}
          </button>
        ))}
      </div>

      {/* Main 3-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 200px', gap: 20, alignItems: 'start' }}>

        {/* LEFT: Badges Panel */}
        <div style={{ border: '3px solid #17140d', borderRadius: 18, background: '#fff', boxShadow: '6px 6px 0 #17140d', overflow: 'hidden' }}>
          <div style={{ background: '#17140d', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <span style={{ color: '#ffc531', fontWeight: 800, fontSize: 13, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Badges</span>
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {badgeDefs.slice(0, 8).map(b => {
              const earned = progress?.badges?.includes(b.id);
              return (
                <div key={b.id} title={earned ? b.desc : 'Complete levels to unlock'}
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    border: `2.5px solid ${earned ? '#17140d' : '#d4c9b5'}`,
                    background: earned ? '#ffc531' : '#f0ece4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: earned ? 24 : 20, cursor: 'default',
                    boxShadow: earned ? '3px 3px 0 #17140d' : 'none',
                    filter: earned ? 'none' : 'grayscale(1) opacity(.4)',
                    margin: '0 auto',
                  }}>
                  {earned ? b.emoji : '🔒'}
                </div>
              );
            })}
          </div>
          {earnedBadges.length > 0 && (
            <div style={{ padding: '0 12px 12px', fontSize: 11, color: '#5a5450', textAlign: 'center' }}>
              {earnedBadges.length} of {badgeDefs.length} earned
            </div>
          )}
        </div>

        {/* CENTER: Path Map */}
        <div style={{ border: '3px solid #17140d', borderRadius: 20, background: `linear-gradient(160deg, ${disc.bg} 0%, #f5efe2 100%)`, boxShadow: '8px 8px 0 #17140d', overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{ padding: '14px 20px', borderBottom: '2px solid #17140d', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{disc.icon}</span>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18 }}>{disc.label} Path</span>
            <span style={{ marginLeft: 'auto', fontSize: 13, background: disc.color, color: '#fff', border: '2px solid #17140d', borderRadius: 999, padding: '2px 12px', fontWeight: 700 }}>
              {done.length}/8 Levels
            </span>
          </div>

          {/* SVG Path Map */}
          <div style={{ position: 'relative', overflowX: 'auto' }}>
            <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
              {/* Dashed road path */}
              <path d={pathD()} fill="none" stroke="#d4c9b5" strokeWidth="18" strokeLinecap="round" />
              <path d={pathD()} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeDasharray="20,16" />

              {/* Level nodes */}
              {levels.map((lvlCfg, i) => {
                const pos = NODE_POS[i];
                const lvl = lvlCfg.level;
                const isDone = done.includes(lvl);
                const avail = isAvailable(lvl);
                const starCount = stars[`${selPath}_${lvl}`] || 0;
                const fill = isDone ? disc.color : avail ? '#fff' : '#c8bfb0';
                const textCol = isDone ? '#fff' : avail ? '#17140d' : '#888';

                return (
                  <g key={lvl} onClick={() => avail && openLevel(lvlCfg)} style={{ cursor: avail ? 'pointer' : 'default' }}>
                    {/* Outer glow for available */}
                    {avail && !isDone && (
                      <circle cx={pos.x} cy={pos.y} r={38} fill={disc.color} opacity={.15} />
                    )}
                    {/* Circle */}
                    <circle cx={pos.x} cy={pos.y} r={30} fill={fill} stroke="#17140d" strokeWidth={3} />
                    {/* Shadow */}
                    <circle cx={pos.x + 4} cy={pos.y + 4} r={30} fill="#17140d" opacity={.15} style={{ pointerEvents: 'none' }} />
                    <circle cx={pos.x} cy={pos.y} r={30} fill={fill} stroke="#17140d" strokeWidth={3} />

                    {/* Number or lock */}
                    {!avail ? (
                      <text x={pos.x} y={pos.y + 6} textAnchor="middle" fontSize={18} fill="#888">🔒</text>
                    ) : (
                      <text x={pos.x} y={pos.y + 8} textAnchor="middle" fontSize={22} fontWeight="800" fontFamily="'Bricolage Grotesque', sans-serif" fill={textCol}>{lvl}</text>
                    )}

                    {/* Stars below node */}
                    <g transform={`translate(${pos.x - 24}, ${pos.y + 36})`}>
                      {[0, 1, 2].map(si => (
                        <text key={si} x={si * 16} y={0} fontSize={13} fill={si < starCount ? '#ffc531' : '#d4c9b5'}>★</text>
                      ))}
                    </g>

                    {/* Level title */}
                    <text x={pos.x} y={pos.y - 38} textAnchor="middle" fontSize={10} fontWeight="700" fill="#5a5450" fontFamily="'DM Sans', sans-serif">
                      {lvlCfg.title.length > 14 ? lvlCfg.title.slice(0, 13) + '…' : lvlCfg.title}
                    </text>
                  </g>
                );
              })}

              {/* Treasure Chest */}
              <g>
                <circle cx={TREASURE_POS.x} cy={TREASURE_POS.y} r={32} fill={done.length >= 8 ? '#ffc531' : '#c8bfb0'} stroke="#17140d" strokeWidth={3} />
                <text x={TREASURE_POS.x} y={TREASURE_POS.y + 10} textAnchor="middle" fontSize={26}>
                  {done.length >= 8 ? '🎁' : '🔒'}
                </text>
                <text x={TREASURE_POS.x} y={TREASURE_POS.y + 50} textAnchor="middle" fontSize={9} fontWeight="700" fill="#5a5450">
                  {done.length >= 8 ? 'UNLOCKED!' : `Unlocks at Level 8`}
                </text>
              </g>
            </svg>
          </div>

          {/* Level list cards below map */}
          <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 10 }}>
            {levels.map(lvlCfg => {
              const avail = isAvailable(lvlCfg.level);
              const isDone = done.includes(lvlCfg.level);
              const starCount = stars[`${selPath}_${lvlCfg.level}`] || 0;
              return (
                <button key={lvlCfg.level}
                  onClick={() => avail && openLevel(lvlCfg)}
                  disabled={!avail}
                  style={{
                    border: `2.5px solid ${avail ? '#17140d' : '#d4c9b5'}`,
                    borderRadius: 14, padding: '10px 12px',
                    background: isDone ? disc.color : avail ? '#fff' : '#f0ece4',
                    color: isDone ? '#fff' : avail ? '#17140d' : '#aaa',
                    cursor: avail ? 'pointer' : 'not-allowed',
                    textAlign: 'left',
                    boxShadow: avail ? '4px 4px 0 #17140d' : '2px 2px 0 #d4c9b5',
                    transition: 'all .15s',
                  }}
                  onMouseEnter={e => { if (avail) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #17140d'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = avail ? '4px 4px 0 #17140d' : '2px 2px 0 #d4c9b5'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      Lvl {lvlCfg.level}
                    </span>
                    <span style={{ fontSize: 11 }}>{'★'.repeat(starCount)}{'☆'.repeat(3 - starCount)}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{lvlCfg.title}</div>
                  <div style={{ fontSize: 10, opacity: .75 }}>{lvlCfg.topic.slice(0, 28)}…</div>
                  <div style={{ marginTop: 6, fontSize: 10, background: 'rgba(0,0,0,.08)', borderRadius: 6, padding: '2px 6px', display: 'inline-block', fontWeight: 700 }}>
                    +{lvlCfg.xp} XP {avail && !isDone ? '▶' : isDone ? '✓' : '🔒'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Progress Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ border: '3px solid #17140d', borderRadius: 18, background: '#fff', boxShadow: '6px 6px 0 #17140d', overflow: 'hidden' }}>
            <div style={{ background: disc.color, padding: '10px 14px', borderBottom: '2px solid #17140d' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Progress</span>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* XP */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🌟</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{progress?.totalXP || 0}</div>
                  <div style={{ fontSize: 11, color: '#7a7068' }}>Total XP</div>
                </div>
              </div>
              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  <span>{done.length}/8 Levels</span>
                  <span style={{ color: disc.color }}>{Math.round(done.length / 8 * 100)}%</span>
                </div>
                <div style={{ height: 10, background: '#e8e2d8', borderRadius: 999, border: '2px solid #17140d', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(done.length / 8) * 100}%`, background: disc.color, borderRadius: 999, transition: 'width .5s' }} />
                </div>
              </div>
              {/* Streak */}
              <div style={{ background: '#fff8e6', border: '2px solid #ffc531', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>🔥</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{progress?.streak || 0} Days</div>
                  <div style={{ fontSize: 10, color: '#7a7068' }}>Current Streak</div>
                </div>
              </div>
              {/* Longest Streak */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🏅</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{progress?.longestStreak || 0} Days</div>
                  <div style={{ fontSize: 11, color: '#7a7068' }}>Longest Streak</div>
                </div>
              </div>
              {/* Badges count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>🎖️</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{progress?.badges?.length || 0} Badges</div>
                  <div style={{ fontSize: 11, color: '#7a7068' }}>Collected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Earned Badges mini list */}
          {earnedBadges.length > 0 && (
            <div style={{ border: '3px solid #17140d', borderRadius: 18, background: '#fff', boxShadow: '5px 5px 0 #17140d', padding: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '.05em' }}>Latest Badges</div>
              {earnedBadges.slice(-3).map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 8px', background: '#ffc531', border: '2px solid #17140d', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                  <span style={{ fontSize: 18 }}>{b.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 11 }}>{b.name}</div>
                    <div style={{ fontSize: 10, color: '#5a5450', fontWeight: 500 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loadingQ && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(23,20,13,.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', border: '3px solid #17140d', borderRadius: 20, padding: '40px 60px', boxShadow: '10px 10px 0 #17140d', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 20 }}>Gemini AI is generating</div>
            <div style={{ fontSize: 15, color: '#5a5450', marginTop: 4 }}>your personalized questions…</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 36, height: 36, border: '4px solid #e8e2d8', borderTopColor: disc.color, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '20px auto 0' }} />
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {quiz && !quiz.showResult && (
        <QuizModal quiz={quiz} disc={disc} timerSec={timerSec} onAnswer={handleAnswer} onClose={closeQuiz} />
      )}

      {/* Result Modal */}
      {quiz?.showResult && result && (
        <ResultModal result={result} disc={disc} level={quiz.level} badgeDefs={badgeDefs} onClose={closeQuiz} onRetry={() => openLevel(quiz.level)} />
      )}
    </div>
  );
}

// ── Quiz Modal ────────────────────────────────────────────────────────
function QuizModal({ quiz, disc, timerSec, onAnswer, onClose }) {
  const q = quiz.questions[quiz.currentQ];
  const total = quiz.questions.length;
  const pct = ((quiz.currentQ) / total) * 100;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(23,20,13,.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#f5efe2', border: '3px solid #17140d', borderRadius: 24, width: '100%', maxWidth: 640, boxShadow: '12px 12px 0 #17140d', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ background: '#17140d', padding: '14px 20px', borderRadius: '21px 21px 0 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{disc.icon}</span>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 16, color: '#f5efe2', flex: 1 }}>
            Level {quiz.level.level}: {quiz.level.title}
          </span>
          <span style={{ background: '#ffc531', color: '#17140d', border: '2px solid #ffc531', borderRadius: 999, padding: '3px 12px', fontSize: 13, fontWeight: 800 }}>
            ⏱ {timerSec}s
          </span>
          <button onClick={onClose} style={{ background: 'none', border: '2px solid #ff5b57', color: '#ff5b57', borderRadius: 999, padding: '3px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>✕ Quit</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, background: '#e8e2d8' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: disc.color, transition: 'width .3s' }} />
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Q counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: disc.color }}>Question {quiz.currentQ + 1} of {total}</span>
            <span style={{ fontWeight: 800, fontSize: 13, color: '#5a5450' }}>Score: {quiz.score}/{quiz.currentQ}</span>
          </div>

          {/* Concept tag */}
          {q.concept && (
            <div style={{ background: '#fff', border: '2px solid #17140d', borderRadius: 10, padding: '4px 12px', fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 12 }}>
              📘 {q.concept}
            </div>
          )}

          {/* Question */}
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1.4, marginBottom: 20, color: '#17140d' }}>
            {q.question}
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, idx) => {
              let bg = '#fff', borderCol = '#17140d', textCol = '#17140d';
              if (quiz.showAnswer) {
                if (idx === q.correctAnswer) { bg = '#e8fbf2'; borderCol = '#2bd980'; textCol = '#096b41'; }
                else if (idx === quiz.selected && idx !== q.correctAnswer) { bg = '#fff0f0'; borderCol = '#ff5b57'; textCol = '#c0392b'; }
                else { bg = '#fafaf8'; borderCol = '#d4c9b5'; textCol = '#aaa'; }
              }
              return (
                <button key={idx} onClick={() => onAnswer(idx)} disabled={quiz.showAnswer}
                  style={{
                    padding: '12px 16px', border: `2.5px solid ${borderCol}`, borderRadius: 14,
                    background: bg, color: textCol, fontWeight: 700, fontSize: 15,
                    textAlign: 'left', cursor: quiz.showAnswer ? 'default' : 'pointer',
                    boxShadow: quiz.showAnswer ? 'none' : '3px 3px 0 #17140d',
                    transition: 'all .15s',
                  }}>
                  {opt}
                  {quiz.showAnswer && idx === q.correctAnswer && <span style={{ float: 'right' }}>✅</span>}
                  {quiz.showAnswer && idx === quiz.selected && idx !== q.correctAnswer && <span style={{ float: 'right' }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {quiz.showAnswer && q.explanation && (
            <div style={{ marginTop: 14, background: '#fffbf0', border: '2px solid #ffc531', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#5a5450', lineHeight: 1.5 }}>
              <strong>💡 Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Result Modal ──────────────────────────────────────────────────────
function ResultModal({ result, disc, level, badgeDefs, onClose, onRetry }) {
  const pct = Math.round((result.score / result.total) * 100);
  const newBadgeDefs = badgeDefs.filter(b => result.newBadges?.includes(b.id));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(23,20,13,.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#f5efe2', border: '3px solid #17140d', borderRadius: 24, width: '100%', maxWidth: 520, boxShadow: '12px 12px 0 #17140d', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ background: result.levelPassed ? disc.color : '#ff5b57', padding: '20px', borderRadius: '21px 21px 0 0', borderBottom: '3px solid #17140d' }}>
          <div style={{ fontSize: 48 }}>{result.levelPassed ? '🎉' : '😤'}</div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', marginTop: 6 }}>
            {result.levelPassed ? 'Level Complete!' : 'Keep Trying!'}
          </div>
          <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 14, marginTop: 2 }}>
            Level {level.level}: {level.title}
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Stars */}
          <div style={{ fontSize: 40, letterSpacing: 6, marginBottom: 16 }}>
            {'⭐'.repeat(result.stars)}{'☆'.repeat(3 - result.stars)}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Score', value: `${result.score}/${result.total}`, emoji: '🎯', color: disc.color },
              { label: 'XP Earned', value: `+${result.xpEarned}`, emoji: '🌟', color: '#ffc531' },
              { label: 'Time', value: `${result.timeTaken}s`, emoji: '⏱', color: '#6b5be6' },
            ].map(s => (
              <div key={s.label} style={{ border: '2.5px solid #17140d', borderRadius: 14, padding: '10px 8px', background: '#fff', boxShadow: '3px 3px 0 #17140d' }}>
                <div style={{ fontSize: 20 }}>{s.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#7a7068' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div style={{ background: '#fff8e6', border: '2px solid #ffc531', borderRadius: 12, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{result.streak} Day Streak!</div>
              <div style={{ fontSize: 12, color: '#7a7068' }}>Longest: {result.longestStreak} days</div>
            </div>
          </div>

          {/* New badges */}
          {newBadgeDefs.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: '#5a5450' }}>🎖️ New Badges Earned!</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {newBadgeDefs.map(b => (
                  <div key={b.id} style={{ background: '#ffc531', border: '2.5px solid #17140d', borderRadius: 14, padding: '8px 14px', boxShadow: '3px 3px 0 #17140d' }}>
                    <div style={{ fontSize: 24 }}>{b.emoji}</div>
                    <div style={{ fontWeight: 800, fontSize: 11 }}>{b.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose}
              style={{ flex: 1, padding: '12px', border: '2.5px solid #17140d', borderRadius: 14, background: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '4px 4px 0 #17140d' }}>
              ← Back to Map
            </button>
            {!result.levelPassed && (
              <button onClick={onRetry}
                style={{ flex: 1, padding: '12px', border: '2.5px solid #17140d', borderRadius: 14, background: disc.color, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '4px 4px 0 #17140d' }}>
                🔄 Retry Level
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
