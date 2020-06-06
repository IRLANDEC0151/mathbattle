const { Schema, model } = require("mongoose");
const statisticsSchema = new Schema({
  modes: [
    (standardMode = {
      name: String,
      allGames: Number,
      allExample: Number,
      allCorrectExample: Number,
      allTimeMiddleExample: Number,
    }),
    (chainMode = {
      name: String,
      allGames: Number,
      allExample: Number,
      correctExample: Number,
      timeMiddleExample: Number,
    }),
  ],
  lastMatch: {
    nameModes: String,
    allExample: Number,
    correctExample: Number,
    percentageOfCorrectAnswers: Number,
    timeMiddleExample: Number,
  },

  todayStatistic: [],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Statistics", statisticsSchema);
