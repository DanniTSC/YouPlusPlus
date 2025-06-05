const mongoose = require('mongoose');
const MeditationSession = require('./models/MeditationSession');

// Conectare la DB
mongoose.connect('mongodb://localhost:27017/YouPlusPlusDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userId = '67e2e3b05e07ed97119ce746';

const seedData = [];

const moods = ['anxios', 'stresat', 'neutru', 'calm', 'fericit'];
const durations = [300, 600, 1200];

// Generează 10 sesiuni pentru fiecare stare
moods.forEach(descriptor => {
  for (let i = 0; i < 10; i++) {
    const dur = durations[Math.floor(Math.random() * durations.length)];
    const before = Math.floor(Math.random() * 5) + 1;     // 1–5
    const after  = before + Math.floor(Math.random() * 4); // +0–3

    seedData.push({
      user: userId,
      type: 'mindfulness',
      duration: dur,
      moodBefore: { descriptor, score: before },
      moodAfter:  { descriptor, score: Math.min(after, 10) },
      endedAt: new Date()
    });
  }
});

(async () => {
  try {
    await MeditationSession.insertMany(seedData);
    console.log('✅ Seed complet pentru sesiuni.');
    process.exit();
  } catch (err) {
    console.error('❌ Eroare la seed:', err);
    process.exit(1);
  }
})();
