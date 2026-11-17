import { CURATED_STORIES, getTopicCartoonVideo } from '../data/curatedStories';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Helper for Real-Time Local Storage Analytics
function getLocalRealtimeAnalytics(userId = 'guest_user') {
  const key = `vidyaverse_story_realtime_${userId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local realtime stats:', e);
  }

  // Initial fresh state
  const initial = {
    userId,
    completedStories: [],
    storiesStarted: 0,
    totalLearningMinutes: 1,
    sessionStartTime: Date.now(),
    decisionsMade: 0,
    correctDecisions: 0,
    quizQuestionsAttempted: 0,
    quizQuestionsCorrect: 0,
    retentionScore: 100,
    favoriteCharacter: 'Leo the Leaf',
    characterPlayCounts: { 'Leo the Leaf': 1 },
    subjectBreakdown: {
      Biology: 1,
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0,
      SpaceScience: 0
    },
    history: []
  };
  try {
    localStorage.setItem(key, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveLocalRealtimeAnalytics(userId, data) {
  const key = `vidyaverse_story_realtime_${userId || 'guest_user'}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

export const api = {
  // 1. Scanner Backend
  async scanObject(objectId, customName, language = 'en', extra = {}) {
    try {
      const res = await fetch(`${API_BASE}/scanner/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId,
          customName,
          language,
          imageFrame: extra.imageFrame || null,
          mediaType: extra.mediaType || 'camera',
          filename: extra.filename || null,
        }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 2. Virtual Labs Simulation Backend
  async simulatePhysicsCircuit(voltage, resistance, isSwitchClosed) {
    try {
      const res = await fetch(`${API_BASE}/labs/physics/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voltage, resistance, isSwitchClosed }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  async simulateChemistryReaction(indicator, reagent) {
    try {
      const res = await fetch(`${API_BASE}/labs/chemistry/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator, reagent }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 3. Treasure Hunt Backend
  async submitTreasureHunt(missionId, foundItemIds, schoolName) {
    try {
      const res = await fetch(`${API_BASE}/treasure-hunt/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, foundItemIds, schoolName }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 4. AI Tutor Socratic Backend
  async askTutor(question, language = 'en') {
    try {
      const res = await fetch(`${API_BASE}/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 5. STEM Career Navigator Backend
  async getCareerRoadmap(studentInterests) {
    try {
      const res = await fetch(`${API_BASE}/careers/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentInterests }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 6. Analytics & Leaderboard Backend
  async getLeaderboard() {
    try {
      const res = await fetch(`${API_BASE}/analytics/leaderboard`);
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 7. PhET Virtual Labs - Get simulations by discipline
  async getPhetSimulations(discipline = 'physics') {
    try {
      const res = await fetch(`${API_BASE}/labs/phet/${discipline}`);
      return await res.json();
    } catch (err) {
      console.warn('PhET API fallback:', err);
      return null;
    }
  },

  async getPhetCatalog() {
    try {
      const res = await fetch(`${API_BASE}/labs/phet-catalog`);
      return await res.json();
    } catch (err) {
      console.warn('PhET catalog fallback:', err);
      return null;
    }
  },

  // 8. Separate User Backend (Personal Dashboard architecture)
  async getUserDashboard(role = 'student', id = 'student_01') {
    try {
      const res = await fetch(`${API_BASE}/user/${role}/${id}`);
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 9. StoryVerse Learning Mode
  async getStories() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE}/stories`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.stories && data.stories.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[StoryVerse] Backend fetch unavailable, using offline curated catalog:', err.message);
    }
    // Reliable curated fallback for Vercel / offline
    return {
      status: 'success',
      source: 'offline_curated',
      count: CURATED_STORIES.length,
      stories: CURATED_STORIES
    };
  },

  async getStoryById(id) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE}/stories/${id}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.story) return data;
      }
    } catch (err) {
      console.warn('[StoryVerse] getStoryById fallback to local:', err.message);
    }
    const match = CURATED_STORIES.find(s => s.id === id) || CURATED_STORIES[0];
    return { status: 'success', source: 'offline_curated', story: match };
  },

  async generateAIStory(params) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE}/stories/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.story) return data;
      }
    } catch (err) {
      console.warn('[StoryVerse] generateAIStory backend unavailable, using client procedural generator:', err.message);
    }

    // Client-side instant generator fallback for Vercel
    const { subject = 'Biology', topic = 'Photosynthesis', grade = 'Class 7', isFirstPerson = false, characterName = '' } = params;
    const hero = characterName || (isFirstPerson ? 'You (The Young Scientist)' : 'Aria the Explorer');
    const videoData = getTopicCartoonVideo(topic, subject);

    const generated = {
      id: `ai_${Date.now()}`,
      title: `${topic}: The Great Discovery Quest`,
      subtitle: `An epic cartoon adventure exploring ${topic} in ${subject} for ${grade}!`,
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
          title: `The Mystery of ${topic}`,
          camera_direction: `Establishing wide crane shot of the village science lab.`,
          visual_prompt: `Pixar 3D animation. Cartoon student ${hero} discovering a holographic model of ${topic}.`,
          dialogue: `Look at the telemetry gauges! The foundational laws of ${topic} are unfolding right before our eyes!`,
          duration_sec: 12
        },
        {
          scene: 2,
          title: `Natural Verification in the Field`,
          camera_direction: `Dynamic tracking shot moving through a lush rural environment.`,
          visual_prompt: `Animated microscopic particles interacting with sunlight, water, and mechanical systems.`,
          dialogue: `In nature, energy and matter are never lost—only transformed!`,
          duration_sec: 15
        },
        {
          scene: 3,
          title: `Breakthrough & Digital Lab`,
          camera_direction: `Low-angle heroic rising shot with celebratory confetti.`,
          visual_prompt: `The cartoon cast celebrating victory as clean energy illuminates the school.`,
          dialogue: `We solved the challenge! Time to test our discoveries inside the digital simulator!`,
          duration_sec: 14
        }
      ],
      simulation_target: {
        type: 'phet',
        id: 'forces_motion',
        name: `PhET ${topic} Interactive Lab`,
        url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
        learning_hook: `Test and verify the physical laws of ${topic} directly inside this digital laboratory!`
      },
      characters: [
        { name: hero, role: isFirstPerson ? 'You (Main Protagonist)' : 'Lead Adventurer', avatar: '🧑‍🔬', personality: 'Curious and determined' },
        { name: 'Dr. Vidya', role: 'Chief Scientist', avatar: '🤖', personality: 'Knowledgeable and supportive AI guide' }
      ],
      learning_objectives: [
        `Understand the fundamental physical mechanisms of ${topic}`,
        `Connect textbook science to everyday village machines and natural phenomena`,
        `Apply scientific problem-solving logic at interactive checkpoints`
      ],
      scenes: [
        {
          scene_number: 1,
          title: `The Awakening of ${topic}`,
          background_type: 'laboratory',
          character_speaking: hero,
          character_action: 'explore',
          narration: `Inside the VidyaVerse mobile laboratory, telemetry readings for ${topic} suddenly burst into action!`,
          dialogue: `Look closely! If we understand how ${topic} operates in nature, we can unlock solutions for our village!`,
          decision_point: {
            has_decision: true,
            prompt: `To investigate ${topic} scientifically, what is the best first step?`,
            options: [
              { id: 'A', text: 'Careful observation, formulating a hypothesis, and gathering testable data', is_correct: true, feedback: 'Spot on! Real science starts with keen observation and testable hypotheses!' },
              { id: 'B', text: 'Guessing without testing', is_correct: false, feedback: 'Incorrect. Science relies on systematic evidence and testing.' },
              { id: 'C', text: 'Ignoring anomalies', is_correct: false, feedback: 'Incorrect. Anomalies often lead to humanity’s greatest discoveries!' }
            ]
          }
        },
        {
          scene_number: 2,
          title: `Field Experiment & Energy Exchange`,
          background_type: 'forest',
          character_speaking: 'Dr. Vidya',
          character_action: 'experiment',
          narration: `Out in the field, natural elements interact with mechanical systems, demonstrating ${topic} in real life!`,
          dialogue: `Notice how matter and energy interact! Universal conservation laws govern every process in nature!`,
          decision_point: {
            has_decision: true,
            prompt: `When applying ${topic} in real life, what happens to the total energy in an isolated system?`,
            options: [
              { id: 'A', text: 'Total energy is conserved: it cannot be created or destroyed, only transformed', is_correct: true, feedback: 'Brilliant! The Law of Conservation of Energy holds true across the Universe!' },
              { id: 'B', text: 'Energy vanishes forever', is_correct: false, feedback: 'Incorrect. Energy may turn into dissipated heat, but the total sum remains constant.' },
              { id: 'C', text: 'Energy doubles without any input', is_correct: false, feedback: 'Incorrect. Perpetual motion machines violating conservation of energy cannot exist.' }
            ]
          }
        },
        {
          scene_number: 3,
          title: `The Triumph of Scientific Mastery`,
          background_type: 'future_city',
          character_speaking: hero,
          character_action: 'celebrate',
          narration: `The experiment succeeds! Applying principles of ${topic} allows the team to power up the village school!`,
          dialogue: `We solved it! Now let us launch the interactive PhET simulation to verify our findings!`,
          decision_point: {
            has_decision: true,
            prompt: `Why is hands-on experimentation superior to rote memorization?`,
            options: [
              { id: 'A', text: 'It develops conceptual intuition, analytical thinking, and real-world problem-solving', is_correct: true, feedback: 'Hurrah! Experimentation builds deep, permanent neural connections!' },
              { id: 'B', text: 'It takes less time to memorize without thinking', is_correct: false, feedback: 'Rote memorization fades quickly and fails when applied to novel problems.' },
              { id: 'C', text: 'There is no difference', is_correct: false, feedback: 'Experiential learning dramatically boosts retention and real-world innovation.' }
            ]
          }
        }
      ],
      quiz: [
        {
          question: `What is the primary scientific principle underlying ${topic}?`,
          options: ['A) Universal conservation laws and cause-and-effect relationships', 'B) Random magic', 'C) Unverifiable speculation', 'D) Rote rules'],
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

    return { status: 'success', source: 'client_generator', story: generated };
  },

  async getStoryAnalytics(userId = 'guest_user') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE}/stories/analytics/${userId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.analytics) return data;
      }
    } catch (err) {
      console.warn('[StoryVerse] getStoryAnalytics using live local stats:', err.message);
    }
    // Return live real-time analytics stored locally
    const stats = getLocalRealtimeAnalytics(userId);
    return { status: 'success', source: 'local_realtime', analytics: stats };
  },

  async saveStoryProgress(progressData) {
    const userId = progressData.userId || 'guest_user';
    const stats = getLocalRealtimeAnalytics(userId);

    // Update real-time statistics
    if (progressData.completed && !stats.completedStories.includes(progressData.storyId)) {
      stats.completedStories.push(progressData.storyId);
    }
    if (progressData.subject) {
      stats.subjectBreakdown[progressData.subject] = (stats.subjectBreakdown[progressData.subject] || 0) + 1;
    }
    if (progressData.quizScore !== undefined) {
      stats.quizQuestionsAttempted = (stats.quizQuestionsAttempted || 0) + 3;
      stats.quizQuestionsCorrect = (stats.quizQuestionsCorrect || 0) + Math.round((progressData.quizScore / 100) * 3);
    }
    if (progressData.decisionsCount) {
      stats.decisionsMade = (stats.decisionsMade || 0) + progressData.decisionsCount;
      stats.correctDecisions = (stats.correctDecisions || 0) + (progressData.correctDecisions || progressData.decisionsCount);
    }
    if (progressData.favoriteCharacter) {
      stats.favoriteCharacter = progressData.favoriteCharacter;
    }

    // Dynamic retention score calculation based on real student performance
    const totalAttempted = (stats.decisionsMade || 0) + (stats.quizQuestionsAttempted || 0);
    const totalCorrect = (stats.correctDecisions || 0) + (stats.quizQuestionsCorrect || 0);
    stats.retentionScore = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;
    stats.totalLearningMinutes = Math.max(stats.totalLearningMinutes, Math.round((Date.now() - (stats.sessionStartTime || Date.now())) / 60000) + 1);

    stats.history = stats.history || [];
    stats.history.unshift({
      storyId: progressData.storyId,
      completedAt: new Date().toISOString(),
      score: progressData.quizScore || 100
    });

    saveLocalRealtimeAnalytics(userId, stats);

    try {
      const res = await fetch(`${API_BASE}/stories/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Offline / Vercel is already persisted in localStorage
    }

    return { status: 'success', source: 'local_realtime', analytics: stats };
  },
};
