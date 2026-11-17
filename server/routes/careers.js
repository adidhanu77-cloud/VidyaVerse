import express from 'express';

const router = express.Router();

const careerDirectory = [
  {
    id: 'ev_robotics',
    passionKeyword: 'bicycles, machines, gears, motors',
    title: 'Robotics & Electric Vehicle Engineer',
    targetIndustries: ['EV Manufacturing', 'Agricultural Automation', 'Mechatronics'],
    schoolSubjects: ['Class 8-10 Kinematics', 'Torque & Gear Ratios', 'Ohm’s Law & Motor Controllers'],
    educationalRoadmap: 'Class 8-10 Physics & Math → Polytechnic Diploma / ITI / JEE → B.Tech Mechatronics',
    villageImpact: 'Design solar tractors, low-cost EV rickshaws & automated village crop harvesters.',
    topInstitutes: ['IIT Madras (EV Centre)', 'NIT Surathkal', 'Govt Polytechnic Colleges'],
    color: '#ff5b57',
  },
  {
    id: 'agritech_genetics',
    passionKeyword: 'plants, farming, soil, insects, crops',
    title: 'Agritech & Genetic Bio-Engineer',
    targetIndustries: ['Seed Technology', 'Soil Microbiome', 'Bio-fertilizers'],
    schoolSubjects: ['Plant Physiology', 'Cellular Chloroplast Genetics', 'Soil Chemistry & pH'],
    educationalRoadmap: 'Class 9-12 Biology & Chemistry → ICAR Entrance Exam → BSc Agriculture / Biotech',
    villageImpact: 'Develop drought-resilient seeds, bio-pesticides & high-yield millet varieties.',
    topInstitutes: ['UAS Bangalore', 'IARI New Delhi', 'TNAU Coimbatore'],
    color: '#2bd980',
  },
  {
    id: 'solar_energy',
    passionKeyword: 'wires, bulbs, batteries, sunlight',
    title: 'Renewable Smart-Grid Engineer',
    targetIndustries: ['Decentralized Solar', 'Battery Storage Systems', 'Microgrids'],
    schoolSubjects: ['Circuit Dynamics', 'Solar Photovoltaic Inverters', 'Battery Chemical Storage'],
    educationalRoadmap: 'Class 8-12 Physics & Math → Diploma / Engineering → Solar Microgrid Specialist',
    villageImpact: 'Build 24/7 solar microgrids and decentralized cold-storage for farmer produce.',
    topInstitutes: ['IIT Roorkee (Hydro/Renewables)', 'MNRE Institutes'],
    color: '#ffc531',
  },
];

// 1. GET ALL CAREERS
router.get('/list', (req, res) => {
  res.json({
    status: 'success',
    count: careerDirectory.length,
    data: careerDirectory,
  });
});

// 2. COMPUTE PERSONALIZED CAREER ROADMAP
router.post('/roadmap', (req, res) => {
  const { studentInterests = [], favoriteSubject = 'Physics' } = req.body;

  let selected = careerDirectory[0];
  const interestStr = studentInterests.join(' ').toLowerCase();

  if (interestStr.includes('plant') || interestStr.includes('farm') || interestStr.includes('soil')) {
    selected = careerDirectory[1];
  } else if (interestStr.includes('solar') || interestStr.includes('wire') || interestStr.includes('bulb')) {
    selected = careerDirectory[2];
  }

  res.json({
    status: 'success',
    studentProfile: {
      interests: studentInterests,
      favoriteSubject,
    },
    recommendedCareer: selected,
  });
});

export default router;
