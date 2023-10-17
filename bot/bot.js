// Singleton para criação de apenas uma instância do bot
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