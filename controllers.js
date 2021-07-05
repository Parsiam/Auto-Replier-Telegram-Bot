const { createModel, stopList } = require("./db");
const { ADMINID } = require("./config");

module.exports = class Controllers {
  static async MessageController(message, bot) {
    const chat_id = message.chat.id;
    const Model = createModel(chat_id);
    const { id: botId } = await bot.getMe();

    // if bot gets message in private chat
    if (message.chat.type == "private") {
      await bot.sendMessage(chat_id, "Hey, add me to the group!");
    } // if message is command
    else if (message.text.startsWith("/")) {
      await this.CommandController(message, bot, chat_id, Model, botId);
    } // if message is text
    else {
      await this.TextController(message, bot, Model);
    }
  }

  static async TextController(message, bot, Model) {
    const message_id = message.message_id;
    const chat_id = message.chat.id;

    const isStopped = await stopList.findOne({ chat_id });

    if (!isStopped) {
      if (message.reply_to_message && message.reply_to_message.text) {
        const msgandrep = {
          q: message.reply_to_message.text,
          a: message.text,
        };

        await Model.create(msgandrep);
      } else {
        const answers = await Model.find({ q: message.text });

        const length = answers.length;
        const random = Math.floor(Math.random() * length);

        if (answers.length !== 0) {
          await bot.sendMessage(chat_id, answers[random].a, {
            reply_to_message_id: message_id,
          });
        }
      }
    }
  }

  static async CommandController(message, bot, chat_id, Model, botId) {
    const command = message.text.split("@")[0];
    const fromAdmin = message.from.id == ADMINID;

    // If start command
    if (message.text == "/start") {
      const isAdmin = (await bot.getChatAdministrators(chat_id)).filter(
        (admin) => admin.user.id == botId
      );

      if (isAdmin.length !== 0) {
        bot.sendMessage(chat_id, "Hey, I am listening!");
      } else {
        bot.sendMessage(chat_id, "Hey, give me an admin rights!");
      }
    } // Other commands if from admind
    else if (fromAdmin) {
      switch (command) {
        case "/stopbot":
          try {
            const isStopped = await stopList.findOne({ chat_id });
            if (isStopped) {
              await bot.sendMessage(chat_id, "Bot has already stopped!");
            } else {
              await stopList.create({ chat_id });
              await bot.sendMessage(
                chat_id,
                "Bot has been stopped temporarily!"
              );
            }
          } catch (error) {
            await bot.sendMessage(ADMINID, error);
          }
          return;
        case "/activatebot":
          try {
            const notStopped = await stopList.findOne({ chat_id });
            if (notStopped) {
              await stopList.deleteOne({ chat_id });
              await bot.sendMessage(chat_id, "Bot is active again!");
            } else {
              await bot.sendMessage(chat_id, "Bot is active!");
            }
          } catch (error) {
            await bot.sendMessage(ADMINID, error);
          }
          return;
        case "/deleteanswer":
          if (message.reply_to_message) {
            try {
              await Model.deleteOne({ a: message.reply_to_message.text });
              await bot.sendMessage(chat_id, "Answer deleted successfully!");
            } catch (error) {
              await bot.sendMessage(ADMINID, error);
            }
          } else {
            await bot.sendMessage(
              chat_id,
              "To delete reply /deleteanswer command to an answer!"
            );
          }
          return;
        default:
          console.log(message.text);
          return;
      }
    } // If not admin user (.env)
    else {
      await bot.sendMessage(chat_id, "You have no right to do this!");
    }
  }
};
