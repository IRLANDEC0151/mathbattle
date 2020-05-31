const { Schema, model } = require("mongoose");
const Statistic = require("../models/statistic");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  userStatistic: {
    statisticId: {
      type: Schema.Types.ObjectId,
      ref: "Statistics",
    },
  },
});

userSchema.methods.addToStatistics = function (statistic) {
  //   this.statistics.items.push({
  //     statisticsModesId: statistic._id,
  //   });
  return this.save();
};

module.exports = model("User", userSchema);
