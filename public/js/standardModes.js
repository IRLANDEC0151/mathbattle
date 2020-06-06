const FastMatch = {
  //дефолтное время матча
  timeMatch: 1,
  arifmSign: ["&#43;"],
  //переменные для статистики  в helperRight (они же для статистики)
  allExаmple: 0,
  correctExаmple: 0,
  timeMiddleExample: 0,
  percentageOfCorrectAnswers: 0,
  example: "",
  counterExample: 0,
  //переменная для ответа
  answer: 0,
  levelOfDifficulty: [
    { from: 0, to: 0 },
    { from: 1, to: 10 },
    { from: 5, to: 50 },
    { from: 10, to: 100 },
    { from: 100, to: 1000 },
    { from: 1000, to: 10000 },
  ],

  // считаем ответ
  answerCounter(randomArifmSign) {
    //целочисленное деление
    if (randomArifmSign === "&#247;") {
      firstParam.innerHTML = +firstParam.textContent * +secondParam.textContent;
    }

    this.example = `${firstParam.textContent} ${FastMatch.transformSign(
      randomArifmSign
    )} ${secondParam.textContent}`;
    this.answer = eval(
      `+firstParam.textContent  ${FastMatch.transformSign(
        randomArifmSign
      )} +secondParam.textContent`
    );
    console.log(this.answer);
  },

  //новые слагаемые и знак
  randomExample(from, to) {
    //получаем рандомно арифм знак
    let randomArifmSign = this.arifmSign[
      Math.floor(Math.random() * this.arifmSign.length)
    ];

    firstParam.innerHTML = Math.floor(Math.random() * (to - from) + from);
    secondParam.innerHTML = Math.floor(Math.random() * (to - from) + from);
    arifmSignParam.innerHTML = randomArifmSign;
    this.answerCounter(randomArifmSign);
  },
  //проверяет ответ
  compare(inputAnswerValue) {
    if (inputAnswerValue == this.answer) {
      this.correctExаmple++;
      addExampleToModalView(true);
    } else {
      addExampleToModalView(false);
    }
    this.allExаmple++;
    result.innerHTML = ` ${this.correctExаmple} из ${this.allExаmple}`;
  },
  //добавляем арифм знаки в массив
  addArifmSign(arg) {
    if (this.arifmSign.includes(arg)) {
      this.arifmSign.splice(this.arifmSign.indexOf(arg), 1);
    } else this.arifmSign.push(arg);
  },
  transformSign(sign) {
    switch (sign) {
      case "&#43;":
        return "+";
        break;

      case "&#8722;":
        return "-";
        break;

      case "&#215;":
        return "*";
        break;

      case "&#247;":
        break;
    }
  },
};

//уровни сложности
let levelSettingContent = document.querySelector(".levelSetting-content");

//порядковый номер точки в range slider
let curVal = 1;

//получаем наш ввод
let inputAnswer = document.querySelector(".answer-form");
// слагаемые
let firstParam = document.querySelector(".first-fastMatch-param");
let secondParam = document.querySelector(".second-fastMatch-param");
let arifmSignParam = document.querySelector(".arifm-sign-param");
//вывод статистики fastMatch в helperRight
let result = document.querySelector(".helperRight-output");

//нажимаем enter или пробел в нашем вводе
let start = 0;
let end = 0;
let timeForExample = [];
inputAnswer.onkeypress = function (event) {
  if ((event.which === 32 || event.which === 13) && inputAnswer.value != "") {
    end = new Date().getTime();
    timeForExample.push(end - start);
    start = new Date().getTime();
    FastMatch.counterExample++;
    //проверяем  ответ на правильность
    FastMatch.compare(inputAnswer.value);
    inputAnswer.value = "";
    FastMatch.randomExample(
      FastMatch.levelOfDifficulty[curVal].from,
      FastMatch.levelOfDifficulty[curVal].to
    );
  }
};

//кнопка СТАРТ
//убираем по кнопке окно настроек

let matchSetting = document.querySelector(".standardModes-area");
let fastMatchStartBtn = document.querySelector(".start-btn");
let fastMatch = document.querySelector(".fastMatch");

//анимация всплытия подсказок
let helperBottom = document.querySelector(".helperBottom");
let helperLeft = document.querySelector(".helperLeft");
let helperRight = document.querySelector(".helperRight");

//нажатие на кнопку НАЧАТЬ
fastMatchStartBtn.addEventListener("click", async () => {
  if (!FastMatch.arifmSign.length) {
    checkArifmLength();
  } else {
    try {
      // обнуляем все настройки (нужно при возвращении к настройкам)
      await returnWindowsSetting();
      //анимация fastMatch
      await animation(200);
      fastMatch.style.visibility = "visible";
      fastMatch.classList.add("animate-fastMath");
    } catch (error) {
      console.log("Oppps..." + error);
    }
  }
});

//анимация helpers после окончания анимации fastMatch
fastMatch.addEventListener("animationend", () => {
  helperBottom.classList.add("animate-helperBottom");
  helperLeft.classList.add("animate-helperLeft");
  helperRight.classList.add("animate-helperRight");
});

//запускаем таймер после окончания анимации хэлперов
helperRight.addEventListener("animationend", () =>
  startTimer(3, "fastMatch-timer p", startMatch)
);

//переменная для остановки таймера
let stopTimer = true;

//таймер
function startTimer(time, tagName, callback) {
  let display = document.querySelector(`.${tagName}`);
  display.style.opacity = "1";
  display.innerHTML = time;

  let timer = setInterval(function () {
    if (time != 0 && stopTimer) {
      time--;
      display.innerHTML = time;
    } else {
      // прячем текст
      display.style.opacity = "0";
      // удаляем таймер
      clearInterval(timer);
      if (callback) callback();
    }
  }, 1000);
}

let skipBtn = document.querySelector(".skip");

//начало матча
function startMatch() {
  if (FastMatch.timeMatch) {
    matchTimer();
    start = new Date().getTime();
  }
  //делаем видимыми
  skipBtn.style.visibility = "visible";
  document.querySelector(".fastMatch-example").style.opacity = "1";
  result.style.opacity = "1";
  inputAnswer.readOnly = false;
  inputAnswer.focus();
  //первые рандомные значения
  FastMatch.randomExample(
    FastMatch.levelOfDifficulty[curVal].from,
    FastMatch.levelOfDifficulty[curVal].to
  );
  FastMatch.allExаmple = 0;
  FastMatch.correctExаmple = 0;
}

//нажатие на ПРОПУСТИТЬ
skipBtn.addEventListener("click", () => {
  inputAnswer.focus();
  //пропускаем пример
  FastMatch.randomExample(
    FastMatch.levelOfDifficulty[curVal].from,
    FastMatch.levelOfDifficulty[curVal].to
  );
  FastMatch.compare(inputAnswer.value);
  inputAnswer.value = "";
});

//нажимаем на кнопку ВЕРНУТЬСЯ К НАСТРОЙКАМ
//возвращаемся к окну с настройками
helperBottom.addEventListener("click", backToSetting);
function backToSetting() {
  stopTimer = false;
  //скрытие fastMatch
  fastMatch.classList.add("animate-back-fastMath");
  fastMatch.classList.remove("animate-fastMath");
  //появление настроек
  matchSetting.classList.add("animate-back-setting");
  matchSetting.classList.remove("animate-setting");
}

//FIXME: в переменную minutes не должно записываться это значение

//let minutes = document.querySelector(".fastMatch-timer p");

//возвращаемся настройки окон
function returnWindowsSetting() {
  return new Promise((resolve, reject) => {
    //анимация скрытия настроек
    matchSetting.classList.add("animate-setting");
    //убрать анимацию возвращения настроек
    matchSetting.classList.remove("animate-back-setting");
    //вернуть fastMatch в исходное положение
    fastMatch.classList.remove("animate-back-fastMath");
    fastMatch.style.visibility = "hidden";

    //убрать анимацию с helpers
    helperBottom.classList.remove("animate-helperBottom");
    helperLeft.classList.remove("animate-helperLeft");
    helperRight.classList.remove("animate-helperRight");
    //убрать анимацию статистики
    document.querySelector(".stat").classList.remove("animate-stat");

    //для селектора в setInterval
    stopTimer = true;
    //прячем спан "пропустить"
    skipBtn.style.visibility = "hidden";
    //для окошка с fastMatch
    document.querySelector(".fastMatch-example").style.opacity = "0";
    result.style.opacity = "0";
    result.innerHTML = "";
    inputAnswer.readOnly = true;
    inputAnswer.value = "";
    inputAnswer.focus();
    FastMatch.allExаmple = 0;
    FastMatch.correctExаmple = 0;

    //таймер матча
    timer.innerHTML = `${+FastMatch.timeMatch}:00`;
    resolve();
  });
}

//запись результатов  в таблицу статистики

////////////////////////////////////////////////////////////////////////
///////////////////////////вспомогательные функции//////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//анимация, когда не выбраны арифм операции
function checkArifmLength() {
  $(document).ready(function () {
    $(".arifmSetting-choose").find("li").removeClass("bounceIn");
  });
  animation(100).then(() => {
    $(document).ready(function () {
      $(".arifmSetting-choose").find("li").addClass("bounceIn");
    });
  });
}

//анимация задержки
async function animation(wait = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, wait);
  });
}
//допускаем  в input только цифры
document.oninput = function () {
  let input = document.querySelector(".fastMatch-input-group input");
  input.value = input.value.replace(/[^.,-1234567890]/, "");
};

//выбор арифметических операций
let arifmChoose = document.querySelector(".arifmSetting-choose");
$(document).ready(function () {
  $(".arifmSetting-choose")
    .find("div")
    .on("click", function () {
      let sign = "";
      switch ($(this).data("arifm")) {
        case "сложение":
          sign = "&#43;";
          FastMatch.addArifmSign(sign);
          break;
        case "вычитание":
          sign = "&#8722;";
          FastMatch.addArifmSign(sign);
          break;
        case "умножение":
          sign = "&#215;";
          FastMatch.addArifmSign(sign);
          break;
        case "деление":
          sign = "&#247;";
          FastMatch.addArifmSign(sign);
          break;
      }
    });
});

// range slider выбор уровня сложности
let sheet = document.createElement("style"),
  $rangeInput = $(".range input"),
  prefs = ["webkit-slider-runnable-track", "moz-range-track", "ms-track"];

document.body.appendChild(sheet);

let getTrackStyle = function (el) {
  //el- это инпут
  console.log("rkbr");

  (curVal = el.value), // порядковый номер точки
    (val = (curVal - 1) * 24.666666667),
    //  16.666666667,
    (style = "");

  //текст уровня сложности из массива
  levelSettingContent.innerHTML =
    "Числа от " +
    FastMatch.levelOfDifficulty[curVal].from +
    " до " +
    FastMatch.levelOfDifficulty[curVal].to;

  //анимация "Числа от...до..."
  levelSettingContent.classList.remove("bounceIn");
  animation(0).then(() => {
    levelSettingContent.classList.add("bounceIn");
  });

  // Set active label
  $(".range-labels li").removeClass("active selected");

  let curLabel = $(".range-labels").find("li:nth-child(" + curVal + ")");
  curLabel.addClass("active selected");
  curLabel.prevAll().addClass("selected");

  // синяя полоска сзади
  for (let i = 0; i < prefs.length; i++) {
    style +=
      ".range {background: linear-gradient(to right,#03a9f4 0%, #03a9f4 " +
      val +
      "%,  #fff " +
      val +
      "%, #fff 100%)}";

    //тонкая полоска
    style +=
      ".range input::-" +
      prefs[i] +
      "{background: linear-gradient(to right, #03a9f4 0%, #03a9f4 " +
      val +
      "%, gray " +
      val +
      "%, gray 100%)}";
  }
  levelSettingContent.innerHTML =
    "Числа от " +
    FastMatch.levelOfDifficulty[curVal].from +
    " до " +
    FastMatch.levelOfDifficulty[curVal].to;
  return style;
};
$rangeInput.on("input", function () {
  sheet.textContent = getTrackStyle(this);
});

// Change input value on label click
$(".range-labels li").on("click", function () {
  let index = $(this).index();

  $rangeInput.val(index + 1).trigger("input");
});

//кнопка "играть на время"
let timeBtn = document.querySelector(".setting-right a");
timeBtn.classList.add("animated", "pulse", "infinite");
let competitionBtn = document.querySelector(".competition button");
if (competitionBtn.classList.contains("btn-primary")) {
  competitionBtn.classList.add("animated", "pulse", "infinite");
}
//появление окна с настройками
let settingStandardModes = document.querySelector(".standardModes-setting");
settingStandardModes.classList.add("animated", "fadeInDown");
settingStandardModes.addEventListener("animationend", () => {
  console.log("fef");
  document
    .querySelector(".setting-right")
    .classList.add("animate-settingStandardModes");
});
//включаем подсказки
$(function () {
  $('[data-tooltip="tooltip"]').tooltip();
});

//таймер матча
let timer = document.querySelector(".helperRight-timer");
//выбор времени
$(document).ready(function () {
  $(".btn-group")
    .find("button")
    .on("click", function () {
      switch ($(this).data("time")) {
        case 1:
          FastMatch.timeMatch = 1;
          break;
        case 2:
          FastMatch.timeMatch = 2;
          break;
        case 3:
          FastMatch.timeMatch = 3;
          break;
        case 0:
          FastMatch.timeMatch = false;
          break;
      }
      setTimeToTimer();
    });
});
function setTimeToTimer() {
  if (!FastMatch.timeMatch) {
    timer.style.opacity = "0";
  }
  timer.style.opacity = "1";
  timer.innerHTML = `${+FastMatch.timeMatch}:00`;
}
//динамическая подсветка кнопок с временем
let selectedBtn;
document.querySelector(".btn-group-vertical").onclick = function (event) {
  let btn = event.target.closest("button"); // (1)
  console.log("click");
  document
    .querySelector(".btn-group-vertical button")
    .classList.remove("btn-success");

  highlight(btn);
};
function highlight(btn) {
  if (selectedBtn) {
    // убрать существующую подсветку, если есть
    selectedBtn.classList.remove("btn-success");
  }
  selectedBtn = btn;
  selectedBtn.classList.add("btn-success"); // подсветить новый td
}

function matchTimer() {
  let timeArr = timer.innerHTML.split(":");
  let minutes = timeArr[0];
  let seconds = timeArr[1];
  if (seconds == 0) {
    if (minutes == 0) {
      showStat();
      return;
    }
    minutes--;
    if (minutes < 10) minutes = "0" + minutes;
    seconds = 59;
  } else seconds--;
  if (seconds < 10) seconds = "0" + seconds;
  timer.innerHTML = minutes + ":" + seconds;

  if (stopTimer) setTimeout(matchTimer, 100);
}

function showStat() {
  inputAnswer.readOnly = true;
  inputAnswer.value = "";
  skipBtn.style.display = "none";
  document.querySelector(".stat").classList.add("animate-stat");
  timeStat();
  FastMatch.percentageOfCorrectAnswers = Math.round(
    (FastMatch.correctExаmple / FastMatch.allExаmple) * 100
  );
  document.querySelector(".statAll").textContent = FastMatch.allExаmple;
  document.querySelector(".statRight").textContent =
    FastMatch.correctExаmple +
    " (" +
    FastMatch.percentageOfCorrectAnswers +
    " )";
  document.querySelector(".statFalse").textContent =
    FastMatch.allExаmple - FastMatch.correctExаmple;
  document.querySelector(".statTime").textContent =
    FastMatch.timeMiddleExample + " сек";
  submitStatistic();
}

function timeStat() {
  let sum = 0;
  for (const time of timeForExample) {
    sum += time;
  }
  if (!sum) {
    FastMatch.timeMiddleExample = "0";
  } else {
    FastMatch.timeMiddleExample = (sum / timeForExample.length / 1000).toFixed(
      2
    );
  }
  console.log(timeForExample);
  timeForExample = [];
  FastMatch.counterExample = 0;
}

function addExampleToModalView(style) {
  if (style) {
    style = "#DFF0D8";
  } else {
    style = "#F2DEDE";
  }
  document.querySelector(".modal-body tbody").insertAdjacentHTML(
    "beforeend",
    `<tr style="background-color: ${style}">
<td style="font-weight: bold">${FastMatch.counterExample}</td>
<td>${FastMatch.example}</td>
<td>${inputAnswer.value}</td>
<td>${FastMatch.answer}</td>
</tr>`
  );
}

//отправка данных о матче
const form = document.querySelector(".postStat");
function submitStatistic() {
  document.querySelector(".allExample").value = FastMatch.allExаmple;
  document.querySelector(".correctExample").value = FastMatch.correctExаmple;
  document.querySelector(".percentageOfCorrectAnswers").value =
    FastMatch.percentageOfCorrectAnswers;
  document.querySelector(".timeMiddleExample").value =
    FastMatch.timeMiddleExample;
  form.submit();
}
