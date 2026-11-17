import express from 'express';
import { broadcastEvent } from '../realtime/broadcast.js';

const router = express.Router();

let schoolRankings = [
  { rank: 1, name: 'Govt High School Doddaballapura (Karnataka)', points: 9420, badges: 48, trend: '+350 pts this week', color: '#ffc531' },
  { rank: 2, name: 'Zilla Parishad High School Warangal (Telangana)', points: 8950, badges: 42, trend: '+280 pts this week', color: '#12b3a4' },
  { rank: 3, name: 'Govt Model Higher Secondary School Salem (Tamil Nadu)', points: 8410, badges: 39, trend: '+410 pts this week', color: '#ff5b57' },
  { rank: 4, name: 'Kasturba Gandhi Balika Vidyalaya Varanasi (UP)', points: 7980, badges: 35, trend: '+220 pts this week', color: '#6b5be6' },
];

let classConceptGaps = [
  { topic: 'Friction & Surface Resistance (Bicycle/Shoes)', masteryPercent: 92, status: 'EXCELLENT', color: '#2bd980' },
  { topic: 'Photosynthesis & Stomatal Respiration', masteryPercent: 78, status: 'GOOD', color: '#ffc531' },
  { topic: 'Gear Torque & Angular Velocity', masteryPercent: 46, status: 'ATTENTION_NEEDED', color: '#ff5b57', suggestedAction: 'Assign Bicycle Gear Ratio Experiment' },
  { topic: 'Acid-Base Neutralization & Chemical Equations', masteryPercent: 68, status: 'MODERATE', color: '#3aa0ff', suggestedAction: 'Run Virtual Kitchen Turmeric Lab' },
];

// 1. GET REAL-TIME SCHOOL LEADERBOARD
router.get('/leaderboard', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: schoolRankings,
  });
});

// 2. GET TEACHER CONCEPT GAP REPORT
router.get('/concept-gaps', (req, res) => {
  res.json({
    status: 'success',
    cohort: 'Class 8-B Rural STEM Pilot',
    totalStudents: 42,
    diagnosticGaps: classConceptGaps,
  });
});

// 3. LOG REAL-TIME STUDENT ATTEMPT (Updates Gaps Dynamically)
router.post('/record-attempt', (req, res) => {
  const { topic, isCorrect, studentId } = req.body;

  const target = classConceptGaps.find((c) => c.topic.toLowerCase().includes(topic.toLowerCase()));
  if (target) {
    target.masteryPercent = isCorrect
      ? Math.min(100, target.masteryPercent + 1)
      : Math.max(10, target.masteryPercent - 2);
  }

  // Broadcast gap update to Teacher Dashboard
  broadcastEvent('TEACHER_GAP_UPDATE', {
    topic,
    updatedMastery: target ? target.masteryPercent : null,
  });

  res.json({
    status: 'success',
    message: 'Student attempt recorded in diagnostic analytics engine',
  });
});

export default router;
