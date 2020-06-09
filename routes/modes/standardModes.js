const { Router } = require("express");
const jsonParser = require("express").json();
const router = Router();
const User = require("../../models/user");
const Statistic = require("../../models/statistic");
const statService = require("../../statisticsService");


router.get("/standardModes", (req, res) => {
  res.render("modes/standardModes", {
    title: "Стандартный режим",
    isModes: true,
    isStandard: true,
    script: "/standardModes.js",
    style: "/standardModes.css",
  });
});

router.post("/standardModes", jsonParser, async (req, res) => {
  try {
    const candidate = await User.findOne({ email: req.user.email });
    let stat = await Statistic.findOne({ userId: req.user });

    if (!stat) {
      console.log("статистики еще нет у user");
      await statService.createUserStatistic(candidate);
      stat = await Statistic.findOne({ userId: req.user });
    }

    statService.todayStat(stat, req.body);
    
    await statService.addToStat(stat, req.body);

    res.json(req.body)
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
