const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    //рендерим эту страницу
    res.render("leaderboard", {
        title: "Таблица лидеров",
        isLeaderboard: true,
    });
});

module.exports = router;
   