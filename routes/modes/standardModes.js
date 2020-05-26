const { Router } = require("express");
const router = Router();
const User = require("../../models/user");
const StatisticsModes = require("../../models/statisticsModes");

router.get("/standardModes", (req, res) => {
  //рендерим эту страницу
  res.render("modes/standardModes", {
    title: "Стандартный режим",
    isModes: true,
    isStandard: true,
    script: "/standardModes.js",
    style: "/standardModes.css",
  });
});

router.post("/standardModes", async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      await writeMatchStatistics(req);
      console.log("записалось");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

async function writeMatchStatistics(req) {
  const statStandardModes = new StatisticsModes({
    standardMode: {
      allExample: req.body.allExample,
      correctExample: req.body.correctExample,
      percentageOfCorrectAnswers: req.body.percentageOfCorrectAnswers,
      timeMiddleExample: req.body.timeMiddleExample,
    },
    userId: req.user,
  });
  await statStandardModes.save();
}
