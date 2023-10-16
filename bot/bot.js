// Criando um singleton para disponibilizar o bot do telegram para todo o código
// sem haver conflito na hora de iniciá-lo e utilizá-lo
const { Telegraf } = require('telegraf');
const { TOKEN } = process.env;

class TelegramBot {
  constructor() {
    if (!TelegramBot.instance) {
      this.bot = new Telegraf(TOKEN);
      TelegramBot.instance = this;
    }

    return TelegramBot.instance;
  }
}

module.exports = TelegramBot;