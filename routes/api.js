const express = require('express');
const TelegramBot = require('../bot/bot');

const router = express.Router();
// Criando um instância do bot
const botInstance = new TelegramBot();

router.post('/sendMessage', async (req, res) => {
  const messageText = req.body.message;

  try {
    // Usando a instância do bot para mandar mensagens
    await botInstance.bot.telegram.sendMessage(6186971422, messageText);
    
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});

module.exports = router;