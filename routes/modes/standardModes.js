const { Router } = require("express");
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

router.post("/standardModes", async (req, res) => {
  try {
    const candidate = await User.findOne({ email: req.user.email });

    if (candidate.userStatistic != null) {
      console.log("статистики еще нет у user");
        createUserStatistic(candidate);
    }

    //запись статистики матча
    writeMatch(candidate)
    
    
    res.json(req.user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

async function writeMatch(candidate) {
  try {


  await candidate.save();
  console.log("запись статистики матча успешно");

  } catch (error) {
    console.log(error);
  }
}

//создание статистики для пользователя
async function createUserStatistic(candidate) {
  const userStat = new Statistic({
    modes: [],
    userId: candidate._id,
  });
  await userStat.save();
  candidate.userStatistic = { statisticId: userStat };
  await candidate.save();
  console.log("создание статистики прошло успешно");
}
