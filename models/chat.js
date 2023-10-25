const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatId: String,
  userId: Number,
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat