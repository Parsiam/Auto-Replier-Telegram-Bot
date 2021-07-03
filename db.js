const mongoose = require("mongoose");
const { TOKEN, OPTIONS } = require("./config");
const TelegramBot = require("node-telegram-bot-api");

const { MONGO } = require("./config");
const { QASchema, StopListSchema } = require("./Models");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    const bot = new TelegramBot(TOKEN, OPTIONS);
    return bot;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

//#region Model
const stopList = mongoose.model("stoplist", StopListSchema);

const createModel = (id) => {
  return mongoose.model(`${id}`, QASchema);
};
//#endregion

module.exports = {
  connectDB,
  createModel,
  stopList,
};
