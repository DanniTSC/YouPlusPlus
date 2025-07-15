const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User    = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const CryptoJS = require('crypto-js');

const SECRET = process.env.VITE_JOURNAL_SECRET;

//  get toate înregistrările userului (DECRIPTARE)
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });

    const decryptedEntries = entries.map(entry => {
      const bytes = CryptoJS.AES.decrypt(entry.content, SECRET);
      const content = bytes.toString(CryptoJS.enc.Utf8);
      return { ...entry._doc, content };
    });

    res.status(200).json(decryptedEntries);
  } catch (err) {
    console.error('Eroare la fetch entries:', err);
    res.status(500).json({ message: 'Eroare server la obținerea jurnalelor.' });
  }
});

// Patch editare + criptare 
router.patch('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 3) {
      return res.status(400).json({ message: 'Conținut invalid sau prea scurt.' });
    }

    const encrypted = CryptoJS.AES.encrypt(content, SECRET).toString();

    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: encrypted },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Intrarea nu a fost găsită sau nu ai acces.' });
    }

    res.status(200).json({ message: 'Actualizat cu succes' });
  } catch (err) {
    console.error('Eroare la editare entry:', err);
    res.status(500).json({ message: 'Eroare server la actualizarea jurnalului.' });
  }
});

// Post + criptare 
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length < 3) {
      return res.status(400).json({ message: 'Conținut invalid sau prea scurt.' });
    }

    const encrypted = CryptoJS.AES.encrypt(content, SECRET).toString();

    const entry = new JournalEntry({ user: req.user.id, content: encrypted });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('Eroare la salvare entry:', err);
    res.status(500).json({ message: 'Eroare server la salvarea jurnalului.' });
  }
});

//setari
router.delete('/all', auth, async (req, res) => {
  try {
    await JournalEntry.deleteMany({ user: req.user.id });
    res.json({ message: 'Toate intrările din jurnal au fost șterse.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la ștergerea jurnalului.' });
  }
});

// delete 
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ message: 'Intrarea nu a fost găsită sau nu ai acces.' });
    res.status(200).json({ message: 'Intrare ștearsă cu succes.' });
  } catch (err) {
    console.error('Eroare la ștergere entry:', err);
    res.status(500).json({ message: 'Eroare server la ștergerea jurnalului.' });
  }
});

//  GET exercițiu random
const prompts = [
  // Recunoștință și pozitivitate
  "Scrie 3 lucruri pentru care ești recunoscător azi.",
  "Ce te-a făcut să zâmbești azi?",
  "Ce moment mic ai vrea să îți amintești din ziua asta?",
  "Care este o persoană care ți-a influențat pozitiv viața? De ce?",
  
  // Reflecție zilnică
  "Ce ai învățat despre tine azi?",
  "Care a fost cea mai provocatoare parte a zilei și cum ai reacționat?",
  "Ce ai fi putut face mai bine azi?",
  "Ce obicei mic ți-ar îmbunătăți ziua de mâine?",
  
  // Obiective și viziune
  "Ce ți-ai dori să înveți despre tine luna asta?",
  "Unde vrei să fii peste 6 luni – emoțional, fizic, profesional?",
  "Dacă te-ai întâlni cu versiunea ta din copilărie, ce i-ai spune?",
  "Ce ai face dacă ai ști că nu poți eșua?",
  
  // Mental health & eliberare emoțională
  "Care e un gând negativ de care vrei să te eliberezi?",
  "Ce emoție ai simțit cel mai intens azi?",
  "Ce îți spui când ești prea dur cu tine?",
  "Ce ai nevoie să îți auzi azi?",
  
  // Viziune & scrisori către sine
  "Scrie o scrisoare pentru 'You++' – versiunea ta viitoare peste 5 ani.",
  "Scrie o scrisoare pentru 'You++' – versiunea ta viitoare peste 1 an.",
  "Scrie-ți un mesaj de susținere pentru zilele în care vei simți că renunți.",
  
  // Creativ & motivațional
  "Dacă viața ta ar fi un film, ce titlu ar avea azi?",
  "Ce superputere ți-ai dori să ai azi și cum ai folosi-o?",
  "Care sunt cele 3 lucruri care îți dau energie în ultima vreme?",
  "Ce ți-ai spune dacă ai fi cel mai bun prieten al tău?"
];

router.get('/prompt', auth, (req, res) => {
  try {
    const random = Math.floor(Math.random() * prompts.length);
    res.status(200).json({ prompt: prompts[random] });
  } catch (err) {
    console.error('Eroare la generare prompt:', err);
    res.status(500).json({ message: 'Eroare server la generarea exercițiului.' });
  }
});



//setari 
router.get('/export', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    // decriptăm
    const rows = entries.map(e => {
      const bytes   = CryptoJS.AES.decrypt(e.content, SECRET);
      const content = bytes.toString(CryptoJS.enc.Utf8).replace(/\r?\n/g, ' '); //inlocuire toate caracterele newline
      return `"${content}","${e.createdAt.toISOString()}"`;
    });
    const header = `"Ce ai scris","Cand ai scris"`;
    const csv    = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="journal.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la exportul jurnalului.' });
  }
});

module.exports = router;
