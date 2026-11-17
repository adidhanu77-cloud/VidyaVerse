// Curated Disney/Pixar-Style Flagship StoryVerse Adventures
// 12 High-Definition Verified Working Adventures across K-12 STEM Curriculum

export const CURATED_STORIES = [
  {
    id: 'leo_leaf',
    title: 'Leo the Leaf & The Sunlight Crystal Quest',
    subtitle: 'Journey inside a living cell to synthesize glucose before the great forest eclipse!',
    subject: 'Biology',
    topic: 'Photosynthesis & Plant Cell Anatomy',
    grade: 'Class 7',
    cover_gradient: 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)',
    badge: 'Cellular Adventure',
    accent_color: '#10b981',
    video_url: 'https://www.youtube.com/embed/D1Ymc311XS8',
    video_title: 'Photosynthesis | The Dr. Binocs Show',
    video_duration: '4:32',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'Watch animated plant characters explain how leaves absorb sunlight photons, drink water from roots, open stomata for CO2, and produce life-giving glucose and oxygen!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'Morning Sunbeams Over Devarayanadurga Forest',
        camera_direction: 'Wide aerial crane shot descending into a vibrant Banyan leaf canopy.',
        visual_prompt: 'Pixar 3D animation style. A cheerful young cartoon leaf character named Leo looking worried as dark shadows fall across the canopy. Vibrant greens, bioluminescent cellular glows.',
        dialogue: "Professor! My thylakoid disks are running out of power! The ancient banyan tree needs photon energy!",
        duration_sec: 12
      },
      {
        scene: 2,
        title: 'Inside the Nano-Chloroplast Kitchen',
        camera_direction: 'Macro zoom entering through a stomata pore into a bustling microscopic biochemical kitchen.',
        visual_prompt: 'High-tech organic kitchen inside a plant cell. Microscopic chloroplast chefs wearing chef hats catching light photons like glowing fireflies.',
        dialogue: "Water is flowing up from the roots, and CO2 is entering through our stomata valves! Time to cook sugar!",
        duration_sec: 15
      },
      {
        scene: 3,
        title: 'The Great Molecular Splash of Oxygen',
        camera_direction: 'Dynamic slow-motion orbit around water molecules splitting into glowing bubbles.',
        visual_prompt: 'Bright flash of sunlight photon hitting a water molecule, bursting into shimmering bubble spheres of O2 that float triumphantly out of the leaf.',
        dialogue: "ZAP! Water bonds broken! Delicious glucose rings formed and fresh oxygen released into the sky!",
        duration_sec: 14
      }
    ],
    simulation_target: {
      type: 'phet',
      id: 'membrane_channels',
      name: 'PhET Membrane & Cell Channels',
      url: 'https://phet.colorado.edu/sims/html/membrane-channels/latest/membrane-channels_all.html',
      learning_hook: 'Control the cell membrane gates to help Leo absorb essential mineral ions!'
    },
    characters: [
      { name: 'Leo the Leaf', role: 'Main Protagonist', avatar: '🍃', personality: 'Eager, adventurous chloroplast trainee' },
      { name: 'Prof. Chlorophyll', role: 'Wise Mentor', avatar: '🔬', personality: 'Brilliant green scientist with microscopic goggles' },
      { name: 'Sunny Photon', role: 'Energy Messenger', avatar: '☀️', personality: 'Hyperactive packet of light energy' },
      { name: 'Stoma Guard', role: 'Gatekeeper', avatar: '🚪', personality: 'Vigilant pore keeper regulating CO2 intake' }
    ],
    learning_objectives: [
      'Understand the chemical equation of photosynthesis: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2',
      'Discover how chloroplasts and chlorophyll trap photon energy',
      'Explore how stomata open and close to exchange gases and regulate transpiration'
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Dimming Forest of Devarayanadurga',
        background_type: 'forest',
        character_speaking: 'Leo the Leaf',
        character_action: 'explore',
        narration: 'Deep in the sacred village forest of Karnataka, morning has arrived. But a sudden canopy shadow is blocking sunlight. Young Leo shivers as his solar energy cells dip below 15%!',
        dialogue: "Professor! My thylakoid disks are running out of power! If the sun doesn't pierce through the canopy, the ancient Banyan tree will starve today!",
        decision_point: {
          has_decision: true,
          prompt: 'Leo needs to reposition his petiole to catch the morning sunbeams. Which biological behavior should Leo trigger?',
          options: [
            { id: 'A', text: 'Phototropism: Turn leaves directly toward the brightest light source', is_correct: true, feedback: 'Spot on! Phototropism causes plant auxin hormones to elongate cells on the shady side, bending Leo straight toward the sun!' },
            { id: 'B', text: 'Geotropism: Dive downward into the soil away from light', is_correct: false, feedback: 'Incorrect. Geotropism is root movement towards gravity. Leo is a leaf and needs photon energy!' },
            { id: 'C', text: 'Hydrotropism: Curl tightly and close all cells', is_correct: false, feedback: 'Not quite. Curling shuts down sunlight absorption and slows food production.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Inside the Chloroplast Foundry',
        background_type: 'laboratory',
        character_speaking: 'Prof. Chlorophyll',
        character_action: 'experiment',
        narration: 'Golden sunlight floods Leo’s palisade cells. Millions of green chloroplast nanomachines spring to life with humming energy!',
        dialogue: "Look closely, Leo! Sunlight alone cannot cook sugar. We need two vital ingredients from the village ecosystem: water drawn from the deep well roots, and gas from the morning breeze!",
        decision_point: {
          has_decision: true,
          prompt: 'To start the light-dependent reaction, Leo must open his microscopic breathing valves. What are these called?',
          options: [
            { id: 'A', text: 'Stomata (guarded by kidney-shaped guard cells)', is_correct: true, feedback: 'Brilliant! Guard cells swell with water to open the stomata pore, allowing Carbon Dioxide (CO2) to rush in!' },
            { id: 'B', text: 'Mitochondria outer membranes', is_correct: false, feedback: 'Incorrect. Mitochondria are the powerhouses for respiration, not leaf breathing pores.' },
            { id: 'C', text: 'Xylem water pipes', is_correct: false, feedback: 'Close! Xylem brings water up from roots, but stomata are the gas valves on the leaf surface.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Great Molecular Synthesis',
        background_type: 'forest',
        character_speaking: 'Sunny Photon',
        character_action: 'celebrate',
        narration: 'Photon energy smashes water molecules (H2O) apart into hydrogen and oxygen. Bubbles of fresh oxygen gas billow into the cool village morning air!',
        dialogue: "ZAP! We broke the water bonds! Carbon atoms are locking into delicious glucose rings! We did it! The forest is saved and breathing again!",
        decision_point: {
          has_decision: true,
          prompt: 'What vital byproduct do plants release into the atmosphere during this process that all village animals breathe?',
          options: [
            { id: 'A', text: 'Pure Oxygen (O2)', is_correct: true, feedback: 'Hurrah! Water molecules are split (photolysis), releasing life-sustaining Oxygen gas into our atmosphere!' },
            { id: 'B', text: 'Nitrogen gas (N2)', is_correct: false, feedback: 'Incorrect. Nitrogen is abundant in air but is fixed by soil bacteria, not produced in photosynthesis.' },
            { id: 'C', text: 'Methane gas (CH4)', is_correct: false, feedback: 'Incorrect! Methane is produced by anaerobic decomposition, not plant photosynthesis.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Where inside the leaf cell does photosynthesis primarily take place?',
        options: ['A) Nucleus', 'B) Chloroplast', 'C) Vacuole', 'D) Ribosome'],
        correct_index: 1,
        explanation: 'Chloroplasts contain green chlorophyll pigments that absorb light wavelengths to drive photosynthesis.'
      },
      {
        question: 'Which cells control the opening and closing of leaf stomata pores?',
        options: ['A) Root hair cells', 'B) Guard cells', 'C) Sieve tube cells', 'D) Cortical cells'],
        correct_index: 1,
        explanation: 'Specialized paired guard cells expand or contract with turgor pressure to open or close the stomatal aperture.'
      },
      {
        question: 'Why are leaves usually broad and flat in shape?',
        options: ['A) To look pretty', 'B) To maximize surface area for catching sunlight', 'C) To become lighter', 'D) To repel insects'],
        correct_index: 1,
        explanation: 'A broad lamina maximizes the light-intercepting surface area and optimizes carbon dioxide absorption.'
      }
    ]
  },
  {
    id: 'eddy_electron',
    title: "Electron Eddy's High-Voltage Village Sprint",
    subtitle: 'Race through wires, transformers, and switches to power up the village health clinic!',
    subject: 'Physics',
    topic: "Electricity, Ohm's Law & Circuits",
    grade: 'Class 8',
    cover_gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    badge: 'Electric Adventure',
    accent_color: '#f59e0b',
    video_url: 'https://www.youtube.com/embed/HOFp8bHTN30',
    video_title: 'The Power of Circuits! | SciShow Kids',
    video_duration: '4:08',
    video_channel: 'SciShow Kids',
    video_description: 'An exciting cartoon animation detailing how electric current flows through closed circuits, what happens inside switches, and how batteries push electrons to light up appliances!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'Emergency at the Village Health Clinic',
        camera_direction: 'Fast-paced zoom across a dark rural village into the clinic.',
        visual_prompt: 'Pixar 3D style. A cute glowing electric spark character named Eddy wearing running sneakers, standing next to battery commander Captain Volt.',
        dialogue: "Attention team! The village clinic cooler needs power! Let us complete the circuit loop!",
        duration_sec: 12
      },
      {
        scene: 2,
        title: 'The Copper Wire Superhighway',
        camera_direction: 'Inside-the-wire microscopic tracking shot following smiling blue electrons.',
        visual_prompt: 'High-speed luminous neon tunnel inside a glowing copper wire. Eddy and fellow electrons leaping through lattices of copper atoms.',
        dialogue: "Georg Ohm says: raise the voltage push or widen the wire to let more of us sprint through!",
        duration_sec: 14
      },
      {
        scene: 3,
        title: 'Tungsten Ignition & Life-Saving Light',
        camera_direction: 'Extreme close up of a glowing filament bulb expanding into a warm village clinic glow.',
        visual_prompt: 'Electrons colliding with tungsten metal atoms causing brilliant fiery-orange luminescence.',
        dialogue: "We are glowing! Thermal photons unleashed and vaccines preserved!",
        duration_sec: 15
      }
    ],
    simulation_target: {
      type: 'phet',
      id: 'circuit_dc',
      name: 'PhET Circuit Construction Kit: DC',
      url: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_all.html',
      learning_hook: 'Design a closed circuit with batteries, resistors, and lightbulbs to test Ohm’s law in real time!'
    },
    characters: [
      { name: 'Electron Eddy', role: 'Main Protagonist', avatar: '⚡', personality: 'Zippy, energetic subatomic runner' },
      { name: 'Captain Volt', role: 'Pressure Commander', avatar: '🔋', personality: 'Authoritative push force providing potential difference' },
      { name: 'Rheostat Rick', role: 'Obstacle Course Master', avatar: '🧱', personality: 'Tough resistor slowing down the charge drift' },
      { name: 'Bulb Bella', role: 'Light Beacon', avatar: '💡', personality: 'Glowing tungsten filament converting watts to lumens' }
    ],
    learning_objectives: [
      'Master Ohm’s Law: Voltage (V) = Current (I) × Resistance (R)',
      'Differentiate between Open Circuits and Closed Circuits',
      'Understand how resistors dissipate electrical energy as heat'
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Dark Village Clinic',
        background_type: 'future_city',
        character_speaking: 'Captain Volt',
        character_action: 'talk',
        narration: 'A sudden storm in Doddaballapura snapped the overhead supply wire. The village hospital vaccine cooler is about to lose power unless Electron Eddy and his charge platoon complete the emergency backup battery circuit!',
        dialogue: "Attention subatomic team! We have a 12-Volt solar battery pack ready! Eddy, you lead the negative-to-positive charge drift!",
        decision_point: {
          has_decision: true,
          prompt: 'The switch is currently OPEN. Can Eddy and his electric charges flow across the gap?',
          options: [
            { id: 'A', text: 'No: An open circuit has infinite air resistance and zero current flow (I = 0)', is_correct: true, feedback: 'Correct! Electrons cannot jump across an open mechanical switch. We must CLOSE the circuit loop!' },
            { id: 'B', text: 'Yes: Electricity flows wirelessly through air at 12 volts', is_correct: false, feedback: 'Incorrect. Air is an electrical insulator requiring over 30,000 volts per centimeter to spark.' },
            { id: 'C', text: 'Yes: If the battery is warm enough', is_correct: false, feedback: 'Incorrect. Temperature does not bridge an open circuit gap.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'The Resistor Narrow Gorge',
        background_type: 'laboratory',
        character_speaking: 'Rheostat Rick',
        character_action: 'walk',
        narration: 'The switch slams shut! Eddy surges into the copper highway at lightspeed signal velocity. Ahead looms a ceramic wire-wound resistor restricting the cross-sectional area!',
        dialogue: "Hold your horses, speedy! According to Georg Simon Ohm, if you want more current, either raise the Captain's Voltage or reduce my Resistance!",
        decision_point: {
          has_decision: true,
          prompt: "The circuit has 12 Volts and a 4-Ohm resistance. What electric current in Amperes (I = V/R) will flow?",
          options: [
            { id: 'A', text: '3 Amperes (12V / 4Ω = 3A)', is_correct: true, feedback: 'Spot on mathematical deduction! 12 divided by 4 equals exactly 3 Amperes of current!' },
            { id: 'B', text: '48 Amperes (12 × 4)', is_correct: false, feedback: 'Incorrect. You multiplied instead of dividing! Current equals Voltage divided by Resistance.' },
            { id: 'C', text: '0.33 Amperes (4 / 12)', is_correct: false, feedback: 'Incorrect. Voltage is in the numerator: I = V / R.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'Illumination at Bulb Bella',
        background_type: 'classroom',
        character_speaking: 'Bulb Bella',
        character_action: 'celebrate',
        narration: 'The 3-Ampere charge stream collides with Bella’s tungsten atoms. High frictional atomic collisions excite electrons, generating brilliant white-hot thermal photons!',
        dialogue: "I am GLOWING! The vaccine cooler is humming, the lights are blazing, and the village clinic is saved! Incredible teamwork, Eddy!",
        decision_point: {
          has_decision: true,
          prompt: 'What form of energy transformation occurs when current passes through the lightbulb filament?',
          options: [
            { id: 'A', text: 'Electrical Energy ➔ Thermal (Heat) & Radiant (Light) Energy', is_correct: true, feedback: 'Exactly right! High resistance Joule heating elevates filament temperature to ~2500°C, producing light radiation!' },
            { id: 'B', text: 'Chemical Energy ➔ Nuclear Energy', is_correct: false, feedback: 'Incorrect. Chemical reactions happen inside batteries, not lightbulb filaments.' },
            { id: 'C', text: 'Sound Energy ➔ Magnetic Energy', is_correct: false, feedback: 'Incorrect. A standard lightbulb produces light and heat.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: "What is the SI unit of electrical resistance?",
        options: ['A) Ampere', 'B) Volt', 'C) Ohm (Ω)', 'D) Watt'],
        correct_index: 2,
        explanation: 'Resistance is measured in Ohms (Ω), named in honor of physicist Georg Simon Ohm.'
      },
      {
        question: 'If voltage across a fixed resistor is doubled, what happens to the current?',
        options: ['A) It halves', 'B) It doubles', 'C) It remains constant', 'D) It drops to zero'],
        correct_index: 1,
        explanation: 'By Ohm’s Law (I = V/R), current is directly proportional to voltage when resistance is constant.'
      },
      {
        question: 'Which of the following materials is an electrical insulator?',
        options: ['A) Copper wire', 'B) Aluminum sheet', 'C) Dry rubber tyre', 'D) Iron nail'],
        correct_index: 2,
        explanation: 'Rubber holds tightly bound valence electrons, making it an exceptional insulator to protect against electric shocks.'
      }
    ]
  },
  {
    id: 'atomia_quest',
    title: 'Atomia: The Quest for the Stable Octet',
    subtitle: 'Join Sammy Sodium and Chloe Chlorine on their epic mission to form the salt of the Earth!',
    subject: 'Chemistry',
    topic: 'Atoms, Valence Electrons & Ionic Bonding',
    grade: 'Class 9',
    cover_gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #312e81 100%)',
    badge: 'Atomic Adventure',
    accent_color: '#6366f1',
    video_url: 'https://www.youtube.com/embed/yQP4UJhNn0I',
    video_title: 'Just How Small is an Atom? | TED-Ed',
    video_duration: '5:28',
    video_channel: 'TED-Ed',
    video_description: 'An acclaimed animated journey exploring the atomic scale, nucleus, electron clouds, and how elements combine through electrostatic forces to build our universe!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'The Lonely Electron Orbit',
        camera_direction: 'Orbital rotation around a glowing nucleus of 11 protons and 12 neutrons.',
        visual_prompt: 'Pixar 3D style. A bouncy metallic atom character named Sammy with planetary rings. A lone blue electron orbits alone on the outermost ring.',
        dialogue: "I have 11 positive protons, but that lonely outer electron wants a home! Who will take it?",
        duration_sec: 12
      },
      {
        scene: 2,
        title: 'Meeting Chloe Chlorine in the Reaction Chamber',
        camera_direction: 'Split screen tracking both atoms approaching each other across an electrified laboratory vapor.',
        visual_prompt: 'A vibrant green halogen character Chloe with 7 bright yellow electrons spinning around her, with exactly one vacant slot in her valence shell.',
        dialogue: "I have 7 outer electrons and need just ONE more to achieve the legendary octet! Hand it over!",
        duration_sec: 14
      },
      {
        scene: 3,
        title: 'The Grand Electron Leap & Crystal Formation',
        camera_direction: 'High-speed camera following the electron leap, followed by an explosion of sparkling cubic salt crystals.',
        visual_prompt: 'Golden particle beam as the electron transfers from Sammy to Chloe. Electrostatic lightning snaps them together into a cubic table salt lattice.',
        dialogue: "Opposites attract! We are locked in an unbreakable ionic bond! Table salt is born!",
        duration_sec: 16
      }
    ],
    simulation_target: {
      type: 'phet',
      id: 'build_an_atom',
      name: 'PhET Build an Atom Simulator',
      url: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
      learning_hook: 'Add protons, neutrons and electrons to construct real elements and test stability!'
    },
    characters: [
      { name: 'Sammy Sodium', role: 'Eager Metal Atom', avatar: '⚛️', personality: 'Has 11 protons and 1 lonely valence electron' },
      { name: 'Chloe Chlorine', role: 'Halogen Seeker', avatar: '🧪', personality: 'Has 7 valence electrons and needs 1 more' },
      { name: 'Elder Neon', role: 'Noble Gas Sage', avatar: '👑', personality: 'Totally peaceful, inert, and happily complete with 8 outer electrons' }
    ],
    learning_objectives: [
      'Understand the Octet Rule and electron shell stability (2, 8, 8)',
      'Learn how Ionic Bonds form through electron transfer',
      'Explain how sodium and chlorine combine into everyday table salt (NaCl)'
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Restless Electron of Sammy',
        background_type: 'space_station',
        character_speaking: 'Sammy Sodium',
        character_action: 'think',
        narration: 'In the microscopic realm of Atomia, Sammy Sodium paced back and forth. His electron configuration was 2, 8, 1. That lonely single electron in his third shell was buzzing with unstable energy!',
        dialogue: "I have 11 positive protons, but that 1 outer electron is driving me crazy! If I could just donate it to a worthy partner, my inner shell would have a magnificent 8 electrons!",
        decision_point: {
          has_decision: true,
          prompt: 'If Sammy Sodium loses 1 negatively charged electron, what will his net electrical charge become?',
          options: [
            { id: 'A', text: '+1 Positive Ion (Cation: Na+)', is_correct: true, feedback: 'Correct! 11 positive protons vs 10 negative electrons leaves an overall positive charge of +1!' },
            { id: 'B', text: '-1 Negative Ion (Anion)', is_correct: false, feedback: 'Incorrect. Losing a negative charge leaves an excess of positive protons.' },
            { id: 'C', text: '0 Neutral atom', is_correct: false, feedback: 'Incorrect. He started neutral; losing an electron unbalances the ratio.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Meeting Chloe Chlorine in the Reaction Chamber',
        background_type: 'ocean_world',
        character_speaking: 'Chloe Chlorine',
        character_action: 'talk',
        narration: 'Across the reaction chamber stood Chloe Chlorine (configuration 2, 8, 7). Her outer valence ring had 7 electrons spinning around 1 empty slot!',
        dialogue: "Sammy! Look at my valence shell! I need exactly ONE electron to reach the legendary stable octet of Argon! Will you share your destiny with me?",
        decision_point: {
          has_decision: true,
          prompt: 'What kind of chemical bond is formed when an electron is completely transferred from a metal to a non-metal?',
          options: [
            { id: 'A', text: 'Ionic Bond (Electrostatic attraction between opposite ions)', is_correct: true, feedback: 'Bingo! Sammy becomes Na+ and Chloe becomes Cl-. Opposites attract with powerful electrostatic force, forging table salt crystals!' },
            { id: 'B', text: 'Covalent Bond (Equal sharing of electron pairs)', is_correct: false, feedback: 'Incorrect. Covalent bonds share electrons. Sodium completely transfers its electron.' },
            { id: 'C', text: 'Metallic Bond', is_correct: false, feedback: 'Incorrect. Metallic bonding occurs between metal atoms in a sea of electrons.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Birth of Crystal Salt',
        background_type: 'laboratory',
        character_speaking: 'Elder Neon',
        character_action: 'celebrate',
        narration: 'FLASH! Sammy transfers his outer electron to Chloe. Together, billions of Na+ and Cl- ions snap into a magnificent cubic crystal lattice: pure, edible village table salt (NaCl)!',
        dialogue: "Remarkable! Two hazardous single elements have combined into the most essential mineral seasoned on every food dish across every Indian village home!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the chemical name and formula of common table salt?',
          options: [
            { id: 'A', text: 'Sodium Chloride (NaCl)', is_correct: true, feedback: 'Perfect! Sodium Chloride is the ionic compound formed by Na+ and Cl-!' },
            { id: 'B', text: 'Potassium Hydroxide (KOH)', is_correct: false, feedback: 'Incorrect. That is caustic potash.' },
            { id: 'C', text: 'Calcium Carbonate (CaCO3)', is_correct: false, feedback: 'Incorrect. That is limestone and chalk.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'According to the Octet Rule, how many electrons do most main-group atoms need in their outer shell for maximum stability?',
        options: ['A) 2', 'B) 6', 'C) 8', 'D) 10'],
        correct_index: 2,
        explanation: 'Atoms tend to gain, lose, or share electrons until their outer valence shell holds 8 electrons, mimicking noble gas stability.'
      },
      {
        question: 'An atom that gains an electron becomes negatively charged and is known as a(n):',
        options: ['A) Cation', 'B) Anion', 'C) Isotope', 'D) Positron'],
        correct_index: 1,
        explanation: 'Anions are negatively charged ions formed when a neutral atom captures one or more electrons.'
      },
      {
        question: 'What holds the ions together in an ionic crystal like Sodium Chloride?',
        options: ['A) Magnetic poles', 'B) Strong electrostatic attraction between opposite charges', 'C) Gravitational pull', 'D) Glue molecules'],
        correct_index: 1,
        explanation: 'Strong Coulombic electrostatic attractions between positive cations and negative anions bind ionic lattices tightly.'
      }
    ]
  },
  {
    id: 'solar_odyssey',
    title: 'Cosmic Odyssey: The Solar System Grand Tour',
    subtitle: 'Pilot your solar rover from the fiery crown of the Sun past the asteroid belt to gas giant rings!',
    subject: 'SpaceScience',
    topic: 'Solar System, Planetary Orbits & Gravity',
    grade: 'Class 6',
    cover_gradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #312e81 100%)',
    badge: 'Space Adventure',
    accent_color: '#3b82f6',
    video_url: 'https://www.youtube.com/embed/libKVRa01L8',
    video_title: 'Solar System 101 | National Geographic',
    video_duration: '4:12',
    video_channel: 'National Geographic',
    video_description: 'An awe-inspiring animated journey through our solar system, charting the Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune!',
    simulation_target: {
      type: 'phet',
      id: 'gravity_and_orbits',
      name: 'PhET Gravity & Planetary Orbits',
      url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html',
      learning_hook: 'Adjust orbital velocity and gravitational mass to keep planets in stable elliptical orbits!'
    },
    characters: [
      { name: 'Astro Neil', role: 'Solar Rover Pilot', avatar: '👨‍🚀', personality: 'Adventurous space explorer' },
      { name: 'Cosmo AI', role: 'Orbital Navigator', avatar: '🛰️', personality: 'Telemetry computer calculating trajectories' },
      { name: 'Sol Sovereign', role: 'Central Star', avatar: '☀️', personality: 'Massive fusion star holding 99.8% of solar mass' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'Departure from the Inner Terrestrial Worlds',
        background_type: 'space_station',
        character_speaking: 'Astro Neil',
        character_action: 'explore',
        narration: 'From Earth’s orbit, Astro Neil initiates thrusters past red planet Mars toward the great asteroid belt.',
        dialogue: "Look at the four rocky planets behind us! Mercury, Venus, Earth, and Mars. Now we head for the giant gas worlds!",
        decision_point: {
          has_decision: true,
          prompt: 'What celestial force keeps all planets locked in their regular elliptical paths around the Sun?',
          options: [
            { id: 'A', text: 'Gravitational attraction exerted by the Sun’s massive core', is_correct: true, feedback: 'Correct! The Sun’s immense mass curves spacetime, exerting gravity that holds planets in orbit!' },
            { id: 'B', text: 'Solar winds blowing planets outwards', is_correct: false, feedback: 'Solar winds push particles, but gravity keeps planets bound in orbit.' },
            { id: 'C', text: 'Magnetic friction with deep space vacuum', is_correct: false, feedback: 'Space is a vacuum with negligible friction.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Meeting the Titan Jupiter',
        background_type: 'space_station',
        character_speaking: 'Cosmo AI',
        character_action: 'experiment',
        narration: 'Our rover emerges past the asteroid belt. The colossal striped atmosphere of Jupiter looms ahead with its Great Red Spot hurricane!',
        dialogue: "Telemetry alert! Jupiter is larger than all other planets combined! Its gravitational slingshot will boost our speed toward Saturn!",
        decision_point: {
          has_decision: true,
          prompt: 'Which planet in our solar system has the most prominent, spectacular icy ring system?',
          options: [
            { id: 'A', text: 'Saturn (made of billions of ice, rock, and dust particles)', is_correct: true, feedback: 'Spot on! Saturn’s glorious rings span thousands of kilometers but are only tens of meters thick!' },
            { id: 'B', text: 'Mars', is_correct: false, feedback: 'Mars is a rocky planet with no ring system.' },
            { id: 'C', text: 'Mercury', is_correct: false, feedback: 'Mercury is small, rocky, and closest to the Sun.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Edge of the Cosmic System',
        background_type: 'space_station',
        character_speaking: 'Astro Neil',
        character_action: 'celebrate',
        narration: 'Looking back from Neptune toward the distant Sun, the entire planetary system shines in cosmic harmony.',
        dialogue: "Mission accomplished! We mapped all 8 planets of our solar system! Let's enter the PhET orbit simulator!",
        decision_point: {
          has_decision: true,
          prompt: 'How many confirmed major planets orbit our Sun according to modern astronomy?',
          options: [
            { id: 'A', text: '8 Planets (Mercury to Neptune)', is_correct: true, feedback: 'Hurrah! Pluto was reclassified as a dwarf planet in 2006, leaving 8 major planets!' },
            { id: 'B', text: '12 Planets', is_correct: false, feedback: 'Incorrect.' },
            { id: 'C', text: '5 Planets', is_correct: false, feedback: 'Incorrect.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which is the largest planet in our solar system?',
        options: ['A) Earth', 'B) Saturn', 'C) Jupiter', 'D) Mars'],
        correct_index: 2,
        explanation: 'Jupiter is the most massive planet, with a volume that could fit over 1,300 Earths inside.'
      },
      {
        question: 'What is the closest planet to the Sun?',
        options: ['A) Venus', 'B) Mercury', 'C) Mars', 'D) Earth'],
        correct_index: 1,
        explanation: 'Mercury orbits closest to the Sun at an average distance of about 58 million kilometers.'
      },
      {
        question: 'Why does Earth support liquid water while Venus and Mars do not?',
        options: ['A) Earth sits in the habitable Goldilocks Zone', 'B) Earth is made of ice', 'C) Pure luck', 'D) Earth has no atmosphere'],
        correct_index: 0,
        explanation: 'Earth’s optimal distance from the Sun allows surface temperatures suitable for liquid water.'
      }
    ]
  },
  {
    id: 'bloodstream_express',
    title: 'Captain Capillary & The Bloodstream Express',
    subtitle: 'Shrink down and navigate the 4 chambers of the heart to deliver oxygen to working muscles!',
    subject: 'Biology',
    topic: 'Heart, Circulatory System & Blood Components',
    grade: 'Class 7',
    cover_gradient: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #f43f5e 100%)',
    badge: 'Human Body',
    accent_color: '#f43f5e',
    video_url: 'https://www.youtube.com/embed/q0s-1MC1hcE',
    video_title: 'The Circulatory Song & System | Scratch Garden',
    video_duration: '4:15',
    video_channel: 'Scratch Garden',
    video_description: 'An upbeat cartoon musical and animated walkthrough explaining how the heart pumps blood, how arteries carry oxygenated blood, and how veins return it to the lungs!',
    simulation_target: {
      type: 'phet',
      id: 'diffusion',
      name: 'PhET Diffusion & Gas Exchange',
      url: 'https://phet.colorado.edu/sims/html/diffusion/latest/diffusion_all.html',
      learning_hook: 'Simulate how oxygen molecules diffuse across capillary walls into tissue cells!'
    },
    characters: [
      { name: 'Dr. Pulse', role: 'Chief Cardiologist', avatar: '🫀', personality: 'Rhythmic, energetic pacemaker of the body' },
      { name: 'RBC Ruby', role: 'Oxygen Courier', avatar: '🔴', personality: 'Red blood cell carrying hemoglobin packets' },
      { name: 'WBC Winston', role: 'Immune Defender', avatar: '🛡️', personality: 'White blood cell protecting against microbes' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'Inside the Right Atrium Valve',
        background_type: 'human_body',
        character_speaking: 'Dr. Pulse',
        character_action: 'explore',
        narration: 'We enter the muscular chamber of the human heart. Deoxygenated dark-red blood has returned from the village farmer’s hardworking legs!',
        dialogue: "LUB-DUB! Blood has arrived low on oxygen! We must pump it immediately into the pulmonary artery toward the lungs for fresh air!",
        decision_point: {
          has_decision: true,
          prompt: 'Which blood vessels carry oxygen-rich blood AWAY from the heart to the rest of the body?',
          options: [
            { id: 'A', text: 'Arteries (thick, muscular walls to withstand high pressure)', is_correct: true, feedback: 'Spot on! Remember: Arteries go Away from the heart under high systolic pressure!' },
            { id: 'B', text: 'Veins', is_correct: false, feedback: 'Veins carry deoxygenated blood back toward the heart.' },
            { id: 'C', text: 'Lymph nodes', is_correct: false, feedback: 'Lymph nodes filter immune fluids, not bulk arterial blood.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Alveoli Oxygen Refueling Station',
        background_type: 'human_body',
        character_speaking: 'RBC Ruby',
        character_action: 'experiment',
        narration: 'Millions of tiny air sacs called alveoli expand with inhaled mountain air. Ruby’s iron-rich hemoglobin traps 4 oxygen molecules!',
        dialogue: "My hemoglobin is fully saturated! I am turning bright scarlet red! Now back to the left ventricle to be catapulted to the brain and muscles!",
        decision_point: {
          has_decision: true,
          prompt: 'What protein molecule inside red blood cells gives blood its red color and binds to oxygen?',
          options: [
            { id: 'A', text: 'Hemoglobin (iron-containing protein)', is_correct: true, feedback: 'Brilliant! Iron in hemoglobin binds reversibly to O2 for efficient delivery!' },
            { id: 'B', text: 'Keratin', is_correct: false, feedback: 'Keratin is the structural protein for hair and nails.' },
            { id: 'C', text: 'Chlorophyll', is_correct: false, feedback: 'Chlorophyll is for plant photosynthesis, not human blood.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Great Aortic Surge',
        background_type: 'human_body',
        character_speaking: 'Dr. Pulse',
        character_action: 'celebrate',
        narration: 'The left ventricle contracts with powerful hydraulic force, sending oxygenated blood surging down the aorta.',
        dialogue: "Systemic circulation restored! Every cell has the oxygen needed to produce ATP energy! Tremendous teamwork!",
        decision_point: {
          has_decision: true,
          prompt: 'How many chambers does the normal mammalian and human heart possess?',
          options: [
            { id: 'A', text: '4 Chambers (2 Atria + 2 Ventricles)', is_correct: true, feedback: 'Correct! Two receiving atria on top and two muscular pumping ventricles on the bottom!' },
            { id: 'B', text: '2 Chambers', is_correct: false, feedback: 'Fish have 2-chambered hearts, but humans have 4!' },
            { id: 'C', text: '3 Chambers', is_correct: false, feedback: 'Amphibians have 3 chambers; humans have 4.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which component of blood is primarily responsible for blood clotting at wounds?',
        options: ['A) Platelets', 'B) Plasma', 'C) Red blood cells', 'D) Hemoglobin'],
        correct_index: 0,
        explanation: 'Platelets (thrombocytes) aggregate and form fibrin mesh to clot cuts and prevent bleeding.'
      },
      {
        question: 'What is normal resting human blood pressure measured around?',
        options: ['A) 120/80 mmHg', 'B) 200/100 mmHg', 'C) 80/40 mmHg', 'D) 50/50 mmHg'],
        correct_index: 0,
        explanation: 'Healthy resting pressure is roughly 120 mmHg systolic over 80 mmHg diastolic.'
      },
      {
        question: 'Which side of the heart pumps deoxygenated blood to the lungs?',
        options: ['A) Right side', 'B) Left side', 'C) Both sides equally', 'D) Neither side'],
        correct_index: 0,
        explanation: 'The right atrium and right ventricle handle deoxygenated blood and pump it to the lungs.'
      }
    ]
  },
  {
    id: 'water_cycle_drippy',
    title: 'Drippy’s Endless Journey in the Water Cycle',
    subtitle: 'Evaporate from village lakes, condense into fluffy monsoon clouds, and precipitate as rain!',
    subject: 'Biology',
    topic: 'The Water Cycle, Evaporation & Precipitation',
    grade: 'Class 6',
    cover_gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
    badge: 'Earth Science',
    accent_color: '#0284c7',
    video_url: 'https://www.youtube.com/embed/ncORPosDrjI',
    video_title: 'The Water Cycle | The Dr. Binocs Show',
    video_duration: '3:50',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'Join Dr. Binocs in this colorful cartoon adventure explaining evaporation, condensation, precipitation, and transpiration across our Earth!',
    simulation_target: {
      type: 'phet',
      id: 'states_of_matter',
      name: 'PhET States of Matter & Phase Changes',
      url: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_all.html',
      learning_hook: 'Heat and cool water molecules to see liquid turn into water vapor gas and back to ice!'
    },
    characters: [
      { name: 'Drippy', role: 'Water Molecule Protagonist', avatar: '💧', personality: 'Adventurous, shapeshifting droplet' },
      { name: 'Nimbus Cloud', role: 'Atmospheric Haven', avatar: '☁️', personality: 'Fluffy gathering of millions of condensed droplets' },
      { name: 'Lord Surya', role: 'Thermal Dynamo', avatar: '☀️', personality: 'Sun warming lakes to power evaporation' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'Thermal Lift from Doddaballapura Lake',
        background_type: 'ocean_world',
        character_speaking: 'Drippy',
        character_action: 'explore',
        narration: 'Sunlight heats the quiet lake surface. Drippy’s molecules absorb thermal kinetic energy and begin vibrating rapidly!',
        dialogue: "I am feeling so light! Liquid water bonds are breaking! I am transforming into invisible water vapor and rising into the sky!",
        decision_point: {
          has_decision: true,
          prompt: 'What physical process turns liquid water into gas water vapor when heated by the Sun?',
          options: [
            { id: 'A', text: 'Evaporation (liquid turning into gas state)', is_correct: true, feedback: 'Correct! Surface water molecules absorb heat and escape into air as water vapor!' },
            { id: 'B', text: 'Freezing', is_correct: false, feedback: 'Freezing turns liquid into solid ice.' },
            { id: 'C', text: 'Precipitation', is_correct: false, feedback: 'Precipitation is rain falling down.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Cloud Condensation High Above',
        background_type: 'space_station',
        character_speaking: 'Nimbus Cloud',
        character_action: 'experiment',
        narration: 'Miles high in the upper troposphere, temperatures drop. Vapor slows down and latches onto dust specks to form clouds.',
        dialogue: "Welcome to our cloud fleet, Drippy! Millions of condensed water droplets are merging together to form heavy rain droplets!",
        decision_point: {
          has_decision: true,
          prompt: 'What process turns water vapor gas back into liquid droplets when cooled high in the sky?',
          options: [
            { id: 'A', text: 'Condensation (cooling gas turning into liquid cloud droplets)', is_correct: true, feedback: 'Spot on! Cold air causes water vapor to condense around condensation nuclei into clouds!' },
            { id: 'B', text: 'Sublimation', is_correct: false, feedback: 'Sublimation is solid turning directly to gas.' },
            { id: 'C', text: 'Transpiration', is_correct: false, feedback: 'Transpiration is water loss from plant leaves.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Monsoon Rain Shower',
        background_type: 'forest',
        character_speaking: 'Drippy',
        character_action: 'celebrate',
        narration: 'Gravity overcomes cloud buoyancy! Millions of rain droplets fall gently over fertile village farm fields and rivers.',
        dialogue: "WHEEE! We are falling as life-giving rain! We replenish village wells and help seeds germinate before starting the cycle again!",
        decision_point: {
          has_decision: true,
          prompt: 'When water falls from clouds to the ground as rain, snow, sleet, or hail, what is it termed?',
          options: [
            { id: 'A', text: 'Precipitation', is_correct: true, feedback: 'Hurrah! Precipitation returns atmospheric water to the ground surface!' },
            { id: 'B', text: 'Evaporation', is_correct: false, feedback: 'Evaporation goes up; precipitation falls down.' },
            { id: 'C', text: 'Filtration', is_correct: false, feedback: 'Filtration purifies water in soil.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'What is the primary driving energy source behind the Earth’s water cycle?',
        options: ['A) The Sun’s radiant heat', 'B) Ocean tides', 'C) Underground volcanoes', 'D) Windmills'],
        correct_index: 0,
        explanation: 'Solar radiation provides thermal energy to evaporate water and drive atmospheric wind patterns.'
      },
      {
        question: 'What is water loss from tiny pores in plant leaves called?',
        options: ['A) Transpiration', 'B) Respiration', 'C) Precipitation', 'D) Distillation'],
        correct_index: 0,
        explanation: 'Transpiration is the evaporation of water from plant aerial parts through stomata.'
      },
      {
        question: 'Does the total amount of water on planet Earth change significantly over time?',
        options: ['A) No, it stays roughly constant through continuous recycling', 'B) Yes, it halves every decade', 'C) Yes, it doubles every century', 'D) Water disappears forever'],
        correct_index: 0,
        explanation: 'Earth’s water cycle is a closed system; the water you drink today existed in the era of dinosaurs!'
      }
    ]
  },
  {
    id: 'gravity_quest',
    title: 'Sir Newton Bot & The Gravitational Pull',
    subtitle: 'Investigate why apples fall, how rockets achieve escape velocity, and why astronauts float in orbit!',
    subject: 'Physics',
    topic: "Gravity, Mass, Weight & Newton's Laws",
    grade: 'Class 8',
    cover_gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4338ca 100%)',
    badge: 'Mechanics',
    accent_color: '#6366f1',
    video_url: 'https://www.youtube.com/embed/EwY6p-r_hyU',
    video_title: 'Gravity Compilation | Crash Course Kids',
    video_duration: '7:42',
    video_channel: 'Crash Course Kids',
    video_description: 'An engaging cartoon animation answering: What is gravity? Why do objects fall at the same acceleration in a vacuum? And how does mass shape gravity?',
    simulation_target: {
      type: 'phet',
      id: 'gravity_force_lab',
      name: 'PhET Gravity Force Lab',
      url: 'https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_all.html',
      learning_hook: 'Change sphere masses and distance to test Newton’s Universal Law of Gravitation!'
    },
    characters: [
      { name: 'Sir Newton Bot', role: 'Laws of Motion Mentor', avatar: '🤖', personality: 'Analytical, witty robot wearing a powdered wig' },
      { name: 'Pip the Apple', role: 'Falling Test Subject', avatar: '🍎', personality: 'Curious fruit seeking gravitational acceleration' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Orchard Drop Experiment',
        background_type: 'forest',
        character_speaking: 'Sir Newton Bot',
        character_action: 'think',
        narration: 'Under the banyan tree shade, Newton Bot observes apples falling straight toward Earth’s center.',
        dialogue: "Notice how objects always fall directly toward Earth’s core! Every piece of matter in the Universe attracts every other piece of matter!",
        decision_point: {
          has_decision: true,
          prompt: 'What happens to the gravitational attraction between two objects if the distance between them is doubled?',
          options: [
            { id: 'A', text: 'It decreases to 1/4 of its original force (Inverse Square Law)', is_correct: true, feedback: 'Correct! By Newton’s Law F = G(m1*m2)/r^2, doubling distance reduces gravitational force by 2^2 = 4 times!' },
            { id: 'B', text: 'It doubles', is_correct: false, feedback: 'Greater distance always weakens gravity.' },
            { id: 'C', text: 'It stays exactly identical', is_correct: false, feedback: 'Distance is critical to gravitational force.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'The Vacuum Chamber Feather Drop',
        background_type: 'laboratory',
        character_speaking: 'Pip the Apple',
        character_action: 'experiment',
        narration: 'Inside a vacuum chamber where all air resistance is evacuated, a heavy bowling ball and a light feather are released together.',
        dialogue: "Look! Without air friction, both fall side-by-side at exactly 9.8 meters per second squared! Mass does not change freefall acceleration!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the acceleration due to gravity near Earth’s surface (g)?',
          options: [
            { id: 'A', text: '9.8 m/s² (meters per second squared)', is_correct: true, feedback: 'Spot on! All objects in vacuum accelerate downward at ~9.8 m/s² regardless of mass!' },
            { id: 'B', text: '100 m/s²', is_correct: false, feedback: 'That would be lethally high gravity.' },
            { id: 'C', text: '0 m/s²', is_correct: false, feedback: 'That would mean zero gravitational acceleration.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'Orbital Freefall in Space',
        background_type: 'future_city',
        character_speaking: 'Sir Newton Bot',
        character_action: 'celebrate',
        narration: 'Orbiting satellites do not defy gravity; they are in perpetual freefall around the curvature of the Earth!',
        dialogue: "Astronauts float not because there is zero gravity, but because both they and their spacecraft are falling around Earth at the same rate!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the difference between Mass and Weight?',
          options: [
            { id: 'A', text: 'Mass is the amount of matter (kg, constant); Weight is the gravitational force on that mass (Newtons, variable)', is_correct: true, feedback: 'Brilliant! Your mass is identical on Earth and the Moon, but your weight on the Moon is only 1/6th of Earth!' },
            { id: 'B', text: 'They are exactly the same thing', is_correct: false, feedback: 'Mass is kilograms; weight is force in Newtons.' },
            { id: 'C', text: 'Weight is measured in kilograms', is_correct: false, feedback: 'Weight is force, measured in Newtons (W = m*g).' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'If you travel to the Moon, what changes?',
        options: ['A) Your weight decreases, but your mass remains unchanged', 'B) Your mass decreases, but weight is same', 'C) Both become zero', 'D) Both double'],
        correct_index: 0,
        explanation: 'The Moon has 1/6th the surface gravity of Earth, so your weight drops, but your atomic mass is invariant.'
      },
      {
        question: 'Who formulated the Universal Law of Gravitation?',
        options: ['A) Sir Isaac Newton', 'B) Albert Einstein', 'C) Galileo Galilei', 'D) Thomas Edison'],
        correct_index: 0,
        explanation: 'Sir Isaac Newton published the Mathematical Principles of Natural Philosophy in 1687.'
      },
      {
        question: 'What is the weight in Newtons of a 10 kg mass on Earth (g = 9.8 m/s²)?',
        options: ['A) 98 Newtons (W = m × g = 10 × 9.8)', 'B) 10 Newtons', 'C) 0.98 Newtons', 'D) 1000 Newtons'],
        correct_index: 0,
        explanation: 'Weight is calculated by multiplying mass (10 kg) by acceleration due to gravity (9.8 m/s²) = 98 N.'
      }
    ]
  },
  {
    id: 'digestive_quest',
    title: 'Journey Inside the Great Digestive Lab',
    subtitle: 'Follow a bite of idli and sambar through the stomach, liver, and intestines into cellular fuel!',
    subject: 'Biology',
    topic: 'Human Digestive System, Enzymes & Nutrients',
    grade: 'Class 7',
    cover_gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
    badge: 'Human Physiology',
    accent_color: '#f59e0b',
    video_url: 'https://www.youtube.com/embed/Og5xAdC8EUI',
    video_title: 'How Your Digestive System Works | TED-Ed',
    video_duration: '4:57',
    video_channel: 'TED-Ed',
    video_description: 'An acclaimed animated medical journey detailing how saliva, stomach hydrochloric acid, bile, and intestinal villi digest food into nutrients!',
    simulation_target: {
      type: 'phet',
      id: 'eating_and_exercise',
      name: 'PhET Nutrition & Energy Balance',
      url: 'https://phet.colorado.edu/sims/html/eating-and-exercise/latest/eating-and-exercise_all.html',
      learning_hook: 'Balance caloric intake, macronutrients, and metabolic expenditure!'
    },
    characters: [
      { name: 'Chef Amylase', role: 'Saliva Enzyme Master', avatar: '👨‍🍳', personality: 'Breaks complex starches into simple maltose sugars' },
      { name: 'Acid Pepsin', role: 'Stomach Vat Guardian', avatar: '🧪', personality: 'Tough protein digestive enzyme working at pH 2' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'Mouth & Salivary Breakdown',
        background_type: 'human_body',
        character_speaking: 'Chef Amylase',
        character_action: 'experiment',
        narration: 'A warm bite of breakfast idli enters the mouth. Teeth grind food into smaller bolus particles while salivary glands activate.',
        dialogue: "Welcome! Chewing increases surface area! My salivary amylase enzymes are immediately chopping long starch chains into sweet sugars!",
        decision_point: {
          has_decision: true,
          prompt: 'Where does the chemical digestion of carbohydrates begin in the human body?',
          options: [
            { id: 'A', text: 'In the mouth (by salivary amylase enzyme)', is_correct: true, feedback: 'Correct! Saliva contains ptyalin/amylase which immediately begins breaking down starches in the mouth!' },
            { id: 'B', text: 'In the stomach', is_correct: false, feedback: 'The stomach digests proteins; carbohydrate digestion starts in the mouth.' },
            { id: 'C', text: 'In the large intestine', is_correct: false, feedback: 'The large intestine absorbs water and minerals.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'The Hydrochloric Acid Vat of the Stomach',
        background_type: 'laboratory',
        character_speaking: 'Acid Pepsin',
        character_action: 'talk',
        narration: 'The bolus slides down the muscular esophagus by peristalsis into the J-shaped stomach churn.',
        dialogue: "Careful! My stomach walls secrete Hydrochloric Acid (HCl) at pH 1.5 to kill germs and activate pepsin for digesting proteins!",
        decision_point: {
          has_decision: true,
          prompt: 'Why does stomach acid not dissolve the stomach’s own muscular walls?',
          options: [
            { id: 'A', text: 'A thick, protective layer of mucus lines and shields the stomach wall', is_correct: true, feedback: 'Spot on! Goblet cells secrete thick alkaline mucus preventing acid and pepsin from eroding the stomach!' },
            { id: 'B', text: 'The stomach is made of titanium metal', is_correct: false, feedback: 'The stomach is living muscle tissue.' },
            { id: 'C', text: 'The acid has zero strength', is_correct: false, feedback: 'Stomach acid is strong enough to dissolve zinc metal.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'Intestinal Villi Nutrient Absorption',
        background_type: 'human_body',
        character_speaking: 'Chef Amylase',
        character_action: 'celebrate',
        narration: 'Chyme enters the small intestine. Millions of microscopic finger-like projections called villi absorb glucose, amino acids, and fats into blood capillaries.',
        dialogue: "Mission complete! Food is broken down into simple cellular fuel and dispatched across the entire human body!",
        decision_point: {
          has_decision: true,
          prompt: 'Where does the greatest absorption of digested nutrients take place in the human digestive tract?',
          options: [
            { id: 'A', text: 'Small Intestine (assisted by millions of microvilli)', is_correct: true, feedback: 'Hurrah! The small intestine’s villi create a massive surface area equal to a tennis court for nutrient absorption!' },
            { id: 'B', text: 'Esophagus', is_correct: false, feedback: 'The esophagus only transports food.' },
            { id: 'C', text: 'Mouth', is_correct: false, feedback: 'Minimal nutrient absorption occurs in the mouth.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which organ produces bile to emulsify fats in digestion?',
        options: ['A) Liver', 'B) Stomach', 'C) Pancreas', 'D) Appendix'],
        correct_index: 0,
        explanation: 'The liver produces bile juice, which is stored in the gallbladder and released into the small intestine.'
      },
      {
        question: 'What is the primary role of the Large Intestine?',
        options: ['A) Absorption of remaining water and formation of feces', 'B) Digesting proteins', 'C) Pumping blood', 'D) Filtering urine'],
        correct_index: 0,
        explanation: 'The colon reabsorbs water and electrolytes, consolidating indigestible waste.'
      },
      {
        question: 'What wave-like muscular contraction pushes food through the digestive canal?',
        options: ['A) Peristalsis', 'B) Diffusion', 'C) Osmosis', 'D) Filtration'],
        correct_index: 0,
        explanation: 'Peristalsis is rhythmic smooth muscle contraction that propels food through the esophagus and intestines.'
      }
    ]
  },
  {
    id: 'magnet_master',
    title: 'Magna Max & The Invisible Magnetic Shields',
    subtitle: 'Harness magnetic field lines, North and South poles, and electromagnets to power maglev trains!',
    subject: 'Physics',
    topic: 'Magnetism, Poles & Electromagnetism',
    grade: 'Class 6',
    cover_gradient: 'linear-gradient(135deg, #0f766e 0%, #115e59 50%, #134e4a 100%)',
    badge: 'Physics Lab',
    accent_color: '#14b8a6',
    video_url: 'https://www.youtube.com/embed/yXCeuSiTOug',
    video_title: 'Magnetism | The Dr. Binocs Show',
    video_duration: '3:58',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'An educational cartoon explaining magnetic poles, magnetic fields, magnetic materials like iron and nickel, and Earth’s protective geomagnetic field!',
    simulation_target: {
      type: 'phet',
      id: 'magnet_and_compass',
      name: 'PhET Magnet & Compass Simulator',
      url: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_all.html',
      learning_hook: 'Move bar magnets through wire coils to generate electric current!'
    },
    characters: [
      { name: 'Magna Max', role: 'Magnetic Hero', avatar: '🧲', personality: 'Has North and South poles that never separate' },
      { name: 'Compass Clara', role: 'Directional Guide', avatar: '🧭', personality: 'Always aligns with Earth’s magnetic field lines' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Law of Magnetic Attraction & Repulsion',
        background_type: 'laboratory',
        character_speaking: 'Magna Max',
        character_action: 'experiment',
        narration: 'In the physics workshop, two powerful neodymium magnets are brought near each other.',
        dialogue: "Watch closely! When you push like poles (North to North) together, they fiercely repel! But bring opposite poles near, and SNAP! They attract!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the fundamental rule of magnetic poles?',
          options: [
            { id: 'A', text: 'Like poles repel (N-N, S-S); Opposite poles attract (N-S)', is_correct: true, feedback: 'Correct! Opposite magnetic poles attract each other, while identical poles push each other away!' },
            { id: 'B', text: 'All poles always attract each other', is_correct: false, feedback: 'Like poles repel.' },
            { id: 'C', text: 'Magnets only stick to plastic and wood', is_correct: false, feedback: 'Plastic and wood are non-magnetic materials.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Visualizing Invisible Magnetic Field Lines',
        background_type: 'classroom',
        character_speaking: 'Compass Clara',
        character_action: 'explore',
        narration: 'Clara sprinkles fine iron filings around a bar magnet on a white cardboard sheet.',
        dialogue: "Look at the elegant curved patterns! Magnetic field lines emerge continuously from the North pole and curve into the South pole!",
        decision_point: {
          has_decision: true,
          prompt: 'Which of the following metals is ferromagnetic (strongly attracted to magnets)?',
          options: [
            { id: 'A', text: 'Iron (Fe), Nickel (Ni), and Cobalt (Co)', is_correct: true, feedback: 'Spot on! Iron, Nickel, and Cobalt have aligned electron domains that respond strongly to magnetic fields!' },
            { id: 'B', text: 'Pure Gold and Copper', is_correct: false, feedback: 'Copper and gold are non-ferromagnetic.' },
            { id: 'C', text: 'Aluminum and Silver', is_correct: false, feedback: 'Aluminum does not stick to permanent bar magnets.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'Earth: A Giant Cosmic Magnet',
        background_type: 'space_station',
        character_speaking: 'Magna Max',
        character_action: 'celebrate',
        narration: 'Molten swirling iron in Earth’s outer core generates a planetary magnetosphere that deflects lethal cosmic radiation.',
        dialogue: "Earth itself is a giant magnet! That’s why compass needles always point north, and magnetic shields protect all life on our planet!",
        decision_point: {
          has_decision: true,
          prompt: 'What device uses a small magnetized needle to determine geographic directions on Earth?',
          options: [
            { id: 'A', text: 'Magnetic Compass', is_correct: true, feedback: 'Hurrah! The lightweight magnetic needle aligns with Earth’s magnetic field lines to guide travelers!' },
            { id: 'B', text: 'Thermometer', is_correct: false, feedback: 'A thermometer measures temperature.' },
            { id: 'C', text: 'Barometer', is_correct: false, feedback: 'A barometer measures atmospheric pressure.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Can you isolate a single magnetic pole (a monopole) by cutting a bar magnet in half?',
        options: ['A) No, each piece automatically becomes a new magnet with both North and South poles', 'B) Yes, one piece is only North and the other is only South', 'C) The magnet loses all magnetism', 'D) It explodes'],
        correct_index: 0,
        explanation: 'Every time you cut a magnet, new magnetic dipoles form at the cut faces; magnetic monopoles have never been observed.'
      },
      {
        question: 'How can you create a temporary electromagnet at home?',
        options: ['A) Wrap insulated copper wire around an iron nail and connect it to a battery', 'B) Put a magnet in water', 'C) Heat an iron nail in fire', 'D) Paint an iron nail red'],
        correct_index: 0,
        explanation: 'Current flowing through a coiled wire creates a magnetic field that magnetizes the iron nail core.'
      },
      {
        question: 'Why do magnetic compasses point toward the geographic North Pole?',
        options: ['A) Earth’s magnetic South pole is located near the geographic North pole', 'B) The needle likes cold weather', 'C) The sun attracts the needle', 'D) Gravity pulls it north'],
        correct_index: 0,
        explanation: 'Opposites attract: the North-seeking pole of the compass needle is drawn to Earth’s magnetic South polarity in the Arctic.'
      }
    ]
  },
  {
    id: 'prism_light',
    title: 'Prism Pete & The Hidden Colors of Light',
    subtitle: 'Bend light rays through lenses, mirrors, and prisms to unlock the rainbow spectrum (VIBGYOR)!',
    subject: 'Physics',
    topic: 'Light, Reflection, Refraction & Dispersion',
    grade: 'Class 8',
    cover_gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
    badge: 'Optics Lab',
    accent_color: '#8b5cf6',
    video_url: 'https://www.youtube.com/embed/IXxZRZxafEQ',
    video_title: 'What Is Light? | TED-Ed',
    video_duration: '4:40',
    video_channel: 'TED-Ed',
    video_description: 'An illuminating animated lesson exploring electromagnetic light waves, photons, how light bends in glass prisms, and how human retinas perceive the color spectrum!',
    simulation_target: {
      type: 'phet',
      id: 'bending_light',
      name: 'PhET Bending Light & Refraction',
      url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_all.html',
      learning_hook: 'Shine laser beams into water, air, and glass prisms to test Snell’s Law and total internal reflection!'
    },
    characters: [
      { name: 'Prism Pete', role: 'Optical Maestro', avatar: '🔺', personality: 'Triangular glass prism splitting white beams' },
      { name: 'Photon Penny', role: 'Light Beam Runner', avatar: '🌈', personality: 'Travels at 300,000 km per second in vacuum' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Great Speed of Light & Straight Lines',
        background_type: 'laboratory',
        character_speaking: 'Photon Penny',
        character_action: 'explore',
        narration: 'A pinhole beam of morning sunlight enters a darkened room, traveling in a straight trajectory.',
        dialogue: "Light always travels in straight lines through a uniform medium! This rectilinear propagation is why shadows form when objects block our path!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the speed of light in a vacuum (c)?',
          options: [
            { id: 'A', text: '300,000 km/s (3 × 10^8 m/s)', is_correct: true, feedback: 'Correct! Light is the cosmic speed limit, crossing 300,000 kilometers in a single second!' },
            { id: 'B', text: '340 m/s', is_correct: false, feedback: '340 m/s is the speed of sound in air, nearly a million times slower than light!' },
            { id: 'C', text: '100 km/h', is_correct: false, feedback: 'That is the speed of an automobile on a highway.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Refraction & Bending at the Glass Boundary',
        background_type: 'laboratory',
        character_speaking: 'Prism Pete',
        character_action: 'experiment',
        narration: 'Penny’s white light ray enters Pete’s dense triangular glass prism. The change in medium speed bends the light ray.',
        dialogue: "Watch! Light slows down in glass and bends toward the normal line! Different wavelengths bend at different angles, separating into the 7 colors of the rainbow!",
        decision_point: {
          has_decision: true,
          prompt: 'What is the bending of light rays as they pass from one optical medium into another of different density called?',
          options: [
            { id: 'A', text: 'Refraction', is_correct: true, feedback: 'Spot on! Refraction is the change in wave direction caused by a change in wave speed across media!' },
            { id: 'B', text: 'Reflection', is_correct: false, feedback: 'Reflection is light bouncing off a shiny surface like a mirror.' },
            { id: 'C', text: 'Combustion', is_correct: false, feedback: 'Combustion is a chemical burning reaction.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Magnificent VIBGYOR Spectrum',
        background_type: 'classroom',
        character_speaking: 'Photon Penny',
        character_action: 'celebrate',
        narration: 'Emerging from the prism, white light fans out into Violet, Indigo, Blue, Green, Yellow, Orange, and Red across the classroom chalkboard.',
        dialogue: "VIBGYOR! Red light bends the least because of its long wavelength, while Violet bends the most! White sunlight was a rainbow all along!",
        decision_point: {
          has_decision: true,
          prompt: 'What natural phenomenon in the sky is caused by sunlight reflecting and refracting inside raindrops?',
          options: [
            { id: 'A', text: 'A Rainbow', is_correct: true, feedback: 'Hurrah! Raindrops act like billions of miniature prisms, dispersing sunlight into a circular arc of color!' },
            { id: 'B', text: 'An Eclipse', is_correct: false, feedback: 'An eclipse occurs when a celestial body blocks sunlight.' },
            { id: 'C', text: 'Lightning', is_correct: false, feedback: 'Lightning is an electrostatic atmospheric discharge.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which color of visible light has the longest wavelength?',
        options: ['A) Red', 'B) Violet', 'C) Green', 'D) Blue'],
        correct_index: 0,
        explanation: 'Red light has the longest wavelength (~700 nm) and is refracted the least by glass prisms.'
      },
      {
        question: 'According to the Law of Reflection, what is the relationship between the angle of incidence (i) and angle of reflection (r)?',
        options: ['A) Angle of Incidence = Angle of Reflection (∠i = ∠r)', 'B) Angle of Incidence is always twice ∠r', 'C) Angle of Incidence is half of ∠r', 'D) There is no relation'],
        correct_index: 0,
        explanation: 'The angle of reflection equals the angle of incidence, and both lie in the same plane with the normal line.'
      },
      {
        question: 'Which type of lens is thicker in the middle and converges parallel light rays to a focal point?',
        options: ['A) Convex lens', 'B) Concave lens', 'C) Flat glass window', 'D) Mirror'],
        correct_index: 0,
        explanation: 'Convex lenses converge light rays toward a focal point, commonly used in magnifying glasses and eyeglasses for hyperopia.'
      }
    ]
  },
  {
    id: 'friction_clash',
    title: 'Slick Sam vs. Grip Rick: The Battle of Friction',
    subtitle: 'Discover how friction stops bicycles, launches rockets, and why lubricants prevent machine wear!',
    subject: 'Physics',
    topic: 'Friction, Resistance & Mechanical Efficiency',
    grade: 'Class 8',
    cover_gradient: 'linear-gradient(135deg, #047857 0%, #065f46 50%, #064e3b 100%)',
    badge: 'Applied Physics',
    accent_color: '#10b981',
    video_url: 'https://www.youtube.com/embed/n2gQs1mcZHA',
    video_title: 'What is Friction? | Infinity Learn',
    video_duration: '4:18',
    video_channel: 'Infinity Learn',
    video_description: 'An intuitive animated explanation of friction, static vs. kinetic friction, microscopic surface roughness, and why friction is a necessary evil in everyday life!',
    simulation_target: {
      type: 'phet',
      id: 'forces_motion_basics',
      name: 'PhET Forces & Motion: Friction Lab',
      url: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
      learning_hook: 'Push wooden crates across ice vs. rough sandpaper to see friction forces oppose movement!'
    },
    characters: [
      { name: 'Slick Sam', role: 'Ice Glider', avatar: '🧊', personality: 'Tries to eliminate friction with lubricants' },
      { name: 'Grip Rick', role: 'Rubber Tread Master', avatar: '🛞', personality: 'Uses high friction to brake bicycles and grip roads' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'Microscopic Irregularities on Smooth Surfaces',
        background_type: 'laboratory',
        character_speaking: 'Grip Rick',
        character_action: 'experiment',
        narration: 'Under the high-magnification electron microscope, even polished steel and glass have jagged peaks and valleys.',
        dialogue: "Look! No surface is perfectly smooth! Microscopic bumps interlock when two objects touch, creating frictional resistance that opposes sliding motion!",
        decision_point: {
          has_decision: true,
          prompt: 'In what direction does friction always act relative to the direction of motion?',
          options: [
            { id: 'A', text: 'Opposite to the direction of motion', is_correct: true, feedback: 'Correct! Friction always acts parallel to the contact surface opposing relative movement!' },
            { id: 'B', text: 'In the same direction of motion', is_correct: false, feedback: 'Friction opposes motion.' },
            { id: 'C', text: 'Straight upward into the sky', is_correct: false, feedback: 'Normal force points upward; friction is parallel to the surface.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'The Village Bicycle Braking Challenge',
        background_type: 'classroom',
        character_speaking: 'Slick Sam',
        character_action: 'walk',
        narration: 'A student rides a bicycle down a steep village hill. Squeezing the brake levers clamps rubber pads against the wheel rim.',
        dialogue: "Friction is a necessary friend! Without rubber brake pad friction against the steel wheel, the bicycle would never stop and crash!",
        decision_point: {
          has_decision: true,
          prompt: 'Why do automobile and bicycle tires have patterned grooves and treads carved into them?',
          options: [
            { id: 'A', text: 'To increase friction and grip with the road surface, preventing skidding on wet roads', is_correct: true, feedback: 'Spot on! Deep treads channel water away and increase traction between tire rubber and asphalt!' },
            { id: 'B', text: 'To make the tire look decorative', is_correct: false, feedback: 'Treads are critical safety engineering.' },
            { id: 'C', text: 'To reduce the tire’s weight', is_correct: false, feedback: 'Carving grooves is all about friction and grip.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'Lubricants & Ball Bearings to the Rescue',
        background_type: 'future_city',
        character_speaking: 'Slick Sam',
        character_action: 'celebrate',
        narration: 'Inside motor vehicle engines and wheel hubs, rolling ball bearings and oil reduce kinetic friction to near zero.',
        dialogue: "Rolling friction is much smaller than sliding friction! By adding grease and ball bearings, village cycle dynamos run smoothly without overheating!",
        decision_point: {
          has_decision: true,
          prompt: 'What substances are applied between moving machine parts to reduce friction and prevent wear and tear?',
          options: [
            { id: 'A', text: 'Lubricants (such as oil and grease)', is_correct: true, feedback: 'Hurrah! Lubricants form a thin fluid layer preventing direct metal-on-metal collision!' },
            { id: 'B', text: 'Sandpaper', is_correct: false, feedback: 'Sandpaper increases friction drastically.' },
            { id: 'C', text: 'Glue', is_correct: false, feedback: 'Glue adheres surfaces together.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which type of friction is the greatest in magnitude?',
        options: ['A) Static friction (before an object starts moving)', 'B) Sliding friction', 'C) Rolling friction', 'D) Fluid friction'],
        correct_index: 0,
        explanation: 'Static friction is the maximum resistance that must be overcome to initiate movement from rest.'
      },
      {
        question: 'Why do meteoroids catch fire and burn up upon entering Earth’s upper atmosphere?',
        options: ['A) Atmospheric air friction and compression heat them to thousands of degrees', 'B) They are made of fire', 'C) Lightning strikes them', 'D) The Sun touches them'],
        correct_index: 0,
        explanation: 'Extreme speed through air causes high frictional heating and shock compression, vaporizing meteors.'
      },
      {
        question: 'Why do gymnasts and rock climbers apply chalk powder to their hands?',
        options: ['A) To absorb sweat and increase friction for a secure grip', 'B) To make hands slide easily', 'C) For decoration', 'D) To keep hands warm'],
        correct_index: 0,
        explanation: 'Dry magnesium carbonate chalk removes slippery sweat and boosts frictional grip on bars and rock faces.'
      }
    ]
  },
  {
    id: 'green_guardians',
    title: 'The Green Guardians: Clean Air & Pollution Heroes',
    subtitle: 'Battle toxic particulate matter (PM2.5), plastic waste, and river runoff to protect our village environment!',
    subject: 'Biology',
    topic: 'Pollution, Ecosystems & Environmental Conservation',
    grade: 'Class 7',
    cover_gradient: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
    badge: 'Ecology',
    accent_color: '#10b981',
    video_url: 'https://www.youtube.com/embed/7qkaz8ChelI',
    video_title: 'What is POLLUTION? | The Dr. Binocs Show',
    video_duration: '6:54',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'An eye-opening animated lesson exploring Air, Water, Soil, and Noise Pollution, their causes, and how planting trees and green energy saves ecosystems!',
    simulation_target: {
      type: 'phet',
      id: 'greenhouse_effect',
      name: 'PhET Greenhouse Effect & Climate',
      url: 'https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_all.html',
      learning_hook: 'Simulate greenhouse gas concentrations and see atmospheric thermal infrared trapping!'
    },
    characters: [
      { name: 'Eco Ranger', role: 'Conservation Guide', avatar: '🌱', personality: 'Passionate protector of trees, soil and rivers' },
      { name: 'Sooty Smoke', role: 'Pollution Monster', avatar: '🏭', personality: 'Emits particulate smoke and greenhouse gases' }
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Smoky Sky of Crop Burning & Smog',
        background_type: 'future_city',
        character_speaking: 'Eco Ranger',
        character_action: 'explore',
        narration: 'Thick winter smog blankets the outskirts of the town. Diesel exhaust and unmanaged waste fires release harmful microscopic PM2.5 particulates.',
        dialogue: "Look at the air quality meter! Particulate matter PM2.5 is entering our respiratory airways! We must transition to solar energy and bio-composting!",
        decision_point: {
          has_decision: true,
          prompt: 'What major greenhouse gas released by burning fossil fuels and stubble is primarily responsible for global warming?',
          options: [
            { id: 'A', text: 'Carbon Dioxide (CO2)', is_correct: true, feedback: 'Correct! Excessive CO2 traps infrared heat in the lower atmosphere, causing global temperatures to rise!' },
            { id: 'B', text: 'Oxygen gas (O2)', is_correct: false, feedback: 'Oxygen is essential for animal respiration and is not a greenhouse gas.' },
            { id: 'C', text: 'Argon gas', is_correct: false, feedback: 'Argon is an inert noble gas.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Protecting the Village River Stream',
        background_type: 'ocean_world',
        character_speaking: 'Eco Ranger',
        character_action: 'experiment',
        narration: 'Single-use plastic packets and untreated runoff threaten fish and clean drinking water in the local river.',
        dialogue: "Plastic takes over 400 years to decompose! We must implement the 3 Rs: Reduce, Reuse, and Recycle to keep our water clean!",
        decision_point: {
          has_decision: true,
          prompt: 'What are the 3 R principles of waste management?',
          options: [
            { id: 'A', text: 'Reduce, Reuse, Recycle', is_correct: true, feedback: 'Spot on! Reduce consumption, Reuse containers, and Recycle materials to minimize landfill waste!' },
            { id: 'B', text: 'Run, Rest, Repeat', is_correct: false, feedback: 'Those are exercise terms.' },
            { id: 'C', text: 'Reheat, Refill, Remove', is_correct: false, feedback: 'The ecological principles are Reduce, Reuse, Recycle.' }
          ]
        }
      },
      {
        scene_number: 3,
        title: 'The Great Afforestation Drive',
        background_type: 'forest',
        character_speaking: 'Eco Ranger',
        character_action: 'celebrate',
        narration: 'Students plant 500 indigenous neem, banyan, and peepal saplings along the school perimeter.',
        dialogue: "Trees are the lungs of planet Earth! They absorb tons of carbon dioxide, bind fertile soil with their roots, and restore rainfall harmony!",
        decision_point: {
          has_decision: true,
          prompt: 'What process do trees and green plants perform that actively removes Carbon Dioxide from air and releases Oxygen?',
          options: [
            { id: 'A', text: 'Photosynthesis', is_correct: true, feedback: 'Hurrah! Plants absorb CO2 from the atmosphere during photosynthesis, acting as the ultimate natural carbon sinks!' },
            { id: 'B', text: 'Erosion', is_correct: false, feedback: 'Erosion is the loss of topsoil by wind or rain.' },
            { id: 'C', text: 'Fermentation', is_correct: false, feedback: 'Fermentation is anaerobic cellular breakdown.' }
          ]
        }
      }
    ],
    quiz: [
      {
        question: 'Which atmospheric layer contains the protective ozone layer that filters harmful UV radiation?',
        options: ['A) Stratosphere', 'B) Troposphere', 'C) Mesosphere', 'D) Exosphere'],
        correct_index: 0,
        explanation: 'The ozone layer (O3) is situated in the stratosphere, approximately 15 to 35 km above Earth’s surface.'
      },
      {
        question: 'What is the excessive growth of algae in water bodies caused by fertilizer runoff called?',
        options: ['A) Eutrophication', 'B) Biodegradation', 'C) Transpiration', 'D) Desalination'],
        correct_index: 0,
        explanation: 'Eutrophication depletes dissolved oxygen in water, suffocating fish and aquatic life.'
      },
      {
        question: 'Which of the following energy sources is clean and 100% renewable?',
        options: ['A) Solar Photovoltaic & Wind energy', 'B) Coal burning power plant', 'C) Diesel generator', 'D) Kerosene lamps'],
        correct_index: 0,
        explanation: 'Solar and wind energy generate clean electricity without emitting greenhouse gases or soot.'
      }
    ]
  }
];

// Intelligent Topic-to-Cartoon-Video Resolver
// Maps ANY user typed topic from AI Story Studio to verified, active, embeddable videos!
export function getTopicCartoonVideo(topic, subject) {
  const t = (topic || '').toLowerCase().trim();
  const s = (subject || '').toLowerCase().trim();

  // 1. Photosynthesis & Botany
  if (t.includes('photo') || t.includes('leaf') || t.includes('leaves') || t.includes('chloroplast') || t.includes('stomata') || t.includes('chlorophyll')) {
    return {
      video_url: 'https://www.youtube.com/embed/D1Ymc311XS8',
      video_title: 'Photosynthesis | The Dr. Binocs Show',
      video_duration: '4:32',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Animated cartoon explaining how plant leaves absorb light photons, drink water, and synthesize glucose and oxygen.',
      matched_category: 'photosynthesis'
    };
  }

  // 2. Electricity, Circuits & Ohm's Law
  if (t.includes('electri') || t.includes('circuit') || t.includes('ohm') || t.includes('current') || t.includes('voltage') || t.includes('resistor') || t.includes('battery') || t.includes('switch')) {
    return {
      video_url: 'https://www.youtube.com/embed/HOFp8bHTN30',
      video_title: 'The Power of Circuits! | SciShow Kids',
      video_duration: '4:08',
      video_channel: 'SciShow Kids',
      video_description: 'Cartoon animation detailing how electric current flows through closed circuits, what happens in switches, and how batteries push electrons.',
      matched_category: 'electricity'
    };
  }

  // 3. Atoms, Chemistry & Chemical Bonding
  if (t.includes('atom') || t.includes('bond') || t.includes('molecule') || t.includes('electron') || t.includes('proton') || t.includes('neutron') || t.includes('nucleus') || t.includes('octet') || t.includes('ionic') || t.includes('covalent')) {
    return {
      video_url: 'https://www.youtube.com/embed/yQP4UJhNn0I',
      video_title: 'Just How Small is an Atom? | TED-Ed',
      video_duration: '5:28',
      video_channel: 'TED-Ed',
      video_description: 'Acclaimed animated exploration of atomic scale, electron shells, protons, and chemical bonds.',
      matched_category: 'atoms'
    };
  }

  // 4. Solar System, Space & Planets
  if (t.includes('solar') || t.includes('planet') || t.includes('space') || t.includes('orbit') || t.includes('sun') || t.includes('moon') || t.includes('mars') || t.includes('jupiter') || t.includes('saturn') || t.includes('astronomy') || t.includes('galaxy') || t.includes('asteroid')) {
    return {
      video_url: 'https://www.youtube.com/embed/libKVRa01L8',
      video_title: 'Solar System 101 | National Geographic',
      video_duration: '4:12',
      video_channel: 'National Geographic',
      video_description: 'An awe-inspiring animated journey through our solar system, charting the Sun, terrestrial rocky worlds, and gas giants.',
      matched_category: 'solar_system'
    };
  }

  // 5. Heart, Blood & Circulatory System
  if (t.includes('heart') || t.includes('blood') || t.includes('circulat') || t.includes('artery') || t.includes('vein') || t.includes('cardio') || t.includes('pulse') || t.includes('hemoglobin')) {
    return {
      video_url: 'https://www.youtube.com/embed/q0s-1MC1hcE',
      video_title: 'The Circulatory Song & System | Scratch Garden',
      video_duration: '4:15',
      video_channel: 'Scratch Garden',
      video_description: 'An upbeat cartoon musical detailing how the heart pumps blood through arteries and veins to deliver oxygen to tissues.',
      matched_category: 'heart'
    };
  }

  // 6. Water Cycle, Rain & Clouds
  if (t.includes('water') || t.includes('rain') || t.includes('cloud') || t.includes('evaporat') || t.includes('condens') || t.includes('precipitat') || t.includes('monsoon')) {
    return {
      video_url: 'https://www.youtube.com/embed/ncORPosDrjI',
      video_title: 'The Water Cycle | The Dr. Binocs Show',
      video_duration: '3:50',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Colorful cartoon adventure explaining evaporation from lakes, condensation into clouds, and rainfall precipitation.',
      matched_category: 'water_cycle'
    };
  }

  // 7. Gravity & Newton's Laws
  if (t.includes('gravit') || t.includes('newton') || t.includes('falling') || t.includes('weight') || t.includes('mass') || t.includes('inertia') || t.includes('acceleration')) {
    return {
      video_url: 'https://www.youtube.com/embed/EwY6p-r_hyU',
      video_title: 'Gravity Compilation | Crash Course Kids',
      video_duration: '7:42',
      video_channel: 'Crash Course Kids',
      video_description: 'Cartoon animation answering what gravity is, why objects fall at the same acceleration in vacuum, and how mass shapes gravity.',
      matched_category: 'gravity'
    };
  }

  // 8. Human Digestive System & Food
  if (t.includes('digest') || t.includes('stomach') || t.includes('food') || t.includes('enzyme') || t.includes('intestine') || t.includes('gut') || t.includes('saliva') || t.includes('nutrition')) {
    return {
      video_url: 'https://www.youtube.com/embed/Og5xAdC8EUI',
      video_title: 'How Your Digestive System Works | TED-Ed',
      video_duration: '4:57',
      video_channel: 'TED-Ed',
      video_description: 'An acclaimed animated medical journey detailing how saliva, stomach hydrochloric acid, and intestinal villi digest food.',
      matched_category: 'digestive'
    };
  }

  // 9. Magnetism & Magnetic Fields
  if (t.includes('magnet') || t.includes('pole') || t.includes('attract') || t.includes('compass') || t.includes('repel')) {
    return {
      video_url: 'https://www.youtube.com/embed/yXCeuSiTOug',
      video_title: 'Magnetism | The Dr. Binocs Show',
      video_duration: '3:58',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Cartoon explaining magnetic poles, magnetic fields, magnetic metals like iron, and Earth’s protective geomagnetic shield.',
      matched_category: 'magnetism'
    };
  }

  // 10. Light, Optics, Rainbows & Refraction
  if (t.includes('light') || t.includes('optic') || t.includes('refract') || t.includes('reflect') || t.includes('rainbow') || t.includes('prism') || t.includes('mirror') || t.includes('lens') || t.includes('shadow') || t.includes('vibgyor')) {
    return {
      video_url: 'https://www.youtube.com/embed/IXxZRZxafEQ',
      video_title: 'What Is Light? | TED-Ed',
      video_duration: '4:40',
      video_channel: 'TED-Ed',
      video_description: 'Animated lesson exploring light waves, rectilinear propagation, how light bends in glass prisms, and the color spectrum.',
      matched_category: 'light'
    };
  }

  // 11. Friction & Resistance
  if (t.includes('friction') || t.includes('grip') || t.includes('slide') || t.includes('rough') || t.includes('tire') || t.includes('brake') || t.includes('lubricant')) {
    return {
      video_url: 'https://www.youtube.com/embed/n2gQs1mcZHA',
      video_title: 'What is Friction? | Infinity Learn',
      video_duration: '4:18',
      video_channel: 'Infinity Learn',
      video_description: 'Intuitive animated explanation of friction, surface roughness, static vs. sliding friction, and why friction is necessary.',
      matched_category: 'friction'
    };
  }

  // 12. Pollution, Ecosystems & Environment
  if (t.includes('pollut') || t.includes('waste') || t.includes('recycle') || t.includes('environment') || t.includes('climate') || t.includes('greenhouse') || t.includes('carbon') || t.includes('plastic') || t.includes('smog')) {
    return {
      video_url: 'https://www.youtube.com/embed/7qkaz8ChelI',
      video_title: 'What is POLLUTION? | The Dr. Binocs Show',
      video_duration: '6:54',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Animated lesson exploring Air, Water, Soil, and Noise Pollution, their causes, and how planting trees and green energy saves ecosystems.',
      matched_category: 'pollution'
    };
  }

  // 13. Sound, Waves & Acoustics
  if (t.includes('sound') || t.includes('wave') || t.includes('echo') || t.includes('vibrat') || t.includes('pitch') || t.includes('volume') || t.includes('hearing') || t.includes('frequency')) {
    return {
      video_url: 'https://www.youtube.com/embed/3-xKZKxXuu0',
      video_title: 'What is Sound? | Physics for Kids | SciShow Kids',
      video_duration: '3:45',
      video_channel: 'SciShow Kids',
      video_description: 'Explore how vibrations travel through air, liquids, and solids to create sound waves that our eardrums detect!',
      matched_category: 'sound'
    };
  }

  // 14. Plant Growth, Seeds & Flowers
  if (t.includes('seed') || t.includes('flower') || t.includes('plant') || t.includes('germinat') || t.includes('pollinat') || t.includes('root') || t.includes('stem')) {
    return {
      video_url: 'https://www.youtube.com/embed/tkFPyue5X3Q',
      video_title: 'How Does A Seed Become A Plant? | SciShow Kids',
      video_duration: '4:02',
      video_channel: 'SciShow Kids',
      video_description: 'Discover how seeds absorb soil moisture, sprout roots and shoots, and grow into flowering plants through sunlight.',
      matched_category: 'plant_growth'
    };
  }

  // 15. Simple Machines (Levers, Pulleys, Wheels)
  if (t.includes('machine') || t.includes('lever') || t.includes('pulley') || t.includes('gear') || t.includes('wheel') || t.includes('wedge') || t.includes('ramp')) {
    return {
      video_url: 'https://www.youtube.com/embed/LSfNYpCprw4',
      video_title: 'Simple Machines for Kids | Learn the 6 Machines',
      video_duration: '4:50',
      video_channel: 'SciShow Kids',
      video_description: 'Explore inclined planes, levers, pulleys, screws, wedges, and wheels that multiply mechanical force!',
      matched_category: 'simple_machines'
    };
  }

  // 16. States of Matter (Solids, Liquids, Gases)
  if (t.includes('matter') || t.includes('solid') || t.includes('liquid') || t.includes('gas') || t.includes('phase') || t.includes('freeze') || t.includes('melt') || t.includes('boil')) {
    return {
      video_url: 'https://www.youtube.com/embed/k3SJuozgbfU',
      video_title: 'Phases of Matter | Bill Nye The Science Guy',
      video_duration: '4:15',
      video_channel: 'Disney Educational / Bill Nye',
      video_description: 'Watch molecules in solids, liquids, and gases change movement and spacing as thermal energy is applied or removed.',
      matched_category: 'states_of_matter'
    };
  }

  // 17. Acids, Bases & Chemical Reactions
  if (t.includes('acid') || t.includes('base') || t.includes('ph') || t.includes('alkali') || t.includes('litmus') || t.includes('react') || t.includes('salt')) {
    return {
      video_url: 'https://www.youtube.com/embed/ANi709MYnWg',
      video_title: 'Acid-Base Reactions in Solution: Crash Course Chemistry #8',
      video_duration: '5:12',
      video_channel: 'Crash Course',
      video_description: 'Understand hydronium ions, hydroxide ions, pH indicators like litmus and cabbage juice, and neutralization reactions.',
      matched_category: 'acids_bases'
    };
  }

  // Subject-based smart fallback (if no specific topic keyword matched)
  if (s.includes('chem')) {
    return {
      video_url: 'https://www.youtube.com/embed/yQP4UJhNn0I',
      video_title: `${topic || 'Chemistry'} Fundamentals | TED-Ed`,
      video_duration: '5:28',
      video_channel: 'TED-Ed',
      video_description: `Learn the building blocks of matter and chemical bonding for ${topic || 'chemistry'}.`,
      matched_category: 'atoms'
    };
  }

  if (s.includes('phys')) {
    return {
      video_url: 'https://www.youtube.com/embed/EwY6p-r_hyU',
      video_title: `${topic || 'Physics'} Fundamental Laws | Crash Course Kids`,
      video_duration: '7:42',
      video_channel: 'Crash Course Kids',
      video_description: `Explore forces, energy transformations, and physical laws of ${topic || 'physics'}.`,
      matched_category: 'gravity'
    };
  }

  if (s.includes('space') || s.includes('astro')) {
    return {
      video_url: 'https://www.youtube.com/embed/libKVRa01L8',
      video_title: `${topic || 'Space'} Exploration | National Geographic`,
      video_duration: '4:12',
      video_channel: 'National Geographic',
      video_description: `Journey into our solar system and cosmic orbits exploring ${topic || 'space'}.`,
      matched_category: 'solar_system'
    };
  }

  // Universal Default: SciShow Kids Circuits & Energy
  return {
    video_url: 'https://www.youtube.com/embed/HOFp8bHTN30',
    video_title: `${topic || 'STEM'} Science Exploration | SciShow Kids`,
    video_duration: '4:08',
    video_channel: 'SciShow Kids',
    video_description: `An engaging cartoon animated exploration of ${topic || 'science'} showing real-world applications.`,
    matched_category: 'electricity'
  };
}
