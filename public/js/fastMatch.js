const FastMatch = {
    arifmSign: ["+"],
    //переменные для статистики fastMatch в helperRight
    allExаmpleCounter: 0,
    correctExаmpleCounter: 0,
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
        if (randomArifmSign === "/") {
            firstParam.innerHTML =
                +firstParam.textContent * +secondParam.textContent;
        }

        this.answer = eval(
            `+firstParam.textContent ${randomArifmSign} +secondParam.textContent`
        );
        console.log(this.answer);
    },

    //проверяет ответ
    compare(inputAnswerValue) {
        let resultAnswer = true;
        if (inputAnswerValue != this.answer) {
            resultAnswer = false;
        }
        //считаем статистику за матч
        this.counterResult(resultAnswer);
        resultAnswer = true;
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

    //статистика в переменной result
    counterResult(resultAnswer) {
        if (resultAnswer) {
            this.correctExаmpleCounter++;
        }
        this.allExаmpleCounter++;
        
        
        result.innerHTML = ` ${this.correctExаmpleCounter} из ${this.allExаmpleCounter}`;
    },
    //добавляем арифм знаки в массив
    addArifmSign(arg) {
        if (this.arifmSign.includes(arg)) {
            this.arifmSign.splice(this.arifmSign.indexOf(arg), 1);
        } else this.arifmSign.push(arg);
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
inputAnswer.onkeypress = function (event) {
    if ((event.which === 32 || event.which === 13) && inputAnswer.value != "") {
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

let matchSetting = document.querySelector(".newFMatch-area");
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
let stopSetInterval = true;

//таймер
function startTimer(time, tagName, callback) {
    display = document.querySelector(`.${tagName}`);
    display.style.opacity = "1";
    display.innerHTML = time;

    let timer = setInterval(function () {
        if (--time != 0 && stopSetInterval) {
            // обновляем цифру
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
    //таймер времени на матч (60сек)
    startTimer(60, "helperRight-timer", null);
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
    FastMatch.allExаmpleCounter = 0;
    FastMatch.correctExаmpleCounter = 0;
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
    stopSetInterval = false;
    //скрытие fastMatch
    fastMatch.classList.add("animate-back-fastMath");
    fastMatch.classList.remove("animate-fastMath");
    //появление настроек
    matchSetting.classList.add("animate-back-setting");
    matchSetting.classList.remove("animate-setting");
}

//FIXME: в переменную display не должно записываться это значение

let display = document.querySelector(".fastMatch-timer p");

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

        //для селектора в setInterval
        stopSetInterval = true;
        //прячем спан "пропустить"
        skipBtn.style.visibility = "hidden";
        //для окошка с fastMatch
        document.querySelector(".fastMatch-example").style.opacity = "0";
        result.style.opacity = "0";
        result.innerHTML = "";
        inputAnswer.readOnly = true;
        inputAnswer.value = "";
        inputAnswer.focus();
        FastMatch.allExаmpleCounter = 0;
        FastMatch.correctExаmpleCounter = 0;
            resolve();
    });
}

////////////////////////////////////////////////////////////////////////
///////////////////////////вспомогательные функции//////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//проверяем, выбраны ли операции
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
                    sign = "+";
                    FastMatch.addArifmSign(sign);
                    break;
                case "вычитание":
                    sign = "-";
                    FastMatch.addArifmSign(sign);
                    break;
                case "умножение":
                    sign = "*";
                    FastMatch.addArifmSign(sign);
                    break;
                case "деление":
                    sign = "/";
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
