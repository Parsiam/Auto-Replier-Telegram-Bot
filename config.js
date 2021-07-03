require('dotenv').config();

const { env } = process;

module.exports = {
  TOKEN: env.TOKEN,
  OPTIONS: {
    polling: true,
  },
  MONGO: env.MONGO
};
