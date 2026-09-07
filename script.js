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
    var finalPosition = clampWindowPos(
      element,
      element.offsetLeft - offsetX,
      element.offsetTop - offsetY,
    );
    element.style.top = finalPosition.top + "px";
    element.style.left = finalPosition.left + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Limit the drag so that the windows don't go out of the viewport
function clampWindowPos(element, left, top) {
  var margin = 10;
  var topBarH = 50;

  var halfW = element.offsetWidth / 2;
  var halfH = element.offsetHeight / 2;

  var minLeft = halfW + margin;
  var maxLeft = window.innerWidth - halfW - margin;

  var minTop = topBarH + halfH + margin;
  var maxTop = window.innerHeight - halfH - margin;

  // return the position value that doesn't go out of viewport boundaries
  return {
    left: Math.min(Math.max(left, minLeft), maxLeft),
    top: Math.min(Math.max(top, minTop), maxTop),
  };
}

// Open-Close window
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

function initializeWindow(element, element2, window) {
  var closeButton = document.querySelector("#" + element);
  var openButton = document.querySelector("#" + element2);
  var screen = document.querySelector("#" + window);
  closeWindowOnClick(closeButton, screen);
  openWindowOnClick(openButton, screen);
  addWindowTapHandler(screen);
  dragElement(screen);
}

initializeWindow("welcome-close-button", "welcome-open-button", "window");
initializeWindow(
  "poseidon-md-close-button",
  "poseidon-md-open-button",
  "poseidon-md",
);

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

// deselect when clicking on desktop bg
document.body.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".open-button")) {
    if (selectedIcon !== undefined) {
      deselectIcon(selectedIcon);
    }
  }
});
