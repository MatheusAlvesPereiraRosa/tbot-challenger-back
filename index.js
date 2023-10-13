require('dotenv').config()

// importes do backend
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const port = 5000

const {TOKEN, SERVER_URL} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL+URI

// API do telegram
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(TOKEN)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  "origin": "*",
}))

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
  console.log(res.data)
}

app.post('/send-message', (req, res) => {
  const messageText = req.body.message; 

  // Enviando mensagem pelo bot e checando a resposta
  bot.telegram.sendMessage(6186971422, messageText) 
    .then(() => {
      res.status(200).send('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).send('Failed to send message');
    });
})

// url 
// https://api.telegram.org/bot6544076832:AAFFVO_T7JSmfDta5K9rutStXvK1kdhw7Qw/getUpdates

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await init()
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))