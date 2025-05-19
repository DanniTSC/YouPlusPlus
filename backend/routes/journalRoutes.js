const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User    = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const CryptoJS = require('crypto-js');

const SECRET = process.env.VITE_JOURNAL_SECRET;

// 🔐 GET toate înregistrările userului (DECRIPTARE)
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

// ✏️ PATCH (EDITARE CU CRIPTARE)
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

// ➕ POST (CU CRIPTARE)
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

// ❌ DELETE
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

// 🎲 GET exercițiu random
const prompts = [
  "Scrie 3 lucruri pentru care ești recunoscător azi.",
  "Ce te-a făcut să zâmbești azi?",
  "Ce ți-ai dori să înveți despre tine luna asta?",
  "Care e un gând negativ de care vrei să te eliberezi?",
  "Scrie o scrisoare pentru 'You++' – versiunea ta viitoare peste 6 luni.",
  "Scrie o scrisoare pentru 'You++' – versiunea ta viitoare peste 5 ani.",
  "Scrie o scrisoare pentru 'You++' – versiunea ta viitoare peste 1 an."
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
      const content = bytes.toString(CryptoJS.enc.Utf8).replace(/\r?\n/g, ' ');
      return `"${e._id}","${content}","${e.createdAt.toISOString()}"`;
    });
    const header = `"_id","content","createdAt"`;
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
