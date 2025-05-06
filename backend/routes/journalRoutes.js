const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const JournalEntry = require('../models/JournalEntry');

// 🔐 GET toate înregistrările userului
router.get('/', auth, async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(entries);
});

// ➕ POST nouă înregistrare
router.post('/', auth, async (req, res) => {
  const { content } = req.body;
  const entry = new JournalEntry({ user: req.user.id, content });
  await entry.save();
  res.status(201).json(entry);
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

router.get('/prompt', (req, res) => {
  const random = Math.floor(Math.random() * prompts.length);
  res.json({ prompt: prompts[random] });
});

module.exports = router;
