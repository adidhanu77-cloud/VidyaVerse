import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { broadcastEvent } from '../realtime/broadcast.js';
import 'dotenv/config';

const router = express.Router();

// ── Gemini AI Setup ─────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ── Path & Level Configuration ───────────────────────────────────────
export const PATHS = {
  physics: {
    name: 'Physics', icon: '⚡', color: '#ff5b57',
    levels: [
      { level: 1, title: "Newton's Village",        topic: "Newton's Laws of Motion",                   difficulty: 'easy',   xp: 100 },
      { level: 2, title: 'Friction Fighters',         topic: 'Friction and Surface Forces',               difficulty: 'easy',   xp: 120 },
      { level: 3, title: 'Pressure Cooker Secrets',   topic: 'Pressure and Boiling Point',                difficulty: 'medium', xp: 150 },
      { level: 4, title: 'Electric Village',          topic: "Ohm's Law and Circuits",                    difficulty: 'medium', xp: 180 },
      { level: 5, title: 'Pendulum Quest',            topic: 'Simple Harmonic Motion',                    difficulty: 'medium', xp: 200 },
      { level: 6, title: 'Light & Lenses',            topic: 'Reflection and Refraction',                 difficulty: 'hard',   xp: 250 },
      { level: 7, title: 'Magnetic Mysteries',        topic: 'Magnetism and Electromagnetic Induction',   difficulty: 'hard',   xp: 280 },
      { level: 8, title: 'Energy Master',             topic: 'Conservation of Energy and Power',          difficulty: 'expert', xp: 350 },
    ],
  },
  chemistry: {
    name: 'Chemistry', icon: '🧪', color: '#12b3a4',
    levels: [
      { level: 1, title: 'Atom Builders',          topic: 'Atomic Structure and Periodic Table',              difficulty: 'easy',   xp: 100 },
      { level: 2, title: 'pH Farmers',              topic: 'Acids, Bases and pH Scale',                        difficulty: 'easy',   xp: 120 },
      { level: 3, title: 'Metal Detectives',        topic: 'Metals, Non-metals and Reactivity Series',         difficulty: 'medium', xp: 150 },
      { level: 4, title: 'Gas Lab',                 topic: 'States of Matter and Gas Laws',                    difficulty: 'medium', xp: 180 },
      { level: 5, title: 'Carbon Quest',            topic: 'Carbon Compounds and Organic Chemistry Basics',    difficulty: 'medium', xp: 200 },
      { level: 6, title: 'Reaction Racers',         topic: 'Types of Chemical Reactions and Equations',        difficulty: 'hard',   xp: 250 },
      { level: 7, title: 'Electrochemistry',        topic: 'Electrolysis and Electrochemical Cells',           difficulty: 'hard',   xp: 280 },
      { level: 8, title: 'Chemistry Grand Prix',    topic: 'Equilibrium, Rate of Reaction and Catalysts',      difficulty: 'expert', xp: 350 },
    ],
  },
  biology: {
    name: 'Biology', icon: '🧬', color: '#6b5be6',
    levels: [
      { level: 1, title: 'Cell Safari',          topic: 'Cell Structure: Plant vs Animal Cells',   difficulty: 'easy',   xp: 100 },
      { level: 2, title: 'Photosynthesis Farm',   topic: 'Photosynthesis and Respiration',          difficulty: 'easy',   xp: 120 },
      { level: 3, title: 'Body Systems',          topic: 'Human Digestive System',                  difficulty: 'medium', xp: 150 },
      { level: 4, title: 'Blood Detectives',      topic: 'Circulatory System and Blood',            difficulty: 'medium', xp: 180 },
      { level: 5, title: 'DNA Explorers',         topic: 'DNA, Genes and Heredity',                 difficulty: 'medium', xp: 200 },
      { level: 6, title: 'Evolution Trail',       topic: 'Natural Selection and Adaptation',        difficulty: 'hard',   xp: 250 },
      { level: 7, title: 'Ecosystem Quest',       topic: 'Food Chains, Webs and Ecosystems',        difficulty: 'hard',   xp: 280 },
      { level: 8, title: 'Bio Grand Master',      topic: 'Immune System and Disease',               difficulty: 'expert', xp: 350 },
    ],
  },
  mathematics: {
    name: 'Mathematics', icon: '📐', color: '#ffc531',
    levels: [
      { level: 1, title: 'Number Ninja',       topic: 'Fractions, Decimals and Percentages',          difficulty: 'easy',   xp: 100 },
      { level: 2, title: 'Geometry Garden',    topic: 'Area, Perimeter and Shapes',                   difficulty: 'easy',   xp: 120 },
      { level: 3, title: 'Algebra Village',    topic: 'Linear Equations and Expressions',              difficulty: 'medium', xp: 150 },
      { level: 4, title: 'Triangle Trek',      topic: 'Pythagoras Theorem and Trigonometry Basics',    difficulty: 'medium', xp: 180 },
      { level: 5, title: 'Statistics Fields',  topic: 'Mean, Median, Mode and Data Analysis',          difficulty: 'medium', xp: 200 },
      { level: 6, title: 'Coordinate Quest',   topic: 'Coordinate Geometry and Graphs',                difficulty: 'hard',   xp: 250 },
      { level: 7, title: 'Probability Path',   topic: 'Probability and Combinatorics',                 difficulty: 'hard',   xp: 280 },
      { level: 8, title: 'Math Grand Master',  topic: 'Quadratic Equations and Polynomials',           difficulty: 'expert', xp: 350 },
    ],
  },
};

// ── Badge Definitions ────────────────────────────────────────────────
export const BADGE_DEFS = [
  { id: 'first_quest',      name: 'First Quest',       emoji: '🎯', desc: 'Completed your first level' },
  { id: 'streak_3',         name: 'Hot Streak',         emoji: '🌶️', desc: '3-day learning streak' },
  { id: 'week_warrior',     name: 'Week Warrior',       emoji: '🔥', desc: '7-day learning streak' },
  { id: 'streak_30',        name: 'Month Master',       emoji: '🏅', desc: '30-day learning streak' },
  { id: 'speed_demon',      name: 'Speed Demon',        emoji: '⚡', desc: 'Completed a level in under 90 seconds' },
  { id: 'perfect_score',    name: 'Perfect Score',      emoji: '💯', desc: 'Got 100% on a level' },
  { id: 'physics_hero',     name: 'Physics Hero',       emoji: '⚛️', desc: 'Completed all Physics levels' },
  { id: 'chemistry_wizard', name: 'Chemistry Wizard',   emoji: '🧪', desc: 'Completed all Chemistry levels' },
  { id: 'bio_expert',       name: 'Biology Expert',     emoji: '🧬', desc: 'Completed all Biology levels' },
  { id: 'math_genius',      name: 'Math Genius',        emoji: '📐', desc: 'Completed all Mathematics levels' },
  { id: 'xp_500',           name: 'XP Explorer',        emoji: '🌟', desc: 'Earned 500 XP' },
  { id: 'xp_2000',          name: 'XP Legend',          emoji: '🏆', desc: 'Earned 2000 XP' },
];

// ── In-Memory User Progress Store ───────────────────────────────────
const userProgress = {};

function initUser(userId) {
  if (!userProgress[userId]) {
    const store = { userId, completedLevels: {}, levelStars: {}, levelTimes: {}, totalXP: 0, streak: 0, longestStreak: 0, lastActivityDate: null, badges: [], activityLog: [] };
    for (const path of Object.keys(PATHS)) store.completedLevels[path] = [];
    userProgress[userId] = store;
  }
  return userProgress[userId];
}

function updateStreak(progress) {
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActivityDate === today) return;
  if (!progress.lastActivityDate) {
    progress.streak = 1;
  } else {
    const diff = (new Date(today) - new Date(progress.lastActivityDate)) / 86400000;
    progress.streak = diff === 1 ? progress.streak + 1 : 1;
  }
  if (progress.streak > progress.longestStreak) progress.longestStreak = progress.streak;
  progress.lastActivityDate = today;
  if (!progress.activityLog.includes(today)) progress.activityLog.push(today);
}

function checkBadges(progress, timeTaken, subject, score, total) {
  const newBadges = [];
  const addBadge = (id) => { if (!progress.badges.includes(id)) { progress.badges.push(id); newBadges.push(id); } };
  const totalDone = Object.values(progress.completedLevels).flat().length;
  if (totalDone >= 1) addBadge('first_quest');
  if (progress.streak >= 3) addBadge('streak_3');
  if (progress.streak >= 7) addBadge('week_warrior');
  if (progress.streak >= 30) addBadge('streak_30');
  if (timeTaken <= 90) addBadge('speed_demon');
  if (score === total) addBadge('perfect_score');
  if (progress.totalXP >= 500) addBadge('xp_500');
  if (progress.totalXP >= 2000) addBadge('xp_2000');
  const pathMap = { physics: 'physics_hero', chemistry: 'chemistry_wizard', biology: 'bio_expert', mathematics: 'math_genius' };
  for (const [path, badgeId] of Object.entries(pathMap)) {
    if (progress.completedLevels[path]?.length >= PATHS[path].levels.length) addBadge(badgeId);
  }
  return newBadges;
}

// ── Fallback Questions (when Gemini unavailable) ─────────────────────
function getFallbackQuestions(topic, subject) {
  return [
    { id: 1, question: `Which of the following best describes ${topic}?`, options: ['A) It involves energy transformation', 'B) It only occurs in labs', 'C) It has no real-world applications', 'D) It is unrelated to daily life'], correctAnswer: 0, explanation: `${topic} involves energy transformation and is closely related to everyday phenomena.`, concept: 'Basic Concept' },
    { id: 2, question: `A student observes a ${subject} phenomenon at home. What is the best way to understand it?`, options: ['A) Ignore it', 'B) Apply scientific principles from class', 'C) Only read about it in textbooks', 'D) Ask someone else to explain it without trying'], correctAnswer: 1, explanation: 'Applying scientific principles helps understand real-world phenomena.', concept: 'Scientific Method' },
    { id: 3, question: `Which unit is most commonly used in ${topic}?`, options: ['A) Meters', 'B) Kilograms', 'C) Seconds', 'D) Depends on the specific quantity'], correctAnswer: 3, explanation: 'Different physical quantities have their own appropriate units.', concept: 'Units of Measurement' },
    { id: 4, question: `In a typical experiment related to ${topic}, which variable is kept constant?`, options: ['A) Independent variable', 'B) Dependent variable', 'C) Control variable', 'D) Random variable'], correctAnswer: 2, explanation: 'Control variables are kept constant to ensure fair testing.', concept: 'Experimental Design' },
    { id: 5, question: `Which scientist is most associated with foundational work in ${subject}?`, options: ['A) Isaac Newton', 'B) Albert Einstein', 'C) Marie Curie', 'D) Multiple scientists contributed'], correctAnswer: 3, explanation: 'Most fields of science have been advanced by many scientists working over centuries.', concept: 'History of Science' },
    { id: 6, question: `What is an everyday example of ${topic} that you might find in a village?`, options: ['A) A well pump uses mechanical principles', 'B) A pressure cooker uses thermodynamics', 'C) A bicycle uses mechanics and friction', 'D) All of the above'], correctAnswer: 3, explanation: 'Village objects like well pumps, pressure cookers, and bicycles all demonstrate scientific principles.', concept: 'Real-World Application' },
    { id: 7, question: `If you double the input in a ${subject} system, what generally happens to the output?`, options: ['A) It stays the same', 'B) It doubles', 'C) It depends on the system', 'D) It always quadruples'], correctAnswer: 2, explanation: 'The relationship between input and output depends on whether the system is linear or not.', concept: 'Proportionality' },
    { id: 8, question: `Which of these is a tool used to measure quantities related to ${topic}?`, options: ['A) Measuring tape', 'B) Thermometer', 'C) Stopwatch', 'D) Various instruments depending on the quantity'], correctAnswer: 3, explanation: 'Different instruments are used to measure different physical quantities.', concept: 'Measurement Instruments' },
    { id: 9, question: `Conservation laws in ${subject} state that:`, options: ['A) Energy is always lost', 'B) Matter can be created from nothing', 'C) Total quantities in a closed system remain constant', 'D) Laws only apply in laboratories'], correctAnswer: 2, explanation: 'Conservation laws state that certain quantities remain constant in a closed system.', concept: 'Conservation Laws' },
    { id: 10, question: `A student from Class 8 is studying ${topic}. What is the best study approach?`, options: ['A) Only memorize formulas', 'B) Connect concepts to everyday objects and experiments', 'C) Skip examples and go straight to problems', 'D) Study only the night before the exam'], correctAnswer: 1, explanation: 'Connecting concepts to everyday life and experiments builds deeper understanding.', concept: 'Study Strategy' },
  ];
}

// ── Gemini Question Generator ────────────────────────────────────────
async function generateQuestionsWithGemini(subject, level, topic, difficulty) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return getFallbackQuestions(topic, subject);
  }

  const prompt = `Generate exactly 10 multiple-choice questions for Indian school students (Class 6-12) about "${topic}" in the subject "${subject}" at Level ${level}.
Difficulty level: ${difficulty}.
Each question must relate to village or rural India context where possible (bicycles, pressure cookers, wells, farms, tractors, hand pumps, etc.).
Return ONLY a valid JSON array with this EXACT structure (no markdown, no code blocks, just raw JSON):
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": 0,
    "explanation": "One clear sentence explanation of why this is correct.",
    "concept": "Key formula or concept (e.g. F = ma)"
  }
]
Make questions progressively harder within the 10. Use simple language. correctAnswer is the 0-based index (0=A, 1=B, 2=C, 3=D).`;

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return parsed;
      }
    } catch (err) {
      console.warn(`[Treasure Hunt] Model ${modelName} attempt:`, err.message);
    }
  }

  console.warn('[Treasure Hunt] All Gemini models attempted, using verified fallback questions.');
  return getFallbackQuestions(topic, subject);
}

// ════════════════════════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════════════════════════

// 1. GET ALL PATHS CONFIG
router.get('/paths', (req, res) => {
  res.json({ status: 'success', paths: PATHS });
});

// 2. GET USER PROGRESS
router.get('/progress/:userId', (req, res) => {
  const progress = initUser(req.params.userId);
  res.json({ status: 'success', progress });
});

// 3. GENERATE QUIZ QUESTIONS (Gemini AI)
router.post('/questions', async (req, res) => {
  const { userId = 'guest', subject = 'physics', level = 1, difficulty = 'easy', topic = '' } = req.body;
  const pathConfig = PATHS[subject];
  if (!pathConfig) return res.status(400).json({ status: 'error', message: 'Invalid subject' });

  const levelConfig = pathConfig.levels.find(l => l.level === Number(level));
  const finalTopic = topic || levelConfig?.topic || 'General Science';
  const finalDifficulty = difficulty || levelConfig?.difficulty || 'medium';

  const questions = await generateQuestionsWithGemini(subject, level, finalTopic, finalDifficulty);
  res.json({ status: 'success', subject, level, topic: finalTopic, difficulty: finalDifficulty, questions });
});

// 4. COMPLETE LEVEL & AWARD XP + BADGES
router.post('/complete-level', (req, res) => {
  const { userId = 'guest', subject = 'physics', level = 1, score = 0, totalQuestions = 10, timeTaken = 120 } = req.body;
  const progress = initUser(userId);
  const pathConfig = PATHS[subject];
  const levelConfig = pathConfig?.levels.find(l => l.level === Number(level));
  if (!levelConfig) return res.status(400).json({ status: 'error', message: 'Invalid level' });

  const pct = score / totalQuestions;
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
  const starMultiplier = stars === 3 ? 1.5 : stars === 2 ? 1.0 : 0.6;
  const xpEarned = stars > 0 ? Math.round(levelConfig.xp * starMultiplier) : 0;

  // Update progress
  if (!progress.completedLevels[subject].includes(Number(level))) {
    progress.completedLevels[subject].push(Number(level));
  }
  const key = `${subject}_${level}`;
  if (!progress.levelStars[key] || stars > progress.levelStars[key]) progress.levelStars[key] = stars;
  progress.levelTimes[key] = timeTaken;
  progress.totalXP += xpEarned;

  updateStreak(progress);
  const newBadges = checkBadges(progress, timeTaken, subject, score, totalQuestions);
  const newBadgeDefs = BADGE_DEFS.filter(b => newBadges.includes(b.id));

  broadcastEvent('LEVEL_COMPLETE', { userId, subject, level, stars, xpEarned, newBadges, streak: progress.streak });

  res.json({
    status: 'success',
    stars, xpEarned, totalXP: progress.totalXP,
    newBadges, newBadgeDefs,
    streak: progress.streak, longestStreak: progress.longestStreak,
    score, totalQuestions, timeTaken,
    levelPassed: stars > 0,
  });
});

// 5. GET BADGE DEFINITIONS
router.get('/badges', (req, res) => {
  res.json({ status: 'success', badges: BADGE_DEFS });
});

// 6. LEADERBOARD
router.get('/leaderboard', (req, res) => {
  const board = Object.values(userProgress)
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, 10)
    .map((p, i) => ({ rank: i + 1, userId: p.userId, totalXP: p.totalXP, streak: p.streak, badges: p.badges.length, levelsCompleted: Object.values(p.completedLevels).flat().length }));
  res.json({ status: 'success', leaderboard: board });
});

export default router;
