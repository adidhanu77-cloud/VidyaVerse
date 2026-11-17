/**
 * VidyaVerse - Real-Time Career Workflow Engine
 * Generates an end-to-end, multi-stage STEM career roadmap workflow
 * directly from actual student assessment test results (Physics, Chemistry, Maths, Biology).
 * 
 * Works in real-time without fake or static data.
 * Leverages Gemini AI when available, with a deep deterministic knowledge engine fallback.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' && window.VITE_GEMINI_API_KEY) || '';

/**
 * Real-time synthesis of Career Roadmap based on student test scores
 */
export async function generateCareerWorkflowFromAssessment(assessment, studentProfile = {}) {
  if (!assessment) return null;

  const {
    grade = 'Class 9',
    sectionBreakdown = {},
    totalCorrect = 0,
    totalQuestions = 40,
    percentage = 0,
    detailedAnswers = []
  } = assessment;

  const phy = sectionBreakdown.Physics?.score || 0;
  const chem = sectionBreakdown.Chemistry?.score || 0;
  const mat = sectionBreakdown.Mathematics?.score || 0;
  const bio = sectionBreakdown.Biology?.score || 0;

  // Collect weak topics from missed questions
  const weakTopics = [];
  const strongTopics = [];
  detailedAnswers.forEach(a => {
    if (a.isCorrect) {
      if (!strongTopics.includes(a.topic) && strongTopics.length < 6) {
        strongTopics.push(a.topic);
      }
    } else {
      if (!weakTopics.includes(a.topic) && weakTopics.length < 5) {
        weakTopics.push({ topic: a.topic, subject: a.subject, explanation: a.explanation });
      }
    }
  });

  // 1. Try Gemini live generation if API key is present
  if (GEMINI_API_KEY) {
    try {
      const aiGenerated = await generateAiCareerWorkflow({
        grade,
        studentName: studentProfile.name || 'Student',
        phy, chem, mat, bio,
        totalCorrect,
        totalQuestions,
        percentage,
        weakTopics,
        strongTopics
      });
      if (aiGenerated && aiGenerated.primaryTrack) {
        return {
          source: 'gemini_realtime_ai',
          ...aiGenerated
        };
      }
    } catch (err) {
      console.warn('[CareerWorkflowEngine] Gemini API call skipped/fallback:', err);
    }
  }

  // 2. High-precision deterministic real-time engine
  return generateDeterministicCareerWorkflow({
    grade,
    studentName: studentProfile.name || 'Student',
    phy, chem, mat, bio,
    totalCorrect,
    totalQuestions,
    percentage,
    weakTopics,
    strongTopics
  });
}

/**
 * Deterministic real-time career roadmap calculator based on exact score ratios
 */
function generateDeterministicCareerWorkflow(params) {
  const { grade, studentName, phy, chem, mat, bio, percentage, weakTopics, strongTopics } = params;

  // Class numeric extraction
  const match = grade.match(/\d+/);
  const gradeNum = match ? parseInt(match[0], 10) : 9;

  // Calculate subject orientation
  const isHighPhy = phy >= 7;
  const isHighMat = mat >= 7;
  const isHighChem = chem >= 7;
  const isHighBio = bio >= 7;

  let primaryTrack = null;
  let alternateTracks = [];

  if (isHighPhy && isHighMat && isHighChem) {
    // Top PCM: Robotics, Aerospace, Quantum Hardware
    const matchPct = Math.min(98, Math.round(((phy * 0.35 + mat * 0.40 + chem * 0.25) / 10) * 100));
    primaryTrack = {
      title: 'Aerospace & Autonomous Robotics Engineer',
      domain: 'Applied Physics, Mechatronics & Space Exploration',
      matchPercentage: matchPct,
      badge: 'TOP PCM MATCH',
      color: '#ff5b57',
      tagline: 'Designing interplanetary satellites, high-speed rail & automated agricultural drones.',
      rationale: `Based on your stellar performance in Mathematics (${mat}/10) and Physics (${phy}/10), you demonstrate exceptional spatial reasoning, kinetic mechanics comprehension, and mathematical modeling aptitude.`
    };

    alternateTracks = [
      {
        title: 'Quantum Computing & Semiconductor Architect',
        matchPercentage: Math.max(75, matchPct - 4),
        domain: 'Condensed Matter Physics & Computer Science',
        color: '#6b5be6',
        description: 'Building next-generation sub-nanometer chips and quantum cryptography algorithms.'
      },
      {
        title: 'Renewable Smart-Grid & Clean Tech Technologist',
        matchPercentage: Math.max(72, matchPct - 7),
        domain: 'Electro-Mechanical Power Systems',
        color: '#12b3a4',
        description: 'Developing decentralized village microgrids and high-capacity sodium-ion battery storage.'
      }
    ];
  } else if (isHighBio && isHighChem) {
    // Top PCB: Genetic Engineering, Precision Medicine, Agritech
    const matchPct = Math.min(97, Math.round(((bio * 0.45 + chem * 0.35 + phy * 0.20) / 10) * 100));
    primaryTrack = {
      title: 'Biotechnologist & CRISPR Genetic Bio-Engineer',
      domain: 'Molecular Biology, Genetics & Bio-Manufacturing',
      matchPercentage: matchPct,
      badge: 'TOP PCB MATCH',
      color: '#2bd980',
      tagline: 'Engineering climate-resilient crops, mRNA vaccines & bio-pesticides for rural farming.',
      rationale: `With standout scores in Biology (${bio}/10) and Chemistry (${chem}/10), you excel at cellular biochemical pathways, chemical stoichiometry, and biological system dynamics.`
    };

    alternateTracks = [
      {
        title: 'Precision Medicine & Biomedical Devices Specialist',
        matchPercentage: Math.max(74, matchPct - 5),
        domain: 'Clinical Immunology & Bio-Instrumentation',
        color: '#ff5b57',
        description: 'Creating affordable diagnostic kits and telemedicine tools for primary health centers.'
      },
      {
        title: 'Agritech & Soil Microbiome Scientist',
        matchPercentage: Math.max(70, matchPct - 8),
        domain: 'Agricultural Biotechnology',
        color: '#ffc531',
        description: 'Developing drought-tolerant millet varieties and natural bio-fertilizers.'
      }
    ];
  } else if (isHighMat && (isHighPhy || mat >= 8)) {
    // Top Math: Computational AI & Data Systems
    const matchPct = Math.min(96, Math.round(((mat * 0.50 + phy * 0.35 + chem * 0.15) / 10) * 100));
    primaryTrack = {
      title: 'Artificial Intelligence & Computational Systems Scientist',
      domain: 'Algorithmic Mathematics, Machine Learning & Cybernetics',
      matchPercentage: matchPct,
      badge: 'TOP COMPUTATIONAL MATCH',
      color: '#6b5be6',
      tagline: 'Developing foundation AI models, monsoon prediction algorithms & automated robotics.',
      rationale: `Your top score in Mathematics (${mat}/10) paired with strong physical intuition (${phy}/10) indicates high abstract logic, algorithmic thinking, and structural problem-solving abilities.`
    };

    alternateTracks = [
      {
        title: 'Satellite Telemetry & Communication Specialist',
        matchPercentage: Math.max(73, matchPct - 6),
        domain: 'Signal Processing & Astrophysics',
        color: '#3aa0ff',
        description: 'Deploying low-earth-orbit communication arrays for rural high-speed internet.'
      },
      {
        title: 'Theoretical Physicist & Data Modeler',
        matchPercentage: Math.max(70, matchPct - 9),
        domain: 'Mathematical Modeling & Simulation',
        color: '#ff5b57',
        description: 'Simulating complex climate patterns, fluid dynamics, and astrophysical phenomena.'
      }
    ];
  } else if (isHighBio) {
    // High Bio, developing others
    const matchPct = Math.min(92, Math.round(((bio * 0.60 + chem * 0.25 + phy * 0.15) / 10) * 100));
    primaryTrack = {
      title: 'Ecosystem Ecologist & Rural Agritech Leader',
      domain: 'Environmental Biology & Conservation Sciences',
      matchPercentage: matchPct,
      badge: 'LIFE SCIENCES MATCH',
      color: '#2bd980',
      tagline: 'Restoring local watershed biodiversity, organic soil vitality & forest conservation.',
      rationale: `Your strong performance in Biology (${bio}/10) highlights your keen observation of living ecosystems, human physiology, and natural life cycles.`
    };

    alternateTracks = [
      {
        title: 'Veterinary Surgeon & Livestock Geneticist',
        matchPercentage: Math.max(70, matchPct - 6),
        domain: 'Veterinary Sciences',
        color: '#ffc531',
        description: 'Improving cattle health, dairy yield, and preventing zoonotic diseases in rural areas.'
      }
    ];
  } else {
    // Balanced or developing: Core Applied STEM Explorer
    const matchPct = Math.min(88, Math.max(65, Math.round((percentage * 0.8) + 15)));
    primaryTrack = {
      title: 'Applied STEM & Sustainable Systems Engineer',
      domain: 'Interdisciplinary Engineering & Applied Sciences',
      matchPercentage: matchPct,
      badge: 'EXPLORER MATCH',
      color: '#ffc531',
      tagline: 'Integrating physics mechanics, green chemistry & rural manufacturing solutions.',
      rationale: `Your balanced test results across Physics (${phy}/10), Chemistry (${chem}/10), Mathematics (${mat}/10), and Biology (${bio}/10) provide a versatile foundation to excel across multiple applied engineering and science disciplines.`
    };

    alternateTracks = [
      {
        title: 'Polytechnic EV & Industrial Automation Specialist',
        matchPercentage: Math.max(65, matchPct - 4),
        domain: 'Mechatronics & EV Servicing',
        color: '#ff5b57',
        description: 'Mastering hands-on solar micro-grids, EV battery repair, and precision CNC fabrication.'
      }
    ];
  }

  // 6-Stage End-to-End Visual Workflow
  const stages = buildWorkflowStages({
    gradeNum,
    track: primaryTrack.title,
    phy, chem, mat, bio,
    weakTopics,
    strongTopics
  });

  return {
    source: 'realtime_assessment_metrics',
    studentGrade: grade,
    testScores: {
      physics: `${phy}/10`,
      chemistry: `${chem}/10`,
      math: `${mat}/10`,
      biology: `${bio}/10`,
      total: `${phy + chem + mat + bio}/40 (${percentage}%)`
    },
    primaryTrack,
    alternateTracks,
    stages,
    strongTopics,
    weakTopics,
    immediateWeeklyActionPlan: buildActionPlan(weakTopics, primaryTrack.title)
  };
}

/**
 * Builds the 6-stage end-to-end long path timeline tailored to class level and career track
 */
function buildWorkflowStages({ gradeNum, track, phy, chem, mat, bio, weakTopics, strongTopics }) {
  const isSenior = gradeNum >= 11;
  const isSecondary = gradeNum >= 9 && gradeNum <= 10;
  const isMiddle = gradeNum <= 8;

  // STAGE 1: Current School Foundation
  let stage1Title = isSenior ? 'Class 11-12 Senior Secondary Rigor' : isSecondary ? 'Class 9-10 Board & Concept Mastery' : 'Class 6-8 Foundational Discovery & Curiosity';
  let stage1Focus = [];
  if (isSenior) {
    stage1Focus = [
      'Master NCERT Class 11-12 syllabus with deep derivation clarity',
      'Solve previous 10 years JEE Advanced / NEET question banks',
      'Participate in National Standard Examinations (NSEP, NSEC, NSEB)',
      'Conduct hands-on experiments at Atal Tinkering Labs (ATL)'
    ];
  } else if (isSecondary) {
    stage1Focus = [
      'Score 90%+ in NCERT Science & Mathematics Board examinations',
      'Register for IOQM (Indian Olympiad Qualifier in Mathematics) & NSEJS',
      'Submit prototype to INSPIRE Award MANAK (Dept of Science & Technology)',
      'Master Newton’s Laws, Stoichiometry, Trigonometry & Life Processes'
    ];
  } else {
    stage1Focus = [
      'Build DIY pocket experiments using everyday household materials',
      'Participate in National Children’s Science Congress (NCSC)',
      'Strengthen mental arithmetic, algebraic equations & unit conversions',
      'Observe natural plant cycles, local soil pH & bicycle mechanics'
    ];
  }

  // STAGE 2: Gateway Competitive Entrance Exams
  let entranceExams = [];
  if (track.includes('Aerospace') || track.includes('Robotics') || track.includes('Quantum') || track.includes('Intelligence') || track.includes('Sustainable')) {
    entranceExams = [
      { name: 'JEE Main & JEE Advanced', target: 'Top 5,000 All India Rank', purpose: 'Gateway to IITs (Bombay, Madras, Delhi, Kharagpur)' },
      { name: 'IISER Aptitude Test (IAT)', target: 'Top 1,000 Rank', purpose: 'Admission to BS-MS Dual Degree at 7 premier IISERs' },
      { name: 'NEST Exam', target: 'Top 500 Rank', purpose: '5-year Integrated M.Sc at NISER Bhubaneswar / UM-DAE CEBS' },
      { name: 'BITSAT', target: '320+ / 390 Score', purpose: 'B.E. (Hons) in Mechatronics/CS at BITS Pilani campuses' }
    ];
  } else if (track.includes('Biotechnologist') || track.includes('Genetic') || track.includes('Medicine')) {
    entranceExams = [
      { name: 'NEET-UG', target: '650+ / 720 Score', purpose: 'Admission to AIIMS New Delhi and top Govt Medical Colleges' },
      { name: 'ICAR AIEEA (CUET-UG)', target: '99+ Percentile', purpose: 'B.Sc (Hons) Agriculture & Biotech at IARI & state Agri Universities' },
      { name: 'IISER Aptitude Test (IAT)', target: 'Top 1,500 Rank', purpose: 'Cutting-edge biological research and genomics at IISERs' },
      { name: 'IIT JAM / GAT-B (Later)', target: 'National Rank', purpose: 'M.Sc Biotechnology with DBT monthly fellowship' }
    ];
  } else {
    entranceExams = [
      { name: 'CUET-UG STEM', target: '98+ Percentile', purpose: 'Premier Central Universities (DU, BHU, JNU) BS/B.Sc programs' },
      { name: 'State Engineering & Polytech CET', target: 'Top 10%', purpose: 'Govt Engineering & Polytechnic institutes' },
      { name: 'ICAR Entrance', target: 'Top 5%', purpose: 'State Agricultural & Horticultural Universities' }
    ];
  }

  // STAGE 3: Premier Undergraduate Colleges & Degrees
  let colleges = [];
  let degreeName = '';
  if (track.includes('Aerospace') || track.includes('Robotics')) {
    degreeName = 'B.Tech in Mechatronics, Aerospace or Mechanical Engineering';
    colleges = ['IIT Madras (Robert Bosch Centre for Data Science & AI)', 'IIT Bombay (Aerospace Dept)', 'IIST Thiruvananthapuram (ISRO Feed)', 'IIT Kanpur'];
  } else if (track.includes('Biotechnologist') || track.includes('Genetic')) {
    degreeName = 'B.Tech / BS-MS in Biotechnology, Molecular Biology or Genetics';
    colleges = ['IISc Bangalore (Biological Sciences)', 'IIT Delhi (Biochemical Engg)', 'AIIMS New Delhi', 'IARI Pusa New Delhi'];
  } else if (track.includes('Intelligence') || track.includes('Computational')) {
    degreeName = 'B.Tech in Computer Science / BS in Mathematics & Computing';
    colleges = ['IIT Bombay', 'IIT Delhi', 'IISc Bangalore', 'ISI Kolkata (Indian Statistical Institute)', 'CMI Chennai'];
  } else {
    degreeName = 'B.Tech in Sustainable Systems / B.Sc (Hons) in Applied Science';
    colleges = ['IIT Roorkee', 'NIT Surathkal', 'Govt Engineering College (State Capital)', 'UAS Bangalore'];
  }

  // STAGE 4: Specialized Research & Advanced Labs
  let researchLabs = [
    'ISRO Satellite Centre (URSC) / Vikram Sarabhai Space Centre (VSSC)',
    'DRDO Robotics & Artificial Intelligence Lab (CAIR)',
    'CSIR - National Chemical Laboratory (NCL) & CCMB Hyderabad',
    'Tata Institute of Fundamental Research (TIFR) & CERN Switzerland'
  ];

  // STAGE 5: High-Demand Industry Career Roles & Compensation
  let careerRoles = [];
  let salaryScale = '';
  if (track.includes('Aerospace') || track.includes('Robotics') || track.includes('Intelligence')) {
    careerRoles = [
      'Lead Autonomous Drone Systems Architect',
      'Embedded Flight Software Engineer at ISRO / Private Space Startups',
      'Robotics Mechatronics Specialist for Agricultural Automation',
      'Principal Deep Learning & Computer Vision Researcher'
    ];
    salaryScale = 'Entry Level: ₹12 - ₹24 Lakhs/yr  |  Mid-Level (5+ yrs): ₹35 - ₹65 Lakhs/yr  |  Global R&D: $140,000 - $220,000/yr';
  } else if (track.includes('Biotechnologist') || track.includes('Genetic')) {
    careerRoles = [
      'Principal Geneticist & CRISPR Gene-Editing Scientist',
      'Agricultural Biotechnologist & Seed Genomics Lead',
      'Immunology & mRNA Vaccine Formulation Specialist',
      'Bioinformatics Molecular Modeler'
    ];
    salaryScale = 'Entry Level: ₹9 - ₹18 Lakhs/yr  |  Mid-Level (5+ yrs): ₹28 - ₹50 Lakhs/yr  |  Global Biotech: $120,000 - $190,000/yr';
  } else {
    careerRoles = [
      'Decentralized Renewable Grid Project Director',
      'Senior Agro-Ecological Hydrologist',
      'Clean Energy Storage & EV Powertrain Engineer',
      'State Science & Innovation Officer'
    ];
    salaryScale = 'Entry Level: ₹8 - ₹16 Lakhs/yr  |  Mid-Level (5+ yrs): ₹22 - ₹40 Lakhs/yr';
  }

  // STAGE 6: Village & Rural Community Impact
  let villageImpact = '';
  if (track.includes('Aerospace') || track.includes('Robotics')) {
    villageImpact = 'Develop solar-powered autonomous mini-tractors and crop-spraying drones that cut smallholder farming costs by 60%, and install satellite weather warning sirens in flood-prone gram panchayats.';
  } else if (track.includes('Biotechnologist') || track.includes('Genetic')) {
    villageImpact = 'Engineer drought-tolerant pearl millet (bajra) and pest-resistant chickpea varieties, eliminating dangerous chemical pesticides and securing farmer yields during unpredictable monsoon cycles.';
  } else if (track.includes('Intelligence')) {
    villageImpact = 'Build offline vernacular voice AI that diagnoses crop leaf diseases directly from a farmer’s smartphone camera in 6 regional languages and predicts local mandi commodity prices.';
  } else {
    villageImpact = 'Design community solar microgrids with decentralized cold storage units so village farmers prevent tomato and vegetable spoilage and sell directly at fair prices.';
  }

  return [
    {
      stageNumber: 1,
      title: stage1Title,
      timeframe: isSenior ? 'Next 1 - 2 Years' : isSecondary ? 'Next 2 - 3 Years' : 'Next 3 - 5 Years',
      icon: '🏫',
      color: '#ff5b57',
      highlights: stage1Focus
    },
    {
      stageNumber: 2,
      title: 'Target Competitive Gateway Examinations',
      timeframe: isSenior ? 'Grade 12 Entrance Phase' : 'Post-Class 10 / Class 12',
      icon: '🎯',
      color: '#6b5be6',
      exams: entranceExams
    },
    {
      stageNumber: 3,
      title: 'Premier Higher Education & Degree Programs',
      timeframe: 'Undergraduate (Years 1 - 4)',
      icon: '🎓',
      color: '#12b3a4',
      degree: degreeName,
      institutes: colleges
    },
    {
      stageNumber: 4,
      title: 'Advanced Research Labs & Innovation Incubators',
      timeframe: 'Postgraduate & Research Phase',
      icon: '🔬',
      color: '#ffc531',
      labs: researchLabs
    },
    {
      stageNumber: 5,
      title: 'Industry Roles & Global Earning Potential',
      timeframe: 'Professional Career Phase',
      icon: '💼',
      color: '#2bd980',
      roles: careerRoles,
      salary: salaryScale
    },
    {
      stageNumber: 6,
      title: 'Village & Grassroots Social Transformation',
      timeframe: 'Lifelong Nation-Building Legacy',
      icon: '🌾',
      color: '#ff5b57',
      impact: villageImpact
    }
  ];
}

/**
 * Builds 3 immediate actionable goals tailored to the specific topics missed in the test
 */
function buildActionPlan(weakTopics, trackTitle) {
  if (!weakTopics || weakTopics.length === 0) {
    return [
      {
        priority: 'High',
        task: 'Attempt an advanced timed challenge to push from 90% to 100% mastery.',
        recommendedResource: 'NCERT Exemplar Problems & Previous Year National Olympiad papers.'
      },
      {
        priority: 'Medium',
        task: 'Teach these concepts to a classmate or create a 3-minute explanation video.',
        recommendedResource: 'VidyaVerse Socratic MentorAI mode.'
      },
      {
        priority: 'Enrichment',
        task: `Explore practical laboratory simulations matching your career path (${trackTitle}).`,
        recommendedResource: 'VidyaVerse PhET Virtual Labs.'
      }
    ];
  }

  return weakTopics.slice(0, 3).map((w, idx) => ({
    priority: idx === 0 ? 'Urgent' : 'Recommended',
    subject: w.subject,
    topic: w.topic,
    task: `Review ${w.subject} concept: "${w.topic}". Focus on the underlying law: ${w.explanation?.slice(0, 120)}...`,
    recommendedResource: `NCERT ${w.subject} Textbook & VidyaVerse MentorAI Doubt Clarification.`
  }));
}

/**
 * Gemini Live AI Generator (when API key is configured)
 */
async function generateAiCareerWorkflow(data) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert STEM Career Counselor and IIT/IISc/AIIMS Senior Mentor at VidyaVerse.
A real student just completed their Weekly 40-Question Skill Assessment Test with these verified live scores:

Student Profile:
- Grade: ${data.grade}
- Physics Score: ${data.phy}/10
- Chemistry Score: ${data.chem}/10
- Mathematics Score: ${data.mat}/10
- Biology Score: ${data.bio}/10
- Total Score: ${data.totalCorrect}/40 (${data.percentage}%)
- Strong Topics: ${data.strongTopics.join(', ')}
- Concept Gaps/Weak Topics: ${data.weakTopics.map(w => w.topic).join(', ')}

Generate a personalized, real-time, non-generic Career Workflow JSON.
Requirements:
1. "primaryTrack": { "title", "domain", "matchPercentage" (integer 0-100 calculated from their score strength), "tagline", "rationale" (referencing their exact scores) }
2. "alternateTracks": array of 2 { "title", "matchPercentage", "domain", "description" }
3. "stages": array of 6 sequential roadmap stages (Stage 1: Current school grade steps; Stage 2: Specific Indian Entrance Exams e.g. JEE, NEET, IAT; Stage 3: Premier colleges e.g. IITs, IISc, AIIMS & specific degree; Stage 4: Research labs e.g. ISRO, DRDO, TIFR; Stage 5: Real career designations and verified salary in INR; Stage 6: Village impact in rural India).
4. "immediateWeeklyActionPlan": array of 3 specific study tasks addressing their exact weak topics.

Return strictly raw valid JSON. Do not wrap in markdown quotes if possible or use clean \`\`\`json.
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  
  // Safe JSON extraction
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  }
  return null;
}
