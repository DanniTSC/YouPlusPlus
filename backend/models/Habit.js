const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) } // doar ziua
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
