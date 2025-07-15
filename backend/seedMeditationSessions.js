
require('dotenv').config();
const mongoose = require('mongoose');
const MeditationSession = require('./models/MeditationSession');

const MONGO_URI = process.env.MONGO_URI;
const USER_ID   = process.env.TEST_USER_ID || 'YOUR_USER_ID_HERE';

const now = new Date();
const seedData = [
 
  {
    user:       USER_ID,
    type:       'mindfulness',
    duration:   300,
    startedAt:  now,
    endedAt:    new Date(now.getTime() + 300 * 1000),
    moodBefore: { descriptor: 'neutru', score: 5 },
    moodAfter:  { descriptor: 'fericit', score: 10 },
  },
 
  {
    user:       USER_ID,
    type:       'box-breathing',
    duration:   600,
    startedAt:  now,
    endedAt:    new Date(now.getTime() + 600 * 1000),
    moodBefore: { descriptor: 'neutru', score: 5 },
    moodAfter:  { descriptor: 'calm',    score: 7 },
  },
  
  {
    user:       USER_ID,
    type:       'mindfulness',
    duration:   1200,
    startedAt:  now,
    endedAt:    new Date(now.getTime() + 1200 * 1000),
    moodBefore: { descriptor: 'anxios',  score: 1 },
    moodAfter:  { descriptor: 'fericit', score: 10 },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');


    await MeditationSession.deleteMany({ user: USER_ID });
    console.log('🗑️  Old sessions removed');


    await MeditationSession.insertMany(seedData);
    console.log(' MeditationSession seed completed');
  } catch (err) {
    console.error(' Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected');
  }
}

seed();
