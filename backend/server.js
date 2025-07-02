require('dotenv').config() // sa pot folosi variabile dintr-un fișier .env
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors()); // cross origin resource sharing activat pt BE cu FE sa poata comunica
app.use(express.json()); // citire json din request
app.use('/api/auth', require('./routes/authRoutes')); // import rutele de autentificare
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/quote', require('./routes/quoteRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/meditation', require('./routes/meditationRoutes'));


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(' MongoDB connection error:', err));

app.get('/api/db-status', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    res.json({ status: dbState === 1 ? " Conectat" : "Deconectat" });
});

app.get('/test', (req, res) => {
    res.send(' Server funcționează');
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

