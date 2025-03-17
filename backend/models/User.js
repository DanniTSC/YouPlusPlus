const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, //nu perimte 2 conturi pe acelasi mail 
    password: { type: String, required: true }
}, { timestamps: true }); //adauga automat createdAt si updatedAt

module.exports = mongoose.model('User', UserSchema);
