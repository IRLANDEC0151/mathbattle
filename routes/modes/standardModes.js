const { Router } = require("express");
const jsonParser = require("express").json();
const router = Router();
const User = require("../../models/user");
const Statistic = require("../../models/statistic");

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

router.post("/standardModes", jsonParser, async (req, res) => {
  try {
    const candidate = await User.findOne({ email: req.user.email });
    let stat = await Statistic.findOne({ userId: req.user });

    if (!stat) {
      console.log("статистики еще нет у user");
      await createUserStatistic(candidate);
      stat = await Statistic.findOne({ userId: req.user });
    }
    //запись последнего матча
    stat.lastMatch = req.body;
    todayStat(stat, req.body);

    //запись статистики матча
    await arithmeticMean(stat, req);
    console.log("данные последнего матча");
    console.log(stat.lastMatch);
  } catch (error) {
    console.log(error);
  }
});

//запись статистика матча
async function arithmeticMean(stat, req) {
  try {
    if (stat.modes[0].allGames == undefined) {
      stat.modes[0].allGames = 0;
      stat.modes[0].allExample = 0;
      stat.modes[0].allCorrectExample = 0;
      stat.modes[0].allTimeMiddleExample = 0;
    }
    stat.modes[0].allGames += 1;
    stat.modes[0].allExample += +req.body.allExample;
    stat.modes[0].allCorrectExample += +req.body.correctExample;
    stat.modes[0].allTimeMiddleExample = (
      stat.modes[0].allTimeMiddleExample + +req.body.timeMiddleExample
    ).toFixed(2);
    await stat.save();
    console.log("Статистика матча записана");
  } catch (error) {
    console.log(error);
  }
}
//создание статистики для пользователя
async function createUserStatistic(candidate) {
  const userStat = new Statistic({
    modes: [{ name: "standartMode" }, { name: "chainMode" }],
    userId: candidate._id,
  });
  await userStat.save();
  candidate.userStatistic = { statisticId: userStat };
  await candidate.save();
  console.log("создание статистики прошло успешно");
}

function todayStat(stat, match) {
  let date = new Date();

  if (stat.today.today === date.getDate()) {
    stat.today.games += 1;
    stat.today.examples += +match.allExample;
    stat.today.correctExamples += +match.correctExample;
  } else {
    console.log('новый день, новая статистика');
    
    stat.today.today = date.getDate();
    stat.today.games = 1;
    stat.today.examples = +match.allExample;
    stat.today.correctExamples = +match.correctExample;
  }
  console.log('статистика сегодня');
  
  console.log(stat.today); 
}
module.exports = router;
