const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatId: String, // Id from the chat that is initialized
  userId: Number, // Id from the user that initialized the chat
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat