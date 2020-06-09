async function send(match) {
  return fetch("/profile/details")
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      console.log(e);
    });
}
let getDetails = document.querySelector(".details ");
getDetails.addEventListener("click", () => {
  send()
    .then((data) => {
      console.log("детальная статистика получена");
      document.querySelector(".modal-body tbody").outerHTML = `${data}`;
    })
    .catch((e) => {
      console.log(e);
    });
});
