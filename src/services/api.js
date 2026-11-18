import { CURATED_STORIES, getTopicCartoonVideo } from '../data/curatedStories';
import { DETAILED_OBJECTS, matchKnownObject, synthesizeCustomObjectSTEM } from '../data/scannerKnowledge';
import { PHET_CATALOG } from '../data/phetSimulations';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { queryMentorAI } from './mentorAiEngine';

// Browser-side Gemini client (works on Vercel, no backend needed)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' && window.VITE_GEMINI_API_KEY) || '';
const browserGenAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Safe JSON extractor that handles markdown fences, thoughts, preambles, and postscripts
function extractJsonFromText(text) {
  if (!text) return null;
  const trimmed = text.trim();
  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Strip code fences
  const stripped = trimmed.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {}

  // 3. Find outermost balanced JSON object
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = stripped.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch {}
  }
  return null;
}

// Real-Time Multimodal Gemini Vision Analyzer for Object Scanning
async function analyzeImageWithGeminiVision(imageFrame, pinpoint = null, customHint = null) {
  if (!imageFrame) return null;

  const apiKey = GEMINI_API_KEY;
  if (!apiKey) return null;

  // Extract accurate MIME type and raw base64 data
  let mimeType = 'image/jpeg';
  if (imageFrame.startsWith('data:')) {
    const mimeMatch = imageFrame.match(/^data:([^;]+);base64,/);
    if (mimeMatch) mimeType = mimeMatch[1];
  }
  const cleanBase64 = imageFrame.includes(',') ? imageFrame.split(',')[1] : imageFrame;

  // Filter out WhatsApp and device container names from hint
  const isGenericHint = !customHint ||
    /whatsapp|screenshot|img_|image|pxl_|photo|camera|capture|scanned|frame/i.test(customHint) ||
    customHint === 'Pressure Cooker' ||
    customHint === 'Captured Object' ||
    customHint === 'Aiming at Object...' ||
    customHint === 'Recognized Object';

  const pinpointInfo = pinpoint
    ? `TARGET PINPOINT: The student has pinpointed coordinate [X: ${Math.round(pinpoint.x)}%, Y: ${Math.round(pinpoint.y)}%] on this image (where [0,0] is top-left and [100,100] is bottom-right). Identify the SPECIFIC physical object located at or closest to this exact reticle coordinate!`
    : 'Look at the primary real-world physical object located in this photo.';

  const hintInfo = !isGenericHint ? `Student hint: "${customHint}".` : '';

  const prompt = `You are an expert AI Vision Scientist and STEM Professor analyzing an image captured or uploaded by an Indian school student (NCERT Grade 6-12).
${pinpointInfo}
${hintInfo}

CRITICAL RULES:
1. Identify the EXACT real-world object/tool/device/appliance/plant/instrument visible in the photo pixels (e.g. "Ballpoint Pen", "Smartphone", "Scissors", "Spectacles / Eyeglasses", "Wristwatch", "Ceiling Fan", "Water Bottle", "Pressure Cooker", "Laptop Keyboard", "Leaf / Plant", "Steel Spoon", "LED Bulb", "Electrical Plug", "Key & Lock", "Running Shoes", "Bicycle", etc.).
2. If this is a downloaded or shared photo (e.g. WhatsApp Image, screenshot, or camera roll), NEVER name the object "WhatsApp Image", "Image", "Photo", "Captured Object", or "Unknown". You MUST detect what physical object is depicted in the pixels!
3. Provide genuine, real-world, scientifically accurate STEM details for THIS EXACT OBJECT.
4. Return ONLY a valid JSON object with NO markdown code fences (no \`\`\`json):
{
  "id": "short_slug",
  "name": "Exact Object Name (English + Local script if common)",
  "icon": "Single representative emoji",
  "category": "Scientific Category (e.g. Optics & Refraction, Classical Mechanics & Levers, Fluid Dynamics, Electromagnetism, Thermodynamics, etc.)",
  "summary": "2-3 clear, engaging sentences explaining the real-world scientific mechanism of this exact object.",
  "mechanism": {
    "step1_activation": "Step 1: Real initial physical action / input force",
    "step2_transmission": "Step 2: Real energy or mechanical transmission through components",
    "step3_core_principle": "Step 3: The fundamental physical, chemical, or thermodynamic law at work",
    "step4_output": "Step 4: The work done, output generated, or functional effect",
    "step5_regulation": "Step 5: How the system achieves balance, safety, or feedback"
  },
  "stem": {
    "physics": "Real physical laws (e.g. Snell's Law, Hooke's Law, Bernoulli's Principle, Ohm's Law, Torque τ=r×F, friction μ), forces, and equations governing this object.",
    "math": "Real mathematical formulas, ratios, geometric relationships, or numerical calculations for this object.",
    "chemistry": "Real material science: alloys, polymers, chemical reactions, surface coatings, or molecular structure.",
    "biology": "Real biomechanical interaction, human ergonomics, sensory perception, or biological inspiration/biomimicry."
  },
  "arPoints": [
    { "top": "25%", "left": "45%", "label": "Key Component 1: Real physical purpose" },
    { "top": "50%", "left": "50%", "label": "Core Mechanism: Active force/energy transformation" },
    { "top": "75%", "left": "55%", "label": "Base / Grip / Contact: Stability & materials" }
  ],
  "experiment": {
    "title": "Hands-On Student Experiment with this Object",
    "items": ["Item 1", "Item 2"],
    "steps": [
      "Step 1: Simple test",
      "Step 2: Measurement or observation",
      "Conclusion: Verified scientific principle"
    ]
  },
  "audioText": {
    "en": "English spoken explanation of how this exact object works.",
    "hi": "Hindi spoken explanation.",
    "kn": "Kannada spoken explanation.",
    "te": "Telugu spoken explanation.",
    "ta": "Tamil spoken explanation.",
    "mr": "Marathi spoken explanation."
  },
  "stats": {
    "primaryMaterial": "Specific material",
    "governingPrinciple": "Specific scientific law",
    "typicalMetric": "Key empirical metric"
  }
}`;

  // Priority models verified active on user's API key
  const visionModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  for (const m of visionModels) {
    try {
      // 1. First attempt: Direct REST call
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: cleanBase64 } }
            ]
          }
        ]
      };

      let rawText = null;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(18000)
        });

        if (res.ok) {
          const data = await res.json();
          rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        } else {
          const errJson = await res.json().catch(() => ({}));
          console.warn(`[VidyaVerse Vision] Model ${m} REST HTTP ${res.status}:`, errJson?.error?.message || res.statusText);
        }
      } catch (fetchErr) {
        console.warn(`[VidyaVerse Vision] Model ${m} fetch error:`, fetchErr.message);
      }

      // 2. Second attempt: Browser GoogleGenerativeAI SDK fallback if REST was blocked
      if (!rawText && browserGenAI) {
        try {
          const sdkModel = browserGenAI.getGenerativeModel({ model: m });
          const sdkResult = await sdkModel.generateContent([
            prompt,
            { inlineData: { data: cleanBase64, mimeType } }
          ]);
          rawText = sdkResult?.response?.text()?.trim();
        } catch (sdkErr) {
          console.warn(`[VidyaVerse Vision] Model ${m} SDK fallback error:`, sdkErr.message);
        }
      }

      if (!rawText) continue;

      const parsed = extractJsonFromText(rawText);
      if (parsed && parsed.name && (parsed.mechanism || parsed.summary)) {
        console.log(`[VidyaVerse Vision] ✅ Successfully recognized: "${parsed.name}" using ${m}`);

        // Enrich with curated knowledge if available
        const known = matchKnownObject(parsed.name) || matchKnownObject(parsed.id);
        if (known) {
          parsed.audioText = { ...known.audioText, ...parsed.audioText };
          if (!parsed.icon || parsed.icon === '🔍') parsed.icon = known.icon;
        }

        return {
          status: 'success',
          source: 'gemini_vision',
          model: m,
          result: parsed
        };
      }
    } catch (err) {
      console.warn(`[VidyaVerse Vision] Model ${m} iteration failed:`, err.message);
    }
  }

  return null;
}

// â”€â”€ Verify a YouTube video ID is accessible via oEmbed (CORS-safe) â”€â”€
async function verifyYouTubeId(videoId) {
  if (!videoId || videoId.length < 8) return false;
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

// â”€â”€ Build YouTube search URL for a topic (always works as a fallback) â”€â”€
function youtubeSearchUrl(topic, subject) {
  const q = encodeURIComponent(`${topic} ${subject} educational cartoon animation for kids`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

// â”€â”€ Call Gemini in the browser and get a full story + real video ID â”€â”€
async function generateStoryWithBrowserGemini({ subject, topic, grade, isFirstPerson, characterName }) {
  if (!browserGenAI) throw new Error('No Gemini API key configured for browser');

  const hero = characterName || (isFirstPerson ? 'You (The Young Scientist)' : 'Aria the Explorer');

  // We ask Gemini to suggest a REAL YouTube video ID it knows exists
  const prompt = `You are a world-class educational storyteller AND a YouTube expert who knows real video IDs from top educational channels like Dr. Binocs (Peekaboo Kidz), TED-Ed, Crash Course Kids, Kurzgesagt, National Geographic Kids, SciShow Kids, and similar.

Create a complete interactive animated educational adventure story for Indian school students.

Subject: ${subject}
Topic: ${topic}
Class: ${grade}
Mode: ${isFirstPerson ? 'BECOME THE CHARACTER â€” 1st person RPG, student IS the protagonist' : '3rd person cartoon adventure'}
${characterName ? `Hero Name: ${characterName}` : ''}

CRITICAL: You MUST include a real, existing YouTube video ID (youtube_video_id field) for an educational animated video about "${topic}" from a reputable educational channel. The video must actually exist on YouTube. Use your knowledge of real popular educational YouTube videos. If unsure, use a Dr. Binocs or TED-Ed video that covers this topic or a closely related concept.

Return ONLY valid JSON (no markdown fences, no comments):
{
  "id": "ai_${Date.now()}",
  "title": "Exciting Pixar-style story title about ${topic}",
  "subtitle": "One catchy subtitle line",
  "subject": "${subject}",
  "topic": "${topic}",
  "grade": "${grade}",
  "cover_gradient": "linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%)",
  "badge": "AI Adventure",
  "accent_color": "#hexcolor",
  "is_first_person": ${Boolean(isFirstPerson)},
  "youtube_video_id": "REAL_YOUTUBE_VIDEO_ID_HERE",
  "video_title": "Title of the YouTube video you chose",
  "video_channel": "Name of the YouTube channel",
  "video_description": "One sentence about what the video teaches",
  "youtube_search_query": "${topic} ${subject} educational animation cartoon for class ${grade.replace('Class ', '')}",
  "simulation_target": {
    "type": "phet",
    "id": "sim_id",
    "name": "Relevant PhET simulation name",
    "url": "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html",
    "learning_hook": "How the simulation connects to the story"
  },
  "characters": [
    { "name": "${hero}", "role": "${isFirstPerson ? 'You (Protagonist)' : 'Lead Adventurer'}", "avatar": "emoji", "personality": "description" },
    { "name": "Mentor Name", "role": "Guide", "avatar": "emoji", "personality": "description" },
    { "name": "Sidekick Name", "role": "Helper", "avatar": "emoji", "personality": "description" }
  ],
  "learning_objectives": [
    "Specific objective 1 about ${topic}",
    "Specific objective 2 about ${topic}",
    "Specific objective 3 about ${topic}"
  ],
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene 1 title",
      "background_type": "forest|laboratory|human_body|space_station|classroom|ocean_world|future_city",
      "character_speaking": "${hero}",
      "character_action": "explore|walk|talk|think|experiment|celebrate",
      "narration": "2-3 sentence Disney-style atmospheric narration specific to ${topic}.",
      "dialogue": "Exciting character dialogue specifically about ${topic} with facts.",
      "decision_point": {
        "has_decision": true,
        "prompt": "Specific science question about ${topic}?",
        "options": [
          { "id": "A", "text": "Correct answer about ${topic}", "is_correct": true, "feedback": "Encouraging explanation with ${topic} facts" },
          { "id": "B", "text": "Common misconception", "is_correct": false, "feedback": "Gentle correction about ${topic}" },
          { "id": "C", "text": "Plausible wrong answer", "is_correct": false, "feedback": "Why this is wrong about ${topic}" }
        ]
      }
    },
    {
      "scene_number": 2,
      "title": "Scene 2 title",
      "background_type": "forest|laboratory|human_body|space_station|classroom|ocean_world|future_city",
      "character_speaking": "Mentor Name",
      "character_action": "experiment",
      "narration": "Deeper dive into ${topic} mechanisms with village India elements.",
      "dialogue": "Mentor explaining key ${topic} principle with an analogy.",
      "decision_point": {
        "has_decision": true,
        "prompt": "Second checkpoint â€” a tougher question about ${topic}?",
        "options": [
          { "id": "A", "text": "Option A", "is_correct": true, "feedback": "Feedback" },
          { "id": "B", "text": "Option B", "is_correct": false, "feedback": "Feedback" },
          { "id": "C", "text": "Option C", "is_correct": false, "feedback": "Feedback" }
        ]
      }
    },
    {
      "scene_number": 3,
      "title": "The Triumph â€” Saving the Day with ${topic}",
      "background_type": "future_city",
      "character_speaking": "${hero}",
      "character_action": "celebrate",
      "narration": "Climax resolution using knowledge of ${topic} to solve the story problem.",
      "dialogue": "Celebrating â€” now launching the digital simulation!",
      "decision_point": {
        "has_decision": true,
        "prompt": "Final quiz: Real-world application of ${topic}?",
        "options": [
          { "id": "A", "text": "Correct application", "is_correct": true, "feedback": "Brilliant!" },
          { "id": "B", "text": "Wrong application", "is_correct": false, "feedback": "Not quite" },
          { "id": "C", "text": "Another wrong option", "is_correct": false, "feedback": "Incorrect" }
        ]
      }
    }
  ],
  "mini_challenge": {
    "title": "${topic} Concept Lab",
    "instruction": "Match the ${topic} inputs and outputs!",
    "inputs": ["Key input 1", "Key input 2"],
    "outputs": ["Expected output 1", "Expected output 2"]
  },
  "quiz": [
    {
      "question": "Core concept question about ${topic}?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 0,
      "explanation": "Clear explanation about ${topic}."
    },
    {
      "question": "Application question about ${topic}?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 1,
      "explanation": "Explanation."
    },
    {
      "question": "Deeper intuition question about ${topic}?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_index": 2,
      "explanation": "Deeper explanation."
    }
  ]
}`;

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  for (const modelName of modelsToTry) {
    try {
      const model = browserGenAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = extractJsonFromText(text);
      if (!parsed) continue;

      if (!parsed.title || !Array.isArray(parsed.scenes) || parsed.scenes.length < 2) continue;

      // Verify the YouTube video ID Gemini picked
      let videoId = parsed.youtube_video_id;
      let videoOk = videoId ? await verifyYouTubeId(videoId) : false;

      if (!videoOk) {
        // Try to find a matching video from the curated catalog
        const catalogMatch = CURATED_STORIES.find(s =>
          (s.topic || '').toLowerCase().includes(topic.toLowerCase().split(' ')[0]) ||
          (s.subject || '').toLowerCase() === subject.toLowerCase()
        );
        if (catalogMatch) {
          const catalogId = catalogMatch.video_url?.split('/embed/')?.[1]?.split('?')?.[0];
          if (catalogId) { videoId = catalogId; videoOk = true; }
        }
      }

      // Build final video fields
      parsed.video_url = videoOk
        ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`
        : null; // null = will show YouTube search fallback in UI
      parsed.video_id = videoOk ? videoId : null;
      parsed.video_search_url = youtubeSearchUrl(topic, subject);
      parsed.video_verified = videoOk;
      if (!parsed.video_title) parsed.video_title = `${topic} Educational Animation`;
      if (!parsed.video_channel) parsed.video_channel = 'Educational YouTube';
      if (!parsed.video_description) parsed.video_description = `Animated cartoon explaining ${topic} for ${grade} students.`;

      // Build ai_video_storyboard from scenes if not present
      if (!parsed.ai_video_storyboard || !parsed.ai_video_storyboard.length) {
        parsed.ai_video_storyboard = parsed.scenes.map((s, idx) => ({
          scene: idx + 1,
          title: s.title || `Scene ${idx + 1}`,
          camera_direction: `Dynamic animated Pixar-style shot. ${s.character_speaking || hero} in a ${s.background_type || 'laboratory'} setting.`,
          visual_prompt: `Disney/Pixar 3D animation. Expressive cartoon character exploring ${topic} with vivid colours and village India backdrop.`,
          dialogue: s.dialogue || '',
          duration_sec: 12 + idx * 2
        }));
      }

      return { status: 'success', source: 'gemini_browser', model: modelName, story: parsed };
    } catch (err) {
      console.warn(`[StoryVerse] Browser Gemini model ${modelName} error:`, err.message);
    }
  }
  throw new Error('All Gemini models failed');
}

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
  // 1. Scanner Backend (Real-Time Multimodal AI Vision + Empirical STEM)
  async scanObject(objectId, customName, language = 'en', extra = {}) {
    // 1. Direct objectId selection from interactive pills
    if (objectId && DETAILED_OBJECTS[objectId]) {
      return {
        status: 'success',
        source: 'curated_library',
        result: DETAILED_OBJECTS[objectId]
      };
    }

    // 2. Real-Time Camera / Upload Image Frame via Gemini Vision
    if (extra.imageFrame) {
      try {
        const visionResult = await analyzeImageWithGeminiVision(
          extra.imageFrame,
          extra.pinpoint || null,
          customName
        );
        if (visionResult && visionResult.result) {
          // If backend is running, notify it in background
          fetch(`${API_BASE}/scanner/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              objectId: visionResult.result.id,
              customName: visionResult.result.name,
              language,
              imageFrame: extra.imageFrame,
              mediaType: extra.mediaType || 'camera_snapshot',
            }),
          }).catch(() => {});

          return visionResult;
        }
      } catch (err) {
        console.warn('[VidyaVerse Scanner] Vision analysis error:', err.message);
      }
    }

    // 3. Fallback: Check backend if online
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
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
          pinpoint: extra.pinpoint || null,
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) return data;
      }
    } catch (err) {
      // Backend not running / Vercel deployment
    }

    // 4. Offline Matching: Keyword lookup from customName or filename (filter out WhatsApp/camera container names)
    const isGenericStr = (str) => !str || /whatsapp|screenshot|img_|image|pxl_|photo|camera|capture|frame|scanned/i.test(str);
    const safeFilename = isGenericStr(extra.filename) ? null : extra.filename.split('.')[0];
    const safeCustomName = isGenericStr(customName) ? null : customName;

    const candidateQuery = [safeCustomName, objectId, safeFilename].filter(Boolean).join(' ');
    const matchedKnown = candidateQuery ? matchKnownObject(candidateQuery) : null;
    if (matchedKnown) {
      return {
        status: 'success',
        source: 'local_matched',
        result: matchedKnown
      };
    }

    // 5. Intelligent STEM Synthesizer for arbitrary typed or detected name
    // NEVER use "WhatsApp Image" or device container names as the object name!
    const fallbackTarget = safeCustomName || safeFilename || 'Optical Instrument & Laboratory Tool';
    const synthesized = synthesizeCustomObjectSTEM(fallbackTarget);
    return {
      status: 'success',
      source: 'local_synthesized',
      result: synthesized
    };
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

  // 4. AI Tutor Socratic & MentorAI Engine
  async askTutor(question, language = 'en', options = {}) {
    // 1. Client-Side MentorAI (works directly on Vercel without backend dependency)
    try {
      const mentorResult = await queryMentorAI({
        question,
        language,
        grade: options.grade || 'Class 8-10',
        learningStyle: options.learningStyle || 'visual',
        persona: options.persona || 'kalam',
      });
      if (mentorResult && mentorResult.data) {
        return {
          status: 'success',
          answer: `${mentorResult.data.intuition}\n\n${mentorResult.data.explanation.join('\n')}`,
          lesson: mentorResult.data,
          mentor: 'MentorAI (Adaptive Socratic Teacher)',
        };
      }
    } catch (e) {
      console.warn('[api.askTutor] Client MentorAI fallback:', e);
    }

    // 2. Fallback to backend endpoint if online
    try {
      const res = await fetch(`${API_BASE}/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language, ...options }),
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
    const disc = (discipline || 'physics').toLowerCase();
    const fallbackSims = PHET_CATALOG[disc] || PHET_CATALOG.physics || [];

    try {
      const res = await fetch(`${API_BASE}/labs/phet/${disc}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success' && Array.isArray(data.simulations) && data.simulations.length > 0) {
          return data;
        }
      }
    } catch (err) {
      // Backend offline / Vercel deployment - seamlessly fallback to local verified catalog
    }

    return {
      status: 'success',
      source: 'local_verified_catalog',
      discipline: disc,
      count: fallbackSims.length,
      simulations: fallbackSims,
    };
  },

  async getPhetCatalog() {
    try {
      const res = await fetch(`${API_BASE}/labs/phet-catalog`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'success') return data;
      }
    } catch (err) {
      // fallback
    }

    return {
      status: 'success',
      source: 'local_verified_catalog',
      catalog: PHET_CATALOG,
    };
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
    const { subject = 'Biology', topic = 'Photosynthesis', grade = 'Class 7', isFirstPerson = false, characterName = '' } = params;

    // â”€â”€ 1. Try browser-side Gemini first (works on Vercel, fully real-time) â”€â”€
    if (browserGenAI) {
      try {
        const result = await generateStoryWithBrowserGemini({ subject, topic, grade, isFirstPerson, characterName });
        if (result && result.story) {
          console.log(`[StoryVerse] âœ… Browser Gemini generated story for "${topic}" using model: ${result.model}`);
          return result;
        }
      } catch (err) {
        console.warn('[StoryVerse] Browser Gemini failed, trying backend:', err.message);
      }
    }

    // â”€â”€ 2. Fallback to backend Express server (local dev) â”€â”€
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${API_BASE}/stories/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.story) {
          // Fix video: verify the backend-provided video URL works
          if (data.story.video_url) {
            const vid = data.story.video_url.split('/embed/')?.[1]?.split('?')?.[0];
            const ok = vid ? await verifyYouTubeId(vid) : false;
            if (!ok) {
              data.story.video_url = null;
              data.story.video_verified = false;
            } else {
              data.story.video_verified = true;
            }
          }
          data.story.video_search_url = youtubeSearchUrl(topic, subject);
          return data;
        }
      }
    } catch (err) {
      console.warn('[StoryVerse] Backend unavailable, using procedural generator:', err.message);
    }

    // â”€â”€ 3. Final offline procedural fallback â”€â”€
    const hero = characterName || (isFirstPerson ? 'You (The Young Scientist)' : 'Aria the Explorer');
    // Try catalog first for best video match
    const catalogMatch = CURATED_STORIES.find(s =>
      topic && (
        (s.topic || '').toLowerCase().includes(topic.toLowerCase().split(' ')[0]) ||
        (s.id || '').includes(topic.toLowerCase().replace(/\s+/g, '_').slice(0, 8))
      )
    );
    const catalogVideoId = catalogMatch?.video_url?.split('/embed/')?.[1]?.split('?')?.[0];

    const generated = {
      id: `ai_${Date.now()}`,
      title: `${topic}: The Great Discovery Quest`,
      subtitle: `An epic cartoon adventure exploring ${topic} in ${subject} for ${grade}!`,
      subject, topic, grade,
      cover_gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
      badge: 'AI Generated Adventure',
      accent_color: '#8b5cf6',
      is_first_person: Boolean(isFirstPerson),
      video_url: catalogVideoId ? `https://www.youtube.com/embed/${catalogVideoId}?rel=0&modestbranding=1` : null,
      video_id: catalogVideoId || null,
      video_verified: Boolean(catalogVideoId),
      video_search_url: youtubeSearchUrl(topic, subject),
      video_title: catalogMatch ? catalogMatch.video_title : `${topic} Educational Animation`,
      video_channel: catalogMatch ? catalogMatch.video_channel : 'Educational YouTube',
      video_description: `Animated cartoon explaining ${topic} for ${grade} students.`,
      ai_video_storyboard: [
        { scene: 1, title: `The Mystery of ${topic}`, camera_direction: `Establishing wide crane shot of the village science lab.`, visual_prompt: `Pixar 3D animation. ${hero} discovering ${topic}.`, dialogue: `Look! The laws of ${topic} are unfolding right before our eyes!`, duration_sec: 12 },
        { scene: 2, title: `Experimenting with ${topic}`, camera_direction: `Dynamic tracking shot through a lush rural environment.`, visual_prompt: `Animated particles demonstrating ${topic} with vivid colours.`, dialogue: `In nature, energy and matter are never lost â€” only transformed!`, duration_sec: 15 },
        { scene: 3, title: `Breakthrough!`, camera_direction: `Heroic low-angle rising shot with celebratory confetti.`, visual_prompt: `Cartoon cast celebrating victory using ${topic} to power the village school.`, dialogue: `We solved the challenge! Launch the simulation now!`, duration_sec: 14 }
      ],
      simulation_target: { type: 'phet', id: 'forces_motion', name: `PhET ${topic} Interactive Lab`, url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html', learning_hook: `Test the physical laws of ${topic} directly!` },
      characters: [
        { name: hero, role: isFirstPerson ? 'You (Main Protagonist)' : 'Lead Adventurer', avatar: 'ðŸ§‘â€ðŸ”¬', personality: 'Curious and determined' },
        { name: 'Dr. Vidya', role: 'Chief Scientist', avatar: 'ðŸ¤–', personality: 'Knowledgeable and supportive AI guide' }
      ],
      learning_objectives: [
        `Understand the fundamental mechanisms of ${topic}`,
        `Connect textbook science to everyday village machines and natural phenomena`,
        `Apply scientific problem-solving logic at interactive checkpoints`
      ],
      scenes: [
        { scene_number: 1, title: `The Awakening of ${topic}`, background_type: 'laboratory', character_speaking: hero, character_action: 'explore', narration: `Inside the VidyaVerse mobile laboratory, readings for ${topic} suddenly burst into action!`, dialogue: `If we understand how ${topic} operates in nature, we can unlock solutions for our village!`, decision_point: { has_decision: true, prompt: `To investigate ${topic} scientifically, what is the best first step?`, options: [ { id: 'A', text: 'Careful observation, hypothesis, and gathering data', is_correct: true, feedback: 'Spot on! Real science starts with observation and testable hypotheses!' }, { id: 'B', text: 'Guessing without testing', is_correct: false, feedback: 'Science relies on systematic evidence.' }, { id: 'C', text: 'Ignoring anomalies', is_correct: false, feedback: 'Anomalies often lead to great discoveries!' } ] } },
        { scene_number: 2, title: `Field Experiment`, background_type: 'forest', character_speaking: 'Dr. Vidya', character_action: 'experiment', narration: `Out in the field, natural elements demonstrate ${topic} in real life!`, dialogue: `Universal conservation laws govern every process in nature!`, decision_point: { has_decision: true, prompt: `What happens to energy in an isolated system studying ${topic}?`, options: [ { id: 'A', text: 'Energy is conserved â€” only transformed', is_correct: true, feedback: 'Brilliant! The Law of Conservation of Energy holds!' }, { id: 'B', text: 'Energy vanishes', is_correct: false, feedback: 'Energy turns into heat but never disappears.' }, { id: 'C', text: 'Energy doubles', is_correct: false, feedback: 'Perpetual motion machines cannot exist.' } ] } },
        { scene_number: 3, title: `The Triumph`, background_type: 'future_city', character_speaking: hero, character_action: 'celebrate', narration: `Applying ${topic} principles, the team powers up the village school!`, dialogue: `Let's launch the interactive simulation to verify our findings!`, decision_point: { has_decision: true, prompt: `How is ${topic} applied in real life?`, options: [ { id: 'A', text: 'Through real-world machines and natural processes', is_correct: true, feedback: 'Exactly right!' }, { id: 'B', text: 'Only in textbooks', is_correct: false, feedback: 'Science is everywhere!' }, { id: 'C', text: 'Only in labs', is_correct: false, feedback: 'Nature is the greatest lab.' } ] } }
      ],
      mini_challenge: { title: `${topic} Concept Connector`, instruction: `Connect ${topic} principles to real-world applications!`, inputs: [`Observation of ${topic}`, 'Hypothesis Testing'], outputs: ['Empirical Proof', 'Simulation Access'] },
      quiz: [
        { question: `What is the primary principle underlying ${topic}?`, options: ['A) Conservation laws and cause-and-effect', 'B) Random chance', 'C) Magic', 'D) Memorization'], correct_index: 0, explanation: `${topic} is governed by empirical, verifiable natural laws.` },
        { question: `How can students best observe ${topic}?`, options: ['A) Through everyday village objects and experiments', 'B) Only in university labs', 'C) Only on TV', 'D) It cannot be observed'], correct_index: 0, explanation: 'Household objects are living laboratories!' },
        { question: `After the story lesson, what is the best next step?`, options: ['A) Run interactive PhET simulations', 'B) Forget the topic', 'C) Skip practice', 'D) Close the browser'], correct_index: 0, explanation: 'Simulations let you test boundary conditions and verify theory.' }
      ]
    };

    return { status: 'success', source: 'offline_procedural', story: generated };
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

  // 12. Twilio Parent Notification Service (WhatsApp & SMS)
  async sendParentReport(reportPayload) {
    try {
      const res = await fetch(`${API_BASE}/notifications/parent-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        return await res.json();
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson) return errJson;
      }
    } catch (err) {
      console.warn('[API] Parent notification backend error:', err.message);
    }

    // Direct fallback: Generate WhatsApp Click-to-Chat URL directly
    const student = reportPayload.studentName || 'Student';
    const score = reportPayload.assessmentScore || 0;
    const total = reportPayload.totalQuestions || 40;
    const pct = reportPayload.percentage || 0;
    const streak = reportPayload.streak || 1;
    const badges = (reportPayload.badges || []).length;
    const phone = (reportPayload.parentPhone || '').replace(/\D/g, '');

    const message = `🎓 *VidyaVerse - Weekly Student Performance Report* 🚀\n\n` +
      `Dear Parent, here is the weekly learning report for *${student}* (${reportPayload.grade || 'Class 9'}):\n\n` +
      `📊 *Score:* ${score}/${total} (${pct}%)\n` +
      `🎯 *Career Match:* ${reportPayload.careerTrack?.title || 'STEM Applied Sciences'}\n` +
      `🔥 *Streak:* ${streak} Days Active\n` +
      `🏆 *Badges:* ${badges} Badges Earned\n\n` +
      `📱 *VidyaVerse Student Portal*`;

    return {
      status: 'offline_fallback',
      message: 'VidyaVerse backend was not reached. Please use direct WhatsApp Click-to-Chat.',
      data: {
        parentPhone: phone,
        reportMessage: message,
        directWhatsAppUrl: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        whatsapp: { sent: false, error: 'Backend offline or unreachable. Click "Send Directly via WhatsApp" below.' },
        sms: { sent: false, error: 'Backend offline or unreachable.' }
      }
    };
  },
};
