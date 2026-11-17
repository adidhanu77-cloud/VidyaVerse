/**
 * VidyaVerse - MentorAI Next-Generation Socratic Pedagogical Engine
 * Powers real-time adaptive tutoring with grade-specific difficulty scaling:
 * - Class 6-8 (Foundational / Middle School Discovery)
 * - Class 9-10 (Secondary / Board Exams & NCERT Laws)
 * - Class 11-12 (Advanced / JEE & NEET Rigor)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' && window.VITE_GEMINI_API_KEY) || '';
const browserGenAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

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

// Call browser-side Gemini models with fallback
async function callBrowserGeminiJson(prompt) {
  if (!GEMINI_API_KEY) return null;
  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        const parsed = extractJson(text);
        if (parsed) return parsed;
      }
    } catch (e) {
      console.warn(`[Browser Gemini Tutor] Model ${m} error:`, e.message);
    }
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────────
   GRADE-STRATIFIED CURIOSITY DOUBTS
   ────────────────────────────────────────────────────────────────── */
export const GRADE_CURIOSITY_DOUBTS = {
  'Class 6-8': [
    { id: 'plant_food_sunlight', q: '🌱 Why do plant leaves turn towards sunlight?', icon: '☀️' },
    { id: 'floating_ice', q: '🧊 Why does an ice cube float in lemonade?', icon: '🍋' },
    { id: 'balloon_static', q: '🎈 Why does a rubbed balloon stick to a wall?', icon: '⚡' },
    { id: 'compass_north', q: '🧭 How does a magnetic compass always point North?', icon: '🌍' },
    { id: 'rainbow_colors', q: '🌈 Why does a rain shower create a 7-color rainbow?', icon: '🌦️' },
    { id: 'cycle_bell_sound', q: '🔔 Why does a cycle bell stop ringing when you touch it?', icon: '🚲' },
  ],

  'Class 9-10': [
    { id: 'pump_compression', q: '🚲 Why does my bicycle pump barrel get hot? (Thermodynamics)', icon: '🔥' },
    { id: 'sky_scattering', q: '🌅 Why is the sky blue and sunset orange-red? (Rayleigh Scattering)', icon: '🌈' },
    { id: 'cooker_pressure', q: '🍲 Why does a pressure cooker cook 3x faster? (Boiling Elevation)', icon: '💨' },
    { id: 'gravity_free_fall', q: '🍎 Do heavy objects fall faster than light objects? (Galileo Equivalence)', icon: '⚖️' },
    { id: 'photosynthesis_energy', q: '🌿 How does chlorophyll split water molecules? (Photolysis)', icon: '☀️' },
    { id: 'current_conservation', q: '⚡ Does current get consumed as it passes through a bulb?', icon: '💡' },
  ],

  'Class 11-12': [
    { id: 'carnot_engine_limit', q: '🌡️ Why is heat engine efficiency limited to η = 1 - Tc/Th? (Carnot Theorem)', icon: '⚙️' },
    { id: 'photoelectric_threshold', q: '⚛️ Why does high-intensity red light fail to eject photoelectrons? (Einstein hν)', icon: '🔬' },
    { id: 'rocket_thrust_vacuum', q: '🚀 How does a rocket accelerate in vacuum with nothing to push against? (Momentum)', icon: '🚀' },
    { id: 'angular_momentum_skater', q: '🌀 Why does a spinning skater accelerate by tucking arms? (L = Iω Conservation)', icon: '⛸️' },
    { id: 'capillary_jurins_law', q: '💧 Why does water rise higher in narrower glass capillaries? (Laplace 2T/r)', icon: '🧪' },
    { id: 'adiabatic_temperature_drop', q: '❄️ Why does rapidly escaping deodorant spray feel icy cold? (Adiabatic Work)', icon: '💨' },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   GRADE-STRATIFIED MISCONCEPTIONS
   ────────────────────────────────────────────────────────────────── */
export const GRADE_MISCONCEPTIONS = {
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
      key: 'floating_ice',
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
      key: 'compass_north',
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
      concept: 'Air & Atmospheric Mass',
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
      key: 'current_conservation',
      grade: 'Class 9-10',
      difficulty: 'Secondary / Boards',
    },
    {
      concept: 'Friction & Forward Drive',
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
      key: 'floating_ice',
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
      concept: 'Centrifugal Force & Inertia',
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
      key: 'adiabatic_temperature_drop',
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
      key: 'photoelectric_threshold',
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
      key: 'angular_momentum_skater',
      grade: 'Class 11-12',
      difficulty: 'Advanced / JEE / NEET',
    },
  ],
};

/* ──────────────────────────────────────────────────────────────────
   GRADE-STRATIFIED DIY EXPERIMENTS
   ────────────────────────────────────────────────────────────────── */
export const GRADE_EXPERIMENTS = {
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
   HELPER: NORMALIZE GRADE BRACKET
   ────────────────────────────────────────────────────────────────── */
export function normalizeGradeBracket(gradeStr) {
  const g = String(gradeStr || '').toLowerCase();
  if (g.includes('11') || g.includes('12')) return 'Class 11-12';
  if (g.includes('6') || g.includes('7') || g.includes('8')) return 'Class 6-8';
  return 'Class 9-10';
}

/* ──────────────────────────────────────────────────────────────────
   LEARNING STYLES & PERSONAS
   ────────────────────────────────────────────────────────────────── */
export const LEARNING_STYLES = {
  visual: {
    id: 'visual',
    name: 'Visual & Diagrammatic',
    icon: '🎨',
    desc: 'Clear visual mind maps, ASCII schematics, and geometric relationships.',
    instruction: 'Emphasize visual mental models, flowcharts, ASCII schematics, and spatial relationships.',
  },
  story: {
    id: 'story',
    name: 'Village & Everyday Metaphors',
    icon: '📖',
    desc: 'Anchored in relatable Indian village life, farming, cooking, and natural phenomena.',
    instruction: 'Use relatable Indian village metaphors (bullock carts, well pulleys, monsoon rains, pressure cookers, kitchen spices).',
  },
  diy: {
    id: 'diy',
    name: 'Hands-On & DIY Experiments',
    icon: '🔬',
    desc: 'Learn by doing: tabletop mini-experiments with everyday kitchen and classroom items.',
    instruction: 'Provide clear, 3-step DIY experiments using household items (cups, coins, paper, water) to prove the concept physically.',
  },
  socratic: {
    id: 'socratic',
    name: 'Socratic Inquiry & Questions',
    icon: '🧠',
    desc: 'Guided step-by-step thinking that leads the student to the eureka discovery.',
    instruction: 'Guide the student through Socratic questioning rather than lecturing; encourage deduction and critical reasoning.',
  },
  rigorous: {
    id: 'rigorous',
    name: 'Formulas & Scientific Derivations',
    icon: '📐',
    desc: 'Strict NCERT scientific laws, equations, SI units, and mathematical proofs.',
    instruction: 'Include exact scientific laws, formulas, SI units, variables, and mathematical deductions.',
  },
};

export const MENTOR_PERSONAS = {
  kalam: {
    id: 'kalam',
    name: 'Dr. APJ Abdul Kalam Style',
    title: 'The People’s Teacher & Missile Guide',
    avatar: '🚀',
    tagline: 'Courage to think differently, invent, and discover!',
    greeting: 'Greetings my young scientist friend! What curiosity sparks your mind today?',
    promptRole: 'You are inspired by Dr. APJ Abdul Kalam: deeply encouraging, humble, passionate about Indian grassroots ingenuity, mother-tongue empathetic, and fostering fearless curiosity.',
  },
  vidya: {
    id: 'vidya',
    name: 'Prof. Vidya',
    title: 'Senior NCERT Pedagogical Mentor',
    avatar: '👩‍🏫',
    tagline: 'Step-by-step conceptual clarity for every student.',
    greeting: 'Hello! I am Professor Vidya. Let us break down your doubt into simple, crystal-clear steps together.',
    promptRole: 'You are Prof. Vidya: a patient, warm, structured STEM teacher who explains concepts with pristine logical progression and ensures no student is left behind.',
  },
  spark: {
    id: 'spark',
    name: 'Curiosity Spark',
    title: 'Energetic Science Sleuth',
    avatar: '⚡',
    tagline: 'Unlocking the cool mysteries hidden in everyday physics!',
    greeting: 'Hey explorer! Ready to find out why the universe behaves so delightfully strangely?',
    promptRole: 'You are Curiosity Spark: an energetic, fun-loving science sleuth who loves surprising paradoxes, mind-blowing facts, and rapid-fire aha moments.',
  },
};

/* ──────────────────────────────────────────────────────────────────
   LOCAL ANALYTICS STORAGE
   ────────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'vidyaverse_mentor_analytics_v2';

export function getMentorSessionAnalytics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const initial = {
    doubtsAsked: 0,
    conceptsMastered: [],
    weakConcepts: [],
    misconceptionsResolved: 0,
    experimentsAttempted: 0,
    learningStreak: 1,
    currentGrade: 'Class 9-10',
    preferredStyle: 'visual',
    preferredPersona: 'kalam',
    history: [],
  };

  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initial)); } catch {}
  return initial;
}

export function saveMentorSessionAnalytics(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function logConceptInteraction({ conceptName, wasCorrect, isWeakConcept = false }) {
  const analytics = getMentorSessionAnalytics();
  analytics.doubtsAsked += 1;

  if (isWeakConcept) {
    if (!analytics.weakConcepts.includes(conceptName)) {
      analytics.weakConcepts.push(conceptName);
    }
  } else if (wasCorrect) {
    if (!analytics.conceptsMastered.includes(conceptName)) {
      analytics.conceptsMastered.push(conceptName);
    }
    analytics.weakConcepts = analytics.weakConcepts.filter((c) => c !== conceptName);
    analytics.misconceptionsResolved += 1;
  }

  saveMentorSessionAnalytics(analytics);
  return analytics;
}

/* ──────────────────────────────────────────────────────────────────
   1. REAL BACKEND-CONNECTED FUNCTION: FETCH GRADE MISCONCEPTIONS
   ────────────────────────────────────────────────────────────────── */
export async function fetchGradeMisconceptions(grade = 'Class 9-10') {
  const bracket = normalizeGradeBracket(grade);

  // Try backend first
  try {
    const res = await fetch(`${API_BASE}/tutor/misconceptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentGrade: bracket, count: 6 }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.misconceptions) && data.misconceptions.length > 0) {
        return data.misconceptions;
      }
    }
  } catch (err) {
    // Backend offline / Vercel deployment
  }

  // Fallback to verified grade-stratified knowledge
  return GRADE_MISCONCEPTIONS[bracket] || GRADE_MISCONCEPTIONS['Class 9-10'];
}

/* ──────────────────────────────────────────────────────────────────
   2. REAL BACKEND-CONNECTED FUNCTION: FETCH GRADE EXPERIMENTS
   ────────────────────────────────────────────────────────────────── */
export async function fetchGradeExperiments(grade = 'Class 9-10') {
  const bracket = normalizeGradeBracket(grade);

  // Try backend first
  try {
    const res = await fetch(`${API_BASE}/tutor/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentGrade: bracket, count: 6 }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.experiments) && data.experiments.length > 0) {
        return data.experiments;
      }
    }
  } catch (err) {
    // Backend offline / Vercel deployment
  }

  // Fallback to verified grade-stratified knowledge
  return GRADE_EXPERIMENTS[bracket] || GRADE_EXPERIMENTS['Class 9-10'];
}

/* ──────────────────────────────────────────────────────────────────
   3. REAL BACKEND-CONNECTED FUNCTION: FETCH SOCRATIC LESSON
   ────────────────────────────────────────────────────────────────── */
export async function fetchSocraticLesson({
  conceptId,
  conceptName,
  grade = 'Class 9-10',
  learningStyle = 'visual',
  persona = 'kalam',
  language = 'en',
}) {
  const bracket = normalizeGradeBracket(grade);
  const targetName = conceptName || conceptId || 'Physics';

  // 1. Try Backend Endpoint
  try {
    const res = await fetch(`${API_BASE}/tutor/lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conceptId,
        conceptName: targetName,
        studentGrade: bracket,
        learningStyle,
        persona,
        language,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.lesson && data.lesson.explanation) {
        return data.lesson;
      }
    }
  } catch (err) {
    // Backend offline
  }

  // 2. Try Client-Side Gemini with Grade-Specific Calibration
  if (GEMINI_API_KEY) {
    const prompt = `You are "MentorAI". Generate a comprehensive, real-data Socratic lesson.
Concept: "${targetName}"
Student Grade: ${bracket}
Difficulty: ${bracket === 'Class 11-12' ? 'Advanced / Class 11-12 (JEE/NEET rigor)' : bracket === 'Class 6-8' ? 'Foundational / Class 6-8 (Middle School)' : 'Secondary / Class 9-10 (Board Exam)'}
Style: ${learningStyle}
Language: ${language}

CRITICAL RULES:
- Calibrate explanation depth, vocabulary, and formulas strictly to ${bracket}!
- For Class 6-8: Qualitative intuition, easy household analogies, fun facts.
- For Class 9-10: Precise NCERT scientific mechanisms, equations, and SI units.
- For Class 11-12: Full mathematical derivations, thermodynamic/calculus rigor, and competitive exam depth.
Return strictly valid raw JSON only:
{
  "id": "${conceptId || 'custom_lesson'}",
  "concept": "${targetName}",
  "subject": "Physics | Chemistry | Biology | Mathematics",
  "grade": "${bracket}",
  "difficulty": "${bracket === 'Class 11-12' ? 'Advanced' : bracket === 'Class 6-8' ? 'Foundational' : 'Secondary'}",
  "intuition": "2 engaging sentences introducing the real-world observation.",
  "explanation": [
    "Step 1: Real initial physical action",
    "Step 2: Internal energy or molecular transmission",
    "Step 3: Primary scientific law or equation",
    "Step 4: Functional result or practical consequence"
  ],
  "visualSchematic": "ASCII diagram or mental model",
  "misconception": {
    "myth": "Common myth at ${bracket} level",
    "reality": "Scientific reality and why people get confused"
  },
  "diyExperiment": {
    "title": "Hands-on tabletop experiment",
    "items": ["Item 1", "Item 2"],
    "steps": ["Step 1", "Step 2", "Step 3"]
  },
  "checkQuestion": {
    "question": "A conceptual question testing understanding at ${bracket} difficulty",
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
    const generated = await callBrowserGeminiJson(prompt);
    if (generated && generated.concept && generated.explanation) {
      return generated;
    }
  }

  // 3. Fallback to Grade-Calibrated Lesson Template
  return {
    id: conceptId || 'lesson_template',
    concept: targetName,
    subject: 'Physical & Natural Sciences',
    grade: bracket,
    difficulty: bracket === 'Class 11-12' ? 'Advanced' : bracket === 'Class 6-8' ? 'Foundational' : 'Secondary',
    intuition: `Observing ${targetName} reveals how fundamental natural laws operate quietly in our daily surroundings!`,
    explanation: [
      `Step 1: Input & Forces: A mechanical, thermal, or chemical force initiates motion or energy transformation.`,
      `Step 2: Conservation Laws: Following the First Law of Thermodynamics, energy is conserved: Energy In = Work Done + Heat.`,
      `Step 3: Force Equilibrium: Internal molecular or structural forces balance external load (Newton’s Laws of Motion).`,
      `Step 4: Observable Outcome: The system completes its physical function with minimal thermal friction dissipation.`,
    ],
    visualSchematic: `
    [Applied Energy / Input Force]
                 │
                 ▼
    ┌───────────────────────────┐
    │  Energy Conservation      │  Energy in = Work done + Heat
    │  Force Balance: ΣF = 0    │  Grade: ${bracket}
    └────────────┬──────────────┘
                 │
                 ▼
    [Observable Physical Effect: ${targetName}]
    `,
    misconception: {
      myth: `Complex science for ${targetName} only happens in expensive high-tech labs.`,
      reality: `Nature uses the exact same physical and chemical laws in a village kitchen, a rural field, or outer space!`,
    },
    diyExperiment: {
      title: `Observation Test for ${targetName}`,
      items: ['Notebook', 'Pencil', 'Everyday related object'],
      steps: [
        'Observe the system carefully for 2 minutes before making any changes.',
        'Identify what initial force or energy caused the reaction.',
        'Measure or record what changed (temperature, speed, pressure) to identify the scientific law!',
      ],
    },
    checkQuestion: {
      question: `At ${bracket} level, which fundamental principle governs ${targetName}?`,
      options: [
        { text: 'A) Energy is created out of nothing whenever work is done.', correct: false, feedback: 'Incorrect. Energy cannot be created or destroyed, only transformed (First Law of Thermodynamics).' },
        { text: 'B) Total energy is always conserved; it merely transforms from one form into another.', correct: true, feedback: 'Spot on! The Conservation of Energy is universal across all science.' },
        { text: 'C) Physical laws change depending on the time of day.', correct: false, feedback: 'Incorrect. Universal physical constants remain invariant.' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET Interactive Virtual Lab Simulation',
      scannerId: 'cooker',
      scannerTitle: 'Scan Object with Camera Scanner',
      storyTopic: 'Adventures in Science & Discovery',
    },
  };
}

/* ──────────────────────────────────────────────────────────────────
   4. QUERY MENTOR AI (Direct Doubt Solver)
   ────────────────────────────────────────────────────────────────── */
export async function queryMentorAI({
  question,
  grade = 'Class 9-10',
  learningStyle = 'visual',
  persona = 'kalam',
  language = 'en',
}) {
  const bracket = normalizeGradeBracket(grade);
  const q = String(question || '').trim();
  if (!q) return null;

  // Try backend first
  try {
    const res = await fetch(`${API_BASE}/tutor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q,
        studentGrade: bracket,
        learningStyle,
        persona,
        language,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.lesson) {
        return {
          status: 'success',
          source: 'backend_api',
          question: q,
          data: data.lesson,
        };
      }
    }
  } catch (err) {
    // Backend offline / Vercel deployment
  }

  // Fallback to fetchSocraticLesson with browser Gemini / calibrated registry
  const lesson = await fetchSocraticLesson({
    conceptName: q,
    grade: bracket,
    learningStyle,
    persona,
    language,
  });

  return {
    status: 'success',
    source: 'client_socratic',
    question: q,
    data: lesson,
  };
}
