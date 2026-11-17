/**
 * VidyaVerse - MentorAI Next-Generation Socratic Pedagogical Engine
 * Powers real-time adaptive tutoring, concept gap detection, learning style personalization,
 * DIY experiment instruction, and dynamic platform connections.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Browser-side Gemini API key (loaded from Vite environment variable)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' && window.VITE_GEMINI_API_KEY) || '';
const browserGenAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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

/* ──────────────────────────────────────────────────────────────────
   CURATED CORE STEM KNOWLEDGE & MISCONCEPTION REGISTRY
   Guarantees instantaneous, rich, pedagogically verified tutoring
   even offline or during network latency.
   ────────────────────────────────────────────────────────────────── */
export const MENTOR_CURATED_KNOWLEDGE = {
  pump_compression: {
    id: 'pump_compression',
    concept: 'Adiabatic Compression & Thermodynamics',
    subject: 'Physics',
    grade: 'Class 8-11',
    triggers: ['pump', 'bicycle pump', 'cycle pump', 'hot', 'barrel warm', 'compression'],
    intuition: 'Have you ever noticed your bicycle pump cylinder getting warm after filling a tire? It is not just friction — you are literally squeezing energy into gas molecules!',
    explanation: [
      'Step 1: When you push the bicycle pump handle rapidly, you perform external mechanical work (W = F · d) on the air trapped inside the cylinder.',
      'Step 2: According to the First Law of Thermodynamics (ΔU = Q - W), because the pumping is done quickly, heat has no time to escape through the barrel (an adiabatic process).',
      'Step 3: Therefore, all the mechanical work you do gets converted directly into the internal kinetic energy of the air molecules.',
      'Step 4: Temperature is simply the average kinetic energy of molecules! Faster vibrating molecules hit the metal cylinder wall, transferring heat to your palm.',
    ],
    visualSchematic: `
    [Piston Handle Pushed Down]
               │
               ▼  Work Done: W = F × d
    ┌───────────────────────────┐
    │  Air Molecules Squeezed   │  Volume Decreases: V↓
    │  Collision Rate Multiplies│  Pressure Rises: P↑
    └─────────────┬─────────────┘
                  │  First Law: ΔU = -W_external
                  ▼
    ┌───────────────────────────┐
    │ Kinetic Energy Increases  │ ──► Pump Barrel Gets HOT!
    └───────────────────────────┘
    `,
    misconception: {
      myth: 'The pump gets hot only because the piston rubber gasket rubs against the metal wall (frictional heat).',
      reality: 'Friction contributes less than 15% of the warmth! The primary heating (>85%) comes from thermodynamic adiabatic gas compression — doing mechanical work on air molecules increases their thermal kinetic energy.',
    },
    diyExperiment: {
      title: 'Finger-Pump Temperature Probe',
      items: ['1 bicycle hand pump', 'Your finger / palm'],
      steps: [
        'Step 1: Pump the handle 20 times into free air with the nozzle open. Touch the cylinder: It stays completely cool because no pressure builds up.',
        'Step 2: Now press your thumb tightly over the air nozzle to seal it, and compress the handle rapidly 10 times against high resistance.',
        'Step 3: Feel the bottom of the cylinder: It becomes instantly warm to the touch! This proves compression work — not free rubbing — creates the heat.',
      ],
    },
    checkQuestion: {
      question: 'If you pump a bicycle tire very slowly over 15 minutes instead of fast in 30 seconds, what happens to the pump barrel temperature?',
      options: [
        { text: 'A) It gets much hotter because it works for a longer time.', correct: false, feedback: 'Not quite! When you pump slowly, heat has plenty of time to conduct away into the surrounding air.' },
        { text: 'B) It stays much cooler because heat conducts away into surrounding air (isothermal process).', correct: true, feedback: 'Spot on! Slow pumping allows thermal equilibrium with the environment, so temperature barely rises.' },
        { text: 'C) The temperature stays identical regardless of speed.', correct: false, feedback: 'Incorrect. Speed determines whether the process is adiabatic (fast, retains heat) or isothermal (slow, dissipates heat).' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET Gas Properties & Thermodynamics Lab',
      scannerId: 'bicycle',
      scannerTitle: 'Scan a Bicycle / Pump with Object Scanner',
      storyTopic: 'Thermodynamics & Energy Conversion',
      questSubject: 'Physics',
    },
  },

  sky_scattering: {
    id: 'sky_scattering',
    concept: 'Rayleigh Scattering & Wavelengths',
    subject: 'Physics',
    grade: 'Class 8-12',
    triggers: ['sky', 'blue sky', 'sunset', 'orange sky', 'red sunset', 'scattering'],
    intuition: 'Sunlight appears pure white or golden, yet our daytime sky is dazzling blue and sunset glows deep fiery red. The secret lies in atmospheric dust and gas molecules playing pinball with light waves!',
    explanation: [
      'Step 1: Sunlight is composed of all visible electromagnetic wavelengths (VIBGYOR). Blue light has a short wavelength (~400-450 nm), while red light has a long wavelength (~650-700 nm).',
      'Step 2: Our atmosphere is filled with billions of tiny nitrogen (N2) and oxygen (O2) molecules, which are smaller than the wavelength of light.',
      'Step 3: Lord Rayleigh proved that light scattering is inversely proportional to the 4th power of wavelength: Scattering ∝ 1 / λ⁴. Because blue light is short, it scatters roughly 10 times more intensely than red light!',
      'Step 4: At noon, scattered blue light floods our eyes from all directions in the sky. At sunset, sunlight passes through 10 times more atmospheric thickness; virtually all blue light gets scattered away sideways before reaching you, leaving only penetrating red and orange rays.',
    ],
    visualSchematic: `
    [Sunlight: All Colors VIBGYOR]
                  │
                  ▼
    ┌───────────────────────────┐
    │  Earth Atmosphere (N2, O2)│
    │  Rayleigh Law: I ∝ 1/λ⁴   │
    └───────┬───────────┬───────┘
            │           │
    [Short Wave: Blue]  [Long Wave: Red/Orange]
    Scatters EVERYWHERE  Travels Straight Through
            │           │
            ▼           ▼
       Daytime Sky      Sunset & Sunrise
    `,
    misconception: {
      myth: 'The sky is blue because it reflects the ocean waters.',
      reality: 'It is the opposite! The ocean appears blue primarily because it reflects the scattered blue sky and because water molecules absorb red light. In fact, the sky is blue even over dry landlocked deserts thousands of miles away from any sea.',
    },
    diyExperiment: {
      title: 'Sunset in a Milk Glass',
      items: ['1 transparent drinking glass with water', '1 drop of milk or Dettol', '1 LED smartphone flashlight'],
      steps: [
        'Step 1: Fill the glass with clear water and shine the flashlight through the side. The beam passes through clearly.',
        'Step 2: Add just 2 drops of milk and stir. The suspended colloidal fat droplets mimic atmospheric gas molecules.',
        'Step 3: Look at the glass from the side: The water glows soft blue (scattered light)! Look directly through the glass toward the flashlight bulb: The light turns sunset orange-red!',
      ],
    },
    checkQuestion: {
      question: 'What color does the sky appear to an astronaut standing on the Moon during lunar daytime?',
      options: [
        { text: 'A) Bright blue, just like on Earth.', correct: false, feedback: 'Incorrect. The Moon has no atmosphere, so there are no gas molecules to scatter light!' },
        { text: 'B) Pitch black with bright shining stars.', correct: true, feedback: 'Brilliant! Without an atmosphere to scatter sunlight (Rayleigh scattering), space and the lunar sky remain pitch black even in broad daylight!' },
        { text: 'C) Pure white because of bright sunlight.', correct: false, feedback: 'Incorrect. Only the Sun itself appears white; the background sky stays jet black.' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET Bending Light & Refraction Lab',
      scannerId: 'spectacles',
      scannerTitle: 'Scan Lenses & Optics with Scanner',
      storyTopic: 'Optics & The Spectrum of Light',
      questSubject: 'Physics',
    },
  },

  ice_floating: {
    id: 'ice_floating',
    concept: 'Anomalous Expansion of Water & Density',
    subject: 'Chemistry & Physics',
    grade: 'Class 7-11',
    triggers: ['ice', 'float', 'iceberg', 'pond freeze', 'lake freeze', 'anomalous', 'density'],
    intuition: 'Nearly every substance on Earth shrinks and becomes heavier as it solidifies from liquid to solid. Water defies this rule — it miraculously expands as it freezes, saving all aquatic life!',
    explanation: [
      'Step 1: As most liquids cool, thermal vibrations decrease and molecules pack closer together, steadily increasing density.',
      'Step 2: Water behaves normally until it cools to 4°C (39.2°F), where it reaches its maximum density (1.000 g/cm³).',
      'Step 3: Between 4°C and 0°C, anomalous expansion occurs! Hydrogen bonds between polar H2O molecules begin arranging into an open, rigid hexagonal crystalline cage.',
      'Step 4: This open cage forces molecules farther apart than in liquid water, increasing volume by ~9% and lowering density to 0.917 g/cm³.',
      'Step 5: Because density < 1, ice floats on water! Village ponds freeze only on top, forming an insulating blanket that keeps the water below at a hospitable 4°C for fish.',
    ],
    visualSchematic: `
    Liquid Water (>4°C): Molecules Tightly Clustered (Density: 1.00 g/cm³)
                        │
                        ▼  Cooling Below 4°C
    Ice Structure (0°C): Hexagonal Open Cage with Empty Space
    ┌───────────────────────────────────┐
    │       H ── O ── H                 │
    │      /           \\  Empty Pores   │  Volume Expands by +9%
    │     O             O in Lattice    │  Density Drops to 0.92 g/cm³
    │      \\           /                │  Result: ICE FLOATS!
    │       H ── O ── H                 │
    └───────────────────────────────────┘
    `,
    misconception: {
      myth: 'Ice floats because air bubbles get trapped inside during freezing.',
      reality: 'Even 100% pure, de-aerated, crystal-clear bubble-free ice floats! The lightness is caused by the geometric hexagonal lattice of hydrogen bonding, which creates molecular empty spaces.',
    },
    diyExperiment: {
      title: 'Water Bottle Expansion Check',
      items: ['1 small plastic water bottle', 'Water', 'Home freezer'],
      steps: [
        'Step 1: Fill a small plastic water bottle right to the brim with water and tighten the cap securely.',
        'Step 2: Place it standing in the freezer overnight.',
        'Step 3: In the morning, observe: The plastic bottle sides bulge outward and the base pushes out! This proves water expands physically upon freezing.',
      ],
    },
    checkQuestion: {
      question: 'At what temperature is pure liquid water at its maximum possible density?',
      options: [
        { text: 'A) 0 °C (Freezing point)', correct: false, feedback: 'Incorrect. At 0°C, the open hexagonal crystal structure has already formed, lowering density.' },
        { text: 'B) 4 °C', correct: true, feedback: 'Spot on! At 4°C, water reaches peak density (1.000 g/cm³). Water cooler or warmer than 4°C expands!' },
        { text: 'C) 100 °C (Boiling point)', correct: false, feedback: 'Incorrect. At 100°C, thermal kinetic motion expands water, making it less dense (~0.958 g/cm³).' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET States of Matter & Density Lab',
      scannerId: 'waterbottle',
      scannerTitle: 'Scan Water Bottle in Object Scanner',
      storyTopic: 'Matter, Phase Changes & Density',
      questSubject: 'Chemistry',
    },
  },

  photosynthesis_energy: {
    id: 'photosynthesis_energy',
    concept: 'Photosynthesis & Solar Energy Conversion',
    subject: 'Biology',
    grade: 'Class 6-10',
    triggers: ['photosynthesis', 'leaf', 'plant', 'chlorophyll', 'sunlight', 'stomata', 'food'],
    intuition: 'Every grain of rice, wheat chapati, and breath of oxygen you enjoy began as photon harvesting in a green leaf. Plants are nature’s ultimate solar power generators!',
    explanation: [
      'Step 1: Light Harvesting: Chlorophyll pigments embedded in thylakoid membranes inside leaf chloroplasts absorb red and blue solar photons, exciting electrons.',
      'Step 2: Photolysis of Water: Absorbed energy splits water molecules (2H2O → 4H+ + 4e- + O2). The released oxygen gas exits through stomata for animals to breathe!',
      'Step 3: Chemical Energy Storage: High-energy electrons generate ATP (biological battery) and NADPH.',
      'Step 4: Dark Reactions (Calvin Cycle): In the stroma, the enzyme RuBisCO captures atmospheric carbon dioxide (CO2) and uses ATP energy to assemble glucose sugar: 6CO2 + 6H2O + Light → C6H12O6 + 6O2.',
    ],
    visualSchematic: `
    [Sunlight Photons] + [6 H2O from Roots]
               │
               ▼  Chloroplast Thylakoids
    ┌───────────────────────────┐
    │ Light Reactions:          │ ──► [O2 Released to Air!]
    │ Photolysis splits water   │
    │ Generates ATP & NADPH     │
    └─────────────┬─────────────┘
                  │  Calvin Cycle + RuBisCO
                  ▼
    [6 CO2 Absorbed from Stomata] ──► [C6H12O6 Glucose Sugar (Food!)]
    `,
    misconception: {
      myth: 'Plants only perform photosynthesis and do not breathe oxygen or do respiration.',
      reality: 'Plants respire 24 hours a day! Just like humans, plant cells have mitochondria and constantly consume oxygen to break down glucose for cellular energy. In daytime, photosynthesis produces far more O2 than they consume, creating a net oxygen surplus.',
    },
    diyExperiment: {
      title: 'Underwater Leaf Oxygen Bubbles',
      items: ['1 fresh green leaf', '1 clear glass of water', 'Bright sunlight'],
      steps: [
        'Step 1: Submerge a freshly plucked leaf completely underwater in a clear glass.',
        'Step 2: Place the glass in direct bright sunlight for 1 hour.',
        'Step 3: Look closely at the underside of the leaf: Tiny silver bubbles form around the stomata pores! Those are pure oxygen bubbles released during photosynthesis.',
      ],
    },
    checkQuestion: {
      question: 'Where does the oxygen gas (O2) produced during photosynthesis come from?',
      options: [
        { text: 'A) From splitting Carbon Dioxide (CO2) molecules.', correct: false, feedback: 'Common misconception! Oxygen in CO2 actually becomes part of the glucose sugar molecule (C6H12O6).' },
        { text: 'B) From splitting Water (H2O) molecules during photolysis.', correct: true, feedback: 'Correct! Water molecules are split by light energy (photolysis), releasing pure O2 into the atmosphere.' },
        { text: 'C) From soil nitrates and minerals.', correct: false, feedback: 'Incorrect. Soil minerals provide nitrogen and phosphorus for proteins, not breathable oxygen.' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET Natural Selection & Plant Biology Lab',
      scannerId: 'plant',
      scannerTitle: 'Scan a Leaf with Object Scanner',
      storyTopic: 'Photosynthesis & The Secret of Green Leaves',
      questSubject: 'Biology',
    },
  },

  cooker_pressure: {
    id: 'cooker_pressure',
    concept: 'Gay-Lussac’s Law & Boiling Point Elevation',
    subject: 'Physics & Chemistry',
    grade: 'Class 8-11',
    triggers: ['cooker', 'pressure cooker', 'boiling point', 'whistle', 'dal', 'steam'],
    intuition: 'Why does your kitchen pressure cooker cook tough lentils and potatoes in 10 minutes, when an open pot takes 45 minutes? It is all about trapping steam to force water past its boiling limit!',
    explanation: [
      'Step 1: In an open pot, water boils at 100°C at normal atmospheric pressure (1 atm / 101.3 kPa). No matter how high you turn the flame, boiling water can never exceed 100°C because heat escapes as steam.',
      'Step 2: In a pressure cooker, an airtight rubber gasket seals the pot, trapping expanding steam (isochoric constant-volume heating).',
      'Step 3: By Gay-Lussac’s Law (P/T = Constant), pressure inside climbs to ~2 atmospheres (202 kPa).',
      'Step 4: At 2 atm, water molecules require much higher thermal kinetic energy to escape as vapor. The boiling point rises from 100°C to 121°C (250°F)!',
      'Step 5: Because cooking water is at 121°C instead of 100°C, heat transfers into food over 300% faster (Fourier’s Law), cooking food 3 times faster!',
    ],
    visualSchematic: `
    Open Pot: Heat Escapes as Steam ──► Max Temp Capped at 100°C (Slow cooking)
    
    Pressure Cooker:
    ┌───────────────────────────┐
    │ Sealed Gasket Traps Steam │
    │ Internal Pressure: 2 atm  │
    └─────────────┬─────────────┘
                  │  Boiling Point Rises!
                  ▼
    Water Boils at 121°C (250°F) ──► Heat Conduction 3.2x Faster!
                  │
                  ▼
    Pressure Exceeds Limit ──► Whistle Weight Lifts (P = F_gravity / Area)
    `,
    misconception: {
      myth: 'Turning the stove flame to maximum after the pressure cooker starts whistling makes the food cook even faster.',
      reality: 'Once boiling at 121°C under pressure, excess heat only vents more steam out the whistle valve and wastes cooking gas. The internal temperature stays pinned at 121°C. Turning the flame to low maintains the same cooking speed while saving fuel!',
    },
    diyExperiment: {
      title: 'Boiling Water Salt Elevation Comparison',
      items: ['2 identical pots', 'Water', '2 tablespoons salt', 'Clock'],
      steps: [
        'Step 1: Put 2 cups of pure water in Pot A and 2 cups of water with 2 tablespoons salt in Pot B.',
        'Step 2: Place both on identical stove burners at the same heat setting.',
        'Step 3: Observe: Pot A boils first! Adding salt increases solute concentration, elevating the boiling point so Pot B needs more heat energy before boiling starts.',
      ],
    },
    checkQuestion: {
      question: 'On top of Mount Everest (altitude 8,848 meters), what happens to the boiling point of water in an open pot?',
      options: [
        { text: 'A) Water boils at a higher temperature (around 120°C).', correct: false, feedback: 'Incorrect. Higher altitude means lower atmospheric pressure, not higher.' },
        { text: 'B) Water boils at a lower temperature (around 70°C), making it almost impossible to cook raw potatoes in an open pot!', correct: true, feedback: 'Brilliant! Low atmospheric pressure on Everest allows water to boil at only ~70°C, which is too cool to cook starch or pulses without a pressure cooker!' },
        { text: 'C) Water boils at exactly 100°C everywhere on Earth.', correct: false, feedback: 'False. 100°C is only at sea level (1 atm).' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET States of Matter & Phase Change Lab',
      scannerId: 'cooker',
      scannerTitle: 'Scan Pressure Cooker with Object Scanner',
      storyTopic: 'Thermodynamics & The Secret of Pressure',
      questSubject: 'Physics',
    },
  },

  gravity_free_fall: {
    id: 'gravity_free_fall',
    concept: 'Gravity, Free Fall & Equivalence Principle',
    subject: 'Physics',
    grade: 'Class 8-11',
    triggers: ['gravity', 'free fall', 'heavy fall faster', 'feather and coin', 'galileo', 'newton'],
    intuition: 'If you drop a heavy cricket ball and a light tennis ball from the top of your roof at the exact same instant, which one hits the ground first? Aristotle got this wrong for 2,000 years until Galileo ran an experiment!',
    explanation: [
      'Step 1: Aristotle believed heavy objects fall faster because Earth pulls heavier masses with greater gravitational force (F = G·M·m / r²).',
      'Step 2: But Galileo realized that heavy objects also possess more inertia (resistance to acceleration) following Newton’s 2nd Law: F = m · a.',
      'Step 3: Combine both laws: m · a = (G · M · m) / r². The mass of the falling object (m) cancels out on both sides of the equation!',
      'Step 4: Therefore, gravitational acceleration a = g = 9.8 m/s² is identical for every object regardless of whether it weighs 1 gram or 1,000 kilograms.',
      'Step 5: On Earth, a feather falls slower only because aerodynamic air drag opposes its motion. In a vacuum, a feather and a bowling ball hit the ground at the exact same millisecond.',
    ],
    visualSchematic: `
    Heavy Ball (Mass: 10m)             Light Ball (Mass: m)
    Force: F = 10m × g (10x force)     Force: F = m × g (1x force)
    Inertia: Resists 10x more          Inertia: Resists 1x
            │                                  │
            ▼                                  ▼
    Acceleration a = F/Mass = g        Acceleration a = F/Mass = g
    ────────┴──────────────────────────────────┴────────
                 BOTH HIT THE GROUND AT THE SAME TIME!
    `,
    misconception: {
      myth: 'Astronauts on the International Space Station float because there is zero gravity in space.',
      reality: 'Gravity at ISS orbit (400 km altitude) is still ~90% as strong as on Earth’s surface! Astronauts float because the space station is in perpetual free fall around Earth at 28,000 km/h. Both the station and astronauts are falling together without ground resistance, creating weightlessness.',
    },
    diyExperiment: {
      title: 'Galileo Book and Paper Drop',
      items: ['1 heavy hardcover book', '1 small sheet of paper cut smaller than the book cover'],
      steps: [
        'Step 1: Hold the book in one hand and the paper in the other at shoulder height. Drop them: The book thuds first because air resistance flutters the paper.',
        'Step 2: Now place the sheet of paper flat on top of the book cover. Make sure no paper edges stick out.',
        'Step 3: Drop the book with the paper on top: The paper stays glued to the book cover and both hit the floor together! The book blocked air drag, showing both fall at identical acceleration g!',
      ],
    },
    checkQuestion: {
      question: 'In a vacuum chamber with all air pumped out, if you drop a 10 kg iron cannonball and a 1 gram pigeon feather simultaneously, what happens?',
      options: [
        { text: 'A) The cannonball lands first because it has 10,000 times more gravitational force.', correct: false, feedback: 'Incorrect. More gravitational force is exactly balanced by 10,000 times more inertia!' },
        { text: 'B) Both hit the ground at the exact same instant.', correct: true, feedback: 'Bingo! In a vacuum with zero air resistance, all objects accelerate at g = 9.8 m/s² regardless of mass.' },
        { text: 'C) The feather lands first because it has less mass to move.', correct: false, feedback: 'Incorrect. Acceleration depends on the force-to-mass ratio, which is identical.' },
      ],
    },
    connections: {
      labId: 'labs',
      labTitle: 'PhET Gravity & Free Fall Simulation',
      scannerId: 'bicycle',
      scannerTitle: 'Scan Motion & Inertia in Scanner',
      storyTopic: 'Galileo, Newton & The Mystery of Gravity',
      questSubject: 'Physics',
    },
  },
};

/* ──────────────────────────────────────────────────────────────────
   LEARNING STYLES & PERSONA PROMPTS
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
   LOCAL SESSION PROGRESS & CONCEPT GAP STORAGE
   ────────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'vidyaverse_mentor_analytics_v1';

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
    currentGrade: 'Class 8-10',
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
    // If it was previously marked weak, remove it
    analytics.weakConcepts = analytics.weakConcepts.filter((c) => c !== conceptName);
    analytics.misconceptionsResolved += 1;
  }

  saveMentorSessionAnalytics(analytics);
  return analytics;
}

/* ──────────────────────────────────────────────────────────────────
   MATCH QUERY TO LOCAL CURATED KNOWLEDGE
   ────────────────────────────────────────────────────────────────── */
export function matchCuratedKnowledge(query) {
  if (!query) return null;
  const q = String(query).toLowerCase();

  for (const key of Object.keys(MENTOR_CURATED_KNOWLEDGE)) {
    const item = MENTOR_CURATED_KNOWLEDGE[key];
    if (item.triggers.some((t) => q.includes(t))) {
      return item;
    }
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────────
   AI MENTOR QUERY RESOLUTION ENGINE
   1. Checks verified curated knowledge for instant rich response.
   2. Calls multimodal Gemini (3.5-flash-lite) for arbitrary doubts.
   3. Synthesizes a structured Socratic lesson with DIY experiment,
      visual schematic, misconception alert, and interactive quiz.
   ────────────────────────────────────────────────────────────────── */
export async function queryMentorAI({
  question,
  grade = 'Class 8-10',
  learningStyle = 'visual',
  persona = 'kalam',
  language = 'en',
}) {
  const cleanQ = String(question || '').trim();
  if (!cleanQ) return null;

  const styleConfig = LEARNING_STYLES[learningStyle] || LEARNING_STYLES.visual;
  const personaConfig = MENTOR_PERSONAS[persona] || MENTOR_PERSONAS.kalam;

  // 1. Check verified curated knowledge base
  const localMatch = matchCuratedKnowledge(cleanQ);

  // 2. If Gemini API key is available, generate live personalized response
  if (GEMINI_API_KEY) {
    const prompt = `You are "MentorAI", an advanced AI Science Teacher for Indian school students (NCERT Grade 6-12).
Student Grade Level: ${grade}
Preferred Learning Persona: ${personaConfig.name} (${personaConfig.promptRole})
Preferred Learning Style: ${styleConfig.name} (${styleConfig.instruction})
Student Language: ${language}

The student asks this doubt: "${cleanQ}"

CRITICAL INSTRUCTIONS:
Do NOT produce a boring plain text reply. You must act as a real teacher, mentor, visual explainer, and experiment instructor.
Return strictly a valid JSON object matching this schema (no markdown code blocks, raw JSON only):
{
  "id": "concept_slug",
  "concept": "Core Scientific Concept Name",
  "subject": "Physics | Chemistry | Biology | Mathematics",
  "grade": "${grade}",
  "intuition": "2 engaging sentences introducing the real-world mystery or daily life observation.",
  "explanation": [
    "Step 1: Foundational observation or force",
    "Step 2: Microscopic or mechanical transmission",
    "Step 3: Core scientific law or equation",
    "Step 4: Real-world consequence or practical result"
  ],
  "visualSchematic": "ASCII or text-based visual flow diagram or schematic explaining the mechanism clearly.",
  "misconception": {
    "myth": "The common trap misconception students usually believe.",
    "reality": "The scientific truth and why people get confused."
  },
  "diyExperiment": {
    "title": "Fun 60-Second Tabletop Experiment",
    "items": ["Item 1", "Item 2"],
    "steps": [
      "Step 1: Easy setup",
      "Step 2: Action or observation",
      "Step 3: Conclusion proving the law"
    ]
  },
  "checkQuestion": {
    "question": "A smart single-choice conceptual question testing if the student really understood.",
    "options": [
      { "text": "A) Plausible option", "correct": false, "feedback": "Explanation of why this is a misconception." },
      { "text": "B) Correct scientific option", "correct": true, "feedback": "Encouraging explanation of why this is correct!" },
      { "text": "C) Another distractor", "correct": false, "feedback": "Why this option fails." }
    ]
  },
  "connections": {
    "labId": "labs",
    "labTitle": "Relevant Virtual Lab Simulation",
    "scannerId": "cooker",
    "scannerTitle": "Relevant Object to Scan with Camera",
    "storyTopic": "Matching Cartoon Story Topic",
    "questSubject": "Physics"
  }
}`;

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
          if (parsed && parsed.concept && parsed.explanation && parsed.checkQuestion) {
            return {
              status: 'success',
              source: 'gemini_ai',
              model: m,
              question: cleanQ,
              persona: personaConfig,
              style: styleConfig,
              data: parsed,
            };
          }
        }
      } catch (err) {
        console.warn(`[MentorAI] Model ${m} attempt error:`, err.message);
      }
    }
  }

  // 3. If live AI is unavailable or offline, return curated knowledge or synthesized lesson
  if (localMatch) {
    return {
      status: 'success',
      source: 'curated_mastery',
      question: cleanQ,
      persona: personaConfig,
      style: styleConfig,
      data: localMatch,
    };
  }

  // 4. Default algorithmic synthesis for uncataloged queries
  const cleanTitle = cleanQ.slice(0, 40);
  return {
    status: 'success',
    source: 'synthesized_socratic',
    question: cleanQ,
    persona: personaConfig,
    style: styleConfig,
    data: {
      id: 'custom_socratic',
      concept: `Scientific Principles of ${cleanTitle}`,
      subject: 'Applied STEM Science',
      grade,
      intuition: `Observing ${cleanTitle} reveals fundamental physical laws operating quietly in our everyday surroundings!`,
      explanation: [
        `Step 1: First, observe the system's energy inputs and initial boundary conditions.`,
        `Step 2: By the Law of Conservation of Energy, energy cannot disappear — it converts between kinetic, thermal, and chemical states.`,
        `Step 3: Forces act in balanced pairs according to Newton’s Laws of Motion, maintaining structural stability.`,
        `Step 4: Look around your home or village: You will notice the exact same principle at work in a bicycle, cooker, or water well!`,
      ],
      visualSchematic: `
      [Input Energy / Applied Force]
                    │
                    ▼
      ┌───────────────────────────┐
      │ Conservation of Energy    │  Energy in = Work done + Heat
      │ Force Equilibrium: ΣF = 0 │
      └─────────────┬─────────────┘
                    │
                    ▼
      [Observable Natural Effect: ${cleanTitle}]
      `,
      misconception: {
        myth: 'Complex science only happens in high-tech laboratories with expensive instruments.',
        reality: 'Nature operates by the exact same physical and chemical laws in a village kitchen, a rural field, or outer space!',
      },
      diyExperiment: {
        title: `Observation Test for ${cleanTitle}`,
        items: ['Notebook', 'Pencil', 'Everyday item related to your question'],
        steps: [
          'Step 1: Observe the object or phenomenon carefully for 2 minutes without touching it.',
          'Step 2: Note down what force or energy initiated the action (gravity, muscular push, heat, or electricity).',
          'Step 3: Measure or describe what changes: Is temperature rising? Is speed changing? This identifies the governing scientific law!',
        ],
      },
      checkQuestion: {
        question: `When analyzing any scientific phenomenon like ${cleanTitle}, what fundamental principle always holds true?`,
        options: [
          { text: 'A) Energy is created out of nothing whenever work is done.', correct: false, feedback: 'Incorrect. Energy cannot be created or destroyed, only transformed (1st Law of Thermodynamics).' },
          { text: 'B) Total energy is always conserved; it merely transforms from one form into another.', correct: true, feedback: 'Spot on! The Conservation of Energy is universal across all science.' },
          { text: 'C) Physical laws change depending on the time of day.', correct: false, feedback: 'Incorrect. Universal physical constants remain invariant.' },
        ],
      },
      connections: {
        labId: 'labs',
        labTitle: 'Explore in PhET Interactive Virtual Labs',
        scannerId: 'cooker',
        scannerTitle: 'Scan an Object with Camera Scanner',
        storyTopic: 'Adventures in Science & Discovery',
        questSubject: 'Physics',
      },
    },
  };
}
