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

export default router;
