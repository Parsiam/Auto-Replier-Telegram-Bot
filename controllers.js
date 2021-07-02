const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'db.json');

module.exports = class Controllers {
  static async MessageController(message, bot) {
    const message_id = message.message_id;
    const chat_id = message.chat.id;

    if (message.reply_to_message && message.reply_to_message.text) {
      const msgandrep = {
        q: message.reply_to_message.text,
        a: message.text,
      };

      fs.readFile(db, 'utf8', (err, data) => {
        let qas = JSON.parse(data);
        qas.push(msgandrep);
        fs.writeFile(db, JSON.stringify(qas), (err) => {
          err && console.log(err);
        });
      });
    } else {
      fs.readFile(db, 'utf8', (err, data) => {
        let qas = JSON.parse(data);

        const answers = qas.filter((qa) => qa.q === message.text);

        const length = answers.length;
        const random = Math.floor(Math.random() * (length - 0) + 0);

        if (answers.length !== 0) {
          bot.sendMessage(chat_id, answers[random].a, {
            reply_to_message_id: message_id,
          });
        }
      });
    }
  }
};
