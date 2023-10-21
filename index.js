require('dotenv').config()

// importes do backend
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

// importes de arquivos
const apiRoutes = require('./routes/api');
const databaseConfig = require('./config/db');

// importes do websocket
const http = require('http');
const io = require('./sockets/socket');
const server = http.createServer(app);

const port = 5000

// URL's
const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

// API do telegram
const TelegramBot = require('./bot/bot');
const Message = require('./models/message')

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

botInstance.bot.launch();

// Usando modulo de websocket para lidar com as conexões
io(server);

// Função que irá transmitir a mensagem em tempo real
const broadcastTelegramMessages = io(server);

// Recebendo as mensagens do usuário
botInstance.bot.on('text', async (ctx) => {
  const messageText = ctx.message.text;
  const userId = ctx.message.from.id;
  console.log(`Received message from user ${userId}: ${messageText}`);

  const timestamp = new Date().toLocaleString();

  const newMessage = new Message({
    text: messageText,
    userId,
    timestamp: timestamp,
    isUserMessage: false,
  });

  try {
    // Salvando mensagem
    await newMessage.save();
    console.log('Message saved to MongoDB');

    // Emitindo a mensagem para todos os clientes conectados
    broadcastTelegramMessages(newMessage);
  } catch (error) {
    console.error('Error saving message to MongoDB:', error);
  }
});

// url 
// https://api.telegram.org/token do bot/getUpdates

server.listen(3000, () => {
  console.log('Websocket is running on port 3000');
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await init()
});

// Parar o bot
process.once('SIGINT', () => botInstance.bot.stop('SIGINT'))
process.once('SIGTERM', () => botInstance.bot.stop('SIGTERM'))