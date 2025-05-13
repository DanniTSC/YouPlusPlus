const mongoose = require('mongoose');

const NutritionPlanSchema = new mongoose.Schema({
  goal: { type: String, enum: ['slăbit', 'masă', 'menținere'], required: true },
  level: { type: String, enum: ['începător', 'intermediar', 'avansat'], required: true },
  sex: { type: String, enum: ['masculin', 'feminin'], required: true },
  calories: Number,
  meals: [String],
  workouts: [String],
  tips: [String]
});

module.exports = mongoose.model('NutritionPlan', NutritionPlanSchema);
