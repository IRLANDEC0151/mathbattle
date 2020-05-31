const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/", (req, res) => {
  //рендерим эту страницу
  res.render("leaderboard", {
    title: "Таблица лидеров",
    isLeaderboard: true,
  });
});

router.post("/scores", async (req, res) => {
 // const candidate = await User.findOne({ email: req.user.email });
  const candidate=await req.user.populate("userStatistic.statisticId").execPopulate();
  console.log(candidate.userStatistic);  

  //res.json(user.statistics.items[0].statisticsModesId);
  //const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
});
module.exports = router;
