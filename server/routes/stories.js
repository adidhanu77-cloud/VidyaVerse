import express from 'express';

const router = express.Router();

const storiesDatabase = [
  {
    id: 'rocket_raju',
    title: 'Rocket Raju’s Village Space Mission',
    character: 'Raju (12 years old, rural school student)',
    coreConcept: 'Newton’s 3rd Law of Motion: Action & Reaction',
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Muddy Field & The Heavy Rice Sack',
        storyText: 'Raju was tasked with carrying a 20kg rice bag across the flooded paddy path. Every time he tried to push forward, his boots slipped backward in the monsoon mud. Why couldn’t he build speed?',
        sciencePrinciple: 'Newton’s 3rd Law: To propel yourself forward (+F), your foot must push the earth backward (-F). Wet mud provides inadequate static friction, absorbing the force instead of pushing back!',
        icon: '🌾',
      },
      {
        chapterNumber: 2,
        title: 'The Bicycle Tire Pump Rocket',
        storyText: 'Using his grandfather’s metal bicycle tire pump, Raju fitted a rubber balloon onto the brass nozzle and secured a straw as a guide rail. When he released the clamp, the balloon zoomed across the village courtyard!',
        sciencePrinciple: 'Action and Reaction! High-pressure air escapes backward (-F), creating an equal and opposite forward thrust (+F) that launches the balloon.',
        icon: '🚀',
      },
      {
        chapterNumber: 3,
        title: 'Raju’s Water Rocket for the Science Fair',
        storyText: 'By attaching half-filled recycled water bottles to the bicycle pump, Raju demonstrated hydraulic pressure and nozzle expansion, winning 1st prize at the taluk science exhibition!',
        sciencePrinciple: 'Water is denser than air, so expelling water generates higher momentum (p = mv), giving the rocket 5x greater altitude.',
        icon: '🌌',
      },
    ],
  },
];

// 1. GET ALL STORIES
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: storiesDatabase,
  });
});

// 2. GET SPECIFIC STORY
router.get('/:id', (req, res) => {
  const story = storiesDatabase.find((s) => s.id === req.params.id) || storiesDatabase[0];
  res.json({
    status: 'success',
    data: story,
  });
});

export default router;
