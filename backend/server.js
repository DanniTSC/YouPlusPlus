require('dotenv').config() // sa pot folosi variabile dintr-un fișier .env
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json()); // citire json din request
app.use('/api/auth', require('./routes/authRoutes')); // import rutele de autentificare
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

app.get('/api/db-status', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    res.json({ status: dbState === 1 ? "🟢 Conectat" : "🔴 Deconectat" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

