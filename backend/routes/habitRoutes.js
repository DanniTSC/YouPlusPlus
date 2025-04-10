const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');

// GET toate obiceiurile pentru ziua curentă
router.get('/', auth, async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const habits = await Habit.find({ user: req.user.id, date: today });
  res.json(habits);
});

router.get('/evaluate', auth, async (req, res) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // duminică
  
    const habits = await Habit.find({
      user: req.user.id,
      date: { $gte: startOfWeek },
    });
  
    // grupăm pe zi
    const days = Array(7).fill(0); // L-M-M-J-V-S-D
  
    habits.forEach(h => {
      const day = new Date(h.date).getDay(); // 0 = Duminică
      if (h.completed) days[day] += 1;
    });
  
    // streak logica (simplă pt demo)
    const streak = await Habit.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $group: { _id: "$date" } },
      { $count: "daysWithCompletion" }
    ]);
  
    res.json({
      weeklyData: days,
      streak: streak[0]?.daysWithCompletion || 0,
      badges: streak[0]?.daysWithCompletion >= 30
        ? ['Voință de Aur 🏅']
        : streak[0]?.daysWithCompletion >= 7
          ? ['Voință de Fier 💪']
          : streak[0]?.daysWithCompletion >= 3
            ? ['Un Nou Start 🚀']
            : []
    });
  });

// POST un habit nou
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

// DELETE habit
router.delete('/:id', auth, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: 'Șters cu succes' });
});


  


module.exports = router;
