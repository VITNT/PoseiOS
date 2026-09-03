/* Real Time clock */
function updateTime() {
  var current_time = new Date().toLocaleString();
  var timeElement = document.getElementById("time");
  timeElement.innerHTML = current_time;
}

setInterval(updateTime, 1000);

/* Drag window feature */
dragElement(document.getElementById("window"));

function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var offsetX = 0;
  var offsetY = 0;

  if (document.getElementById(element.id + "-handle")) {
    document.getElementById(element.id + "-handle").onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    offsetX = initialX - e.clientX;
    offsetY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = element.offsetTop - offsetY + "px";
    element.style.left = element.offsetLeft - offsetX + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Open-Close window
var welcomeScreen = document.querySelector("#window");

function closeWindow() {
  welcomeScreen.style.display = "none";
}

function openWindow() {
  welcomeScreen.style.display = "flex";
}

var welcomeScreenClose = document.querySelector("#welcome-close-button");
var welcomeScreenOpen = document.querySelector("#welcome-open-button");

welcomeScreenClose.addEventListener("click", function () {
  closeWindow();
});

welcomeScreenOpen.addEventListener("click", function () {
  openWindow();
});
