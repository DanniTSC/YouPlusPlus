const express = require('express');
const quotes = require('../utils/quotes');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req, res) => {
  const random = Math.floor(Math.random() * quotes.length);
  res.json({ quote: quotes[random] });
});

module.exports = router;
