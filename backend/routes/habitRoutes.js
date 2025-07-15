const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// GET toate obiceiurile de azi
router.get('/', auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const habits = await Habit.find({ user: req.user.id, date: today });
  res.json(habits);
});

// Evaluare Streak, Badge-uri, Grafic + todayComplete + todayFailed
router.get('/evaluate', auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Încarcă user & obiceiurile de azi
  const user = await User.findById(req.user.id);
  const habitsToday = await Habit.find({ user: req.user.id, date: today });
  const completed = habitsToday.filter(h => h.completed).length;
  const total     = habitsToday.length;

  // Pragul de 50%
  const required  = Math.floor(total / 2);
  const reached50 = total > 0 && completed >= required;
  const failed50  = total > 0 && completed <  required;

  let streakChanged = false;

  // Actualizează streak-ul o singură dată pe zi
  const lastDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
  const isNewDay = !lastDate || lastDate.getTime() !== today.getTime();

  if (isNewDay) {
    if (reached50) {
      user.streak = (user.streak || 0) + 1;
      streakChanged = true;
    } else if (failed50) {
      user.streak = 0;
      streakChanged = true;
    }

    if (streakChanged) {
      user.lastStreakDate = today;
      await user.save();
    }
  }

  // Acordă Toate badge-urile meritate la streak-ul curent
  const possible = [
    { cond: user.streak >= 1,   name: 'Primul Pas 👣' },
    { cond: user.streak >= 3,   name: 'Un Nou Start 🚀' },
    { cond: user.streak >= 7,   name: 'Voință de Fier 💪' },
    { cond: user.streak >= 14,  name: 'Două Săptămâni fără Oprire 🚧' },
    { cond: user.streak >= 21,  name: 'Obicei de 21 Zile 🌱' },
    { cond: user.streak >= 30,  name: 'Voință de Aur 🥇' },
    { cond: user.streak >= 60,  name: 'Stăpânul Disciplinei 🏆' },
    { cond: user.streak >= 100, name: 'Legenda You++ 🦸‍♂️' },
  ];
  // badge-uri pentru fiecare multiplu de 10
  if (user.streak > 0 && user.streak % 10 === 0) {
    possible.push({ cond: true, name: `X${user.streak} Streak 🔄` });
  }

  const earned = possible
    .filter(b => b.cond && !user.badges.includes(b.name))
    .map(b => b.name);

  if (earned.length) {
    user.badges.push(...earned);
    await user.save();
  }

  // Grafic : Progres săptămânal
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Duminică

  const habitsWeek = await Habit.find({
    user: req.user.id,
    date: { $gte: startOfWeek }
  });

  const weeklyData = Array(7).fill(0);
  habitsWeek.forEach(h => {
    const day = new Date(h.date).getDay(); // 0 = Duminică
    if (h.completed) weeklyData[day] += 1;
  });

  //  Răspuns
  res.json({
    weeklyData,
    streak: user.streak,
    badges: user.badges,
    todayComplete: reached50,
    todayFailed: failed50 && streakChanged
  });
});

//  POST habit
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  const habit = new Habit({ user: req.user.id, name });
  await habit.save();
  res.status(201).json(habit);
});

// PATCH toggle completed
router.patch('/:id', auth, async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { completed: req.body.completed },
    { new: true }
  );
  res.json(habit);
});

//  DELETE habit
router.delete('/:id', auth, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Șters cu succes' });
});

module.exports = router;
