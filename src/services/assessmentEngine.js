/**
 * VidyaVerse - Skill Assessment Engine
 * Manages class-level 40-question weekly test evaluations, subject diagnostic scores,
 * weekly countdown/cooldown timers, and sync with local storage & backend.
 */

import { getQuestionsForGrade } from '../data/assessmentQuestions';
import { API_BASE } from './api';

const STORAGE_KEY_LATEST = 'vidyaverse_latest_assessment';
const STORAGE_KEY_HISTORY = 'vidyaverse_assessment_history';

/**
 * Computes diagnostic performance metrics across all 4 subjects
 */
export function evaluateAssessment({ answers, questions, grade, timeSpentSec = 0 }) {
  let totalCorrect = 0;
  const sectionBreakdown = {
    Physics: { score: 0, total: 10, incorrectTopics: [] },
    Chemistry: { score: 0, total: 10, incorrectTopics: [] },
    Mathematics: { score: 0, total: 10, incorrectTopics: [] },
    Biology: { score: 0, total: 10, incorrectTopics: [] }
  };

  const detailedAnswers = questions.map((q, idx) => {
    const studentChoice = answers[idx] !== undefined ? answers[idx] : null;
    const isCorrect = studentChoice === q.correctIndex;
    if (isCorrect) {
      totalCorrect++;
      if (sectionBreakdown[q.subject]) {
        sectionBreakdown[q.subject].score++;
      }
    } else {
      if (sectionBreakdown[q.subject]) {
        sectionBreakdown[q.subject].incorrectTopics.push({
          topic: q.topic,
          question: q.question,
          difficulty: q.difficulty,
          selected: studentChoice !== null ? q.options[studentChoice] : 'Unanswered',
          correct: q.options[q.correctIndex],
          explanation: q.explanation
        });
      }
    }

    return {
      index: idx + 1,
      id: q.id,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      studentChoice,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const percentage = Math.round((totalCorrect / questions.length) * 100);

  // Subject percentages
  const subjectPercentages = {
    physics: Math.round((sectionBreakdown.Physics.score / 10) * 100),
    chemistry: Math.round((sectionBreakdown.Chemistry.score / 10) * 100),
    math: Math.round((sectionBreakdown.Mathematics.score / 10) * 100),
    biology: Math.round((sectionBreakdown.Biology.score / 10) * 100)
  };

  // Determine top domain & profile stream orientation
  const scoresArray = [
    { name: 'Physics', key: 'physics', score: sectionBreakdown.Physics.score },
    { name: 'Chemistry', key: 'chemistry', score: sectionBreakdown.Chemistry.score },
    { name: 'Mathematics', key: 'math', score: sectionBreakdown.Mathematics.score },
    { name: 'Biology', key: 'biology', score: sectionBreakdown.Biology.score }
  ].sort((a, b) => b.score - a.score);

  const topSubject = scoresArray[0].name;
  const secondarySubject = scoresArray[1].name;
  const lowestSubject = scoresArray[3].name;

  let streamOrientation = 'GENERAL_STEM';
  const phy = sectionBreakdown.Physics.score;
  const chem = sectionBreakdown.Chemistry.score;
  const mat = sectionBreakdown.Mathematics.score;
  const bio = sectionBreakdown.Biology.score;

  if (phy >= 7 && mat >= 7 && chem >= 6) {
    streamOrientation = 'PCM_ENGINEERING_TECH';
  } else if (bio >= 7 && chem >= 7 && mat < 7) {
    streamOrientation = 'PCB_MEDICAL_BIO';
  } else if (phy >= 7 && mat >= 7 && bio >= 7) {
    streamOrientation = 'PCMB_INTERDISCIPLINARY';
  } else if (mat >= 8 && phy >= 7) {
    streamOrientation = 'COMPUTATIONAL_DATA_PHYSICS';
  } else if (bio >= 8 && phy < 6) {
    streamOrientation = 'BIO_AGRITECH_ECOSYSTEM';
  }

  // Mastery tier
  let masteryTier = 'Foundational';
  if (percentage >= 85) masteryTier = 'Master / Elite';
  else if (percentage >= 70) masteryTier = 'Proficient';
  else if (percentage >= 50) masteryTier = 'Developing';

  const completedAt = new Date().toISOString();
  // Weekly cooldown: Next eligible test in 7 days
  const nextEligibleDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Week number of the year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);

  const result = {
    id: `assessment_${Date.now()}`,
    grade,
    completedAt,
    weekNumber,
    year: now.getFullYear(),
    nextEligibleDate,
    timeSpentSec,
    totalQuestions: questions.length,
    totalCorrect,
    percentage,
    masteryTier,
    sectionBreakdown,
    subjectPercentages,
    topSubject,
    secondarySubject,
    lowestSubject,
    streamOrientation,
    detailedAnswers
  };

  return result;
}

/**
 * Saves assessment result locally and attempts background backend sync
 */
export async function saveAssessmentLocally(result) {
  try {
    localStorage.setItem(STORAGE_KEY_LATEST, JSON.stringify(result));
    
    // Append to history
    const historyRaw = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.unshift(result);
    // Keep last 12 tests
    if (history.length > 12) history.length = 12;
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));

    // Also update overall progress badges/XP in user profile if applicable
    updateProfileWithAssessment(result);

    // Sync to backend if accessible
    syncToBackend(result).catch(() => {});
  } catch (err) {
    console.warn('[AssessmentEngine] Storage error:', err);
  }
}

/**
 * Retrieve the latest assessment
 */
export function getLatestAssessment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LATEST);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieve assessment history
 */
export function getAssessmentHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Check weekly assessment status
 */
export function checkWeeklyStatus() {
  const latest = getLatestAssessment();
  if (!latest || !latest.completedAt) {
    return {
      hasTakenThisWeek: false,
      canTakeTest: true,
      lastTakenDate: null,
      daysRemaining: 0,
      latestResult: null
    };
  }

  const completedTime = new Date(latest.completedAt).getTime();
  const now = Date.now();
  const diffDays = (now - completedTime) / (1000 * 60 * 60 * 24);

  // If completed within last 7 days
  const hasTakenThisWeek = diffDays < 7;
  const daysRemaining = Math.max(0, Math.ceil(7 - diffDays));

  return {
    hasTakenThisWeek,
    canTakeTest: !hasTakenThisWeek,
    lastTakenDate: latest.completedAt,
    daysRemaining,
    latestResult: latest
  };
}

/**
 * Awards XP and badges to user progress based on assessment results
 */
function updateProfileWithAssessment(result) {
  try {
    const progRaw = localStorage.getItem('vidyaverse_progress') || localStorage.getItem('stemverse_progress');
    const prog = progRaw ? JSON.parse(progRaw) : { totalXP: 0, streak: 1, badges: [] };

    // Award 200 XP for taking the weekly assessment + bonus XP for score
    const earnedXP = 200 + (result.totalCorrect * 15);
    prog.totalXP = (prog.totalXP || 0) + earnedXP;

    // Badges based on performance
    const badges = prog.badges || [];
    if (!badges.includes('weekly_warrior')) badges.push('weekly_warrior');
    if (result.percentage >= 90 && !badges.includes('perfect_score')) badges.push('perfect_score');
    if (result.sectionBreakdown.Physics.score >= 8 && !badges.includes('physics_hero')) badges.push('physics_hero');
    if (result.sectionBreakdown.Chemistry.score >= 8 && !badges.includes('chemistry_wizard')) badges.push('chemistry_wizard');
    if (result.sectionBreakdown.Mathematics.score >= 8 && !badges.includes('math_genius')) badges.push('math_genius');
    if (result.sectionBreakdown.Biology.score >= 8 && !badges.includes('bio_expert')) badges.push('bio_expert');

    prog.badges = badges;
    localStorage.setItem('vidyaverse_progress', JSON.stringify(prog));
  } catch (e) {
    console.warn('[AssessmentEngine] Progress update error:', e);
  }
}

/**
 * Attempts to sync assessment data to backend
 */
async function syncToBackend(result) {
  const userId = localStorage.getItem('vidyaverse_userId') || localStorage.getItem('stemverse_userId') || 'student_guest';
  try {
    await fetch(`${API_BASE}/user/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assessment: result }),
      signal: AbortSignal.timeout(4000)
    });
  } catch {}
}
