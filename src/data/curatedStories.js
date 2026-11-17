// Curated Disney/Pixar-Style Flagship StoryVerse Adventures
// Shared across client and server to guarantee 100% offline & Vercel reliability

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
    video_url: 'https://www.youtube-nocookie.com/embed/sQK3Yr4Sc_k',
    video_title: 'Photosynthesis for Kids: Dr. Binocs Cartoon Adventure',
    video_duration: '4:32',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'Watch Dr. Binocs and animated plant characters explain how leaves absorb sunlight photons, drink water from roots, open stomata for CO2, and produce glucose and oxygen!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'Morning Sunbeams Over Devarayanadurga Forest',
        camera_direction: 'Wide aerial crane shot descending into a vibrant Banyan leaf canopy. Golden morning sunbeams piercing through the mist.',
        visual_prompt: 'Pixar 3D animation style. A cheerful young cartoon leaf character named Leo looking worried as dark shadows fall across the canopy. Vibrant greens, bioluminescent cellular glows.',
        dialogue: "Professor! My thylakoid disks are running out of power! The ancient banyan tree needs photon energy!",
        duration_sec: 12
      },
      {
        scene: 2,
        title: 'Inside the Nano-Chloroplast Kitchen',
        camera_direction: 'Macro zoom entering through a stomata pore into a bustling microscopic biochemical kitchen.',
        visual_prompt: 'High-tech organic kitchen inside a plant cell. Microscopic chloroplast chefs wearing chef hats catching light photons like glowing fireflies. Green neon lighting, water drops rushing through xylem pipes.',
        dialogue: "Water is flowing up from the roots, and CO2 is entering through our stomata valves! Time to cook sugar!",
        duration_sec: 15
      },
      {
        scene: 3,
        title: 'The Great Molecular Splash of Oxygen',
        camera_direction: 'Dynamic slow-motion orbit around water molecules splitting into glowing hydrogen and oxygen bubbles.',
        visual_prompt: 'Bright flash of sunlight photon hitting a water molecule, bursting into shimmering bubble spheres of O2 that float triumphantly out of the leaf into the village air.',
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
      { name: 'Sunny photon', role: 'Energy Messenger', avatar: '☀️', personality: 'Hyperactive packet of light energy' },
      { name: 'Stoma Guard', role: 'Gatekeeper', avatar: '🚪', personality: 'Vigilant pore keeper regulating CO2 intake' }
    ],
    learning_objectives: [
      'Understand the chemical equation of photosynthesis: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2',
      'Discover how chloroplasts and chlorophyll trap photon energy',
      'Explore how stomata open and close to exchange gases and regulate transpiration',
      'Connect plant photosynthesis to the oxygen cycle supporting rural ecosystems'
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
    mini_challenge: {
      title: 'Leaf Cell Chemical Lab',
      instruction: 'Match the inputs and outputs of Photosynthesis to activate the simulation!',
      inputs: ['6 CO2 (Carbon Dioxide)', '6 H2O (Root Water)', 'Light Photons'],
      outputs: ['C6H12O6 (Glucose Food)', '6 O2 (Pure Oxygen)'],
      formula: '6CO2 + 6H2O + Sunlight ➔ C6H12O6 + 6O2'
    },
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
    video_url: 'https://www.youtube-nocookie.com/embed/HOFp8bHTN30',
    video_title: 'Electricity & Circuits for Kids: Dr. Binocs Cartoon',
    video_duration: '4:08',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'An exciting cartoon animation detailing how electric current flows through closed circuits, what happens inside switches, and how batteries push electrons to light up appliances!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'Emergency at the Village Health Clinic',
        camera_direction: 'Fast-paced zoom across a dark rural village into the clinic. Thunderstorm flashing outside.',
        visual_prompt: 'Pixar 3D style. A cute glowing electric spark character named Eddy wearing running sneakers, standing next to a battery commander Captain Volt.',
        dialogue: "Attention team! The village clinic cooler needs power! Let us complete the circuit loop!",
        duration_sec: 12
      },
      {
        scene: 2,
        title: 'The Copper Wire Superhighway',
        camera_direction: 'Inside-the-wire microscopic tracking shot following a swarm of smiling blue electrons.',
        visual_prompt: 'High-speed luminous neon tunnel inside a glowing copper wire. Eddy and fellow electrons leaping through lattices of copper atoms, meeting a stone bridge resistor.',
        dialogue: "Georg Ohm says: raise the voltage push or widen the wire to let more of us sprint through!",
        duration_sec: 14
      },
      {
        scene: 3,
        title: 'Tungsten Ignition & Life-Saving Light',
        camera_direction: 'Extreme close up of a glowing filament bulb expanding into a warm village clinic glow.',
        visual_prompt: 'Electrons colliding with tungsten metal atoms causing brilliant fiery-orange luminescence. The medical vaccine refrigerator hums to life, and doctors celebrate.',
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
      'Understand how resistors dissipate electrical energy as heat (Joule’s Law)',
      'Learn how rural village solar batteries power medical refrigerators'
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
    mini_challenge: {
      title: "Ohm's Law Master Calculator",
      instruction: "Calculate current, voltage and resistance relationships for village electrical devices.",
      formula: "V = I × R | I = V / R | R = V / I",
      inputs: ['12V Solar Battery', '4 Ohm Load'],
      outputs: ['3.0 Amperes Safe Current', '36 Watts Useful Power']
    },
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
    video_url: 'https://www.youtube-nocookie.com/embed/CPTtX4GuR7E',
    video_title: 'What Is An Atom & How Do They Bond? Dr. Binocs Cartoon',
    video_duration: '4:15',
    video_channel: 'The Dr. Binocs Show',
    video_description: 'An educational cartoon explaining atomic structure, protons, neutrons, electrons, and how chemical bonds form between atoms seeking a stable octet of electrons!',
    ai_video_storyboard: [
      {
        scene: 1,
        title: 'The Lonely Electron Orbit',
        camera_direction: 'Orbital rotation around a glowing nucleus of 11 protons and 12 neutrons.',
        visual_prompt: 'Pixar 3D style. A bouncy metallic atom character named Sammy with planetary rings. A lone blue electron orbits alone on the outermost ring, looking for a home.',
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
        visual_prompt: 'Golden particle beam as the electron transfers from Sammy to Chloe. Electrostatic lightning snaps them together into a sparkling cubic lattice of edible table salt (NaCl).',
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
      { name: 'Sammy Sodium', role: 'Eager Metal Atom', avatar: '⚛️', personality: 'Has 11 protons and 1 lonely valence electron he wants to give away' },
      { name: 'Chloe Chlorine', role: 'Halogen Seeker', avatar: '🧪', personality: 'Has 7 valence electrons and desperately craves 1 more to complete her octet' },
      { name: 'Elder Neon', role: 'Noble Gas Sage', avatar: '👑', personality: 'Totally peaceful, inert, and happily complete with 8 outer electrons' }
    ],
    learning_objectives: [
      'Understand the Octet Rule and electron shell stability (2, 8, 8)',
      'Learn how Ionic Bonds form through electron transfer',
      'Discover cations (positive ions) and anions (negative ions)',
      'Explain how explosive sodium and poisonous chlorine combine into everyday edible table salt (NaCl)'
    ],
    scenes: [
      {
        scene_number: 1,
        title: 'The Restless Electron of Sammy',
        background_type: 'space_station',
        character_speaking: 'Sammy Sodium',
        character_action: 'think',
        narration: 'In the microscopic realm of Atomia, Sammy Sodium paced back and forth. His electron configuration was 2, 8, 1. That lonely single electron in his third shell was buzzing with unstable kinetic energy!',
        dialogue: "I have 11 positive protons, but that 1 outer electron is driving me crazy! If I could just donate it to a worthy partner, my inner shell would have a magnificent, stable 8 electrons like Elder Neon!",
        decision_point: {
          has_decision: true,
          prompt: 'If Sammy Sodium loses 1 negatively charged electron, what will his net electrical charge become?',
          options: [
            { id: 'A', text: '+1 Positive Ion (Cation: Na+)', is_correct: true, feedback: 'Correct! 11 positive protons vs 10 negative electrons leaves an overall positive charge of +1!' },
            { id: 'B', text: '-1 Negative Ion (Anion)', is_correct: false, feedback: 'Incorrect. Losing a negative charge leaves an excess of positive protons.' },
            { id: 'C', text: '0 Neutral atom', is_correct: false, feedback: 'Incorrect. He started neutral; losing an electron unbalances the proton-electron ratio.' }
          ]
        }
      },
      {
        scene_number: 2,
        title: 'Meeting Chloe Chlorine in the Lagoon',
        background_type: 'ocean_world',
        character_speaking: 'Chloe Chlorine',
        character_action: 'talk',
        narration: 'Across the reaction chamber stood Chloe Chlorine (configuration 2, 8, 7). Her outer valence ring had 7 electrons spinning around 1 empty slot!',
        dialogue: "Sammy! Look at my valence shell! I need exactly ONE electron to reach the legendary stable octet of Argon! Will you share your destiny with me?",
        decision_point: {
          has_decision: true,
          prompt: 'What kind of chemical bond is formed when an electron is completely transferred from a metal (Sodium) to a non-metal (Chlorine)?',
          options: [
            { id: 'A', text: 'Ionic Bond (Electrostatic attraction between opposite ions)', is_correct: true, feedback: 'Bingo! Sammy becomes Na+ and Chloe becomes Cl-. Opposites attract with powerful electrostatic force, forging table salt crystals!' },
            { id: 'B', text: 'Covalent Bond (Equal sharing of electron pairs)', is_correct: false, feedback: 'Incorrect. Covalent bonds share electrons (like H2O). Sodium completely transfers its electron to Chlorine.' },
            { id: 'C', text: 'Metallic Bond', is_correct: false, feedback: 'Incorrect. Metallic bonding occurs between metal atoms in a sea of delocalized electrons.' }
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
    mini_challenge: {
      title: 'Valence Octet Matcher',
      instruction: 'Form the ionic bond by pairing the metal cation and non-metal anion!',
      inputs: ['Na (2,8,1) Metal Donor', 'Cl (2,8,7) Non-metal Acceptor'],
      outputs: ['Na+ Cation (2,8)', 'Cl- Anion (2,8,8)', 'NaCl Cubic Lattice']
    },
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
  }
];

// Fallback topic cartoon video matcher
export function getTopicCartoonVideo(topic, subject) {
  const t = (topic || '').toLowerCase();
  
  if (t.includes('photo') || t.includes('plant') || t.includes('leaf') || t.includes('cell')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/sQK3Yr4Sc_k',
      video_title: 'Photosynthesis for Kids: Dr. Binocs Cartoon Adventure',
      video_duration: '4:32',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Watch Dr. Binocs and animated plant characters explain how leaves absorb sunlight photons, drink water from roots, open stomata for CO2, and produce glucose and oxygen!'
    };
  }
  if (t.includes('electri') || t.includes('circuit') || t.includes('ohm') || t.includes('current') || t.includes('voltage')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/HOFp8bHTN30',
      video_title: 'What is Electricity & Circuits: Dr. Binocs Cartoon',
      video_duration: '4:08',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Animated cartoon explaining electric circuits, electrons, switches, batteries, and conductors.'
    };
  }
  if (t.includes('atom') || t.includes('bond') || t.includes('molecule') || t.includes('electron') || t.includes('chem')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/CPTtX4GuR7E',
      video_title: 'What Is An Atom & How Do They Bond? Dr. Binocs Cartoon',
      video_duration: '4:15',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Animated cartoon showing atomic structure, electron shells, protons, neutrons, and chemical bonding.'
    };
  }
  if (t.includes('gravity') || t.includes('gravitat') || t.includes('force') || t.includes('motion') || t.includes('newton')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/EwY6p-r_hyU',
      video_title: 'What is Gravity & Forces: Dr. Binocs Animated Cartoon',
      video_duration: '4:20',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Fun animated cartoon adventure explaining gravitational pull, mass, acceleration, and Sir Isaac Newton.'
    };
  }
  if (t.includes('digest') || t.includes('stomach') || t.includes('body') || t.includes('heart') || t.includes('blood') || t.includes('organ')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/VwrsL-lCZYo',
      video_title: 'Human Digestive System: Dr. Binocs Animated Cartoon',
      video_duration: '4:45',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Travel inside the human body with cartoon animation to see how food is digested, broken down, and absorbed.'
    };
  }
  if (t.includes('space') || t.includes('solar') || t.includes('planet') || t.includes('moon') || t.includes('sun') || t.includes('orbit')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/libKVRa01L8',
      video_title: 'Solar System & Planets: Dr. Binocs Cartoon Adventure',
      video_duration: '4:12',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Zoom through our solar system to meet Mercury, Venus, Earth, Mars, Jupiter, and Saturn in cartoon format!'
    };
  }
  if (t.includes('water') || t.includes('rain') || t.includes('cloud') || t.includes('evaporat')) {
    return {
      video_url: 'https://www.youtube-nocookie.com/embed/ncORPosDrjI',
      video_title: 'Water Cycle for Kids: Dr. Binocs Animated Cartoon',
      video_duration: '3:50',
      video_channel: 'The Dr. Binocs Show',
      video_description: 'Cartoon animation showing evaporation, condensation, precipitation, and the village water cycle!'
    };
  }
  return {
    video_url: 'https://www.youtube-nocookie.com/embed/sQK3Yr4Sc_k',
    video_title: `${topic || 'STEM'} Cartoon Science Lesson: Dr. Binocs Show`,
    video_duration: '4:15',
    video_channel: 'The Dr. Binocs Show',
    video_description: `An engaging cartoon animated lesson explaining scientific mechanisms and principles of ${topic || 'science'}.`
  };
}
