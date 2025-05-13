// backend/routes/nutritionRoutes.js
const express       = require('express');
const router        = express.Router();
const auth          = require('../middleware/authMiddleware');
const NutritionPlan = require('../models/NutritionPlan');

router.post('/plan', auth, async (req, res) => {
  const { sex, goal, level } = req.body;
  if (!sex || !goal || !level) {
    return res.status(400).json({ message: 'Sex, goal și level sunt necesare.' });
  }
  try {
    const preset = await NutritionPlan.findOne({ sex, goal, level });
    if (!preset) {
      return res.status(404).json({ message: `Nu există plan pentru ${sex}, ${goal}, ${level}.` });
    }
    return res.status(200).json({
      workouts: preset.workouts,
      meals:    preset.meals,
      tips:     preset.tips
    });
  } catch (err) {
    console.error('Eroare la generare plan:', err);
    return res.status(500).json({ message: 'Eroare server la generarea planului.' });
  }
});

module.exports = router;
