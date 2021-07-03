const Conterollers = require('./controllers');
const { connectDB } = require('./db');

async function main() {
  const bot = await connectDB();
  // await bot.getMe().then((info) => console.log(info));
  await bot.on('text', async (msg) => Conterollers.MessageController(msg, bot));
}
main();
