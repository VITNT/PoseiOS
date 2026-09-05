// Real Time clock
function updateTime() {
  var current_time = new Date().toLocaleString();
  var timeElement = document.getElementById("time");
  timeElement.innerHTML = current_time;
}

setInterval(updateTime, 1000);

//  Drag window feature
function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var offsetX = 0;
  var offsetY = 0;

  if (document.getElementById(element.id + "-handle")) {
    document.getElementById(element.id + "-handle").onmousedown = startDragging;
    addWindowTapHandler(element);
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

dragElement(document.getElementById("window"));
dragElement(document.getElementById("poseidon-md-window"));

// Open-Close window
var welcomeScreen = document.querySelector("#window");
var poseidonWindow = document.querySelector("#poseidon-md-window");
var topBar = document.querySelector("#top-bar");
var maxIndex = 1;

function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
  maxIndex++;
  element.style.zIndex = maxIndex;
  topBar.style.zIndex = maxIndex + 1;
}

function closeWindowOnClick(element, window) {
  element.addEventListener("click", () => {
    closeWindow(window);
  });
}

function openWindowOnClick(element, window) {
  element.addEventListener("click", () => {
    clickIcon(element, window);
  });
}

openWindowOnClick(
  document.querySelector("#welcome-open-button"),
  welcomeScreen,
);

closeWindowOnClick(
  document.querySelector("#welcome-close-button"),
  welcomeScreen,
);

openWindowOnClick(
  document.querySelector("#poseidon-md-open-button"),
  poseidonWindow,
);

closeWindowOnClick(
  document.querySelector("#poseidon-md-close-button"),
  poseidonWindow,
);

function addWindowTapHandler(element) {
  element.addEventListener("mousedown", () => {
    handleWindowTap(element);
  });
}

function handleWindowTap(element) {
  maxIndex++;
  element.style.zIndex = maxIndex;
  topBar.style.zIndex = maxIndex + 1;
}

// Open-Close Apps
var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined;
}

function clickIcon(element, window) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
    openWindow(window);
  } else {
    selectIcon(element);
  }
}
