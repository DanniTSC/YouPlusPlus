const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) } // doar ziua
}, { timestamps: true }); // modelul folosește timestamps, deci are automat și createdAt, updatedAt.

module.exports = mongoose.model('Habit', HabitSchema);

// Fiecare obicei are:
// un id-ul al userului care l-a creat
// un nume 
// un flag completed dacă a fost bifat sau nu 
// o dată 
