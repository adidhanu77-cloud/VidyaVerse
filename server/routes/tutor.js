import express from 'express';
import { broadcastEvent } from '../realtime/broadcast.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
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

// Call Gemini active models with automated fallback
async function generateGeminiJson(prompt) {
  if (!genAI) return null;
  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text()?.trim();
      const parsed = extractJson(text);
      if (parsed) return parsed;
    } catch (e) {
      console.warn(`[Backend Tutor] Model ${m} error:`, e.message);
    }
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────────
   GRADE-STRATIFIED VERIFIED KNOWLEDGE REGISTRY
   Class 6-8 (Foundational) | Class 9-10 (Secondary) | Class 11-12 (Advanced)
   ────────────────────────────────────────────────────────────────── */
const GRADE_MISCONCEPTIONS = {
  'Class 6-8': [
    {
      concept: 'Plant Nutrition',
      myth: 'Plants eat soil with their roots just like animals eat food.',
      fact: 'Roots only absorb water and trace minerals! Plants create 100% of their actual food (glucose sugar) in green leaves by harvesting sunlight and airborne CO2.',
      key: 'plant_food_sunlight',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
    {
      concept: 'Floating & Sinking',
      myth: 'Heavy things always sink and light things always float.',
      fact: 'A 100,000-ton steel cargo ship floats easily, while a tiny 2-gram pebble sinks! Floating depends on density (mass/volume) and buoyant force, not total weight.',
      key: 'density_buoyancy',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
    {
      concept: 'Seasons & Sunlight',
      myth: 'Summer happens because Earth is closer to the Sun in July.',
      fact: 'Earth is actually farthest from the Sun in July! Seasons occur purely because Earth’s 23.5° axis tilt directs more direct, concentrated sunbeams onto your hemisphere.',
      key: 'earth_tilt_seasons',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
    {
      concept: 'Magnetism of Metals',
      myth: 'All shiny metals like aluminum foil, copper wires, and brass keys are magnetic.',
      fact: 'Only ferromagnetic metals (iron, nickel, cobalt) attract to magnets! Aluminum, copper, brass, gold, and silver have zero magnetic attraction.',
      key: 'ferromagnetism_basics',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
    {
      concept: 'States of Matter',
      myth: 'Boiling water and steam disappear from the universe when they evaporate.',
      fact: 'Mass is 100% conserved! Liquid water simply breaks apart into invisible gaseous H2O molecules floating in the air, which later condense into clouds and rain.',
      key: 'water_cycle_conservation',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
    {
      concept: 'Air & Pressure',
      myth: 'Air is empty nothingness with zero weight.',
      fact: 'Air has real mass! 1 cubic meter of atmospheric air weighs ~1.2 kilograms. The air inside your classroom weighs over 200 kilograms pushing down on you.',
      key: 'air_mass_pressure',
      grade: 'Class 6-8',
      difficulty: 'Foundational',
    },
  ],

  'Class 9-10': [
    {
      concept: 'Gravity in Free Fall',
      myth: 'Astronauts float aboard the ISS because there is zero gravity in space.',
      fact: 'Earth’s gravity at ISS orbit (400 km) is still 90% as strong as at sea level! Astronauts float because both they and the station are in perpetual free fall around Earth at 28,000 km/h.',
      key: 'gravity_free_fall',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Adiabatic Compression',
      myth: 'A bicycle pump heats up purely from mechanical friction of the rubber piston seal.',
      fact: 'Friction accounts for less than 15% of the warmth! The primary heating (>85%) comes from thermodynamic adiabatic gas compression — mechanical work W increases the internal kinetic energy of air molecules.',
      key: 'pump_compression',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Electric Current & Charges',
      myth: 'Electric current gets "used up" or consumed as it passes through a filament light bulb.',
      fact: 'Every single electron that enters a bulb exits the other side! Current (charge per second, I = Q/t) is identical everywhere in a series loop. Only potential energy (voltage, V) is transformed into light and heat.',
      key: 'current_conservation_kirchhoff',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Friction & Direction',
      myth: 'Friction always opposes motion and can never make an object move forward.',
      fact: 'Friction is the exact force that propels you and your bicycle forward! When your foot or tire pushes backward against the road, static friction pushes you forward following Newton’s 3rd Law.',
      key: 'static_friction_propulsion',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Anomalous Water Expansion',
      myth: 'Ice floats because air bubbles are trapped inside during freezing.',
      fact: 'Even 100% pure, de-aerated, bubble-free ice floats! Polar hydrogen bonds form an open hexagonal crystal lattice between 4°C and 0°C, increasing volume by 9% and lowering density to 0.92 g/cm³.',
      key: 'ice_floating',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Acids, Bases & Ions',
      myth: 'Acids contain only H+ ions and have absolutely zero OH- hydroxide ions.',
      fact: 'Due to the autoionization equilibrium of water (Kw = [H+][OH-] = 10^-14 at 25°C), every acidic solution contains OH- ions, just at a concentration lower than 10^-7 M.',
      key: 'acid_base_equilibrium',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
  ],

  'Class 11-12': [
    {
      concept: 'Centrifugal Force & Frames',
      myth: 'Centrifugal force is a real fundamental inward or outward force of nature.',
      fact: 'Centrifugal force is a fictitious pseudo-force that appears only when writing equations in a non-inertial rotating reference frame (-m·ω²r). In an inertial frame, only inward centripetal force (mv²/r) exists.',
      key: 'non_inertial_frames',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
    {
      concept: 'Thermodynamics & Adiabatic Law',
      myth: 'In an adiabatic gas expansion, temperature must remain constant because heat exchange Q = 0.',
      fact: 'Since Q = 0, the First Law ΔU = -W proves that when expanding gas does positive work (W > 0), internal energy must drop (ΔU < 0)! Temperature plummets following T·V^(γ-1) = constant.',
      key: 'adiabatic_reversibility',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
    {
      concept: 'Conservative Forces & Work',
      myth: 'The net work done on a particle moving along any closed path is always zero.',
      fact: 'Work over a closed loop ∮ F · dr = 0 holds ONLY for conservative forces (gravity, electrostatic)! For non-conservative forces like friction or magnetic induced emf, ∮ F · dr = -E_dissipated ≠ 0.',
      key: 'conservative_fields_path_independence',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
    {
      concept: 'Wave-Particle Duality & Photons',
      myth: 'Increasing the intensity of light in the photoelectric effect increases the kinetic energy of emitted photoelectrons.',
      fact: 'Higher intensity only increases the photon flux (number of photoelectrons emitted per second)! Maximum kinetic energy K_max = hν - Φ depends strictly on photon frequency ν, not light intensity (Einstein 1905).',
      key: 'photoelectric_einstein_equation',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
    {
      concept: 'Electromagnetic Induction & Lenz’s Law',
      myth: 'Induced electromotive force (emf) is caused by a magnetic field, so a stronger static magnet produces higher voltage.',
      fact: 'A colossal static 100 Tesla magnetic field produces ZERO induced emf! Faraday’s Law proves emf ε = -dΦ/dt depends solely on the time rate of change of magnetic flux, not field strength magnitude.',
      key: 'faraday_flux_change_rate',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
    {
      concept: 'Rotational Angular Momentum',
      myth: 'A spinning figure skater speeds up their rotation because external torque increases.',
      fact: 'External torque is strictly zero (τ_ext = 0)! Total angular momentum L = I·ω is conserved. Tucking arms reduces the rotational moment of inertia I, forcing angular velocity ω to increase proportionally.',
      key: 'angular_momentum_conservation',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
  ],
};

const GRADE_EXPERIMENTS = {
  'Class 6-8': [
    {
      id: 'lemon_battery_cell',
      title: 'Juicy Lemon Voltage Generator',
      subject: 'Physics & Chemistry',
      grade: 'Class 6-8',
      difficulty: 'Foundational Discovery',
      items: ['1 fresh lemon', '1 copper coin or wire', '1 galvanized zinc iron nail', '1 small 1.5V LED or multimeter'],
      steps: [
        'Roll the lemon firmly on the table with your palm to release inner citric juice without breaking the peel.',
        'Insert the copper coin into one side of the lemon and the galvanized zinc nail 2 cm away.',
        'Touch the LED terminal leads to the copper (+) and zinc (-) electrodes: The LED glows with ~0.9V generated by chemical redox!',
      ],
      principle: 'Citric acid acts as an electrolyte. Zinc oxidizes (Zn → Zn2+ + 2e-), driving electrons through the external circuit to copper.',
    },
    {
      id: 'leaf_transpiration_bag',
      title: 'Hidden Tree Perspiration Trap',
      subject: 'Biology',
      grade: 'Class 6-8',
      difficulty: 'Foundational Discovery',
      items: ['1 transparent plastic ziplock bag', '1 rubber band', 'A sunny outdoor plant leaf'],
      steps: [
        'Wrap a clear plastic bag tightly around a cluster of green leaves on a living plant and seal it with a rubber band.',
        'Leave it in bright sunshine for 2 hours.',
        'Observe: The inside of the bag forms hundreds of clear water droplets! This proves leaves continuously exhale water vapor via stomata.',
      ],
      principle: 'Transpiration creates negative suction pressure that pulls water and soil minerals 30 meters up to tree canopies.',
    },
    {
      id: 'balloon_electrostatic_bend',
      title: 'Bending Water with Electrostatic Magic',
      subject: 'Physics',
      grade: 'Class 6-8',
      difficulty: 'Foundational Discovery',
      items: ['1 rubber balloon', 'Clean dry wool sweater or hair', 'Kitchen water tap'],
      steps: [
        'Turn on a tap so a very thin, smooth, unbroken stream of water flows down.',
        'Rub an inflated rubber balloon against dry hair or wool for 20 seconds to load it with static negative electrons.',
        'Bring the balloon within 2 cm of the water stream: The water bends sharply towards the balloon without touching it!',
      ],
      principle: 'Water molecules are polar dipoles. The charged balloon induces an opposite surface charge on the stream, exerting electrostatic attraction (Coulomb’s Law).',
    },
  ],

  'Class 9-10': [
    {
      id: 'snell_law_refraction_slab',
      title: 'Snell’s Law Optical Refraction & Index Calculation',
      subject: 'Physics (Optics)',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Board Practical',
      items: ['1 rectangular glass slab or clear container of water', 'Laser pointer or pins', 'Protractor & ruler', 'White paper'],
      steps: [
        'Trace the glass slab boundary on paper. Direct a red laser beam at incident angle i = 45° to the normal.',
        'Mark the entry point, refracted path inside the glass, and emergent ray exit point.',
        'Measure the angle of refraction r with a protractor. Calculate n = sin(i) / sin(r): You will get n ≈ 1.50 for glass!',
      ],
      principle: 'Snell’s Law: n1·sin(θ1) = n2·sin(θ2). Light slows down from 3×10^8 m/s in air to 2×10^8 m/s in glass, bending towards the normal.',
    },
    {
      id: 'neutralization_turmeric_titration',
      title: 'Natural Turmeric Indicator & Acid-Base Titration',
      subject: 'Chemistry',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Board Practical',
      items: ['1 teaspoon kitchen turmeric powder', 'Water & white paper strips', 'Lemon juice (citric acid)', 'Detergent powder or baking soda (base)'],
      steps: [
        'Dip white paper strips into turmeric water and let dry to make natural curcumin indicator paper.',
        'Brush detergent soap solution on the strip: It turns bright blood red (curcumin changes color at pH > 8.5)!',
        'Now drop fresh lemon juice onto the red spot: The acidic H+ ions neutralize the alkali and restore the bright golden yellow color!',
      ],
      principle: 'Acid-base neutralization: H+ + OH- → H2O. Natural curcumin dye changes molecular tautomer conformation based on hydrogen ion concentration.',
    },
    {
      id: 'galileo_free_fall_drag_shield',
      title: 'Galileo Equivalence Drop & Air Drag Shielding',
      subject: 'Physics (Mechanics)',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Board Practical',
      items: ['1 heavy textbook', '1 sheet of paper trimmed slightly smaller than the book cover'],
      steps: [
        'Drop the textbook and sheet of paper separately from 1.5 meters height. The textbook hits first due to aerodynamic drag on paper.',
        'Now place the paper flat on top of the book cover without any edges overlapping.',
        'Release both together: The paper stays glued to the book cover and both strike the floor at the exact same millisecond!',
      ],
      principle: 'Equivalence Principle: Gravitational acceleration a = F/m = (G·M·m/r²)/m = g is independent of mass when air drag is removed.',
    },
  ],

  'Class 11-12': [
    {
      id: 'capillary_surface_tension_radius',
      title: 'Capillary Tube Rise & Surface Tension Derivation',
      subject: 'Physics (Fluid Mechanics)',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET Rigor',
      items: ['Glass capillary tube (inner radius r ≈ 0.5 mm)', 'Clear water with food coloring', 'Millimeter ruler', 'Magnifier'],
      steps: [
        'Clean the capillary tube thoroughly with alcohol to ensure zero contact angle (θ ≈ 0° for clean glass-water interface).',
        'Dip the capillary tube vertically into colored water. Measure the vertical equilibrium meniscus height h in millimeters.',
        'Calculate liquid surface tension T using Jurin’s Law: T = (h · ρ · g · r) / (2 · cos θ). Verify against standard water value T ≈ 0.0728 N/m at 20°C!',
      ],
      principle: 'Jurin’s Law: Laplace pressure deficit ΔP = 2T/r across the curved meniscus pulls liquid upward until balanced by hydrostatic head ρgh.',
    },
    {
      id: 'restitution_coefficient_ball_drop',
      title: 'Coefficient of Restitution (e) & Kinetic Energy Loss',
      subject: 'Physics (Rotational & Collision Dynamics)',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET Rigor',
      items: ['Steel ball bearing or hard tennis ball', 'Meter scale / phone camera slow-motion video at 120 fps', 'Solid concrete or steel floor'],
      steps: [
        'Drop the ball from known initial height h1 = 1.00 meter onto concrete without imparting initial velocity.',
        'Record the bounce on slow-motion video against the vertical ruler to capture peak rebound height h2.',
        'Calculate Coefficient of Restitution e = √(h2 / h1). Calculate percentage fractional mechanical energy lost to heat: ΔE/E1 = 1 - e².',
      ],
      principle: 'Newton’s Law of Restitution: e = (v2 - v1) / (u1 - u2). Fractional mechanical energy dissipation transforms into acoustic and internal vibrational lattice modes.',
    },
    {
      id: 'spectrophotometer_beer_lambert',
      title: 'Smartphone Photometer & Beer-Lambert Law Verification',
      subject: 'Chemistry & Modern Physics',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET Rigor',
      items: ['5 cuvettes or identical clear glass vials', 'Copper sulfate (CuSO4) or food dye', 'Smartphone light meter lux app', 'Monochromatic LED light'],
      steps: [
        'Prepare 5 serial dilutions of known molar concentration C: 0.02M, 0.04M, 0.06M, 0.08M, 0.10M.',
        'Shine constant LED light through each cuvette (path length l = 1 cm) onto the smartphone ambient light sensor to measure transmitted intensity I.',
        'Plot Absorbance A = log10(I0 / I) versus concentration C: A perfectly straight linear line verifies Beer-Lambert Law A = ε · l · C!',
      ],
      principle: 'Beer-Lambert Law: Differential photon absorption dI/dx = -α·C·I integrates to exponential decay I = I0 · 10^(-ε·l·C).',
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   1. ENDPOINT: ASK SOCRATIC MENTOR (Dynamic Real-Time Response)
   ────────────────────────────────────────────────────────────────── */
router.post('/ask', async (req, res) => {
  const {
    question = '',
    language = 'en',
    studentGrade = 'Class 8-10',
    learningStyle = 'visual',
    persona = 'kalam',
  } = req.body;

  const prompt = `You are "MentorAI", an advanced Socratic STEM Teacher for Indian students.
Target Grade Level: ${studentGrade}
Target Difficulty: ${studentGrade.includes('11') || studentGrade.includes('12') ? 'Advanced / JEE / NEET' : studentGrade.includes('9') || studentGrade.includes('10') ? 'Secondary / Boards' : 'Foundational'}
Learning Style: ${learningStyle}
Language: ${language}
Question: "${question}"

CRITICAL RULES:
- Calibrate the difficulty of the explanation and quiz to ${studentGrade}!
- For Class 6-8: Keep it intuitive, fun, qualitative with daily life analogies.
- For Class 9-10: Include exact NCERT laws, mechanisms, and board-level concepts.
- For Class 11-12: Include mathematical formulas, SI units, thermodynamic/calculus derivations, and competitive exam depth.
- Return strictly valid raw JSON only (no markdown code blocks):
{
  "concept": "Concept Title",
  "subject": "Physics | Chemistry | Biology | Mathematics",
  "grade": "${studentGrade}",
  "difficulty": "${studentGrade.includes('11') ? 'Advanced' : studentGrade.includes('9') ? 'Secondary' : 'Foundational'}",
  "intuition": "2 engaging sentences introducing the real-world observation.",
  "explanation": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "visualSchematic": "ASCII visual schematic",
  "misconception": { "myth": "Grade-appropriate misconception", "reality": "Scientific truth" },
  "diyExperiment": { "title": "Experiment Title", "items": ["Item 1", "Item 2"], "steps": ["Step 1", "Step 2", "Conclusion"] },
  "checkQuestion": {
    "question": "A smart conceptual question tailored to ${studentGrade}",
    "options": [
      { "text": "A) ...", "correct": false, "feedback": "..." },
      { "text": "B) ...", "correct": true, "feedback": "..." },
      { "text": "C) ...", "correct": false, "feedback": "..." }
    ]
  },
  "connections": {
    "labId": "labs",
    "labTitle": "Matching PhET Virtual Lab",
    "scannerId": "cooker",
    "scannerTitle": "Matching Object Scanner Item",
    "storyTopic": "Story Topic"
  }
}`;

  let aiLesson = await generateGeminiJson(prompt);

  // Broadcast question to real-time teacher monitor
  broadcastEvent('TUTOR_DOUBT_ASKED', {
    question,
    language,
    grade: studentGrade,
    concept: aiLesson?.concept || 'General STEM',
    timestamp: new Date().toISOString(),
  });

  res.json({
    status: 'success',
    question,
    language,
    grade: studentGrade,
    lesson: aiLesson,
    answer: aiLesson ? `${aiLesson.intuition}\n\n${aiLesson.explanation.join('\n')}` : null,
    mentor: 'MentorAI (Socratic & Empirical Teacher)',
  });
});

/* ──────────────────────────────────────────────────────────────────
   2. ENDPOINT: EXPLORE FULL SOCRATIC LESSON (Dedicated Endpoint)
   ────────────────────────────────────────────────────────────────── */
router.post('/lesson', async (req, res) => {
  const {
    conceptId,
    conceptName,
    studentGrade = 'Class 8-10',
    learningStyle = 'visual',
    persona = 'kalam',
    language = 'en',
  } = req.body;

  const targetTopic = conceptName || conceptId || 'Thermodynamics & Energy Conversion';

  const prompt = `You are "MentorAI". Generate a comprehensive, verified Socratic Lesson.
Topic: "${targetTopic}"
Student Grade: ${studentGrade}
Difficulty: ${studentGrade.includes('11') || studentGrade.includes('12') ? 'Advanced / Class 11-12' : studentGrade.includes('9') || studentGrade.includes('10') ? 'Class 9-10 Boards' : 'Class 6-8 Middle School'}
Style: ${learningStyle}
Language: ${language}

Calibrate the depth strictly to ${studentGrade}.
Return valid raw JSON only:
{
  "id": "${conceptId || 'custom_lesson'}",
  "concept": "${targetTopic}",
  "subject": "Physics | Chemistry | Biology | Mathematics",
  "grade": "${studentGrade}",
  "difficulty": "${studentGrade.includes('11') ? 'Advanced' : studentGrade.includes('9') ? 'Secondary' : 'Foundational'}",
  "intuition": "2 engaging sentences introducing the real-world observation.",
  "explanation": [
    "Step 1: Real-world physical action or entry state",
    "Step 2: Internal energy or molecular transmission",
    "Step 3: Primary scientific law or equation",
    "Step 4: Functional result or practical consequence"
  ],
  "visualSchematic": "ASCII diagram or mental model",
  "misconception": {
    "myth": "Common myth at ${studentGrade} level",
    "reality": "Scientific reality and why people get confused"
  },
  "diyExperiment": {
    "title": "Hands-on tabletop experiment",
    "items": ["Item 1", "Item 2"],
    "steps": ["Step 1", "Step 2", "Step 3"]
  },
  "checkQuestion": {
    "question": "A conceptual question testing understanding at ${studentGrade} difficulty",
    "options": [
      { "text": "A) ...", "correct": false, "feedback": "..." },
      { "text": "B) ...", "correct": true, "feedback": "..." },
      { "text": "C) ...", "correct": false, "feedback": "..." }
    ]
  },
  "connections": {
    "labId": "labs",
    "labTitle": "Virtual Lab",
    "scannerId": "cooker",
    "scannerTitle": "Scanner Object",
    "storyTopic": "Story Topic"
  }
}`;

  let lesson = await generateGeminiJson(prompt);

  res.json({
    status: 'success',
    grade: studentGrade,
    lesson,
  });
});

/* ──────────────────────────────────────────────────────────────────
   3. ENDPOINT: GET REAL GRADE-CALIBRATED MISCONCEPTIONS
   ────────────────────────────────────────────────────────────────── */
router.post('/misconceptions', async (req, res) => {
  const { studentGrade = 'Class 8-10', count = 6 } = req.body;

  // Determine standard grade bracket
  const bracket =
    studentGrade.includes('11') || studentGrade.includes('12')
      ? 'Class 11-12'
      : studentGrade.includes('6') || studentGrade.includes('7') || studentGrade.includes('8')
      ? 'Class 6-8'
      : 'Class 9-10';

  const defaultList = GRADE_MISCONCEPTIONS[bracket] || GRADE_MISCONCEPTIONS['Class 9-10'];

  // Optional: Dynamic generation for fresh variety
  if (genAI && req.body.generateFresh) {
    const prompt = `Generate ${count} real scientific misconceptions for Indian school students in ${studentGrade}.
Return valid raw JSON only as an array:
[
  {
    "concept": "Concept Title",
    "myth": "The common student misconception",
    "fact": "The actual scientific reality",
    "grade": "${studentGrade}",
    "difficulty": "${bracket}",
    "key": "slug_key"
  }
]`;
    const aiList = await generateGeminiJson(prompt);
    if (Array.isArray(aiList) && aiList.length >= 3) {
      return res.json({ status: 'success', grade: studentGrade, bracket, misconceptions: aiList });
    }
  }

  res.json({
    status: 'success',
    grade: studentGrade,
    bracket,
    misconceptions: defaultList,
  });
});

/* ──────────────────────────────────────────────────────────────────
   4. ENDPOINT: GET REAL GRADE-CALIBRATED DIY EXPERIMENTS
   ────────────────────────────────────────────────────────────────── */
router.post('/experiments', async (req, res) => {
  const { studentGrade = 'Class 8-10', count = 6 } = req.body;

  const bracket =
    studentGrade.includes('11') || studentGrade.includes('12')
      ? 'Class 11-12'
      : studentGrade.includes('6') || studentGrade.includes('7') || studentGrade.includes('8')
      ? 'Class 6-8'
      : 'Class 9-10';

  const defaultList = GRADE_EXPERIMENTS[bracket] || GRADE_EXPERIMENTS['Class 9-10'];

  // Optional: Dynamic generation for fresh variety
  if (genAI && req.body.generateFresh) {
    const prompt = `Generate ${count} real hands-on DIY science experiments for Indian students in ${studentGrade}.
Return valid raw JSON only as an array:
[
  {
    "id": "slug_id",
    "title": "Experiment Title",
    "subject": "Physics | Chemistry | Biology",
    "grade": "${studentGrade}",
    "difficulty": "${bracket}",
    "items": ["Item 1", "Item 2"],
    "steps": ["Step 1", "Step 2", "Step 3"],
    "principle": "The governing scientific law"
  }
]`;
    const aiList = await generateGeminiJson(prompt);
    if (Array.isArray(aiList) && aiList.length >= 3) {
      return res.json({ status: 'success', grade: studentGrade, bracket, experiments: aiList });
    }
  }

  res.json({
    status: 'success',
    grade: studentGrade,
    bracket,
    experiments: defaultList,
  });
});

/* ──────────────────────────────────────────────────────────────────
   5. ENDPOINT: GET REAL GRADE-CALIBRATED QUIZ
   ────────────────────────────────────────────────────────────────── */
router.post('/quiz', async (req, res) => {
  const { concept = 'Physics', studentGrade = 'Class 8-10', count = 3 } = req.body;

  const prompt = `Generate ${count} real conceptual multiple-choice questions for Indian students in ${studentGrade} about "${concept}".
Difficulty must strictly match ${studentGrade}.
Return valid raw JSON only as an array:
[
  {
    "question": "Question text?",
    "options": [
      { "text": "A) ...", "correct": false, "feedback": "Why wrong" },
      { "text": "B) ...", "correct": true, "feedback": "Why right" },
      { "text": "C) ...", "correct": false, "feedback": "Why wrong" }
    ]
  }
]`;

  const quizList = await generateGeminiJson(prompt);

  res.json({
    status: 'success',
    concept,
    grade: studentGrade,
    quiz: quizList || [],
  });
});

export default router;
