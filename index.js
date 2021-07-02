const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const Conterollers = require('./controllers');

dotenv.config();

const TOKEN = process.env.TOKEN;

const options = {
  polling: true,
};

const bot = new TelegramBot(TOKEN, options);

bot.on('text', (msg) => Conterollers.MessageController(msg, bot));

// bot.getMe().then((info) => console.log(info));
