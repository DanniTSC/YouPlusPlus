const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);

// Are:
// user cine a scris
// conținutul, text criptat la nivel de backend
// createdAt data înregistrării