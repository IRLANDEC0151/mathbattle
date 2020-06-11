let modeStat = document.querySelector(".profile-stat-modeStat tbody");
let lastMatch = document.querySelector(".profile-stat-lastMatch");
getStat("/profile/getStatistic")
  .then((stat) => {
    let statToJSON = JSON.parse(stat);
    if (!statToJSON) {
      console.log("Статистики еще нет");
      lastMatch.insertAdjacentHTML("beforeEnd", "вы еще не играли");
      modeStat.insertAdjacentHTML("beforebegin", `<p>вы еще не играли</p>`);
      return 0;
    }
    showStat(statToJSON);
  })
  .catch((e) => {
    console.log(e);
  });
function pushModesStat(modes) {
  modes.forEach((mode) => {
    modeStat.insertAdjacentHTML(
      "beforebegin",
      `<tr>
      <th scope="row">${mode.name}</th>  
      <td>${mode.games}</td>
      <td>${mode.examples} </td>
      <td>${mode.correctExamples}</td>
      <td>${mode.timeMiddleExample}сек</td>
      </tr>`
    );
  });
}


function showStat(stat) {
  console.log("статистика получена");
  document.querySelector(
    ".modal-body tbody"
  ).outerHTML = `${stat.lastMatch.details}`;
  document.querySelector(".lastMatchStat").style.display = "table";
  document.querySelector(".details").style.display = "block";
  pushModesStat(stat.modes);
}


async function getStat(url) {
  return fetch(url)
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      console.log(e);
    });
}
