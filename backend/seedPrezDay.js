const mongoose = require('mongoose');
const Habit = require('./models/Habit.js');

const userId = new mongoose.Types.ObjectId("67e2e6e15e07ed97119ce74c");

const azi = new Date(2025, 6, 15, 0, 0, 0); // 15 iulie 2025, ora 00:00 local
azi.setHours(0, 0, 0, 0);
const aziUTC = new Date(azi.getTime() - 3 * 60 * 60 * 1000); // Scade 3 ore pentru UTC

// Conectează-te la baza ta de date!
mongoose.connect('mongodb://127.0.0.1:27017/YouPlusPlusDB')
  .then(async () => {
    // 1. ȘTERGE progresul de azi
    await Habit.deleteMany({ user: userId, date: aziUTC });

    // 2. Adaugă progresul pentru IERI (cu același tip de seed, dar cu data de ieri)
    const ieri = new Date(azi.getTime() - 24 * 60 * 60 * 1000); // Ieri la 00:00 local
    const ieriUTC = new Date(ieri.getTime() - 3 * 60 * 60 * 1000); // Ieri la 21:00 UTC

    await Habit.insertMany([
      { user: userId, name: "Apă", completed: true, date: ieriUTC },
      { user: userId, name: "Sport", completed: true, date: ieriUTC },
      { user: userId, name: "Meditație", completed: true, date: ieriUTC },
      { user: userId, name: "Citit", completed: true, date: ieriUTC }
    ]);

    console.log("Seed complet: progresul de azi șters, progres adăugat pentru ieri.");
    process.exit();
  })
  .catch(e => console.error(e));
