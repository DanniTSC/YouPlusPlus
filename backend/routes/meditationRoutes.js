// backend/routes/meditationRoutes.js
const express           = require('express');
const router            = express.Router();
const auth              = require('../middleware/authMiddleware');
const MeditationSession = require('../models/MeditationSession');
const ALPHA = parseFloat(process.env.RECO_ALPHA) || 5;
const DURATIONS         = [300, 600, 1200];             // secunde


// 1️⃣ START a session
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
    return res.status(201).json({ sessionId: session._id });
  } catch (err) {
    console.error('❌ START session error:', err);
    return res.status(500).json({ message: 'Eroare la start session.' });
  }
});

// 2️⃣ COMPLETE a session
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
    if (!session) {
      return res.status(404).json({ message: 'Session nu a fost găsit.' });
    }
    return res.json({ message: 'Sesiune completată!' });
  } catch (err) {
    console.error('❌ COMPLETE session error:', err);
    return res.status(500).json({ message: 'Eroare la complete session.' });
  }
});

// RECOMMENDATIONS cu Bayesian smoothing
//endpoint get valabil doar pentru utilziatorii autentificati cu middleware auth
router.get('/recommendations', auth, async (req, res) => {
  try {
    const mood = req.query.mood; // extrage mood din query param

    // filtrez doar sesiunile userului curent cu un query in MongoDB
    const query = { user: req.user.id };
    if (mood) query['moodBefore.descriptor'] = mood;

    const sessions = await MeditationSession.find(query);
    //preiau toate sesiunile care respecta query-ul
    
    const byDur = DURATIONS.reduce((acc,d) => ({ ...acc, [d]: [] }), {});
    //initializez un obiect care mapeaza fiecare durata in secunde

    sessions
      .filter(s => s.moodAfter && s.moodBefore)
      .forEach(s => {
        const delta = s.moodAfter.score - s.moodBefore.score;
        if (byDur[s.duration]) byDur[s.duration].push(delta);
      }); 
      //pentru fiecare sesiune care are scoruri pentru before & after
      //calculez delta, cat de mult s-a imbunatati starea
      //si adaug valoarea in lista corespunzatoare


    // Prior global
    const allDeltas = [].concat(...Object.values(byDur));
    const overallMean = allDeltas.length
      ? allDeltas.reduce((sum, d) => sum + d, 0) / allDeltas.length
      : 0;
      //daca nu exista date, media este 0, altfel o calculez

    // Posterior Bayesian
    const stats = {};
    let bestDuration  = null;
    let bestPosterior = -Infinity;

    for (const d of DURATIONS) {
      const arr = byDur[d];
      const count = arr.length;
      const mean = count ? arr.reduce((a,b) => a + b, 0) / count : 0;
      const posterior = (ALPHA * overallMean + count * mean) / (ALPHA + count);
      stats[d] = { count, mean, posterior };
        

        if (posterior > bestPosterior) {
          bestPosterior = posterior;
          bestDuration = d;
            }
  }
      


    // 4️⃣ Mesaj + fallback
    let message;
    if (bestDuration) {
      message = `Atunci cand esti: („${mood ?? 'toate'}”), ${bestDuration/60} minute de meditatie par cele mai eficiente.`;
    } else {
      bestDuration = 300;
      message = 'Nu avem destule date. Îți recomandăm 5 minute ca început.';
    }
    //daca am gasit o durata cu date suficienta construiesc mesajul de recomandare cu durata optima
    //daca nu exista date deloc dau o recomandare default


    return res.json({ stats, bestDuration, message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Eroare la recommendations.' });
  }
});


router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await MeditationSession.find({
      user: req.user.id,
      moodAfter: { $exists: true }
    });
    res.json(sessions);
  } catch (err) {
    console.error('Eroare la fetch sessions:', err);
    res.status(500).json({ message: 'Eroare server la obținerea sesiunilor.' });
  }
});

module.exports = router;
