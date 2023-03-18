const start = document.querySelector("#start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector(".time-list");
const board = document.querySelector("#board");
const timer = document.querySelector("#time");

let level = 1;
let interval = null;
let time = 0;
let score = 0;

function setLevel(newLevel) {
  level = newLevel;
}

start.addEventListener("click", () => {
  screens[0].classList.add("up");
});

timeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("time-btn")) {
    time = parseInt(event.target.getAttribute("data-time"));
    screens[1].classList.add("up");
    startGame();
  }
});

board.addEventListener("click", (event) => {
  if (event.target.classList.contains("circle")) {
    event.target.removeEventListener("click", changeColor);
    score++;
    event.target.remove();
    createRandomCircle();
  }
});

function startGame() {
  setLevel(1);
  interval = setInterval(decraseTime, 1000);
  createRandomCircle();
  setTimer(time);
}

function finishGame() {
  if (score > 10 && level == 1) {
    clearInterval(interval);
    setLevel(2);
    alert("Felicitari, treci la nivelul 2!");
    score = 0;
    time = 30;
    setTimer(time);
    interval = setInterval(decraseTime, 1000);
  } else if (score > 20 && level == 2) {
    clearInterval(interval);
    setLevel(3);
    alert("Felicitari, treci la nivelul 3!");
    score = 0;
    time = 20;
    setTimer(time);
    interval = setInterval(decraseTime, 1000);
  } else {
    clearInterval(interval);
    board.innerHTML = `<h1>Score: <span class="primary">${score}</span></h1>`;
    timeList.parentNode.innerHTML = "";
  }
}

function decraseTime() {
  if (time === 0) {
    finishGame();
  } else {
    --time;
    setTimer(time);
  }
}

function setTimer(value) {
  if (value < 10) {
    timer.innerHTML = `00:0${value}`;
  } else {
    timer.innerHTML = `00:${value}`;
  }
}

function createRandomCircle() {
  let circle = document.createElement("div");
  let size;
  if (level === 1) {
    size = getRandomNumber(30, 50);
  } else if (level === 2) {
    size = getRandomNumber(10, 20);
  } else {
    size = getRandomNumber(5, 10);
  }
  const { width, height } = board.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);
  circle.classList.add("circle");
  circle.style.background = randomHexColor();
  circle.setAttribute("data-id", Date.now()); // adaugam un data-id unic pentru cerc

  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;

  board.append(circle);
}

board.addEventListener("click", (event) => {
  const circle = event.target.closest(".circle");
  if (circle) {
    if (
      circle.getAttribute("data-id") === board.getAttribute("data-current-id")
    ) {
      score++;
      circle.remove();
      createRandomCircle();
    }
  }
});

function randomInteger(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomRgbColor() {
  const r = randomInteger(255);
  const g = randomInteger(255);
  const b = randomInteger(255);
  return [r, g, b];
}

function randomHexColor() {
  const grayThreshold = 50; // pragul pentru a decide dacă o culoare este apropiată de gri
  let rgb;
  let hex;
  do {
    // Generăm o culoare aleatoare
    rgb = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];
    hex =
      "#" + rgb.map((value) => value.toString(16).padStart(2, "0")).join("");
  } while (Math.max(...rgb) - Math.min(...rgb) <= grayThreshold);
  return hex;
}

function changeColor() {
  let hex = randomHexColor();
  this.style.background = hex;
}

function clickHandler(event) {
  changeColor();
  event.preventDefault();
}

document.addEventListener("click", clickHandler);

changeColor();

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
