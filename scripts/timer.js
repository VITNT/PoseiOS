// Timer
var timerStartButton = document.querySelector("#timer-start");
var timerPauseButton = document.querySelector("#timer-pause");
var timerResetButton = document.querySelector("#timer-reset");
var timeLeft = document.querySelector("#timer-time");
var waterLevel = document.querySelector("#water");
var waterHeight = 150;
var interval = null;

var totalTime = 300; // 1500 sec = 25 min

// update the time
function updateTimer() {
  const min = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  timeLeft.innerHTML = `${min.toString()}:${seconds.toString().padStart(2, "0")}`;
}
// lower the time every second
function startTimer() {
  if (interval !== null) {
    return;
  }
  interval = setInterval(function () {
    totalTime--;
    waterHeight = waterHeight - 0.5;
    waterLevel.style.height = waterHeight.toString() + "px";
    updateTimer();

    if (totalTime === 0) {
      clearInterval(interval);
      interval = null;
      waterHeight = 150;
      waterLevel.style.height = waterHeight.toString() + "px";
      totalTime = 300;
      updateTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  totalTime = 300;
  waterHeight = 150;
  waterLevel.style.height = waterHeight.toString() + "px";
  updateTimer();
}

timerStartButton.addEventListener("click", startTimer);
timerPauseButton.addEventListener("click", pauseTimer);
timerResetButton.addEventListener("click", resetTimer);
