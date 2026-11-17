import express from 'express';
const router = express.Router();

// ── In-memory profile store ──────────────────────────────────────────
const profiles = {};

function getOrCreateProfile(userId) {
  if (!profiles[userId]) {
    profiles[userId] = {
      userId,
      name: '',
      username: '',
      avatar: null,
      bio: '',
      school: '',
      grade: '',
      language: 'en',
      joinedAt: new Date().toISOString(),
      isProfileComplete: false,
    };
  }
  return profiles[userId];
}

// ── PROFILE ROUTES ───────────────────────────────────────────────────

// GET profile
router.get('/profile/:userId', (req, res) => {
  const profile = getOrCreateProfile(req.params.userId);
  res.json({ status: 'success', profile });
});

// CREATE / UPDATE full profile
router.post('/profile', (req, res) => {
  const { userId, name, username, avatar, bio, school, grade, language } = req.body;
  if (!userId) return res.status(400).json({ status: 'error', message: 'userId required' });
  const profile = getOrCreateProfile(userId);
  if (name !== undefined) profile.name = name;
  if (username !== undefined) profile.username = username;
  if (avatar !== undefined) profile.avatar = avatar;
  if (bio !== undefined) profile.bio = bio;
  if (school !== undefined) profile.school = school;
  if (grade !== undefined) profile.grade = grade;
  if (language !== undefined) profile.language = language;
  profile.isProfileComplete = !!(profile.name && profile.username);
  res.json({ status: 'success', profile });
});

// PATCH avatar only
router.patch('/profile/:userId/avatar', (req, res) => {
  const { avatar } = req.body;
  const profile = getOrCreateProfile(req.params.userId);
  profile.avatar = avatar;
  res.json({ status: 'success', avatar });
});

// GET full combined profile + progress
router.get('/profile/:userId/full', async (req, res) => {
  const profile = getOrCreateProfile(req.params.userId);
  res.json({ status: 'success', profile });
});

// ── LEGACY DASHBOARD ROUTES (preserved) ──────────────────────────────
const legacyProfiles = {
  student_01: {
    id: 'student_01', role: 'STUDENT', name: 'Raju Kumar',
    school: 'Govt High School Doddaballapura', grade: 'Class 8-A',
    learningHours: 14.5, points: 450,
    badges: ['Friction Detective', 'Circuit Builder', 'Neem Botanist'],
    completedLabs: ['Electric Circuit', 'Turmeric pH Test'],
    scannedObjectsCount: 12,
    weakTopics: ['Gear Torque Multiplication', 'Angular Velocity'],
    strongTopics: ['Friction', 'Photosynthesis', "Ohm's Law"],
  },
  teacher_01: {
    id: 'teacher_01', role: 'TEACHER', name: 'Mrs. Shailaja Rao',
    school: 'Govt High School Doddaballapura',
    assignedClasses: ['Class 8-A', 'Class 8-B', 'Class 9'],
    activeStudents: 84, classAveragePoints: 620,
    criticalAttentionAlerts: [{ topic: 'Gear Torque Multiplication', studentCountStruggling: 18 }],
  },
  parent_01: {
    id: 'parent_01', role: 'PARENT', parentName: 'Ramesh Kumar (Farmer)',
    studentName: 'Raju Kumar', weeklyLearningMinutes: 280,
    favoriteSubject: 'Physics Mechanics (Bicycles & Motors)',
    recommendedActivity: 'Try measuring water depth and pressure with a marked stick!',
  },
};

router.get('/student/:id', (req, res) => {
  const p = legacyProfiles[req.params.id] || legacyProfiles['student_01'];
  res.json({ status: 'success', userRole: 'STUDENT', dashboardData: p });
});

router.get('/teacher/:id', (req, res) => {
  const p = legacyProfiles[req.params.id] || legacyProfiles['teacher_01'];
  res.json({ status: 'success', userRole: 'TEACHER', dashboardData: p });
});

router.get('/parent/:id', (req, res) => {
  const p = legacyProfiles[req.params.id] || legacyProfiles['parent_01'];
  res.json({ status: 'success', userRole: 'PARENT', dashboardData: p });
});

router.post('/student/:id/progress', (req, res) => {
  const { newBadge, completedLab, addPoints = 0 } = req.body;
  const p = legacyProfiles[req.params.id] || legacyProfiles['student_01'];
  if (newBadge && !p.badges.includes(newBadge)) p.badges.push(newBadge);
  if (completedLab && !p.completedLabs.includes(completedLab)) p.completedLabs.push(completedLab);
  p.points += Number(addPoints);
  res.json({ status: 'success', message: 'Progress updated', updatedProfile: p });
});

// ── WEEKLY SKILL ASSESSMENT ROUTES ───────────────────────────────────
// In-memory store for assessment records (per user)
const assessmentRecords = {};

// POST - save a completed assessment result
router.post('/assessment', (req, res) => {
  const { userId, assessment } = req.body;
  if (!userId || !assessment) {
    return res.status(400).json({ status: 'error', message: 'userId and assessment required' });
  }
  if (!assessmentRecords[userId]) assessmentRecords[userId] = [];
  // Prepend latest, keep last 12
  assessmentRecords[userId].unshift(assessment);
  if (assessmentRecords[userId].length > 12) assessmentRecords[userId].length = 12;

  res.json({
    status: 'success',
    message: 'Assessment saved successfully',
    assessmentId: assessment.id,
    grade: assessment.grade,
    score: `${assessment.totalCorrect}/40`,
    percentage: assessment.percentage,
    nextEligibleDate: assessment.nextEligibleDate,
    streamOrientation: assessment.streamOrientation
  });
});

// GET - retrieve latest assessment for a user
router.get('/assessment/:userId/latest', (req, res) => {
  const records = assessmentRecords[req.params.userId] || [];
  if (records.length === 0) {
    return res.json({ status: 'not_found', message: 'No assessments found', data: null });
  }
  res.json({ status: 'success', data: records[0] });
});

// GET - retrieve full assessment history for a user
router.get('/assessment/:userId/history', (req, res) => {
  const records = assessmentRecords[req.params.userId] || [];
  res.json({
    status: 'success',
    count: records.length,
    history: records.map(r => ({
      id: r.id,
      grade: r.grade,
      completedAt: r.completedAt,
      weekNumber: r.weekNumber,
      year: r.year,
      totalCorrect: r.totalCorrect,
      percentage: r.percentage,
      masteryTier: r.masteryTier,
      streamOrientation: r.streamOrientation,
      subjectPercentages: r.subjectPercentages
    }))
  });
});

export default router;
