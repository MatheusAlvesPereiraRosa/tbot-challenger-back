require('dotenv').config()

// importes do backend
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

// importes de arquivos
const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')
const databaseConfig = require('./config/db')

// importes do websocket
const http = require('http')
const io = require('./sockets/socket')
const server = http.createServer(app)

const port = 5000

// URL's
const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

// API do telegram
const TelegramBot = require('./bot/bot');

// Models do banco de dados
const Message = require('./models/message')
const Chat = require('./models/chat')

const botInstance = new TelegramBot()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  "origin": "*",
}))

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
  console.log(res.data)
}

app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

botInstance.bot.launch()

function generateChatId(userId) {
  const timestamp = Date.now() // Tempo aproximado em milisegundos
  return `${userId}-${timestamp}`
}

// Usando modulo de websocket para lidar com as conexões
io(server);

// Função que irá transmitir a mensagem em tempo real
const broadcastTelegramMessages = io(server);

// Recebendo as mensagens do usuário
botInstance.bot.on('text', async (ctx) => {
  const messageText = ctx.message.text;
  const userId = ctx.message.from.id;

  console.log(`Received message from user ${userId}: ${messageText}`);

  // Checando se o chat já existe
  const existingChat = await Chat.findOne({ userId });

  if (existingChat) {
    // Se o chat já existe, será utilizado
    const chatId = existingChat.chatId

    const timestamp = new Date().toLocaleString();

    const newMessage = new Message({
      text: messageText,
      userId,
      chatId: chatId,
      timestamp: timestamp,
      isUserMessage: false,
    });

    try {
      // Salvando mensagem
      await newMessage.save();
      console.log('Message saved to MongoDB')

      // Emitindo a mensagem para todos os clientes conectados
      broadcastTelegramMessages(newMessage)
    } catch (error) {
      console.error('Error saving message to MongoDB:', error);
    }
  } else {
    // Gera um novo chatId para o usuário
    chatId = generateChatId(userId);

    // Cria um chat Novo
    const newChat = new Chat({ userId, chatId })
    await newChat.save()

    const timestamp = new Date().toLocaleString()

    const newMessage = new Message({
      text: messageText,
      userId,
      chatId: chatId,
      timestamp: timestamp,
      isUserMessage: false,
    });

    try {
      // Salvando mensagem
      await newMessage.save();
      console.log('Message saved to MongoDB')

      // Emitindo a mensagem para todos os clientes conectados
      broadcastTelegramMessages(newMessage)
    } catch (error) {
      console.error('Error saving message to MongoDB:', error)
    }
  }
});

server.listen(3000, () => {
  console.log('Websocket is running on port 3000')
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`)
  await init()
});

// Parar o bot
process.once('SIGINT', () => botInstance.bot.stop('SIGINT'))
process.once('SIGTERM', () => botInstance.bot.stop('SIGTERM'))