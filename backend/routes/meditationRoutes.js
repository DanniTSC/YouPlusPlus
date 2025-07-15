const express           = require('express');
const router            = express.Router();
const auth              = require('../middleware/authMiddleware');
const MeditationSession = require('../models/MeditationSession');
const ALPHA = parseFloat(process.env.RECO_ALPHA) || 5;
const DURATIONS         = [300, 600, 1200];             // secunde


// start sesiune
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
    console.error(' eroare start sesiune:', err);
    return res.status(500).json({ message: 'Eroare la start sesiunii.' });
  }
});

// completare sesiune
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
    console.error(' Eroare la completare sesiune:', err);
    return res.status(500).json({ message: 'Eroare la completare sesiune.' });
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
      //iau toate sesiunile userului
      //le organizez dupa durata sesiunii (toate meditatiile de 5 minute la un loc)
      //pentru fiecare sesiune care are scoruri pentru before & after
      //calculez delta, cat de mult s-a imbunatati starea
      //si adaug valoarea delta in lista corespunzatoare duratei 


    // Prior global = (asteptarea generala) media a tuturor imbunatatirilor, 
    const allDeltas = [].concat(...Object.values(byDur));
    const overallMean = allDeltas.length
      ? allDeltas.reduce((sum, d) => sum + d, 0) / allDeltas.length
      : 0;
      //daca nu exista date, media este 0, altfel o calculez

    // Smooth Bayesian
    const stats = {};
    let bestDuration  = null;
    let bestPosterior = -Infinity;

    for (const d of DURATIONS) {
      const arr = byDur[d];
      const count = arr.length; //cate sesiuni am avut de un anumit tip ( durata 5 min 10 min etc)
      const mean = count ? arr.reduce((a,b) => a + b, 0) / count : 0; // media scorurilor de imbunatatire pentru acea durata 
      
      //alpha = increderea in media globala de cate ori conteaza scorul mediu global in comparatie cu datele userului, cu cat alpha cu atat trage mai mult spre overallmean, aplha e 5 primele 5 sesiuni de meditatie sunt la fel de importante ca media globala 
      //overallmean = media tuturor scorurilor de imbunatatire (delta) al userului avand in vedere toate tipurile de meditatie 
      //count nr sesiuni cu cat sesiunile cresc cu atat conteaza mai mult experienta proprie a userului
      //mean e media scorurilor doar pentru un tip de durata PERSONALIZATA
      const posterior = (ALPHA * overallMean + count * mean) / (ALPHA + count); // nu dau recomandari bazate doar pe ce rezultate are userul ci combin scorul sau cu media globala(prior), cu cat are mai multe incercari cu atat scorul se ajusteaza catre media sa proprie 
      stats[d] = { count, mean, posterior }; // scorul ajutat bayesian = media globala + media proprie ponderata cu alpha si count 
      //daca count este mare si am mult date personale media userului influenteaza mai mult
      //daca count este mic si nu sunt asa multe date personale media va fi mai apropiata de prior 
      //durata cu cel mai mare posterior este recomandarea 
        
      //caut cel mai bun scor posterior 
        if (posterior > bestPosterior) {
          bestPosterior = posterior;
          bestDuration = d;
            }
  }
      


    //  Mesaj + fallback
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
