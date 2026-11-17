import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { broadcastEvent } from '../realtime/broadcast.js';
import 'dotenv/config';
// Import the single source-of-truth story catalog from the frontend data layer
import { CURATED_STORIES as flagshipStories, getTopicCartoonVideo } from '../../src/data/curatedStories.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// â”€â”€ Fallback AI Story Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function buildFallbackAIStory(subject, topic, grade, isFirstPerson, characterName) {
  const char = characterName || (isFirstPerson ? 'You (The Young Scientist)' : 'Aria the Explorer');
  const videoData = getTopicCartoonVideo(topic, subject);

  return {
    id: `ai_story_${Date.now()}`,
    title: `${topic}: The Great Discovery Quest`,
    subtitle: `An epic interactive adventure exploring ${topic} in ${subject} for ${grade}!`,
    subject,
    topic,
    grade,
    cover_gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
    badge: 'AI Generated Adventure',
    accent_color: '#8b5cf6',
    is_first_person: Boolean(isFirstPerson),
    video_url: videoData.video_url,
    video_title: videoData.video_title,
    video_duration: videoData.video_duration,
    video_channel: videoData.video_channel,
    video_description: videoData.video_description,
    ai_video_storyboard: [
      {
        scene: 1,
        title: `The Awakening of ${topic}`,
        camera_direction: `Cinematic wide establishing shot of a futuristic village laboratory. Warm volumetric golden hour sunlight.`,
        visual_prompt: `Pixar 3D animation style. A vibrant cartoon student character named ${char} examining an glowing hologram of ${topic}. Bright expressive eyes, dynamic lighting.`,
        dialogue: `Look at the telemetry gauges! The foundational laws of ${topic} are unfolding right before our eyes!`,
        duration_sec: 12
      },
      {
        scene: 2,
        title: `Experimenting with the Natural Laws of ${topic}`,
        camera_direction: `Dynamic tracking shot moving through a lush rural landscape with moving gears and natural phenomena.`,
        visual_prompt: `Microscopic zoom showing atoms, molecules, or energy waves interacting in real time. Colorful neon particles and visual cause-and-effect science cues.`,
        dialogue: `Watch how energy and matter transform! In nature, fundamental conservation laws mean nothing is lost!`,
        duration_sec: 15
      },
      {
        scene: 3,
        title: `The Triumph of Discovery`,
        camera_direction: `Heroic low angle crane shot rising into the sky with celebratory confetti and glowing science apparatus.`,
        visual_prompt: `The cartoon cast smiling triumphantly together as the newly powered invention illuminates the village school. Vibrant, inspiring Pixar cinematic finish.`,
        dialogue: `We solved the challenge! Now letâ€™s jump straight into the digital simulation to test our discoveries!`,
        duration_sec: 14
      }
    ],
    simulation_target: {
      type: 'phet',
      id: 'forces_motion',
      name: 'PhET Forces & Interactive Lab',
      url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
      learning_hook: `Test and verify the physical laws of ${topic} directly inside this digital laboratory!`
    },
    characters: [
      { name: char, role: isFirstPerson ? 'You (Main Protagonist)' : 'Lead Adventurer', avatar: 'ðŸ§‘â€ðŸ”¬', personality: 'Curious, determined, observant' },
      { name: 'Dr. Vidya', role: 'Chief Scientist & Guide', avatar: 'ðŸ¤–', personality: 'Knowledgeable, friendly AI science mentor' },
      { name: 'Gizmo the Bot', role: 'Sensor Analyzer', avatar: 'ðŸ§­', personality: 'Calculates formulas and telemetry in real time' }
    ],
    learning_objectives: [
      `Understand fundamental principles and mechanisms of ${topic}`,
      `Identify real-world applications of ${topic} across village and everyday machines`,
      `Apply problem-solving logic at critical interactive decision checkpoints`,
      `Bridge theoretical classroom science with hands-on digital simulations`
    ],
    scenes: [
      {
        scene_number: 1,
        title: `The Mystery of ${topic}`,
        background_type: 'laboratory',
        character_speaking: char,
        character_action: 'explore',
        narration: `The adventure begins in the high-tech VidyaVerse mobile lab. Dr. Vidya detects an extraordinary reading related to ${topic}!`,
        dialogue: isFirstPerson 
          ? `I can see the scientific instruments oscillating! If we crack how ${topic} operates in nature, we can unlock clean energy for our entire school!`
          : `Look at the telemetry gauges! The foundational laws of ${topic} are unfolding right before our eyes!`,
        decision_point: {
          has_decision: true,
          prompt: `To investigate ${topic} scientifically, what is the best first step of the Scientific Method?`,
          options: [
            { id: 'A', text: 'Careful observation, formulating a hypothesis, and gathering data', is_correct: true, feedback: 'Spot on! Real science starts with keen observation and testable hypotheses!' },
            { id: 'B', text: 'Guessing the answer without testing', is_correct: false, feedback: 'Incorrect. Science relies on systematic evidence and testing.' },
            { id: 'C', text: 'Ignoring anomalies and assuming equipment is broken', is_correct: false, feedback: 'Incorrect. Anomalies often lead to humanityâ€™s greatest discoveries!' }
          ]
        }
      },
      {
        scene_number: 2,
        title: `Testing the Hypotheses in the Field`,
        background_type: 'forest',
        character_speaking: 'Dr. Vidya',
        character_action: 'experiment',
        narration: `We step out into the field where natural elements interact with mechanical systems. Every rural toolâ€”from cycle dynamos to water pumpsâ€”demonstrates ${topic}!`,
        dialogue: `Watch how energy and matter transform! In nature, fundamental conservation laws mean nothing is lost, only transformed!`,
        decision_point: {
          has_decision: true,
          prompt: `When applying ${topic} in real life, what happens to the total energy of an isolated system?`,
          options: [
            { id: 'A', text: 'Total energy is conserved: it cannot be created or destroyed, only transformed', is_correct: true, feedback: 'Brilliant! The First Law of Thermodynamics and Law of Conservation of Energy hold true everywhere in the Universe!' },
            { id: 'B', text: 'Energy vanishes forever when work is performed', is_correct: false, feedback: 'Incorrect. Energy may turn into dissipated heat, but the total sum remains constant.' },
            { id: 'C', text: 'Energy doubles automatically without any input', is_correct: false, feedback: 'Incorrect. Perpetual motion machines violating conservation of energy cannot exist.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: `The Breakthrough & Universal Application`,
        background_type: 'future_city',
        character_speaking: char,
        character_action: 'celebrate',
        narration: `All puzzle pieces snap together! By applying scientific principles of ${topic}, the team successfully creates an optimized technological blueprint!`,
        dialogue: `We solved the challenge! Now letâ€™s jump straight into the digital simulation to test our discoveries under custom parameters!`,
        decision_point: {
          has_decision: true,
          prompt: `Why is hands-on experimentation superior to simple textbook rote memorization?`,
          options: [
            { id: 'A', text: 'It develops conceptual intuition, analytical thinking, and experiential understanding', is_correct: true, feedback: 'Hurrah! Doing experiments wires neural pathways for deep, lifelong understanding!' },
            { id: 'B', text: 'It takes less time to memorize without thinking', is_correct: false, feedback: 'Rote memorization fades quickly and fails when applied to novel problems.' },
            { id: 'C', text: 'There is no difference', is_correct: false, feedback: 'Experiential learning dramatically boosts retention and real-world innovation.' }
          ]
        }
      }
    ],
    mini_challenge: {
      title: `${topic} Concept Connector`,
      instruction: `Connect the underlying principles of ${topic} with village machines to unlock the simulation!`,
      inputs: [`Observation of ${topic}`, 'Hypothesis Testing'],
      outputs: ['Empirical Proof', 'Virtual Simulation Access']
    },
    quiz: [
      {
        question: `What is the primary scientific principle underlying ${topic}?`,
        options: ['A) Universal conservation laws and cause-and-effect relationships', 'B) Random magic', 'C) Unverifiable speculation', 'D) Rote memorization rules'],
        correct_index: 0,
        explanation: `${topic} is governed by empirical, verifiable physical and natural laws.`
      },
      {
        question: `How can rural students best observe ${topic} at home?`,
        options: ['A) By examining everyday objects like bicycles, pressure cookers, and plants', 'B) Only in expensive university research labs', 'C) It cannot be observed at home', 'D) Only on television'],
        correct_index: 0,
        explanation: 'Everyday household and village objects are living laboratories demonstrating STEM principles.'
      },
      {
        question: `What is the next step after completing an interactive story lesson?`,
        options: ['A) Run interactive PhET simulations to test boundary conditions', 'B) Forget the topic', 'C) Skip practicing', 'D) Close the browser'],
        correct_index: 0,
        explanation: 'Simulations allow students to manipulate parameters and verify theory interactively.'
      }
    ]
  };
}

// In-memory student progress tracking for StoryVerse
const userStoryProgress = {};

function getStudentProgress(userId) {
  if (!userStoryProgress[userId]) {
    userStoryProgress[userId] = {
      userId,
      completedStories: ['leo_leaf'],
      storiesStarted: 3,
      totalLearningMinutes: 48,
      retentionScore: 92,
      decisionsMade: 14,
      correctDecisions: 13,
      favoriteCharacter: 'Leo the Leaf',
      subjectBreakdown: { Biology: 2, Physics: 1, Chemistry: 1, Mathematics: 0, SpaceScience: 1 },
      history: [{ storyId: 'leo_leaf', title: 'Leo the Leaf', completedAt: new Date(Date.now() - 86400000).toISOString(), score: 100, xpEarned: 250 }]
    };
  }
  return userStoryProgress[userId];
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ROUTES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// 1. GET ALL FLAGSHIP & CURATED STORIES
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    count: flagshipStories.length,
    stories: flagshipStories,
  });
});

// 2. GET SPECIFIC STORY BY ID
router.get('/:id', (req, res) => {
  const story = flagshipStories.find((s) => s.id === req.params.id) || flagshipStories[0];
  res.json({
    status: 'success',
    story,
  });
});

// 3. GENERATE DYNAMIC AI STORY VIA GEMINI API
router.post('/generate', async (req, res) => {
  const {
    subject = 'Biology',
    topic = 'Photosynthesis',
    grade = 'Class 7',
    isFirstPerson = false,
    characterName = '',
  } = req.body;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    const fallback = buildFallbackAIStory(subject, topic, grade, isFirstPerson, characterName);
    return res.json({ status: 'success', source: 'curated_fallback', story: fallback });
  }

  const prompt = `You are a world-class educational storyteller for Disney/Pixar and educational animation studios.
Create an exciting, interactive animated educational adventure story for Indian school students in ${grade}.

Subject: ${subject}
Topic: ${topic}
Mode: ${isFirstPerson ? 'BECOME THE CHARACTER (1st person RPG perspective where student IS the main character)' : 'Guided Cartoon Adventure (3rd person protagonist)'}
${characterName ? `Protagonist Name: ${characterName}` : ''}

Context: Make the setting relatable to students with village/rural Indian elements (nature, trees, farms, bicycles, water pumps, solar energy, simple machines) blended with animated wonder (talking cells, personified electrons, microscopic zoom).

Return ONLY a valid JSON object with this EXACT structure (NO markdown code fences, NO comments, JUST RAW JSON):
{
  "id": "ai_${Date.now()}",
  "title": "Exciting Pixar-Style Story Title",
  "subtitle": "One catchy subtitle sentence",
  "subject": "${subject}",
  "topic": "${topic}",
  "grade": "${grade}",
  "cover_gradient": "linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)",
  "badge": "AI Generated Adventure",
  "accent_color": "#10b981",
  "is_first_person": ${Boolean(isFirstPerson)},
  "simulation_target": {
    "type": "phet",
    "id": "sim_id",
    "name": "Relevant Simulation Name",
    "url": "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
    "learning_hook": "How the simulation reinforces the story"
  },
  "characters": [
    { "name": "Character Name", "role": "Role description", "avatar": "Emoji (e.g. ðŸƒ, âš¡, âš›ï¸)", "personality": "Personality description" },
    { "name": "Mentor Name", "role": "Guide / Mentor", "avatar": "Emoji", "personality": "Personality description" }
  ],
  "learning_objectives": [
    "Learning objective 1",
    "Learning objective 2",
    "Learning objective 3"
  ],
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene 1 Title",
      "background_type": "one of: forest, laboratory, human_body, space_station, classroom, ocean_world, future_city",
      "character_speaking": "Name of character",
      "character_action": "one of: walk, talk, think, explore, experiment, celebrate",
      "narration": "2-3 sentences of atmospheric Disney-style cartoon narration.",
      "dialogue": "Character dialogue with exclamation and emotion.",
      "decision_point": {
        "has_decision": true,
        "prompt": "Check question pausing the story",
        "options": [
          { "id": "A", "text": "Correct scientific decision", "is_correct": true, "feedback": "Detailed encouraging explanation" },
          { "id": "B", "text": "Common misconception option", "is_correct": false, "feedback": "Gentle correction explaining why" },
          { "id": "C", "text": "Plausible wrong option", "is_correct": false, "feedback": "Explanation of misconception" }
        ]
      }
    },
    {
      "scene_number": 2,
      "title": "Scene 2 Title",
      "background_type": "one of: forest, laboratory, human_body, space_station, classroom, ocean_world, future_city",
      "character_speaking": "Name of character",
      "character_action": "one of: walk, talk, think, explore, experiment, celebrate",
      "narration": "2-3 sentences advancing the plot and science concept.",
      "dialogue": "Character dialogue explaining scientific cause-and-effect.",
      "decision_point": {
        "has_decision": true,
        "prompt": "Second checkpoint question",
        "options": [
          { "id": "A", "text": "Option A", "is_correct": true, "feedback": "Feedback" },
          { "id": "B", "text": "Option B", "is_correct": false, "feedback": "Feedback" },
          { "id": "C", "text": "Option C", "is_correct": false, "feedback": "Feedback" }
        ]
      }
    },
    {
      "scene_number": 3,
      "title": "Scene 3: The Climax & Triumph",
      "background_type": "one of: forest, laboratory, human_body, space_station, classroom, ocean_world, future_city",
      "character_speaking": "Name of character",
      "character_action": "celebrate",
      "narration": "Exciting resolution where the scientific concept saves the day!",
      "dialogue": "Celebratory dialogue inviting student to launch the simulation.",
      "decision_point": {
        "has_decision": true,
        "prompt": "Climax verification decision",
        "options": [
          { "id": "A", "text": "Option A", "is_correct": true, "feedback": "Feedback" },
          { "id": "B", "text": "Option B", "is_correct": false, "feedback": "Feedback" },
          { "id": "C", "text": "Option C", "is_correct": false, "feedback": "Feedback" }
        ]
      }
    }
  ],
  "mini_challenge": {
    "title": "Challenge Name",
    "instruction": "Interactive instruction",
    "inputs": ["Input 1", "Input 2"],
    "outputs": ["Output 1", "Output 2"]
  },
  "quiz": [
    {
      "question": "Question 1 testing key concept?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 0,
      "explanation": "Clear explanation of why this answer is right."
    },
    {
      "question": "Question 2 testing practical application?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 1,
      "explanation": "Clear explanation of application."
    },
    {
      "question": "Question 3 testing deeper intuition?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 2,
      "explanation": "Intuition explanation."
    }
  ]
}`;

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.title && Array.isArray(parsed.scenes) && parsed.scenes.length >= 2) {
        if (!parsed.video_url) {
          const v = getTopicCartoonVideo(topic, subject);
          parsed.video_url = v.video_url;
          parsed.video_title = v.video_title;
          parsed.video_duration = v.video_duration;
          parsed.video_channel = v.video_channel;
          parsed.video_description = v.video_description;
        }
        if (!parsed.ai_video_storyboard || !parsed.ai_video_storyboard.length) {
          parsed.ai_video_storyboard = parsed.scenes.map((s, idx) => ({
            scene: idx + 1,
            title: s.title || `Scene ${idx + 1}`,
            camera_direction: `Dynamic animated camera move highlighting ${s.character_speaking || 'the protagonist'}. Pixar 3D animated styling with volumetric lighting.`,
            visual_prompt: `Disney/Pixar 3D animation. ${s.character_speaking || 'Hero'} in an animated ${s.background_type || 'laboratory'} environment. Expressive eye movement, gestures, vibrant palette.`,
            dialogue: s.dialogue || '',
            duration_sec: 12 + idx * 2
          }));
        }
        return res.json({ status: 'success', source: 'gemini_ai', model: modelName, story: parsed });
      }
    } catch (err) {
      console.warn(`[StoryVerse] Model ${modelName} error:`, err.message);
    }
  }

  // Graceful fallback to verified template
  const fallback = buildFallbackAIStory(subject, topic, grade, isFirstPerson, characterName);
  res.json({ status: 'success', source: 'curated_fallback', story: fallback });
});

// 4. GET STUDENT STORY LEARNING ANALYTICS (FOR CHART.JS)
router.get('/analytics/:userId', (req, res) => {
  const userId = req.params.userId || 'guest_user';
  const progress = getStudentProgress(userId);

  res.json({
    status: 'success',
    analytics: {
      userId,
      completedStoriesCount: progress.completedStories.length,
      totalLearningMinutes: progress.totalLearningMinutes,
      retentionScore: progress.retentionScore,
      decisionsTotal: progress.decisionsMade,
      decisionsCorrect: progress.correctDecisions,
      favoriteCharacter: progress.favoriteCharacter,
      subjectBreakdown: progress.subjectBreakdown,
      weeklyActivity: [
        { day: 'Mon', minutes: 12, score: 85 },
        { day: 'Tue', minutes: 18, score: 90 },
        { day: 'Wed', minutes: 8,  score: 80 },
        { day: 'Thu', minutes: 24, score: 95 },
        { day: 'Fri', minutes: 15, score: 88 },
        { day: 'Sat', minutes: 30, score: 98 },
        { day: 'Sun', minutes: 20, score: 92 },
      ]
    }
  });
});

// 5. RECORD STORY PROGRESS & QUIZ SCORE
router.post('/progress', (req, res) => {
  const {
    userId = 'guest_user',
    storyId,
    storyTitle = 'Story Adventure',
    completed = true,
    quizScore = 100,
    timeSpentSeconds = 180,
    decisionsCount = 3,
    simulationLaunched = false,
  } = req.body;

  const progress = getStudentProgress(userId);

  if (completed && !progress.completedStories.includes(storyId)) {
    progress.completedStories.push(storyId);
  }
  progress.totalLearningMinutes += Math.round(timeSpentSeconds / 60);
  progress.decisionsMade += decisionsCount;
  progress.correctDecisions += decisionsCount;

  progress.history.unshift({
    storyId,
    title: storyTitle,
    completedAt: new Date().toISOString(),
    score: quizScore,
    xpEarned: completed ? 200 : 50,
    simulationLaunched
  });

  // Broadcast live progress over WebSockets
  broadcastEvent('STORY_PROGRESS_UPDATED', {
    userId,
    storyId,
    storyTitle,
    completed,
    quizScore,
    totalMinutes: progress.totalLearningMinutes
  });

  res.json({
    status: 'success',
    message: 'Story progress saved successfully',
    updatedProgress: progress
  });
});

export default router;
