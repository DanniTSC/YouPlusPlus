// backend/models/MeditationSession.js
const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  descriptor: {
    type: String,
    enum: ['anxios','stresat','neutru','calm','fericit'],
    required: true
  },
  score: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  }
}, { _id: false });

const MeditationSessionSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['box-breathing','mindfulness'], required: true },
  duration:   { type: Number, required: true },       // seconds
  startedAt:  { type: Date, default: Date.now },
  endedAt:    { type: Date },
  moodBefore: { type: MoodSchema, required: true },
  moodAfter:  { type: MoodSchema, required: false }
}, { timestamps: true });

module.exports = mongoose.model('MeditationSession', MeditationSessionSchema);


// user – cine a făcut sesiunea
// type – tipul („box-breathing” sau „mindfulness”)
// duration – durata în secunde
// startedAt, endedAt
// moodBefore și moodAfter – starea și scorul emoțional înainte și după sesiune