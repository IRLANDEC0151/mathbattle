getStat("/profile/getStatistic")
  .then((stat) => {
    console.log("статистика получена");
    let statToJSON = JSON.parse(stat);
    console.log(statToJSON);
    document.querySelector(
      ".modal-body tbody"
    ).outerHTML = `${statToJSON.lastMatch.details}`;
    pushModesStat(statToJSON.modes);
  })
  .catch((e) => {
    console.log(e);
  });
function pushModesStat(modes) {
  modes.forEach((mode) => {
    document.querySelector(".profile-stat-modeStat tbody").insertAdjacentHTML(
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

async function getStat(url) {
  return fetch(url)
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      console.log(e);
    });
}