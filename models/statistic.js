const { Schema, model } = require("mongoose");
const statisticsSchema = new Schema({
  modes: [
    (standardMode = {
      name: String,
      games: Number,
      examples: Number,
      correctExamples: Number,
      timeMiddleExample: Number,
    }),
    (chainMode = {
      name: String,
      games: Number,
      examples: Number,
      correctExamples: Number,
      timeMiddleExample: Number,
    }),
  ],
  lastMatch: {
    name: String,
    examples: Number,
    correctExamples: Number,
    percentageOfCorrectAnswers: Number,
    timeMiddleExample: Number,
    details: String,
  },
  today: {
    today: Number,
    games: Number,
    examples: Number,
    correctExamples: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Statistics", statisticsSchema);
