//создание статистики для пользователя
const Statistic = require("../models/statistic");

exports.createUserStatistic = async function (candidate) {
  try {
    const userStat = new Statistic({
      modes: [{ name: "standartMode" }, { name: "chainMode" }],
      userId: candidate._id,
    });
    await userStat.save();
    candidate.userStatistic = { statisticId: userStat };
    await candidate.save();
    console.log("создание статистики прошло успешно");
  } catch (error) {
    console.log("Oppps...Статистика для user не создана");
  }
};
//запись статистика матча
exports.addToStat = async function (stat, match) {
  try {
    if (stat.modes[0].allGames == undefined) {
      stat.modes[0].allGames = 0;
      stat.modes[0].allExample = 0;
      stat.modes[0].allCorrectExample = 0;
      stat.modes[0].allTimeMiddleExample = 0;
    }
    stat.modes[0].allGames += 1;
    stat.modes[0].allExample += +match.allExample;
    stat.modes[0].allCorrectExample += +match.correctExample;
    stat.modes[0].allTimeMiddleExample = (
      stat.modes[0].allTimeMiddleExample + +match.timeMiddleExample
    ).toFixed(2);
    console.log("Статистика матча записана");
    stat.lastMatch=match
    await stat.save(); 
  } catch (error) {
    console.log("Opps...Статистика матча не записана!");

    console.log(error);
  }
};

exports.todayStat = function (stat, match) {
  let date = new Date();
  if (stat.today.today === date.getDate()) {
    stat.today.games += 1;
    stat.today.examples += +match.allExample;
    stat.today.correctExamples += +match.correctExample;
  } else {
    console.log("новый день, новая статистика");
    stat.today.today = date.getDate();
    stat.today.games = 1;
    stat.today.examples = +match.allExample;
    stat.today.correctExamples = +match.correctExample;
  }
  console.log("статистика сегодня");
  console.log(stat.today);
};
