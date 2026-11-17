import express from 'express';
import { broadcastEvent } from '../realtime/broadcast.js';

const router = express.Router();

/**
 * PhET Interactive Simulations Catalog (University of Colorado Boulder)
 * Officially embeddable HTML5 science and math simulations with zero plugin requirement.
 */
const phetCatalog = {
  physics: [
    {
      id: 'circuit_dc',
      title: 'Circuit Construction Kit: DC (Virtual Lab)',
      subtitle: 'Build interactive circuits with batteries, lightbulbs, resistors & switches',
      phetUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_all.html',
      grade: 'Class 6 - 12',
      concept: 'Ohm’s Law (V = IR), Series & Parallel Resistors, Current Flow, Short Circuits',
      villageLink: 'Understand how household wiring, cycle dynamo, and solar home lighting systems work safely.',
      color: '#ff5b57',
    },
    {
      id: 'forces_motion',
      title: 'Forces and Motion: Basics',
      subtitle: 'Explore net force, friction, acceleration and Newton’s laws of motion',
      phetUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html',
      grade: 'Class 6 - 10',
      concept: 'Newton’s 1st & 2nd Laws (F = ma), Static vs Kinetic Friction, Tug-of-War Vector Sums',
      villageLink: 'Why pulling a loaded bullock cart on muddy village roads requires more force than on tarmac.',
      color: '#ffc531',
    },
    {
      id: 'ohms_law',
      title: 'Ohm’s Law Simulator',
      subtitle: 'See how changing voltage and resistance changes current in a real-time circuit',
      phetUrl: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_all.html',
      grade: 'Class 8 - 12',
      concept: 'Direct proportionality: Current I ∝ Voltage V and I ∝ 1 / Resistance R',
      villageLink: 'Why low voltage in rural transformers makes water pump motors run slow or overheat.',
      color: '#12b3a4',
    },
    {
      id: 'pendulum_lab',
      title: 'Pendulum Lab',
      subtitle: 'Experiment with period, gravity, length, and energy conservation',
      phetUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
      grade: 'Class 7 - 11',
      concept: 'Simple Harmonic Motion T = 2π√(L/g), Kinetic & Potential Energy Transformation',
      villageLink: 'How village grandfather clocks keep time and why swings move faster with shorter chains.',
      color: '#6b5be6',
    },
  ],

  chemistry: [
    {
      id: 'ph_scale',
      title: 'pH Scale: Basics',
      subtitle: 'Test pH levels of everyday substances: soap, lemon juice, milk, and water',
      phetUrl: 'https://phet.colorado.edu/sims/html/ph-scale-basics/latest/ph-scale-basics_all.html',
      grade: 'Class 7 - 11',
      concept: 'Logarithmic pH scale (0 to 14), Hydronium [H₃O⁺] vs Hydroxide [OH⁻] ion concentrations',
      villageLink: 'Testing agricultural soil acidity/alkalinity for optimal paddy and sugarcane crop harvest.',
      color: '#ff5b57',
    },
    {
      id: 'build_an_atom',
      title: 'Build an Atom',
      subtitle: 'Construct elements from protons, neutrons, and electrons and see atomic symbols',
      phetUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_all.html',
      grade: 'Class 8 - 12',
      concept: 'Atomic number (Z), Mass number (A), Isotopes, Net Electric Charge & Electron Shells',
      villageLink: 'Understand the building blocks of matter from village iron plows to atmospheric oxygen.',
      color: '#12b3a4',
    },
    {
      id: 'states_of_matter',
      title: 'States of Matter: Basics',
      subtitle: 'Heat, cool and compress atoms & molecules to explore solid, liquid, and gas phases',
      phetUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_all.html',
      grade: 'Class 6 - 10',
      concept: 'Thermal kinetic energy, Intermolecular forces, Phase transitions (melting, boiling, sublimation)',
      villageLink: 'How pressure cookers trap steam and why morning dew evaporates when the sun rises.',
      color: '#3aa0ff',
    },
    {
      id: 'reactants_products',
      title: 'Reactants, Products and Leftovers',
      subtitle: 'Balance chemical equations and discover limiting reagents through sandwich & water analogies',
      phetUrl: 'https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_all.html',
      grade: 'Class 8 - 11',
      concept: 'Stoichiometry, Law of Conservation of Mass, Limiting Reagents & Excess Reactants',
      villageLink: 'Mixing exact ratios of lime and water to prepare white-wash paint for village walls.',
      color: '#ffc531',
    },
  ],

  biology: [
    {
      id: 'natural_selection',
      title: 'Natural Selection',
      subtitle: 'Explore genetic mutations, predator selection, and environmental adaptation in bunnies',
      phetUrl: 'https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_all.html',
      grade: 'Class 8 - 12',
      concept: 'Darwinian Evolution, Allele frequencies, Camouflage, Mutation & Survival of the fittest',
      villageLink: 'Why local indigenous cow breeds (Desi cows) resist local heat and tick diseases better than exotic breeds.',
      color: '#2bd980',
    },
    {
      id: 'gene_expression',
      title: 'Gene Expression Essentials',
      subtitle: 'Transcribe DNA to mRNA and translate mRNA into real functional protein enzymes',
      phetUrl: 'https://phet.colorado.edu/sims/html/gene-expression-essentials/latest/gene-expression-essentials_all.html',
      grade: 'Class 9 - 12',
      concept: 'Central Dogma: DNA Transcription, RNA Polymerase, Ribosome Translation, Transcription Factors',
      villageLink: 'How bio-engineered Bt-cotton and drought-resistant seeds synthesize protective proteins.',
      color: '#6b5be6',
    },
    {
      id: 'membrane_channels',
      title: 'Membrane Channels (Cell Biology)',
      subtitle: 'Observe how ions and water molecules diffuse through gated cellular channels',
      phetUrl: 'https://phet.colorado.edu/sims/html/membrane-channels/latest/membrane-channels_all.html',
      grade: 'Class 9 - 12',
      concept: 'Phospholipid bilayer, Selective permeability, Facilitated diffusion, Osmosis & Gated ion channels',
      villageLink: 'How plant root hair cells absorb mineral nutrients dissolved in groundwater.',
      color: '#12b3a4',
    },
    {
      id: 'neuron',
      title: 'Neuron Action Potential',
      subtitle: 'Stimulate a nerve cell and watch sodium & potassium voltage-gated channels fire electrical signals',
      phetUrl: 'https://phet.colorado.edu/sims/html/neuron/latest/neuron_all.html',
      grade: 'Class 10 - 12',
      concept: 'Resting membrane potential (-70mV), Depolarization, Action potential pulse & Myelin sheath',
      villageLink: 'How your hand immediately jerks backward when touching a hot metal cooking vessel (Reflex Arc).',
      color: '#ff5b57',
    },
  ],

  mathematics: [
    {
      id: 'balancing_act',
      title: 'Balancing Act (Torque & Proportions)',
      subtitle: 'Balance seesaws with various masses, learn rotational torque and solve balance challenges',
      phetUrl: 'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html',
      grade: 'Class 6 - 10',
      concept: 'Rotational equilibrium: Mass 1 × Distance 1 = Mass 2 × Distance 2 (Torque τ = r × F)',
      villageLink: 'How traditional village weighing balances (Taraju) work in vegetable markets.',
      color: '#ffc531',
    },
    {
      id: 'area_builder',
      title: 'Area & Perimeter Builder',
      subtitle: 'Create irregular shapes and discover mathematical relationships between perimeter and area',
      phetUrl: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_all.html',
      grade: 'Class 5 - 9',
      concept: 'Area = Total square units enclosed; Perimeter = Total boundary length',
      villageLink: 'Calculating fencing wire needed for agricultural land vs crop planting yield.',
      color: '#2bd980',
    },
    {
      id: 'fraction_matcher',
      title: 'Fraction Matcher & Equivalence',
      subtitle: 'Match fractions using visual shapes, pie slices, and numerical ratios',
      phetUrl: 'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_all.html',
      grade: 'Class 5 - 8',
      concept: 'Equivalent fractions (1/2 = 2/4 = 4/8), Numerators & Denominators, Mixed fractions',
      villageLink: 'Dividing harvests of grains, measuring liters of milk, and sharing land portions.',
      color: '#3aa0ff',
    },
    {
      id: 'graphing_lines',
      title: 'Graphing Lines (Slope & Intercept)',
      subtitle: 'Interact with slope (m) and y-intercept (c) to see equations graph in real time',
      phetUrl: 'https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_all.html',
      grade: 'Class 8 - 11',
      concept: 'Linear equations y = mx + c, Slope = Rise / Run, Positive, negative and zero gradients',
      villageLink: 'Plotting crop growth over weeks or water level depletion in village wells.',
      color: '#6b5be6',
    },
  ],
};

// 1. GET FULL PHET SIMULATION CATALOG
router.get('/phet-catalog', (req, res) => {
  res.json({
    status: 'success',
    catalog: phetCatalog,
  });
});

// 2. GET SIMULATIONS FOR SPECIFIC DISCIPLINE (Physics / Chemistry / Biology / Mathematics)
router.get('/phet/:discipline', (req, res) => {
  const discipline = req.params.discipline.toLowerCase();
  const simulations = phetCatalog[discipline] || phetCatalog.physics;

  res.json({
    status: 'success',
    discipline,
    count: simulations.length,
    simulations,
  });
});

// 3. LEGACY / LOCAL PHYSICS CIRCUIT SIMULATOR
router.post('/physics/simulate', (req, res) => {
  const { voltage = 9, resistance = 25, isSwitchClosed = true } = req.body;
  const R = Math.max(1, Number(resistance));
  const V = Number(voltage);
  const closed = Boolean(isSwitchClosed);

  const current = closed ? parseFloat((V / R).toFixed(3)) : 0;
  const power = closed ? parseFloat((V * current).toFixed(2)) : 0;
  const brightnessPercent = closed ? Math.min(100, Math.round((power / 4) * 100)) : 0;

  const result = {
    voltage: V,
    resistance: R,
    isSwitchClosed: closed,
    currentAmperes: current,
    powerWatts: power,
    brightnessPercent,
    safetyStatus: current > 2.0 ? 'WARNING: High current heat dissipation' : 'OPTIMAL',
    formula: 'Ohm’s Law: I = V / R | Joule Heating: P = I²R',
  };

  broadcastEvent('CIRCUIT_TELEMETRY', result);

  res.json({
    status: 'success',
    simulation: 'Physics Electric Circuit',
    data: result,
  });
});

// 4. LEGACY / LOCAL CHEMISTRY REACTION SIMULATOR
router.post('/chemistry/react', (req, res) => {
  const { indicator = 'turmeric', reagent = 'none' } = req.body;

  let ph = 7.0;
  let color = '#ffcc00';
  let gasProduced = null;
  let reactionEquation = 'No active reaction in equilibrium.';

  if (indicator === 'turmeric') {
    if (reagent === 'baking_soda') {
      ph = 8.8;
      color = '#c72c21';
      gasProduced = 'CO2';
      reactionEquation = 'CH₃COOH (Acid) + NaHCO₃ (Base) → CH₃COONa + H₂O + CO₂ ↑ (Effervescence)';
    } else if (reagent === 'lemon') {
      ph = 2.4;
      color = '#ffe600';
      gasProduced = null;
      reactionEquation = 'C₆H₈O₇ + H₂O ⇌ C₆H₇O₇⁻ + H₃O⁺ (Weak Acid Ionization)';
    }
  } else if (indicator === 'cabbage') {
    if (reagent === 'baking_soda') {
      ph = 8.8;
      color = '#2b9348';
      gasProduced = 'CO2';
      reactionEquation = 'Flavylium cation deprotonation in alkaline medium (pH > 8)';
    } else if (reagent === 'lemon') {
      ph = 2.4;
      color = '#e63946';
      gasProduced = null;
      reactionEquation = 'Anthocyanin shifts to flavylium cation (red) at low pH';
    }
  }

  const result = {
    indicator,
    reagent,
    ph,
    hexColor: color,
    gasProduced,
    reactionEquation,
    isSafeForHome: true,
  };

  broadcastEvent('CHEM_REACTION', result);

  res.json({
    status: 'success',
    simulation: 'Chemistry Safe Reactions',
    data: result,
  });
});

export default router;
