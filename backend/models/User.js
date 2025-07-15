const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  streak: { type: Number, default: 0 },
  lastStreakDate: Date,
  badges: [String]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


// in mongoDB se folosesc referinte pentru a nu creste dimensiunea unui singur document 