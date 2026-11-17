import express from 'express';
import { broadcastEvent } from '../realtime/broadcast.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const answerKnowledgeBase = {
  pump_hot: {
    patterns: ['pump', 'hot', 'bicycle pump', 'cycle pump', 'heat'],
    answer: 'When you rapidly pump air into a tire, you perform mechanical work on the gas molecules. According to the First Law of Thermodynamics (Adiabatic Compression), this mechanical compression increases the kinetic energy of air molecules, converting it into thermal energy that warms the metal barrel!',
    translations: {
      kn: 'ಗಾಳಿಯನ್ನು ಸಂಕುಚಿತಗೊಳಿಸಿದಾಗ ಯಾಂತ್ರಿಕ ಕೆಲಸವು ಅಣುಗಳ ಆಂತರಿಕ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಿ ಶಾಖವಾಗಿ ಬದಲಾಗುತ್ತದೆ (ಥರ್ಮೋಡೈನಾಮಿಕ್ಸ್ ನಿಯಮ).',
      hi: 'हवा को तेजी से संपीड़ित करने पर यांत्रिक कार्य ऊष्मा ऊर्जा में परिवर्तित होता है, जिससे पंप गर्म हो जाता है।',
      te: 'గాలిని వేగంగా కుదించినప్పుడు యాంత్రిక శక్తి ఉష్ణ శక్తిగా మారుతుంది.',
      ta: 'காற்றை அழுத்தும்போது இயந்திர ஆற்றல் வெப்ப ஆற்றலாக மாறுகிறது.',
      mr: 'हवा दाबल्यामुळे यांत्रिक ऊर्जेचे रूपांतर उष्णतेमध्ये होते.',
    },
  },
  sky_blue: {
    patterns: ['sky', 'blue', 'sunset', 'orange', 'red sky'],
    answer: 'Rayleigh Scattering! Sunlight contains all spectral colors. Blue light has a shorter wavelength (~450nm) and scatters strongly when striking tiny nitrogen and oxygen molecules in our atmosphere. At sunset, the sunlight passes through 10x more atmosphere, filtering out all blue light and leaving only longer red/orange wavelengths.',
    translations: {
      kn: 'ರೇಲೀ ಸ್ಕ್ಯಾಟರಿಂಗ್! ನೀಲಿ ಬೆಳಕಿನ ಕಡಿಮೆ ತರಂಗಾಂತರದಿಂದಾಗಿ ಅದು ವಾತಾವರಣದ ಅಣುಗಳಿಂದ ಎಲ್ಲಾ ದಿಕ್ಕುಗಳಲ್ಲಿ ಹರಡುತ್ತದೆ.',
      hi: 'रेले प्रकीर्णन! नीले प्रकाश की छोटी तरंग दैर्ध्य वायुमंडलीय गैसों द्वारा सबसे ज्यादा बिखरती है।',
      te: 'నీలి రంగు కాంతి తక్కువ తరంగదైర్ఘ్యం కలిగి ఉండటం వల్ల ఎక్కువగా చెల్లాచెదురవుతుంది.',
      ta: 'நீல ஒளியின் அலைநீளம் குறைவு என்பதால் அது வளிமண்டலத்தில் அதிகமாக சிதறடிக்கப்படுகிறது.',
      mr: 'कमी तरंगलांबीमुळे निळा प्रकाश वातावरणात सर्वाधिक विखुरला जातो.',
    },
  },
  ice_float: {
    patterns: ['ice', 'float', 'water', 'sink'],
    answer: 'Anomalous expansion of water! Between 4°C and 0°C, water expands instead of contracting as hydrogen bonds crystallize into an open hexagonal lattice. This makes ice roughly 9% less dense than liquid water, allowing ponds to freeze only at the surface so village fish survive winter underneath!',
    translations: {
      kn: 'ನೀರಿನ ಅಸಹಜ ವಿಕಸನ! 4 ಡಿಗ್ರಿಗಿಂತ ಕಡಿಮೆ ಉಷ್ಣತೆಯಲ್ಲಿ ಮಂಜುಗಡ್ಡೆಯ ಸಾಂದ್ರತೆಯು ನೀರಿಗಿಂತ 9% ಕಡಿಮೆಯಾಗಿ ತೇಲುತ್ತದೆ.',
      hi: 'पानी का असामान्य प्रसार! बर्फ का घनत्व तरल पानी से 9% कम होता है, इसलिए वह तैरती है।',
      te: 'మంచు సాంద్రత నీటి కంటే తక్కువగా ఉండటం వల్ల అది నీటిపై తేలుతుంది.',
      ta: 'பனிக்கட்டியின் அடர்த்தி நீரை விட குறைவு என்பதால் அது மிதக்கிறது.',
      mr: 'बर्फाची घनता पाण्यापेक्षा कमी असल्यामुळे बर्फ पाण्यावर तरंगतो.',
    },
  },
};


const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Safe JSON extractor
function extractJson(text) {
  if (!text) return null;
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}
  const stripped = trimmed.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(stripped); } catch {}
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(stripped.slice(firstBrace, lastBrace + 1)); } catch {}
  }
  return null;
}

// 1. ASK DR. APJ MENTOR (Socratic Doubt Resolution with Multimodal AI)
router.post('/ask', async (req, res) => {
  const {
    question = '',
    language = 'en',
    studentGrade = 'Class 8-10',
    learningStyle = 'visual',
    persona = 'kalam',
  } = req.body;
  const qLower = question.toLowerCase();

  let matched = null;
  for (const key of Object.keys(answerKnowledgeBase)) {
    const entry = answerKnowledgeBase[key];
    if (entry.patterns.some((p) => qLower.includes(p))) {
      matched = entry;
      break;
    }
  }

  let aiLesson = null;
  if (genAI) {
    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    const prompt = `You are "MentorAI", an advanced Socratic STEM Teacher for Indian students (Grade: ${studentGrade}, Language: ${language}, Style: ${learningStyle}).
Student asks: "${question}".
Return strictly valid raw JSON only (no markdown code blocks):
{
  "concept": "Concept Name",
  "subject": "Physics | Chemistry | Biology | Mathematics",
  "intuition": "2 engaging sentences introducing the real-world observation.",
  "explanation": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "visualSchematic": "ASCII visual schematic",
  "misconception": { "myth": "Common myth", "reality": "Scientific truth" },
  "diyExperiment": { "title": "Home Experiment", "items": ["Item 1"], "steps": ["Step 1", "Step 2"] },
  "checkQuestion": {
    "question": "Concept check question",
    "options": [
      { "text": "A) ...", "correct": false, "feedback": "..." },
      { "text": "B) ...", "correct": true, "feedback": "..." }
    ]
  }
}`;

    for (const m of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(prompt);
        const text = result?.response?.text()?.trim();
        const parsed = extractJson(text);
        if (parsed && parsed.concept && parsed.explanation) {
          aiLesson = parsed;
          break;
        }
      } catch (e) {
        console.warn(`[Backend Tutor] Model ${m} error:`, e.message);
      }
    }
  }

  let finalAnswer = '';
  if (aiLesson) {
    finalAnswer = `${aiLesson.intuition}\n\n${aiLesson.explanation.join('\n')}`;
  } else if (matched) {
    if (language !== 'en' && matched.translations[language]) {
      finalAnswer = `${matched.translations[language]} (English: ${matched.answer})`;
    } else {
      finalAnswer = matched.answer;
    }
  } else {
    finalAnswer = `Dr. APJ Mentor Guidance for "${question}":\n` +
      `1. Observe the natural forces and energy involved.\n` +
      `2. By the Law of Conservation of Energy, energy cannot be created or destroyed, only transformed.\n` +
      `3. Look around your home or village: Have you observed this in a bicycle, cooker, or water well?`;
  }

  // Broadcast question to real-time teacher monitor
  broadcastEvent('TUTOR_DOUBT_ASKED', {
    question,
    language,
    concept: aiLesson?.concept || matched?.patterns?.[0] || 'General Science',
    timestamp: new Date().toISOString(),
  });

  res.json({
    status: 'success',
    question,
    language,
    answer: finalAnswer,
    lesson: aiLesson,
    mentor: 'MentorAI (Socratic & Empirical Teacher)',
  });
});

export default router;
