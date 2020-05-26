const { Schema, model } = require("mongoose");
const statisticsModes = new Schema({
    standardMode: {
        allExample: Number,
        correctExample: Number,
        percentageOfCorrectAnswers: Number,
        timeMiddleExample: Number,
        leaderboard: Number,
    },
    chainMode: {
        allExample: Number,
        correctExample: Number,
        percentageOfCorrectAnswers: Number,
        timeMiddleExample: Number,
        leaderboard: {
            type: Number,
            default:1,
        },
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

module.exports = model("statisticsModes", statisticsModes);
