/**
 * VidyaVerse - Authentic Class-Stratified 40-Question Assessment Banks
 * Curated from NCERT Curriculum across 4 STEM Pillars:
 * 1. Physics (10 Qs)
 * 2. Chemistry (10 Qs)
 * 3. Mathematics (10 Qs)
 * 4. Biology & Life Sciences (10 Qs)
 * 
 * Stratified by Class Tiers:
 * - Class 6-8 (Middle School Discovery)
 * - Class 9-10 (Secondary Board Preparation)
 * - Class 11-12 (Senior Secondary / JEE & NEET Foundation)
 */

export const ASSESSMENT_QUESTIONS_BY_TIER = {
  // ──────────────────────────────────────────────────────────────────
  // CLASS 9-10 (SECONDARY BOARD RIGOR) - 40 MIXED QUESTIONS
  // ──────────────────────────────────────────────────────────────────
  'Class 9-10': [
    // ── SECTION 1: PHYSICS (Questions 1 to 10) ──
    {
      id: 'c910_p01',
      subject: 'Physics',
      topic: 'Laws of Motion & Inertia',
      question: 'A passenger in a moving bus falls backward when the bus abruptly starts moving forward. Which law or concept directly explains this phenomenon?',
      options: [
        'Newton’s First Law of Motion (Inertia of Rest)',
        'Newton’s Second Law of Motion (Rate of change of momentum)',
        'Newton’s Third Law of Motion (Action and Reaction)',
        'Law of Conservation of Angular Momentum'
      ],
      correctIndex: 0,
      explanation: 'According to Newton’s First Law (Inertia of Rest), an object at rest resists any change in its state. When the bus suddenly accelerates forward, the lower body moves forward with the bus while the upper body tends to remain at rest due to inertia, making the passenger fall backward.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_p02',
      subject: 'Physics',
      topic: 'Universal Gravitation',
      question: 'If the distance between two spherical masses is doubled, how does the gravitational force of attraction between them change?',
      options: [
        'It is doubled',
        'It is halved',
        'It becomes one-fourth of its initial value',
        'It becomes four times its initial value'
      ],
      correctIndex: 2,
      explanation: 'According to Newton’s Law of Universal Gravitation, F = G * (m1 * m2) / r². The force is inversely proportional to the square of the distance (1/r²). When r is doubled (2r), the force becomes 1/(2)² = 1/4th of the initial value.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_p03',
      subject: 'Physics',
      topic: 'Work & Kinetic Energy',
      question: 'A village tractor engine increases its speed from 10 m/s to 20 m/s. If the mass of the tractor is 1500 kg, what is the work done by the engine?',
      options: [
        '75,000 Joules',
        '150,000 Joules',
        '225,000 Joules',
        '300,000 Joules'
      ],
      correctIndex: 2,
      explanation: 'Work-Energy Theorem states that Work Done = Change in Kinetic Energy (ΔKE). Initial KE = 0.5 * 1500 * (10)² = 75,000 J. Final KE = 0.5 * 1500 * (20)² = 300,000 J. Work done = 300,000 - 75,000 = 225,000 Joules.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_p04',
      subject: 'Physics',
      topic: 'Sound & Wave Frequency',
      question: 'An ultrasonic sound wave used in medical echography has a frequency of 2 MHz (2,000,000 Hz) and travels in human tissue at 1500 m/s. What is its wavelength in the tissue?',
      options: [
        '0.75 mm',
        '1.33 mm',
        '3.0 mm',
        '0.33 mm'
      ],
      correctIndex: 0,
      explanation: 'Wave velocity formula: v = f * λ. Therefore, λ = v / f = 1500 m/s / (2 * 10⁶ s⁻¹) = 7.5 * 10⁻⁴ m = 0.75 mm.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_p05',
      subject: 'Physics',
      topic: 'Refraction & Snell’s Law',
      question: 'A beam of sunlight passes from air into water having a refractive index of 4/3. If the speed of light in vacuum is 3 × 10⁸ m/s, what is the speed of light in water?',
      options: [
        '4.0 × 10⁸ m/s',
        '2.25 × 10⁸ m/s',
        '2.0 × 10⁸ m/s',
        '1.5 × 10⁸ m/s'
      ],
      correctIndex: 1,
      explanation: 'Refractive index n = c / v, where c is speed of light in air/vacuum and v is speed in water. v = c / n = (3 × 10⁸) / (4/3) = (3 × 3 × 10⁸) / 4 = 2.25 × 10⁸ m/s.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_p06',
      subject: 'Physics',
      topic: 'Human Eye Defects',
      question: 'A student sitting on the back bench of a rural classroom cannot read the blackboard clearly, but can read their textbook comfortably. Which defect do they have and which lens corrects it?',
      options: [
        'Hypermetropia, corrected by a Convex lens',
        'Myopia, corrected by a Concave lens',
        'Presbyopia, corrected by a Bifocal lens',
        'Astigmatism, corrected by a Cylindrical lens'
      ],
      correctIndex: 1,
      explanation: 'Inability to see distant objects clearly while near vision is normal is known as Myopia (near-sightedness). Light rays from distant objects converge in front of the retina. A diverging (concave) lens of suitable power diverges incoming parallel rays to focus precisely on the retina.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_p07',
      subject: 'Physics',
      topic: 'Electricity & Ohm’s Law',
      question: 'Three identical resistors of 6 Ω each are connected in parallel across a 12 V solar battery. What is the equivalent resistance and the total current supplied by the battery?',
      options: [
        'Equivalent Resistance = 18 Ω, Total Current = 0.67 A',
        'Equivalent Resistance = 2 Ω, Total Current = 6 A',
        'Equivalent Resistance = 3 Ω, Total Current = 4 A',
        'Equivalent Resistance = 6 Ω, Total Current = 2 A'
      ],
      correctIndex: 1,
      explanation: 'For n identical resistors R in parallel, 1/R_eq = 1/6 + 1/6 + 1/6 = 3/6 = 1/2, so R_eq = 2 Ω. Using Ohm’s law, I = V / R_eq = 12 V / 2 Ω = 6 A.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_p08',
      subject: 'Physics',
      topic: 'Electric Power & Joule’s Heating',
      question: 'A 2 kW village solar water pump runs for 5 hours every day. How many electrical commercial units (kWh) does it consume over a 30-day month?',
      options: [
        '100 kWh units',
        '150 kWh units',
        '300 kWh units',
        '600 kWh units'
      ],
      correctIndex: 2,
      explanation: 'Daily energy consumption = Power × Time = 2 kW × 5 hours = 10 kWh. Monthly energy consumption (30 days) = 10 kWh/day × 30 days = 300 kWh (300 units).',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_p09',
      subject: 'Physics',
      topic: 'Electromagnetic Induction',
      question: 'When a strong bar magnet is pushed rapidly into a copper wire coil connected to a galvanometer, the galvanometer needle deflects. This phenomenon is termed:',
      options: [
        'Magnetic Resonance Imaging',
        'Electromagnetic Induction',
        'Joule’s Thermal Effect',
        'Coulomb Electrostatic Repulsion'
      ],
      correctIndex: 1,
      explanation: 'Discovered by Michael Faraday, Electromagnetic Induction is the production of an electromotive force (and induced current) across an electrical conductor when it experiences a changing magnetic flux.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_p10',
      subject: 'Physics',
      topic: 'Magnetic Field Due to Current',
      question: 'According to Maxwell’s Right-Hand Thumb Rule, if your thumb points in the direction of electric current along a straight vertical wire, the curled fingers indicate:',
      options: [
        'The direction of the electric potential gradient',
        'The direction of magnetic field lines around the wire',
        'The direction of gravitational force on electrons',
        'The direction of resistance flow'
      ],
      correctIndex: 1,
      explanation: 'Maxwell’s Right-Hand Thumb Rule states that if a current-carrying straight conductor is held in the right hand with the thumb pointing in the direction of conventional current, then the curled fingers encircle the wire in the direction of the magnetic field lines.',
      difficulty: 'Foundational'
    },

    // ── SECTION 2: CHEMISTRY (Questions 11 to 20) ──
    {
      id: 'c910_c11',
      subject: 'Chemistry',
      topic: 'Chemical Reactions & Equations',
      question: 'When quicklime (calcium oxide, CaO) reacts vigorously with water in a beaker, it produces slaked lime [Ca(OH)₂] and releases immense heat. What type of reaction is this?',
      options: [
        'Combination and Exothermic reaction',
        'Decomposition and Endothermic reaction',
        'Displacement and Endothermic reaction',
        'Double Displacement and Neutralization reaction'
      ],
      correctIndex: 0,
      explanation: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat. Two reactants combine to form a single product (Combination Reaction), and heat is released to the surroundings (Exothermic Reaction).',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_c12',
      subject: 'Chemistry',
      topic: 'Redox Reactions',
      question: 'In the chemical reaction: CuO + H₂ → Cu + H₂O, which substance acts as the reducing agent?',
      options: [
        'CuO (Copper Oxide)',
        'H₂ (Hydrogen Gas)',
        'Cu (Metallic Copper)',
        'H₂O (Water)'
      ],
      correctIndex: 1,
      explanation: 'Hydrogen (H₂) gains oxygen to become H₂O, which means it undergoes oxidation. The substance that undergoes oxidation and reduces another compound is the reducing agent.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_c13',
      subject: 'Chemistry',
      topic: 'Acids, Bases & Salts',
      question: 'Which of the following salts produces an aqueous solution with a pH greater than 7 (alkaline)?',
      options: [
        'Sodium Chloride (NaCl)',
        'Ammonium Chloride (NH₄Cl)',
        'Sodium Carbonate (Na₂CO₃)',
        'Potassium Sulfate (K₂SO₄)'
      ],
      correctIndex: 2,
      explanation: 'Na₂CO₃ is the salt of a strong base (NaOH) and a weak acid (H₂CO₃ - carbonic acid). When dissolved in water, basic hydrolysis takes place, generating excess OH⁻ ions and yielding pH > 7.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_c14',
      subject: 'Chemistry',
      topic: 'Metals & Reactivity Series',
      question: 'When an iron nail is immersed in a blue copper sulfate (CuSO₄) solution for 30 minutes, what observable change takes place?',
      options: [
        'The solution turns deep blue and hydrogen gas is released',
        'The solution fades to pale green and a reddish-brown copper layer coats the iron nail',
        'No reaction occurs because copper is more reactive than iron',
        'The nail dissolves completely with white precipitate formation'
      ],
      correctIndex: 1,
      explanation: 'Iron is more reactive than copper (higher in the electrochemical reactivity series). Fe displaces Cu: Fe + CuSO₄ (blue) → FeSO₄ (pale green) + Cu (reddish-brown precipitate on nail).',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_c15',
      subject: 'Chemistry',
      topic: 'Carbon Compounds & Functional Groups',
      question: 'Ethanol is oxidized to ethanoic acid (acetic acid) using which of the following common oxidizing agents?',
      options: [
        'Concentrated Sulfuric Acid at 443 K',
        'Alkaline Potassium Permanganate (KMnO₄) or Acidified Potassium Dichromate (K₂Cr₂O₇)',
        'Nickel catalyst under hydrogen gas',
        'Sodium metal and liquid ammonia'
      ],
      correctIndex: 1,
      explanation: 'Alkaline KMnO₄ or acidified K₂Cr₂O₇ are strong oxidizing agents capable of adding oxygen to primary alcohols like ethanol (CH₃CH₂OH) to form carboxylic acids (CH₃COOH).',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_c16',
      subject: 'Chemistry',
      topic: 'Covalent Bonding & Allotropy',
      question: 'Why does graphite conduct electricity whereas diamond, another allotrope of pure carbon, is a complete electrical insulator?',
      options: [
        'Diamond has weak van der Waals forces between its layers',
        'In graphite, each carbon atom is bonded to 3 others, leaving one delocalized free valence electron per atom',
        'Graphite contains metallic impurities while diamond is 100% pure',
        'Diamond undergoes ionic bonding whereas graphite undergoes covalent bonding'
      ],
      correctIndex: 1,
      explanation: 'In graphite, each carbon atom undergoes sp² hybridization, bonding to three neighboring carbons in hexagonal planar sheets. The fourth valence electron remains free and delocalized across the sheet, conducting electric current. In diamond, all 4 valence electrons form rigid sp³ tetrahedral bonds.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_c17',
      subject: 'Chemistry',
      topic: 'Periodic Table & Atomic Radius',
      question: 'Across a period from left to right in Modern Periodic Table, atomic radius generally decreases because:',
      options: [
        'New electron shells are continually added',
        'Effective nuclear charge increases, pulling valence electrons closer to the nucleus',
        'The number of neutrons in the nucleus decreases',
        'Electrons lose negative charge across periods'
      ],
      correctIndex: 1,
      explanation: 'Moving from left to right along a period, protons are added to the nucleus while electrons enter the same principal valence shell. The increased positive nuclear charge exerts a stronger electrostatic pull on valence electrons, contracting the atomic radius.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_c18',
      subject: 'Chemistry',
      topic: 'Mole Concept & Stoichiometry',
      question: 'How many molecules are present in 36 grams of pure water (H₂O)? (Atomic masses: H = 1 u, O = 16 u; Avogadro’s constant N_A = 6.022 × 10²³)',
      options: [
        '6.022 × 10²³ molecules',
        '1.2044 × 10²⁴ molecules',
        '3.011 × 10²³ molecules',
        '2.4088 × 10²⁴ molecules'
      ],
      correctIndex: 1,
      explanation: 'Molar mass of H₂O = 2(1) + 16 = 18 g/mol. Number of moles n = 36 g / 18 g/mol = 2 moles. Total molecules = 2 × 6.022 × 10²³ = 1.2044 × 10²⁴ molecules.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_c19',
      subject: 'Chemistry',
      topic: 'Structure of the Atom',
      question: 'Rutherford’s alpha-particle scattering experiment led directly to which fundamental scientific conclusion?',
      options: [
        'Discovery of the neutron inside the nucleus',
        'Proof that the positive charge and most mass of an atom is concentrated in a tiny central nucleus',
        'Electrons orbit only in discrete stationary energy shells',
        'Atoms are indivisible solid spheres as described by Dalton'
      ],
      correctIndex: 1,
      explanation: 'Since most alpha particles passed straight through the gold foil undeflected while about 1 in 12,000 rebounded at 180°, Rutherford deduced that most of the atom is empty space and the positive charge and mass reside in a tiny, dense core named the nucleus.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_c20',
      subject: 'Chemistry',
      topic: 'Corrosion & Electrochemistry',
      question: 'Galvanization is a widely practiced industrial method of protecting iron from rusting by coating it with a thin layer of:',
      options: [
        'Chromium (Cr)',
        'Zinc (Zn)',
        'Tin (Sn)',
        'Copper (Cu)'
      ],
      correctIndex: 1,
      explanation: 'Galvanization coats iron or steel with a protective layer of Zinc (Zn). Zinc acts as a sacrificial anode because it oxidizes more readily than iron, protecting the underlying iron even if the coating is scratched.',
      difficulty: 'Foundational'
    },

    // ── SECTION 3: MATHEMATICS (Questions 21 to 30) ──
    {
      id: 'c910_m21',
      subject: 'Mathematics',
      topic: 'Real Numbers & Euclid’s Algorithm',
      question: 'If the HCF of two positive integers a and b is 12, and their product (a × b) is 2160, what is their LCM?',
      options: [
        '120',
        '180',
        '240',
        '360'
      ],
      correctIndex: 1,
      explanation: 'For any two positive integers, Product of numbers = HCF × LCM. Therefore, LCM = (a × b) / HCF = 2160 / 12 = 180.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m22',
      subject: 'Mathematics',
      topic: 'Polynomials & Zeros',
      question: 'If α and β are the zeros of the quadratic polynomial f(x) = x² - 7x + 12, what is the value of (α² + β²)?',
      options: [
        '25',
        '37',
        '49',
        '13'
      ],
      correctIndex: 0,
      explanation: 'From Vieta’s formulas: Sum of zeros α + β = -(-7)/1 = 7, and Product αβ = 12/1 = 12. Since α² + β² = (α + β)² - 2αβ = (7)² - 2(12) = 49 - 24 = 25.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_m23',
      subject: 'Mathematics',
      topic: 'Linear Equations in Two Variables',
      question: 'For what value of k will the pair of linear equations 2x + 3y = 7 and 4x + ky = 14 have infinitely many solutions?',
      options: [
        'k = 3',
        'k = 6',
        'k = 9',
        'k = 12'
      ],
      correctIndex: 1,
      explanation: 'Condition for infinitely many solutions (coincident lines): a₁/a₂ = b₁/b₂ = c₁/c₂. Here 2/4 = 3/k = 7/14. 1/2 = 3/k => k = 6.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m24',
      subject: 'Mathematics',
      topic: 'Quadratic Equations & Discriminant',
      question: 'The quadratic equation 2x² - 4x + 3 = 0 has:',
      options: [
        'Two distinct real roots',
        'Two equal real roots',
        'No real roots (complex roots)',
        'More than two real roots'
      ],
      correctIndex: 2,
      explanation: 'Discriminant D = b² - 4ac. Here a = 2, b = -4, c = 3. D = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m25',
      subject: 'Mathematics',
      topic: 'Arithmetic Progressions',
      question: 'Find the 20th term of the arithmetic progression (AP): 7, 13, 19, 25, ...',
      options: [
        '115',
        '121',
        '127',
        '133'
      ],
      correctIndex: 1,
      explanation: 'First term a = 7, common difference d = 13 - 7 = 6. n-th term formula: a_n = a + (n - 1)d. For n = 20: a₂₀ = 7 + (20 - 1)(6) = 7 + 19(6) = 7 + 114 = 121.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m26',
      subject: 'Mathematics',
      topic: 'Coordinate Geometry & Distance',
      question: 'The distance between points A(3, -2) and B(-1, 1) in the Cartesian plane is:',
      options: [
        '5 units',
        '4 units',
        '√7 units',
        '25 units'
      ],
      correctIndex: 0,
      explanation: 'Distance formula d = √[(x₂ - x₁)² + (y₂ - y₁)²] = √[(-1 - 3)² + (1 - (-2))²] = √[(-4)² + (3)²] = √[16 + 9] = √25 = 5 units.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m27',
      subject: 'Mathematics',
      topic: 'Trigonometry & Identities',
      question: 'If tan θ = 4/3 where θ is an acute angle, what is the value of (sin θ + cos θ)?',
      options: [
        '7/5',
        '1/5',
        '5/7',
        '12/5'
      ],
      correctIndex: 0,
      explanation: 'tan θ = opposite / adjacent = 4/3. Hypotenuse = √(4² + 3²) = 5. sin θ = 4/5, cos θ = 3/5. sin θ + cos θ = 4/5 + 3/5 = 7/5.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_m28',
      subject: 'Mathematics',
      topic: 'Heights & Distances',
      question: 'The angle of elevation of the top of a village telecom tower from a point on the ground 30 meters away from its base is 45°. What is the height of the tower?',
      options: [
        '15 meters',
        '30 meters',
        '30√3 meters',
        '30/√3 meters'
      ],
      correctIndex: 1,
      explanation: 'tan 45° = Height / Distance from base. Since tan 45° = 1, Height / 30 = 1 => Height = 30 meters.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_m29',
      subject: 'Mathematics',
      topic: 'Mensuration & Solid Geometry',
      question: 'A metallic solid sphere of radius 6 cm is melted and recast into small cones of radius 3 cm and height 4 cm. How many cones are formed?',
      options: [
        '16',
        '24',
        '32',
        '8'
      ],
      correctIndex: 1,
      explanation: 'Volume of sphere = (4/3)πR³ = (4/3)π(6)³ = 288π cm³. Volume of one cone = (1/3)πr²h = (1/3)π(3)²(4) = 12π cm³. Number of cones = 288π / 12π = 24.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_m30',
      subject: 'Mathematics',
      topic: 'Probability & Statistics',
      question: 'Two fair six-sided dice are thrown simultaneously. What is the probability that the sum of the numbers appearing on top is equal to 8?',
      options: [
        '1/6',
        '5/36',
        '7/36',
        '1/9'
      ],
      correctIndex: 1,
      explanation: 'Total outcomes when rolling 2 dice = 6 × 6 = 36. Favorable pairs giving sum = 8 are (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes. Probability = 5/36.',
      difficulty: 'Intermediate'
    },

    // ── SECTION 4: BIOLOGY & LIFE SCIENCES (Questions 31 to 40) ──
    {
      id: 'c910_b31',
      subject: 'Biology',
      topic: 'Cell Biology & Mitochondria',
      question: 'Why are mitochondria referred to as the "powerhouse of the cell"?',
      options: [
        'They synthesize digestive enzymes for cellular breakdown',
        'They generate cellular energy in the form of ATP molecules via aerobic respiration',
        'They store genetic chromosomes and nucleoli',
        'They assemble ribosomal proteins for secretion'
      ],
      correctIndex: 1,
      explanation: 'Mitochondria carry out cellular aerobic respiration, converting chemical energy from nutrients into Adenosine Triphosphate (ATP), which acts as the universal chemical energy currency for metabolic tasks.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b32',
      subject: 'Biology',
      topic: 'Plant Physiology & Photosynthesis',
      question: 'During the light-dependent reaction of photosynthesis in chloroplasts, where do the oxygen molecules released into the atmosphere originate?',
      options: [
        'From the carbon dioxide (CO₂) absorbed by stomata',
        'From the photolysis (splitting) of water (H₂O) molecules',
        'From the breakdown of glucose during nighttime',
        'From nitrogen absorbed by the roots'
      ],
      correctIndex: 1,
      explanation: 'Experiments by Ruben, Kamen, and Van Niel proved that during photosynthesis, light energy absorbed by chlorophyll splits water molecules (2H₂O → 4H⁺ + 4e⁻ + O₂). All oxygen released comes exclusively from water.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_b33',
      subject: 'Biology',
      topic: 'Human Circulatory System',
      question: 'Which chamber of the human heart pumps oxygenated blood under highest pressure into the systemic aorta to supply the entire body?',
      options: [
        'Right Atrium',
        'Right Ventricle',
        'Left Atrium',
        'Left Ventricle'
      ],
      correctIndex: 3,
      explanation: 'The Left Ventricle has the thickest muscular myocardium wall because it must generate high systemic systolic pressure (approx. 120 mmHg) to force oxygenated blood through the aorta across the entire body.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b34',
      subject: 'Biology',
      topic: 'Excretory System & Nephrons',
      question: 'In the human kidney, the filtration of blood under high hydrostatic pressure into Bowman’s capsule occurs across which microscopic capillary network?',
      options: [
        'Loop of Henle',
        'Glomerulus',
        'Collecting Duct',
        'Renal Pelvis'
      ],
      correctIndex: 1,
      explanation: 'The glomerulus is a high-pressure capillary tuft supplied by the afferent arteriole. Ultrafiltration forces water, urea, glucose, and salts through the glomerular membrane into Bowman’s capsule.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_b35',
      subject: 'Biology',
      topic: 'Nervous Coordination & Reflex Arc',
      question: 'When a person accidentally touches a hot vessel, their hand pulls away instantaneously before conscious thought occurs in the brain. What neural pathway coordinates this?',
      options: [
        'Cerebral Cortex sensory projection',
        'Spinal Reflex Arc',
        'Sympathetic autonomic ganglia',
        'Cerebellum balance center'
      ],
      correctIndex: 1,
      explanation: 'A reflex arc bypasses conscious cerebral interpretation for ultra-rapid survival action: receptor → sensory neuron → spinal cord relay interneuron → motor neuron → effector muscle.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b36',
      subject: 'Biology',
      topic: 'Endocrine Regulation & Insulin',
      question: 'Which hormone synthesized by the beta-cells of the islets of Langerhans in the pancreas regulates blood glucose levels by promoting glucose uptake into cells?',
      options: [
        'Glucagon',
        'Insulin',
        'Thyroxine',
        'Adrenaline'
      ],
      correctIndex: 1,
      explanation: 'Insulin facilitates cellular uptake and storage of glucose as glycogen in liver and skeletal muscles, preventing hyperglycemia (high blood sugar).',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b37',
      subject: 'Biology',
      topic: 'Genetics & Mendel’s Monohybrid Cross',
      question: 'In a monohybrid cross between pure tall pea plants (TT) and pure dwarf pea plants (tt), what is the phenotypic ratio of tall to dwarf plants in the F2 generation?',
      options: [
        '1 : 1',
        '2 : 1',
        '3 : 1',
        '9 : 3 : 3 : 1'
      ],
      correctIndex: 2,
      explanation: 'F1 generation plants are heterozygous tall (Tt). Self-pollination of F1 yields genotype 1 TT : 2 Tt : 1 tt. Because the T allele is dominant, TT and Tt are phenotypically tall, giving a 3 Tall : 1 Dwarf phenotypic ratio.',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b38',
      subject: 'Biology',
      topic: 'DNA & Chromosomal Sex Determination',
      question: 'In human sex determination, what determines the biological sex of a newly conceived human child?',
      options: [
        'The maternal X chromosome in the ovum',
        'Whether the fertilizing sperm cell carries an X or a Y sex chromosome',
        'The ambient temperature during embryonic gestation',
        'The hormonal balance of maternal placenta'
      ],
      correctIndex: 1,
      explanation: 'Females produce gametes (eggs) with only X chromosomes (homogametic). Males produce 50% X-bearing and 50% Y-bearing sperm (heterogametic). Fertilization by an X sperm yields female (XX); by a Y sperm yields male (XY).',
      difficulty: 'Foundational'
    },
    {
      id: 'c910_b39',
      subject: 'Biology',
      topic: 'Ecology & 10% Energy Transfer Law',
      question: 'According to Lindeman’s 10% Ecological Law, if green plants (primary producers) trap 20,000 Joules of solar energy, how much energy is transferred to secondary carnivores (tertiary trophic level)?',
      options: [
        '2,000 Joules',
        '200 Joules',
        '20 Joules',
        '2 Joules'
      ],
      correctIndex: 1,
      explanation: 'Producers = 20,000 J. Primary consumers (herbivores) receive 10% = 2,000 J. Secondary consumers (carnivores) receive 10% of 2,000 J = 200 J.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c910_b40',
      subject: 'Biology',
      topic: 'Ecosystems & Ozone Layer Depletion',
      question: 'The depletion of the stratospheric ozone layer is predominantly caused by industrial synthetic compounds called:',
      options: [
        'Carbon Monoxide (CO)',
        'Chlorofluorocarbons (CFCs)',
        'Sulfur Dioxide (SO₂)',
        'Nitrous Oxide (N₂O)'
      ],
      correctIndex: 1,
      explanation: 'Chlorofluorocarbons (CFCs) used in refrigerants dissociate under solar UV radiation to release free chlorine radicals, which catalytically break down ozone (O₃) into oxygen gas (O₂).',
      difficulty: 'Foundational'
    }
  ],

  // ──────────────────────────────────────────────────────────────────
  // CLASS 6-8 (MIDDLE SCHOOL FOUNDATIONAL DISCOVERY) - 40 MIXED QUESTIONS
  // ──────────────────────────────────────────────────────────────────
  'Class 6-8': [
    // ── SECTION 1: PHYSICS (Questions 1 to 10) ──
    {
      id: 'c68_p01',
      subject: 'Physics',
      topic: 'Measurement & Units',
      question: 'What is the standard International System of Units (SI unit) of length?',
      options: ['Centimeter', 'Meter', 'Kilometer', 'Foot'],
      correctIndex: 1,
      explanation: 'The SI unit of length is the meter (m). Centimeters and kilometers are metric submultiples and multiples.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p02',
      subject: 'Physics',
      topic: 'Motion & Speed',
      question: 'A rural postal van travels 120 kilometers in 3 hours. What is its average speed?',
      options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'],
      correctIndex: 1,
      explanation: 'Average speed = Total distance / Total time taken = 120 km / 3 h = 40 km/h.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p03',
      subject: 'Physics',
      topic: 'Light, Shadows & Reflection',
      question: 'Which of the following objects allows light to pass through completely so objects on the other side can be seen clearly?',
      options: ['Opaque cardboard', 'Translucent butter paper', 'Transparent clean glass', 'Wooden plank'],
      correctIndex: 2,
      explanation: 'Transparent objects like clean glass allow light to pass through almost completely, giving clear visibility.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p04',
      subject: 'Physics',
      topic: 'Pinhole Camera',
      question: 'What kind of image is formed on the screen of a simple pinhole camera?',
      options: ['Erect and enlarged', 'Inverted and real', 'Virtual and upright', 'Magnified and colored only'],
      correctIndex: 1,
      explanation: 'Because light travels in straight lines (rectilinear propagation), rays from the top and bottom of the object cross through the pinhole, forming an inverted real image on the screen.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c68_p05',
      subject: 'Physics',
      topic: 'Electric Circuits & Switches',
      question: 'What is the primary function of an electric switch in a household torch circuit?',
      options: ['To create electrical charge', 'To safely open or close an electric circuit', 'To convert electricity into sound', 'To store chemical potential energy'],
      correctIndex: 1,
      explanation: 'A switch is a simple device that either breaks (opens) the circuit to stop current or completes (closes) it to allow current flow.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p06',
      subject: 'Physics',
      topic: 'Electrical Conductors & Insulators',
      question: 'Which of the following materials is a good conductor of electricity?',
      options: ['Rubber eraser', 'Copper wire', 'Plastic ruler', 'Dry cotton string'],
      correctIndex: 1,
      explanation: 'Metals such as copper and aluminum possess free electrons and are good conductors of electric current.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p07',
      subject: 'Physics',
      topic: 'Magnets & Poles',
      question: 'When a freely suspended bar magnet comes to rest, in which geographic direction do its poles align?',
      options: ['East-West', 'North-South', 'North-East', 'South-West'],
      correctIndex: 1,
      explanation: 'Earth behaves like a giant bar magnet. A freely suspended magnet aligns along Earth’s geographic North-South direction.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p08',
      subject: 'Physics',
      topic: 'Friction & Motion',
      question: 'Why do bicycle mechanics apply grease or lubricating oil to the ball bearings of bicycle wheels?',
      options: ['To increase friction for better grip', 'To reduce friction and minimize wear and tear', 'To make the wheels heavier', 'To prevent the metal from rusting only'],
      correctIndex: 1,
      explanation: 'Lubricants form a thin protective layer between interacting metal surfaces, smoothing out irregularities and significantly reducing friction and wear.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_p09',
      subject: 'Physics',
      topic: 'Pressure & Surface Area',
      question: 'Why do sharp kitchen knives cut vegetables much more easily than blunt knives?',
      options: ['Sharp knives have less weight', 'Sharp edges have smaller surface area, exerting much greater pressure for the same force', 'Blunt knives generate higher friction', 'Sharp knives absorb thermal energy'],
      correctIndex: 1,
      explanation: 'Pressure = Force / Area. A sharp knife has an extremely thin edge (tiny area), producing high cutting pressure with moderate applied force.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c68_p10',
      subject: 'Physics',
      topic: 'Simple Machines & Levers',
      question: 'A pair of scissors or village pliers belongs to which class of lever?',
      options: ['First Class Lever (Fulcrum in the middle)', 'Second Class Lever (Load in the middle)', 'Third Class Lever (Effort in the middle)', 'Wheel and Axle system'],
      correctIndex: 0,
      explanation: 'In scissors, the pivot/fulcrum lies between the applied effort (handles) and the resistance load (blades), defining a Class 1 lever.',
      difficulty: 'Intermediate'
    },

    // ── SECTION 2: CHEMISTRY (Questions 11 to 20) ──
    {
      id: 'c68_c11',
      subject: 'Chemistry',
      topic: 'Separation of Substances',
      question: 'Which method is used by village farmers to separate heavier grains of wheat or paddy from lighter dry husk particles using wind?',
      options: ['Sieving', 'Winnowing', 'Filtration', 'Sedimentation'],
      correctIndex: 1,
      explanation: 'Winnowing uses the blowing wind to carry away lighter husk particles while heavier food grains fall vertically downwards.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c12',
      subject: 'Chemistry',
      topic: 'Physical vs Chemical Changes',
      question: 'Which of the following processes represents a chemical change (irreversible new substance formed)?',
      options: ['Melting of ice into water', 'Boiling of water into steam', 'Rusting of an iron gate', 'Tearing a sheet of paper into pieces'],
      correctIndex: 2,
      explanation: 'Rusting of iron forms hydrated iron(III) oxide (Fe₂O₃·xH₂O), a brand new chemical substance with different properties, making it a chemical change.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c13',
      subject: 'Chemistry',
      topic: 'Acids, Bases & Indicators',
      question: 'When yellow turmeric paste is applied to an alkaline soap solution, what color change takes place?',
      options: ['Remains bright yellow', 'Turns reddish-brown', 'Turns dark blue', 'Becomes colorless'],
      correctIndex: 1,
      explanation: 'Turmeric is a natural acid-base indicator containing curcumin. It stays yellow in acidic or neutral solutions but turns deep reddish-brown in basic solutions like soap.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c14',
      subject: 'Chemistry',
      topic: 'Litmus Paper Indicator',
      question: 'Lemon juice turns blue litmus paper into which color?',
      options: ['Red', 'Green', 'Yellow', 'White'],
      correctIndex: 0,
      explanation: 'Lemon juice contains citric acid. Acids turn moist blue litmus paper red.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c15',
      subject: 'Chemistry',
      topic: 'Composition of Air',
      question: 'Which gas makes up approximately 78% of the Earth’s atmosphere by volume?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],
      correctIndex: 1,
      explanation: 'Clean dry air consists of roughly 78% Nitrogen (N₂), 21% Oxygen (O₂), and 1% other trace gases like argon, CO₂, and water vapor.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c16',
      subject: 'Chemistry',
      topic: 'Water Cycle & Condensation',
      question: 'Tiny water droplets appearing on the outer surface of a cold glass of ice water occur due to which process?',
      options: ['Evaporation', 'Condensation', 'Transpiration', 'Precipitation'],
      correctIndex: 1,
      explanation: 'Water vapor present in ambient air cools down upon contacting the cold glass surface and changes from gas to liquid (condensation).',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c17',
      subject: 'Chemistry',
      topic: 'Combustion & Fire Safety',
      question: 'Which of the following components is essential for burning (combustion) to take place?',
      options: ['Nitrogen gas', 'Oxygen gas', 'Carbon dioxide gas', 'Helium gas'],
      correctIndex: 1,
      explanation: 'Combustion is an exothermic reaction of a fuel with oxygen. Without oxygen, fire cannot sustain.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c18',
      subject: 'Chemistry',
      topic: 'Metals & Non-metals Properties',
      question: 'The property of metals by which they can be beaten into thin sheets without shattering is known as:',
      options: ['Ductility', 'Malleability', 'Sonority', 'Brittleness'],
      correctIndex: 1,
      explanation: 'Malleability is the physical property of metals allowing them to be hammered into sheets (e.g. aluminum foil). Ductility is the ability to be drawn into wires.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c68_c19',
      subject: 'Chemistry',
      topic: 'Solubility & Solutions',
      question: 'A solution in which no more solute can be dissolved at a given temperature is called a:',
      options: ['Dilute solution', 'Saturated solution', 'Unsaturated solution', 'Super-dilute solution'],
      correctIndex: 1,
      explanation: 'When a solvent has dissolved the maximum quantity of solute possible at that temperature, it reaches dynamic saturation.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_c20',
      subject: 'Chemistry',
      topic: 'Fibers & Fabrics',
      question: 'Which of the following fibers is obtained directly from an animal source?',
      options: ['Cotton', 'Jute', 'Silk', 'Linen'],
      correctIndex: 2,
      explanation: 'Silk is an animal protein fiber obtained from the cocoons spun by silkworm larvae (Bombyx mori).',
      difficulty: 'Foundational'
    },

    // ── SECTION 3: MATHEMATICS (Questions 21 to 30) ──
    {
      id: 'c68_m21',
      subject: 'Mathematics',
      topic: 'Integers & Arithmetic',
      question: 'Evaluate: (-15) + (-8) - (-12)',
      options: ['-11', '-35', '+5', '-19'],
      correctIndex: 0,
      explanation: '(-15) + (-8) = -23. Then -23 - (-12) = -23 + 12 = -11.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m22',
      subject: 'Mathematics',
      topic: 'Fractions & Operations',
      question: 'What is the product of 3/4 and 8/9 in its simplest form?',
      options: ['2/3', '24/36', '1/2', '5/12'],
      correctIndex: 0,
      explanation: '(3/4) × (8/9) = (3 × 8) / (4 × 9) = 24 / 36. Dividing numerator and denominator by 12 gives 2/3.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m23',
      subject: 'Mathematics',
      topic: 'Decimals & Percentages',
      question: 'Convert the fraction 7/20 into a percentage:',
      options: ['28%', '35%', '42%', '70%'],
      correctIndex: 1,
      explanation: '(7/20) × 100% = 7 × 5 = 35%.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m24',
      subject: 'Mathematics',
      topic: 'Algebra & Linear Equations',
      question: 'Solve for x: 3x - 7 = 14',
      options: ['x = 5', 'x = 7', 'x = 9', 'x = 21'],
      correctIndex: 1,
      explanation: '3x - 7 = 14 => 3x = 14 + 7 = 21 => x = 21 / 3 = 7.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m25',
      subject: 'Mathematics',
      topic: 'Geometry & Angles',
      question: 'Two angles are complementary if the sum of their measures equals:',
      options: ['90°', '180°', '270°', '360°'],
      correctIndex: 0,
      explanation: 'By definition, complementary angles add up to 90°. Supplementary angles add up to 180°.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m26',
      subject: 'Mathematics',
      topic: 'Perimeter & Area',
      question: 'A rectangular village school playground has length 50 m and width 30 m. What is its perimeter and area?',
      options: ['Perimeter = 160 m, Area = 1500 m²', 'Perimeter = 80 m, Area = 1500 m²', 'Perimeter = 160 m, Area = 800 m²', 'Perimeter = 100 m, Area = 1500 m²'],
      correctIndex: 0,
      explanation: 'Perimeter = 2(L + W) = 2(50 + 30) = 2(80) = 160 meters. Area = L × W = 50 × 30 = 1500 m².',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m27',
      subject: 'Mathematics',
      topic: 'Triangles & Angle Sum Property',
      question: 'In triangle ABC, angle A = 55° and angle B = 65°. What is the measure of angle C?',
      options: ['50°', '60°', '70°', '80°'],
      correctIndex: 1,
      explanation: 'Sum of all interior angles of a triangle = 180°. Angle C = 180° - (55° + 65°) = 180° - 120° = 60°.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m28',
      subject: 'Mathematics',
      topic: 'Ratios & Proportions',
      question: 'If 6 solar LED lamps cost ₹2400, what is the cost of 10 such lamps?',
      options: ['₹3600', '₹4000', '₹4400', '₹4800'],
      correctIndex: 1,
      explanation: 'Cost of 1 lamp = ₹2400 / 6 = ₹400. Cost of 10 lamps = 10 × ₹400 = ₹4000.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_m29',
      subject: 'Mathematics',
      topic: 'Exponents & Powers',
      question: 'What is the value of 2⁵ - 3³?',
      options: ['5', '7', '1', '9'],
      correctIndex: 0,
      explanation: '2⁵ = 32, and 3³ = 27. Therefore 32 - 27 = 5.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c68_m30',
      subject: 'Mathematics',
      topic: 'Data Handling & Mean',
      question: 'Find the arithmetic mean of marks: 6, 8, 10, 12, 14',
      options: ['8', '10', '11', '12'],
      correctIndex: 1,
      explanation: 'Mean = Sum of numbers / Count = (6 + 8 + 10 + 12 + 14) / 5 = 50 / 5 = 10.',
      difficulty: 'Foundational'
    },

    // ── SECTION 4: BIOLOGY & LIFE SCIENCES (Questions 31 to 40) ──
    {
      id: 'c68_b31',
      subject: 'Biology',
      topic: 'Plant Parts & Functions',
      question: 'Which part of a plant is primarily responsible for absorbing water and minerals from the soil?',
      options: ['Stem', 'Leaves', 'Roots', 'Flowers'],
      correctIndex: 2,
      explanation: 'Plant roots have tiny root hairs that provide large surface area for absorbing soil moisture and dissolved mineral ions.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b32',
      subject: 'Biology',
      topic: 'Photosynthesis & Leaves',
      question: 'The green pigment present in leaves that traps sunlight for photosynthesis is called:',
      options: ['Chlorophyll', 'Carotene', 'Hemoglobin', 'Melanin'],
      correctIndex: 0,
      explanation: 'Chlorophyll is the light-absorbing green pigment situated inside the chloroplasts of plant cells.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b33',
      subject: 'Biology',
      topic: 'Transpiration in Plants',
      question: 'The loss of water vapor through microscopic stomata present on the surface of leaves is termed:',
      options: ['Respiration', 'Transpiration', 'Translocation', 'Germination'],
      correctIndex: 1,
      explanation: 'Transpiration generates a negative suction pull inside xylem vessels, pulling water and minerals up from the roots to tree canopies.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b34',
      subject: 'Biology',
      topic: 'Human Skeletal System',
      question: 'Which organ system protects delicate vital organs like the heart and lungs?',
      options: ['Vertebral Column', 'Rib Cage', 'Pelvic Girdle', 'Cranium'],
      correctIndex: 1,
      explanation: 'The thoracic rib cage, consisting of 12 pairs of ribs connected to the sternum, forms a protective enclosure around the heart and lungs.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b35',
      subject: 'Biology',
      topic: 'Microorganisms: Friend and Foe',
      question: 'Which friendly bacterium converts milk into curd (yogurt)?',
      options: ['Lactobacillus', 'Rhizobium', 'Escherichia coli', 'Penicillium'],
      correctIndex: 0,
      explanation: 'Lactobacillus bacteria ferment lactose sugar present in milk into lactic acid, which coagulates milk proteins into curd.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b36',
      subject: 'Biology',
      topic: 'Nitrogen Cycle & Legumes',
      question: 'Which bacteria living in the root nodules of leguminous plants like gram and peas fix atmospheric nitrogen into the soil?',
      options: ['Yeast', 'Rhizobium', 'Amoeba', 'Streptococcus'],
      correctIndex: 1,
      explanation: 'Rhizobium bacteria maintain a symbiotic relationship with legume roots, converting inert nitrogen (N₂) into bioavailable nitrates.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b37',
      subject: 'Biology',
      topic: 'Nutrition & Deficiency Diseases',
      question: 'Night blindness (inability to see clearly in dim light) is caused by a dietary deficiency of which vitamin?',
      options: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'],
      correctIndex: 0,
      explanation: 'Vitamin A (retinol) is essential for rhodopsin synthesis in eye rod cells; its deficiency causes night blindness.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b38',
      subject: 'Biology',
      topic: 'Animal Adaptations',
      question: 'Camels can survive long periods without drinking water in hot deserts primarily because they:',
      options: ['Do not sweat and excrete very concentrated urine', 'Store water directly in their humps', 'Breathe through their skin', 'Have hollow lightweight bones'],
      correctIndex: 0,
      explanation: 'Camels minimize moisture loss by rarely sweating and producing dry dung and concentrated urine. (Their humps store fat for energy, not water).',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b39',
      subject: 'Biology',
      topic: 'Ecosystems & Food Chains',
      question: 'In the food chain: Grass → Grasshopper → Frog → Snake → Eagle, which organism is the primary consumer?',
      options: ['Grass', 'Grasshopper', 'Frog', 'Eagle'],
      correctIndex: 1,
      explanation: 'Grass is the primary producer. The herbivore that eats grass directly is the grasshopper, making it the primary consumer.',
      difficulty: 'Foundational'
    },
    {
      id: 'c68_b40',
      subject: 'Biology',
      topic: 'Pollination & Reproduction',
      question: 'The transfer of pollen grains from the anther to the stigma of a flower is known as:',
      options: ['Fertilization', 'Pollination', 'Transpiration', 'Germination'],
      correctIndex: 1,
      explanation: 'Pollination is the mechanical transfer of pollen grains from the male anther to the female receptive stigma, facilitated by wind, water, or insect vectors.',
      difficulty: 'Foundational'
    }
  ],

  // ──────────────────────────────────────────────────────────────────
  // CLASS 11-12 (SENIOR STEM / JEE & NEET RIGOR) - 40 MIXED QUESTIONS
  // ──────────────────────────────────────────────────────────────────
  'Class 11-12': [
    // ── SECTION 1: PHYSICS (Questions 1 to 10) ──
    {
      id: 'c1112_p01',
      subject: 'Physics',
      topic: 'Rotational Dynamics & Moment of Inertia',
      question: 'A solid cylinder and a thin hollow spherical shell of identical mass M and radius R roll down an inclined plane without slipping. Which one reaches the bottom first?',
      options: [
        'The hollow spherical shell',
        'The solid cylinder',
        'Both reach at the exact same instant',
        'Depends on the angle of inclination of the ramp'
      ],
      correctIndex: 1,
      explanation: 'Acceleration on an incline: a = g·sin θ / (1 + I / MR²). Moment of inertia for solid cylinder is I = 0.5 MR² (ratio = 0.5); for hollow sphere I = 2/3 MR² ≈ 0.67 MR² (ratio = 0.67). Smaller I means greater linear acceleration; therefore, the solid cylinder reaches the bottom first.',
      difficulty: 'Advanced'
    },
    {
      id: 'c1112_p02',
      subject: 'Physics',
      topic: 'Thermodynamics & Carnot Cycle',
      question: 'A Carnot heat engine operates between reservoirs at 500 K and 300 K. What is the maximum theoretical thermodynamic efficiency of this engine?',
      options: ['25%', '40%', '60%', '66.7%'],
      correctIndex: 1,
      explanation: 'Carnot efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 500) = 1 - 0.60 = 0.40 = 40%.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_p03',
      subject: 'Physics',
      topic: 'Electrostatics & Gauss’s Law',
      question: 'A spherical conducting shell of radius R carries a net electric charge Q. What is the electric field strength at distance r from the center where r < R (inside the shell)?',
      options: ['Zero', 'kQ / r²', 'kQ / R²', 'kQr / R³'],
      correctIndex: 0,
      explanation: 'By Gauss’s Law, ∮ E·dA = q_enclosed / ε₀. Inside a hollow conductor in electrostatic equilibrium, no net charge is enclosed (q_enclosed = 0), so the electric field E is identically zero.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_p04',
      subject: 'Physics',
      topic: 'Current Electricity & RC Circuits',
      question: 'What is the time constant τ of a circuit containing a resistor R = 50 kΩ and a capacitor C = 20 µF in series?',
      options: ['1.0 millisecond', '1.0 second', '2.5 seconds', '10 seconds'],
      correctIndex: 1,
      explanation: 'Time constant τ = R × C = (50 × 10³ Ω) × (20 × 10⁻⁶ F) = 1000 × 10⁻³ s = 1.0 second.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_p05',
      subject: 'Physics',
      topic: 'Magnetism & Lorentz Force',
      question: 'A proton moves with velocity v perpendicularly into a uniform magnetic field B. What is the path followed by the proton and does the magnetic field do work on it?',
      options: ['Helical path; positive work done', 'Circular path; zero work done', 'Parabolic path; positive work done', 'Linear path; negative work done'],
      correctIndex: 1,
      explanation: 'Magnetic Lorentz force F = q(v × B) is always perpendicular to instantaneous velocity vector v. Since F ⟂ v, instantaneous power P = F·v = 0, so zero work is done while speed remains constant in a circular trajectory.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_p06',
      subject: 'Physics',
      topic: 'Wave Optics & Young’s Double Slit',
      question: 'In Young’s double-slit experiment, if the distance between the two slits is halved and the distance to the screen is doubled, how does the fringe width β change?',
      options: ['Remains unchanged', 'Doubled', 'Quadrupled (4 times)', 'Halved'],
      correctIndex: 2,
      explanation: 'Fringe width β = λD / d. If D → 2D and d → d/2, then β’ = λ(2D) / (d/2) = 4(λD / d) = 4β (quadrupled).',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_p07',
      subject: 'Physics',
      topic: 'Modern Physics & Photoelectric Effect',
      question: 'In Einstein’s photoelectric equation, if the frequency of incident radiation is doubled while keeping intensity constant, what happens to the maximum kinetic energy of emitted photoelectrons?',
      options: ['It is doubled', 'It is halved', 'It becomes more than double', 'It remains unchanged'],
      correctIndex: 2,
      explanation: 'Einstein’s equation: KE_max = hν - Φ. If ν → 2ν, then KE_max’ = 2hν - Φ = 2(hν - Φ) + Φ = 2(KE_max) + Φ. Since work function Φ > 0, the new KE_max is strictly more than twice the original.',
      difficulty: 'Advanced'
    },
    {
      id: 'c1112_p08',
      subject: 'Physics',
      topic: 'Nuclear Physics & Half-Life',
      question: 'A radioactive isotope has a half-life of 15 days. What fraction of the original sample remains undecayed after 45 days?',
      options: ['1/2', '1/4', '1/8', '1/16'],
      correctIndex: 2,
      explanation: 'Number of half-lives elapsed n = 45 / 15 = 3. Remaining fraction = (1/2)ⁿ = (1/2)³ = 1/8.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_p09',
      subject: 'Physics',
      topic: 'Semiconductors & p-n Junction',
      question: 'When a p-n junction diode is forward biased, what happens to the width of the depletion layer and the barrier potential?',
      options: ['Both increase', 'Depletion width decreases and barrier potential decreases', 'Depletion width increases and barrier potential decreases', 'Both remain constant'],
      correctIndex: 1,
      explanation: 'In forward bias, external positive voltage pushes holes toward the junction while negative voltage pushes electrons, overcoming internal space charge, reducing depletion width and barrier height.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_p10',
      subject: 'Physics',
      topic: 'Simple Harmonic Motion',
      question: 'For a particle executing simple harmonic motion (SHM) with amplitude A, at what displacement x from the mean position is its kinetic energy equal to its potential energy?',
      options: ['x = A/2', 'x = A / √2', 'x = A / 2√2', 'x = A/4'],
      correctIndex: 1,
      explanation: 'KE = 0.5 k(A² - x²) and PE = 0.5 k x². Equating KE = PE: A² - x² = x² => 2x² = A² => x = A / √2.',
      difficulty: 'Intermediate'
    },

    // ── SECTION 2: CHEMISTRY (Questions 11 to 20) ──
    {
      id: 'c1112_c11',
      subject: 'Chemistry',
      topic: 'Quantum Mechanics & Orbitals',
      question: 'Which set of quantum numbers (n, l, m_l, s) is physically forbidden for an electron in an isolated atom?',
      options: [
        'n = 3, l = 2, m_l = -1, s = +1/2',
        'n = 2, l = 2, m_l = 0, s = -1/2',
        'n = 4, l = 0, m_l = 0, s = +1/2',
        'n = 3, l = 1, m_l = +1, s = -1/2'
      ],
      correctIndex: 1,
      explanation: 'The azimuthal quantum number l can only take integer values from 0 up to (n - 1). For n = 2, the maximum allowed value of l is 1 (2s and 2p orbitals). l = 2 (a 2d orbital) is physically impossible.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_c12',
      subject: 'Chemistry',
      topic: 'Chemical Bonding & Hybridization',
      question: 'What is the hybridization and molecular geometry of xenon tetrafluoride (XeF₄) according to VSEPR theory?',
      options: [
        'sp³d, See-saw',
        'sp³d², Square Planar',
        'sp³d², Octahedral',
        'dsp², Tetrahedral'
      ],
      correctIndex: 1,
      explanation: 'Xe has 8 valence electrons. In XeF₄, 4 electrons form single bonds with F and 4 electrons form 2 lone pairs. Steric number = 4 + 2 = 6 (sp³d²). The 2 lone pairs occupy axial positions to minimize repulsions, producing a square planar geometry.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_c13',
      subject: 'Chemistry',
      topic: 'Thermodynamics & Spontaneity',
      question: 'A chemical reaction has ΔH = -80 kJ/mol (exothermic) and ΔS = -100 J/(mol·K). At what temperature range is this reaction spontaneous (ΔG < 0)?',
      options: [
        'At all temperatures',
        'At temperatures below 800 K',
        'At temperatures above 800 K',
        'Never spontaneous at any temperature'
      ],
      correctIndex: 1,
      explanation: 'Gibbs-Helmholtz: ΔG = ΔH - TΔS < 0 => -80,000 - T(-100) < 0 => 100T < 80,000 => T < 800 K. The reaction is spontaneous below 800 K.',
      difficulty: 'Advanced'
    },
    {
      id: 'c1112_c14',
      subject: 'Chemistry',
      topic: 'Chemical Equilibrium & Le Chatelier',
      question: 'For the Haber process reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) with ΔH = -92 kJ/mol, which condition maximizes ammonia yield at equilibrium?',
      options: [
        'High temperature and low pressure',
        'High pressure and low temperature',
        'Low pressure and low temperature',
        'High temperature and high pressure'
      ],
      correctIndex: 1,
      explanation: 'Forward reaction is exothermic (favored by lower temperature) and involves a decrease in gas moles from 4 to 2 (favored by high pressure according to Le Chatelier’s principle).',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_c15',
      subject: 'Chemistry',
      topic: 'Electrochemistry & Nernst Equation',
      question: 'According to the Nernst Equation, when a standard galvanic cell reaches equilibrium, what is the value of its cell potential E_cell?',
      options: ['E_cell = E°_cell', 'E_cell = 0 Volts', 'E_cell = 1.1 Volts', 'E_cell = -E°_cell'],
      correctIndex: 1,
      explanation: 'At electrochemical equilibrium, the forward and reverse reaction rates are equal, ΔG = 0, and therefore cell potential E_cell = 0 V (no current flows).',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_c16',
      subject: 'Chemistry',
      topic: 'Chemical Kinetics & Rate Law',
      question: 'For a first-order chemical reaction, if the initial reactant concentration is doubled, what happens to its half-life (t_1/2)?',
      options: ['It is doubled', 'It is halved', 'It remains completely unchanged', 'It is quadrupled'],
      correctIndex: 2,
      explanation: 'For a first-order reaction, t_1/2 = 0.693 / k. The half-life is completely independent of initial reactant concentration.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_c17',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanisms (SN1 vs SN2)',
      question: 'Why does tertiary butyl bromide [(CH₃)₃C-Br] undergo substitution predominantly via the SN1 pathway rather than SN2?',
      options: [
        'Steric hindrance blocks backside nucleophilic attack, and the tertiary carbocation intermediate is highly stabilized by hyperconjugation',
        'Bromide is a poor leaving group',
        'Tertiary halides cannot form ionic bonds',
        'SN1 reactions require non-polar solvents'
      ],
      correctIndex: 0,
      explanation: 'Bulky methyl groups prevent backside nucleophile attack (ruling out SN2). Furthermore, ionization produces a stable 3° carbocation stabilized by 9 hyperconjugative α-hydrogens and inductive release, favoring SN1.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_c18',
      subject: 'Chemistry',
      topic: 'Aromaticity & Huckel’s Rule',
      question: 'According to Hückel’s Rule, a monocyclic planar conjugated ring system exhibits aromatic stability if it possesses:',
      options: ['4n π electrons (where n = 0, 1, 2...)', '(4n + 2) π electrons (where n = 0, 1, 2...)', '2n π electrons', '(2n + 1) π electrons'],
      correctIndex: 1,
      explanation: 'Hückel’s rule states that cyclic planar delocalized π-systems possessing (4n + 2) π electrons (e.g. benzene with 6 π electrons, n=1) possess extraordinary aromatic stability.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_c19',
      subject: 'Chemistry',
      topic: 'Aldehydes, Ketones & Cannizzaro Reaction',
      question: 'Which of the following organic compounds undergoes the Cannizzaro reaction when heated with concentrated sodium hydroxide (NaOH)?',
      options: ['Acetaldehyde (CH₃CHO)', 'Formaldehyde (HCHO)', 'Acetone (CH₃COCH₃)', 'Propionaldehyde (CH₃CH₂CHO)'],
      correctIndex: 1,
      explanation: 'The Cannizzaro reaction is a disproportionation reaction undergone exclusively by aldehydes lacking an α-hydrogen (such as Formaldehyde HCHO and Benzaldehyde C₆H₅CHO).',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_c20',
      subject: 'Chemistry',
      topic: 'Coordination Chemistry & Crystal Field Theory',
      question: 'In octahedral transition metal complexes, crystal field splitting separates the five degenerate d-orbitals into which two sets?',
      options: [
        'Higher energy t_2g (3 orbitals) and lower energy e_g (2 orbitals)',
        'Lower energy t_2g (d_xy, d_yz, d_xz) and higher energy e_g (d_x²-y², d_z²)',
        'Three degenerate e_g orbitals and two degenerate t_2g orbitals',
        'Four planar orbitals and one axial orbital'
      ],
      correctIndex: 1,
      explanation: 'In an octahedral field, ligands approach along Cartesian axes, electrostatically repelling axial d_x²-y² and d_z² orbitals (e_g set, raised in energy) while non-axial d_xy, d_yz, d_xz orbitals (t_2g set) drop in energy.',
      difficulty: 'Intermediate'
    },

    // ── SECTION 3: MATHEMATICS (Questions 21 to 30) ──
    {
      id: 'c1112_m21',
      subject: 'Mathematics',
      topic: 'Calculus & Limits',
      question: 'Evaluate the limit: lim (x → 0) [sin(5x) / tan(2x)]',
      options: ['1', '5/2', '2/5', '0'],
      correctIndex: 1,
      explanation: 'Using standard limits lim (u→0) sin(u)/u = 1 and lim (v→0) tan(v)/v = 1: lim [5 · (sin(5x)/5x)] / [2 · (tan(2x)/2x)] = 5(1) / 2(1) = 5/2.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m22',
      subject: 'Mathematics',
      topic: 'Differential Calculus & Maxima',
      question: 'Find the minimum value of the function f(x) = x² - 6x + 13 for all real numbers x.',
      options: ['4', '7', '13', '0'],
      correctIndex: 0,
      explanation: 'f’(x) = 2x - 6 = 0 => x = 3. f’’(x) = 2 > 0 (confirms local minimum). f(3) = (3)² - 6(3) + 13 = 9 - 18 + 13 = 4.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m23',
      subject: 'Mathematics',
      topic: 'Definite Integration',
      question: 'Evaluate the definite integral: ∫ (from 0 to π/2) cos(x) dx',
      options: ['0', '1', 'π/2', '2'],
      correctIndex: 1,
      explanation: '∫ cos(x) dx = sin(x). Evaluating from 0 to π/2: sin(π/2) - sin(0) = 1 - 0 = 1.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m24',
      subject: 'Mathematics',
      topic: 'Vectors & Dot Product',
      question: 'If vectors a = 2i + 3j - k and b = 3i - 2j + c k are orthogonal (perpendicular), what is the value of scalar c?',
      options: ['0', '1', '-1', '12'],
      correctIndex: 0,
      explanation: 'Two non-zero vectors are perpendicular if and only if their dot product a·b = 0. a·b = (2)(3) + (3)(-2) + (-1)(c) = 6 - 6 - c = -c = 0 => c = 0.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m25',
      subject: 'Mathematics',
      topic: 'Matrices & Determinants',
      question: 'If A is a 3 × 3 invertible square matrix with determinant det(A) = 4, what is det(2A)?',
      options: ['8', '16', '32', '64'],
      correctIndex: 2,
      explanation: 'For any n × n matrix and scalar k, det(kA) = kⁿ · det(A). Here n = 3 and k = 2: det(2A) = 2³ · det(A) = 8 · 4 = 32.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_m26',
      subject: 'Mathematics',
      topic: 'Complex Numbers & Modulus',
      question: 'Find the modulus |z| of the complex number z = (3 + 4i) / (1 - i√3).',
      options: ['5/2', '5', '2.5', '1'],
      correctIndex: 0,
      explanation: '|z| = |3 + 4i| / |1 - i√3|. |3 + 4i| = √(3² + 4²) = 5. |1 - i√3| = √(1² + (√3)²) = √(1 + 3) = 2. Therefore |z| = 5/2.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_m27',
      subject: 'Mathematics',
      topic: 'Permutations & Combinations',
      question: 'In how many distinct ways can a committee of 3 students be selected from a class of 8 students?',
      options: ['24', '56', '336', '120'],
      correctIndex: 1,
      explanation: 'Combination formula: ⁸C₃ = 8! / [3! · (8 - 3)!] = (8 × 7 × 6) / (3 × 2 × 1) = 56 ways.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m28',
      subject: 'Mathematics',
      topic: 'Probability & Bayes’ Theorem',
      question: 'A box contains 4 red balls and 6 green balls. Two balls are drawn successively without replacement. What is the probability that both balls are red?',
      options: ['4/25', '2/15', '1/5', '6/25'],
      correctIndex: 1,
      explanation: 'P(First ball red) = 4/10 = 2/5. P(Second ball red | First red) = 3/9 = 1/3. P(Both red) = (2/5) × (1/3) = 2/15.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_m29',
      subject: 'Mathematics',
      topic: 'Three-Dimensional Geometry',
      question: 'The direction cosines of the vector r = 2i - 3j + 6k are:',
      options: [
        '2/7, -3/7, 6/7',
        '2/5, -3/5, 6/5',
        '2/11, -3/11, 6/11',
        '2/49, -3/49, 6/49'
      ],
      correctIndex: 0,
      explanation: 'Magnitude |r| = √(2² + (-3)² + 6²) = √(4 + 9 + 36) = √49 = 7. Direction cosines: l = 2/7, m = -3/7, n = 6/7.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_m30',
      subject: 'Mathematics',
      topic: 'Trigonometric Equations',
      question: 'Find the general solution to the trigonometric equation: sin(x) = 1/2.',
      options: [
        'x = nπ + (-1)ⁿ (π/6), where n ∈ ℤ',
        'x = 2nπ ± π/6, where n ∈ ℤ',
        'x = nπ + π/6, where n ∈ ℤ',
        'x = 2nπ + π/3, where n ∈ ℤ'
      ],
      correctIndex: 0,
      explanation: 'Principal solution is α = π/6. The general solution for sin(x) = sin(α) is x = nπ + (-1)ⁿ α, giving x = nπ + (-1)ⁿ (π/6) for any integer n.',
      difficulty: 'Foundational'
    },

    // ── SECTION 4: BIOLOGY & LIFE SCIENCES (Questions 31 to 40) ──
    {
      id: 'c1112_b31',
      subject: 'Biology',
      topic: 'Molecular Genetics & DNA Replication',
      question: 'During DNA replication in prokaryotes, which enzyme synthesizes short RNA primers required for DNA polymerase III to initiate chain elongation?',
      options: ['DNA Topoisomerase', 'DNA Primase (RNA Polymerase)', 'DNA Ligase', 'DNA Polymerase I'],
      correctIndex: 1,
      explanation: 'DNA polymerases cannot initiate polynucleotide synthesis de novo and require a free 3’-OH group provided by short RNA primers synthesized by DNA Primase.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b32',
      subject: 'Biology',
      topic: 'Cell Cycle & Meiosis',
      question: 'In which specific sub-stage of Prophase I of meiosis does genetic crossing-over (chiasma formation) occur between non-sister chromatids?',
      options: ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'],
      correctIndex: 2,
      explanation: 'Crossing-over, catalyzed by the recombinase enzyme complex, occurs during Pachytene of Meiotic Prophase I.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b33',
      subject: 'Biology',
      topic: 'Biomolecules & Enzyme Kinetics',
      question: 'In competitive enzyme inhibition, how do the Michaelis constant (K_m) and maximum velocity (V_max) change in the presence of the competitive inhibitor?',
      options: [
        'V_max decreases and K_m remains unchanged',
        'K_m increases (apparent affinity decreases) while V_max remains unchanged',
        'Both K_m and V_max decrease',
        'Both K_m and V_max increase'
      ],
      correctIndex: 1,
      explanation: 'Competitive inhibitors bind reversibly to the enzyme’s catalytic active site. Excess substrate can overcome the inhibitor (V_max unchanged), but a higher substrate concentration is required to reach half-maximal velocity (K_m increases).',
      difficulty: 'Advanced'
    },
    {
      id: 'c1112_b34',
      subject: 'Biology',
      topic: 'Plant Physiology & C4 Pathway',
      question: 'What is the initial carbon dioxide acceptor molecule in the mesophyll cells of C4 plants (such as maize and sugarcane)?',
      options: ['Ribulose-1,5-bisphosphate (RuBP)', 'Phosphoenolpyruvate (PEP)', 'Oxaloacetic acid (OAA)', 'Phosphoglycerate (PGA)'],
      correctIndex: 1,
      explanation: 'In C4 mesophyll cells, atmospheric CO₂ is captured by Phosphoenolpyruvate (PEP, a 3-carbon compound) catalyzed by PEP carboxylase, forming 4-carbon Oxaloacetic acid (OAA).',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b35',
      subject: 'Biology',
      topic: 'Neurobiology & Action Potential',
      question: 'The rapid depolarization phase of a neuronal action potential is driven by the sudden opening of which voltage-gated ion channels?',
      options: ['Voltage-gated Potassium (K⁺) channels', 'Voltage-gated Sodium (Na⁺) channels', 'Voltage-gated Chloride (Cl⁻) channels', 'Sodium-Potassium ATPase pumps'],
      correctIndex: 1,
      explanation: 'When membrane potential reaches threshold (approx. -55 mV), voltage-gated Na⁺ channels snap open, triggering an influx of sodium ions down their electrochemical gradient, rapidly depolarizing the cell toward +30 mV.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b36',
      subject: 'Biology',
      topic: 'Biotechnology & Recombinant DNA',
      question: 'In genetic engineering, which type of restriction endonucleases are preferred for gene cloning because they cut DNA molecules at specific palindromic recognition sequences?',
      options: ['Type I restriction enzymes', 'Type II restriction endonucleases (e.g. EcoRI)', 'Type III restriction enzymes', 'Exonucleases'],
      correctIndex: 1,
      explanation: 'Type II restriction endonucleases (like EcoRI and HindIII) cut DNA directly within or immediately adjacent to symmetrical palindromic recognition sites with high precision, generating cohesive sticky or blunt ends essential for molecular cloning.',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b37',
      subject: 'Biology',
      topic: 'Immunology & Antibodies',
      question: 'Which class of immunoglobulins (antibodies) is actively transported across the human placenta to provide passive natural immunity to the developing fetus?',
      options: ['IgA', 'IgD', 'IgE', 'IgG'],
      correctIndex: 3,
      explanation: 'Immunoglobulin G (IgG) is the predominant circulating monomeric antibody class and the only one capable of crossing the placental syncytiotrophoblast barrier to grant congenital passive immunity.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_b38',
      subject: 'Biology',
      topic: 'Evolution & Hardy-Weinberg Equilibrium',
      question: 'In a diploid population in Hardy-Weinberg equilibrium, if the frequency of a recessive allele (q) is 0.3, what is the frequency of heterozygous carriers (2pq)?',
      options: ['0.09', '0.42', '0.49', '0.21'],
      correctIndex: 1,
      explanation: 'p + q = 1 => p = 1 - 0.3 = 0.7. Frequency of heterozygotes = 2pq = 2(0.7)(0.3) = 0.42 (42%).',
      difficulty: 'Intermediate'
    },
    {
      id: 'c1112_b39',
      subject: 'Biology',
      topic: 'Ecology & Population Growth Models',
      question: 'In the Verhulst-Pearl logistic growth equation dN/dt = rN(K - N)/K, what does the ecological parameter K represent?',
      options: ['Intrinsic rate of natural increase', 'Carrying capacity of the environmental habitat', 'Total immigration rate', 'Critical mortality index'],
      correctIndex: 1,
      explanation: 'K represents the environmental Carrying Capacity — the maximum sustainable population density that the available resources (food, water, shelter) of a habitat can support.',
      difficulty: 'Foundational'
    },
    {
      id: 'c1112_b40',
      subject: 'Biology',
      topic: 'Human Physiology & Nephron Countercurrent',
      question: 'The hyperosmotic medullary concentration gradient in the mammalian kidney is maintained by the countercurrent multiplier mechanism between which two anatomical structures?',
      options: [
        'Bowman’s Capsule and Proximal Convoluted Tubule',
        'Loop of Henle and surrounding Vasa Recta capillaries',
        'Glomerulus and Afferent Arteriole',
        'Distal Convoluted Tubule and Urinary Bladder'
      ],
      correctIndex: 1,
      explanation: 'The countercurrent multiplication and exchange between the hairpin Loops of Henle of juxtamedullary nephrons and the parallel hairpin Vasa Recta blood vessels establishes a steep osmolarity gradient (300 to 1200 mOsm/L) in the renal medulla, facilitating water reabsorption.',
      difficulty: 'Advanced'
    }
  ]
};

/**
 * Resolve grade string to the appropriate question tier
 * Accepts 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', etc.
 */
export function getQuestionsForGrade(gradeString) {
  const normalized = (gradeString || 'Class 9').trim();
  const match = normalized.match(/\d+/);
  const gradeNum = match ? parseInt(match[0], 10) : 9;

  if (gradeNum <= 8) {
    return {
      tier: 'Class 6-8',
      displayGrade: `Class ${gradeNum || 7} (Middle School Discovery)`,
      questions: ASSESSMENT_QUESTIONS_BY_TIER['Class 6-8']
    };
  } else if (gradeNum <= 10) {
    return {
      tier: 'Class 9-10',
      displayGrade: `Class ${gradeNum || 9} (Secondary Board Preparation)`,
      questions: ASSESSMENT_QUESTIONS_BY_TIER['Class 9-10']
    };
  } else {
    return {
      tier: 'Class 11-12',
      displayGrade: `Class ${gradeNum || 11} (Senior Secondary / JEE & NEET)`,
      questions: ASSESSMENT_QUESTIONS_BY_TIER['Class 11-12']
    };
  }
}
