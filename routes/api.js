const express = require('express');
const TelegramBot = require('../bot/bot');
const Message = require('../models/message')

const router = express.Router();

// Criando um instância do bot
const botInstance = new TelegramBot();

router.post('/sendMessage', async (req, res) => {
  const messageText = req.body.message;

  try {
    // Usando a instância do bot para mandar mensagens
    await botInstance.bot.telegram.sendMessage(6186971422, messageText);

    const userId = req.body.userId;
    const timestamp = new Date();

    const newMessage = new Message({
      text: messageText,
      userId,
      timestamp: timestamp, // Campo de tempo para saber quando a mensagem foi enviada
      isUserMessage: false, // Campo booleano para distinguir se é o usuário ou o bot
    });

    await newMessage.save();

    res.status(200).send('Message sent and saved successfully');

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Failed to send message');
  }
});

router.get('/getHistory', async (req, res) => {
  await Message.find().sort({ timestamp: -1 })
    .then((messages) => {
      res.json(messages)
      console.log('Retrieved messages:', messages);
    })
    .catch((error) => {
      console.error('Error while retrieving messages:', error);
      res.status(500).send('Failed to retrieve the messages:' + error)
    });
})

module.exports = router;