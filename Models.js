const mongoose = require("mongoose");

const QASchema = mongoose.Schema({
  q: {
    type: String,
  },
  a: {
    type: String,
  },
});

const StopListSchema = mongoose.Schema({
  chat_id: {
    type: Number,
  },
});

module.exports = {
  QASchema,
  StopListSchema,
};
