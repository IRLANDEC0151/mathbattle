const { Schema, model } = require("mongoose");
const statisticsSchema = new Schema({
    modes:[{
        standardMode: {
            allGames: Number,
            allExample: Number,
            correctExample: Number,
            percentageOfCorrectAnswers: Number,
            timeMiddleExample: Number,
            leaderboard: Number,
        },
        chainMode: {
            allGames: Number,
            allExample: Number,
            correctExample: Number,
            percentageOfCorrectAnswers: Number,
            timeMiddleExample: Number,
        },
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = model("Statistics", statisticsSchema);
