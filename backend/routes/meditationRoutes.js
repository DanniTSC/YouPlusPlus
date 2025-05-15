// backend/routes/meditationRoutes.js
const express             = require('express');
const router              = express.Router();
const auth                = require('../middleware/authMiddleware');
const MeditationSession   = require('../models/MeditationSession');

// START a session
router.post('/start', auth, async (req, res) => {
  const { type, duration, moodBefore } = req.body;
  if (!type || !duration || !moodBefore) {
    return res.status(400).json({ message: 'type, duration și moodBefore necesare.' });
  }
  try {
    const session = await MeditationSession.create({
      user:       req.user.id,
      type,
      duration,
      moodBefore
    });
    res.status(201).json({ sessionId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la start session.' });
  }
});

// COMPLETE a session
router.post('/complete', auth, async (req, res) => {
  const { sessionId, endedAt, moodAfter } = req.body;
  if (!sessionId || !endedAt || !moodAfter) {
    return res.status(400).json({ message: 'sessionId, endedAt și moodAfter necesare.' });
  }
  try {
    const session = await MeditationSession.findOneAndUpdate(
      { _id: sessionId, user: req.user.id },
      { endedAt, moodAfter },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session nu a fost găsit.' });
    res.json({ message: 'Sesiune completată!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la complete session.' });
  }
});

// RECOMMENDATIONS
router.get('/recommendations', auth, async (req, res) => {
  try {
    const sessions = await MeditationSession.find({ user: req.user.id });
    const byDur = { 300:[],600:[],1200:[] };
    sessions.forEach(s => {
      const d = s.duration;
      const delta = s.moodAfter.score - s.moodBefore.score;
      if (byDur[d]) byDur[d].push(delta);
    });
    const stats = {};
    let best = null, bestAvg = -Infinity;
    for (const [dur, arr] of Object.entries(byDur)) {
      const count = arr.length;
      const avg   = count ? arr.reduce((a,b)=>a+b,0)/count : 0;
      stats[dur] = { count, avgDelta: avg };
      if (avg>bestAvg) { bestAvg=avg; best=dur; }
    }
    res.json({
      stats,
      bestDuration: best,
      message: best
        ? `Pentru tine, sesiunile de ${best/60} minute au cele mai mari îmbunătățiri medii (${bestAvg.toFixed(1)} puncte).`
        : 'Nu există încă suficiente date.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la recommendations.' });
  }
});

module.exports = router;
