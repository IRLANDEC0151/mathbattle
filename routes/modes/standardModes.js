const { Router } = require("express");
const router = Router();
const User = require("../../models/user");
const Statistic = require("../../models/statistic");
const fetch=require('node-fetch')
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
    const candidate = await User.findOne({ email: req.user.email });
    let stat = await Statistic.findOne({ userId: req.user });

    if (!stat) {
      console.log("статистики еще нет у user");
      await createUserStatistic(candidate);
      stat = await Statistic.findOne({ userId: req.user });
    }

    //запись статистики матча
    arithmeticMean(stat, req);
  } catch (error) { 
    console.log(error);
  }
});


router.post('/standardModes/stat',(req, res) => {
  console.log('записано в бд');
  console.log(req.body);
  console.log(req.params);
  
} )

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
    modes: [{ name: "standardMode" }, { name: "chainMode" }],
    userId: candidate._id,
  });
  await userStat.save();
  candidate.userStatistic = { statisticId: userStat };
  await candidate.save();
  console.log("создание статистики прошло успешно");
}
 
function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}
module.exports = router;
