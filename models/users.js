const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Other user-related fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;