const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coin_balance: { type: Number, default: 0 }, // Default coins are 0
});

module.exports = mongoose.model('User', userSchema);

