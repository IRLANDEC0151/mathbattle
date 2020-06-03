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
  bio: String,
  city: String,
  school: String,
  lookstat: Boolean,
  userStatistic: {
    statisticId: {
      type: Schema.Types.ObjectId,
      ref: "Statistics",
    },
  },
});

module.exports = model("User", userSchema);
