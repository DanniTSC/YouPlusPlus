const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

//ruta de signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //verificare existenta user 
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        //hasuire parola de salt round 10 
        const hashedPassword = await bcrypt.hash(password, 10);

        // creare user 
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

//ruta login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //gasim user dupa email 
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        //verificare parola 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        //generare jwt expira in 7 zile 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});


// ruta protejata doar utilizatorii autentificați pot accesa
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // elimin parola din raspuns
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});


router.get('/home', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Eliminăm parola din răspuns
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});
//setari
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email name');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la obținerea profilului.' });
  }
});

// setari ✏️ PATCH /api/auth/me — actualizează doar name
router.patch('/me', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Nume invalid.' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, select: 'email name' }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la actualizarea numelui.' });
  }
});

module.exports = router;
