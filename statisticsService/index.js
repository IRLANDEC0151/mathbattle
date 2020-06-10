const Statistic = require("../models/statistic");

//создание статистики для пользователя
exports.createUserStatistic = async function (candidate) {
  try {
    const userStat = new Statistic({
      modes: [],
      userId: candidate._id,
    });
    await userStat.save();
    candidate.userStatistic = { statisticId: userStat };
    await candidate.save();
    console.log("создание статистики прошло успешно");
  } catch (error) {
    console.log("Oops...Статистика для user не создана");
  }
};

//запись статистика матча
exports.writeMatch = async function (stat, match, nameMode) {
  try {
    stat.lastMatch = match;
    if (!stat.modes.find((mode) => mode.name == nameMode)) {
      delete match.details;
      delete match.percentageOfCorrectAnswers;
      match.games = 1;
      stat.modes.push(match);
      await stat.save();
      console.log("Новый режим в статистике");
      return 0;
    }
    let index = stat.modes.findIndex((mode) => mode.name == match.name);
    stat.modes[index].games += 1;
    stat.modes[index].examples += +match.examples;
    stat.modes[index].correctExamples += +match.correctExamples;
    stat.modes[index].timeMiddleExample = (
      stat.modes[index].timeMiddleExample + +match.timeMiddleExample
    ).toFixed(2);
    await stat.save();
    console.log("Статистика матча записана");
  } catch (error) {
    console.log("Oops...Статистика матча не записана!");
    console.log(error);
  }
};

exports.todayStat = function (stat, match) {
  let date = new Date();
  if (stat.today.today === date.getDate()) {
    stat.today.games += 1;
    stat.today.examples += +match.examples;
    stat.today.correctExamples += +match.correctExamples;
  } else {
    console.log("новый день, новая статистика");
    stat.today.today = date.getDate();
    stat.today.games = 1;
    stat.today.examples = +match.examples;
    stat.today.correctExamples = +match.correctExamples;
  }
  console.log("статистика сегодня");
  console.log(stat.today);
};

//получение статистики в профиле
exports.statisticToProfile = function (stat) {
  let allStat = {
    games: stat.modes.reduce((sum, current) => sum + current.games, 0),
    examples: stat.modes.reduce((sum, current) => sum + current.examples, 0),
    correctExamples: stat.modes.reduce(
      (sum, current) => sum + current.correctExamples,
      0
    ),
    // percentageOfCorrectAnswers: stat.modes.reduce(
    //   (sum, current) => sum + current.allExample,
    //   0
    // ),
  };
  return allStat;
};
