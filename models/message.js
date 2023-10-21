// Model de mensagem da aplicação
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  userId: Number,
  chatId: String,
  timestamp: String,
  isUserMessage: Boolean,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;