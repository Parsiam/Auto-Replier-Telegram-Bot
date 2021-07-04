const { createModel, stopList } = require("./db");

module.exports = class Controllers {
  static async MessageController(message, bot) {
    const chat_id = message.chat.id;
    const Model = createModel(chat_id);

    if (message.text.startsWith("/")) {
      this.CommandController(message, bot, chat_id, Model);
    } else {
      this.TextController(message, bot, Model);
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
        const random = Math.floor(Math.random() * (length - 0) + 0);

        if (answers.length !== 0) {
          bot.sendMessage(chat_id, answers[random].a, {
            reply_to_message_id: message_id,
          });
        }
      }
    }
  }

  static async CommandController(message, bot, chat_id, Model) {
    const command = message.text.split("@")[0];
    switch (command) {
      case "/stopbot":
        try {
          const isStopped = await stopList.findOne({ chat_id });
          if (isStopped) {
            bot.sendMessage(chat_id, "Bot allaqachon to'xtatilgan!");
          } else {
            await stopList.create({ chat_id });
            bot.sendMessage(
              chat_id,
              "Bot bu guruh uchun vaqtincha to'xtatildi!"
            );
          }
        } catch (error) {
          bot.sendMessage(process.env.MYID, error);
        }
        return;
      case "/activatebot":
        try {
          const notStopped = await stopList.findOne({ chat_id });
          if (notStopped) {
            await stopList.deleteOne({ chat_id });
            bot.sendMessage(chat_id, "Bot yana aktiv!");
          } else {
            bot.sendMessage(chat_id, "Bot aktiv holatda!");
          }
        } catch (error) {
          bot.sendMessage(process.env.MYID, error);
        }
        return;
      case "/deleteanswer":
        if (message.reply_to_message) {
          try {
            await Model.deleteOne({ a: message.reply_to_message.text });
            bot.sendMessage(chat_id, "Javob muvaffaqiyatli o'chirildi!");
          } catch (error) {
            bot.sendMessage(process.env.MYID, error);
          }
        } else {
          bot.sendMessage(
            chat_id,
            "Javobni o'chirish uchun unga \n /deleteanswer buyrug'ini reply qiling!"
          );
        }
        return;
      default:
        console.log(message.text);
        return;
    }
  }
};
