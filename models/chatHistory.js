const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: Date,
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);