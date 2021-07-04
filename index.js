const Conterollers = require("./controllers");
const { connectDB } = require("./db");

const botcommands = [
  { command: "activatebot", description: "Activate bot for this group" },
  { command: "stopbot", description: "Stop bot for this group" },
  {
    command: "deleteanswer",
    description: "Delete unwanted aswer with reply to it",
  },
];

async function main() {
  const bot = await connectDB();
  await bot.setMyCommands(botcommands);
  // await bot.getMe().then((info) => console.log(info));
  await bot.on("text", async (msg) => Conterollers.MessageController(msg, bot));
}
main();
