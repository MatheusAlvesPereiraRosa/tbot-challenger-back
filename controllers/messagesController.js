const TelegramBot = require('../bot/bot');
const Message = require('../models/message')
const Chat = require('../models/chat')

const botInstance = new TelegramBot();

module.exports = {
  sendMessage: async (req, res) => {
    const messageText = req.body.message
    const timestamp = req.body.timestamp
    const chatId = req.body.chatId

    try {
      // Usando a instância do bot para mandar mensagens
      await botInstance.bot.telegram.sendMessage(chatId, messageText);

      const userId = req.body.userId;

      const newMessage = new Message({
        text: messageText,
        userId,
        chatId,
        timestamp: timestamp, // Campo de tempo para saber quando a mensagem foi enviada
        isUserMessage: true, // Campo booleano para distinguir se é o usuário ou o bot
      });

      await newMessage.save();

      let message = {
        text: messageText,
        userId,
        timestamp,
        chatId,
        isUserMessage: true
      }

      res.status(200).json({ status: 'Mensagem enviado e salva com sucesso', message: message }); // Envio o status e a mensagem via json para atualizar o store sem precisar fazer a requisição novamente

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).send('Falha ao enviar mensagem');
    }
  },

  getChats: async (req, res) => {
    await Chat.find()
      .then((chats) => {
        res.json(chats)
        console.log('Chats recuperados:', chats);
      })
      .catch((error) => {
        console.error('Erro ao receber mensagens:', error);
        res.status(500).send('Falha ao recuperar mensagens:' + error)
      });
  },

  getHistory: async (req, res) => {
    await Message.find().sort({ timestamp: -1 })
      .then((messages) => {
        res.json(messages)
        console.log('Mensagens recuperadas:', messages);
      })
      .catch((error) => {
        console.error('Error while retrieving messages:', error);
        res.status(500).send('Erro ao recuperar mensagens:' + error)
      });
  },

  getMessageFromChatId: async (req, res) => {
    const chatId = req.params.chatId;
  
    try {
      // Query your database to retrieve messages with the provided chatId
      const messages = await Message.find({ chatId });
  
      // Send the retrieved messages as a response
      res.status(200).json(messages);
    } catch (error) {
      console.error('Erro ao recuperar mensagens do chat:', error);
      res.status(500).send('Erro ao recuperar mensagens do chat específico');
    }
  }
}