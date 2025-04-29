const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// 📥 GET toate obiceiurile de azi
router.get('/', auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const habits = await Habit.find({ user: req.user.id, date: today });
  res.json(habits);
});

// ✅ EVALUARE Streak, Badge-uri, Grafic + todayComplete + todayFailed
router.get('/evaluate', auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await User.findById(req.user.id);

  // --- 1️⃣ Obiceiuri de azi
  const habitsToday = await Habit.find({ user: req.user.id, date: today });
  const completed = habitsToday.filter(h => h.completed).length;
  const total     = habitsToday.length;

  // Pragul de 50%
  const required  = Math.floor(total / 2);
  const reached50 = total > 0 && completed >= required;
  const failed50  = total > 0 && completed <  required;

  let streakChanged = false;

  // Data ultimului check (ca să nu aplicăm de două ori în aceeași zi)
  const lastDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
  const isNewDay = !lastDate || lastDate.getTime() !== today.getTime();

  if (isNewDay) {
    if (reached50) {
      // --- 2️⃣ cresc streak-ul
      user.streak = (user.streak || 0) + 1;
      streakChanged = true;

      // --- 3️⃣ actualizez badge-urile
      const newBadges = [];
      if (user.streak >= 30) newBadges.push('Voință de Aur 🏅');
      else if (user.streak >= 7) newBadges.push('Voință de Fier 💪');
      else if (user.streak >= 3) newBadges.push('Un Nou Start 🚀');
      user.badges = newBadges;
    }
    else if (failed50) {
      // --- reset streak
      user.streak = 0;
      // NU ating badges
      streakChanged = true;
    }

    if (streakChanged) {
      user.lastStreakDate = today;
      await user.save();
    }
  }

  // --- 4️⃣ GRAFIC: Progres săptămânal
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

  res.json({
    weeklyData,
    streak: user.streak,
    badges: user.badges,
    todayComplete: reached50 ,
    todayFailed:   failed50 && streakChanged
  });
});


// ➕ POST habit
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  const habit = new Habit({ user: req.user.id, name });
  await habit.save();
  res.status(201).json(habit);
});

// 📝 PATCH toggle completed
router.patch('/:id', auth, async (req, res) => {
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { completed: req.body.completed },
    { new: true }
  );
  res.json(habit);
});

// ❌ DELETE habit
router.delete('/:id', auth, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Șters cu succes' });
});

module.exports = router;
