const Statistic = require("../models/statistic");

exports.isStat = async function (req, res, next) {
  let stat = await Statistic.findOne({ userId: req.user });
  if (!stat) {
    res.render("profile/profile", {
      title: "Профиль",
      style: "/profile.css",
      script: "/profile.js",
      isLogin: true,
      user: req.user.toObject(),
    });
  } else {
    next();
  }
};
