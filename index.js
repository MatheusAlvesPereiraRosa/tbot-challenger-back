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

botInstance.bot.on('text', async (ctx) => {
  const messageText = ctx.message.text;
  const userId = ctx.message.from.id;
  console.log(`Received message from user ${userId}: ${messageText}`);

  // Save the received message to MongoDB
  const timestamp = new Date();

  const newMessage = new Message({
    text: messageText,
    userId,
    timestamp: timestamp,
    isUserMessage: false, // For outgoing messages sent by the bot
  });
  
  try {
    await newMessage.save();;
    console.log('Message saved to MongoDB');
  } catch (error) {
    console.error('Error saving message to MongoDB:', error);
  }
});

// url 
// https://api.telegram.org/token do bot/getUpdates

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await init()
});

// Enable graceful stop
process.once('SIGINT', () => botInstance.bot.stop('SIGINT'))
process.once('SIGTERM', () => botInstance.bot.stop('SIGTERM'))