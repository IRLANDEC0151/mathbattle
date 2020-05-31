const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  //рендерим эту страницу
  res.render("leaderboard", {
    title: "Таблица лидеров",
    isLeaderboard: true,
  });
});

router.post("/scores", async (req, res) => {
  //console.log(req.user.statistics);
  const user = await req.user
    .populate("statistics.items.statisticsModesId")
    .execPopulate();
  res.json(user.statistics.items[0].statisticsModesId); 
  //const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
});
module.exports = router;
