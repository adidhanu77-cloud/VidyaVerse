import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { broadcastEvent } from '../realtime/broadcast.js';
import { DETAILED_OBJECTS, matchKnownObject, synthesizeCustomObjectSTEM } from '../../src/data/scannerKnowledge.js';
import 'dotenv/config';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 1. GET ALL REGISTERED FLAGSHIP OBJECTS
router.get('/objects', (req, res) => {
  res.json({
    status: 'success',
    count: Object.keys(DETAILED_OBJECTS).length,
    data: Object.values(DETAILED_OBJECTS),
  });
});

// 2. SCAN & ANALYZE AN OBJECT IN REAL TIME VIA GEMINI VISION OR KNOWLEDGE ENGINE
router.post('/scan', async (req, res) => {
  const {
    objectId,
    customName,
    language = 'en',
    imageFrame = null,
    mediaType = 'camera',
    filename = null,
    pinpoint = null,
  } = req.body;

  let matched = null;

  // Step 1: Direct objectId match
  if (objectId && DETAILED_OBJECTS[objectId]) {
    matched = DETAILED_OBJECTS[objectId];
  }

  // Step 2: If image frame provided and Gemini API key is configured, run Gemini Vision
  if (!matched && imageFrame && process.env.GEMINI_API_KEY) {
    try {
      const mimeType = imageFrame.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      const cleanBase64 = imageFrame.includes(',') ? imageFrame.split(',')[1] : imageFrame;

      const pinpointText = pinpoint
        ? `Focus targeting at relative coordinates [X: ${pinpoint.x}%, Y: ${pinpoint.y}%].`
        : 'Focus on the primary physical object in the center.';

      const prompt = `Identify the exact real-world object in this photo. ${pinpointText}
Never say "Captured Object" or use generic placeholders.
Return strictly valid raw JSON only:
{
  "id": "slug_name",
  "name": "Exact Object Name",
  "icon": "A single representative emoji",
  "category": "Scientific Category (e.g. Optics & Refraction, Classical Mechanics & Levers, Fluid Dynamics, Electromagnetism, Thermodynamics, etc.)",
  "summary": "2-3 sentences explaining the real-world scientific mechanism of this exact object.",
  "mechanism": {
    "step1_activation": "Step 1: Real initial physical action",
    "step2_transmission": "Step 2: Real energy or mechanical transmission",
    "step3_core_principle": "Step 3: Primary scientific law",
    "step4_output": "Step 4: Functional result",
    "step5_regulation": "Step 5: System balance/safety"
  },
  "stem": {
    "physics": "Real physical laws, forces, and equations.",
    "math": "Real mathematical formulas or calculations.",
    "chemistry": "Real material science, alloys, polymers.",
    "biology": "Human ergonomics, sensory, or biomechanics."
  },
  "arPoints": [
    { "top": "25%", "left": "45%", "label": "Component 1: Physical purpose" },
    { "top": "50%", "left": "50%", "label": "Component 2: Active mechanism" },
    { "top": "75%", "left": "55%", "label": "Component 3: Base / stability" }
  ],
  "experiment": {
    "title": "Hands-On Student Test",
    "items": ["Item 1", "Item 2"],
    "steps": ["Step 1", "Step 2", "Conclusion"]
  },
  "audioText": {
    "en": "English spoken explanation.",
    "hi": "Hindi spoken explanation.",
    "kn": "Kannada spoken explanation.",
    "te": "Telugu spoken explanation.",
    "ta": "Tamil spoken explanation.",
    "mr": "Marathi spoken explanation."
  },
  "stats": {
    "primaryMaterial": "Material",
    "governingPrinciple": "Scientific law",
    "typicalMetric": "Empirical metric"
  }
}`;

      const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      for (const m of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: m });
          const result = await model.generateContent([
            prompt,
            { inlineData: { data: cleanBase64, mimeType } },
          ]);
          const text = result.response.text().trim();
          let parsed = null;
          try {
            parsed = JSON.parse(text);
          } catch {
            const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const firstBrace = stripped.indexOf('{');
            const lastBrace = stripped.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
              try {
                parsed = JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
              } catch {}
            }
          }

          if (parsed && parsed.name && (parsed.mechanism || parsed.summary)) {
            const known = matchKnownObject(parsed.name) || matchKnownObject(parsed.id);
            if (known) {
              parsed.audioText = { ...known.audioText, ...parsed.audioText };
              if (!parsed.icon || parsed.icon === '🔍') parsed.icon = known.icon;
            }
            matched = parsed;
            break;
          }
        } catch (innerErr) {
          console.warn(`[Backend Scanner Vision] Model ${m} error:`, innerErr.message);
        }
      }
    } catch (e) {
      console.warn('[Backend Scanner Vision] Error:', e.message);
    }
  }

  // Step 3: Check keyword / alias match from customName or filename (sanitizing generic filenames like WhatsApp Image)
  const isGeneric = (str) => !str || /whatsapp|screenshot|img_|image|pxl_|photo|camera|capture|frame|scanned/i.test(str);
  const safeFilename = isGeneric(filename) ? null : filename.split('.')[0];
  const safeCustomName = isGeneric(customName) ? null : customName;

  if (!matched) {
    const candidateQuery = [safeCustomName, objectId, safeFilename].filter(Boolean).join(' ');
    if (candidateQuery) {
      matched = matchKnownObject(candidateQuery);
    }
  }

  // Step 4: Intelligent STEM Synthesizer for arbitrary uncataloged object
  if (!matched) {
    const targetName = safeCustomName || safeFilename || 'Optical Instrument & Laboratory Tool';
    matched = synthesizeCustomObjectSTEM(targetName);
  }

  // Broadcast real-time scan event to classroom monitor
  broadcastEvent('REALTIME_SCAN_EVENT', {
    objectId: matched.id,
    name: matched.name,
    category: matched.category,
    mediaType,
    hasLiveCameraFrame: Boolean(imageFrame),
    timestamp: new Date().toISOString(),
  });

  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    result: matched,
  });
});

export default router;
