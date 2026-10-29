// Real Time clock
function updateTime() {
  var timeElement = document.getElementById("time");
  const dateFormat = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
  };
  timeElement.innerHTML = new Date().toLocaleString("en-US", dateFormat);
}

setInterval(updateTime, 1000);

// Window functions
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
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragHandling;
  }
  function dragHandling(e) {
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
  var topBarH = 60;

  var halfW = element.offsetWidth / 2;
  var halfH = element.offsetHeight / 2;

  var minLeft = halfW;
  var maxLeft = window.innerWidth - halfW;

  var minTop = topBarH + halfH;
  var maxTop = window.innerHeight - halfH;

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

function focusWindow(element) {
  element.addEventListener("mousedown", () => {
    maxIndex++;
    element.style.zIndex = maxIndex;
    topBar.style.zIndex = maxIndex + 1;
  });
}

function initializeWindow(element, element2, window) {
  var closeButton = document.querySelector("#" + element);
  var openButton = document.querySelector("#" + element2);
  var screen = document.querySelector("#" + window);

  closeButton.addEventListener("click", () => {
    closeWindow(screen);
  });

  openButton.addEventListener("click", () => {
    if (selectedIcon != openButton && selectedIcon != undefined) {
      deselectIcon(selectedIcon);
    }
    clickIcon(openButton, screen);
  });

  focusWindow(screen);
  dragElement(screen);
}

// initializing all desktop
initializeWindow(
  "welcome-close-button",
  "welcome-open-button",
  "welcome-window",
);
initializeWindow(
  "poseidon-md-close-button",
  "poseidon-md-open-button",
  "poseidon-md",
);
initializeWindow(
  "poseidon-book-close-button",
  "poseidon-book-open-button",
  "poseidon-book",
);

// init windows for docks
initializeWindow(
  "poseidon-md-close-button",
  "poseidon-md-open-button__dock",
  "poseidon-md",
);
initializeWindow(
  "poseidon-book-close-button",
  "poseidon-book-open-button__dock",
  "poseidon-book",
);
initializeWindow(
  "timer-close-button",
  "timer-open-button__dock",
  "timer-window",
);
initializeWindow(
  "poseidon-browser-close-button",
  "browser-open-button__dock",
  "poseidon-browser",
);
initializeWindow(
  "poseidon-setting-close-button",
  "setting-open-button__dock",
  "poseidon-setting",
);

// initialize draggable dolphin
var dolphin = document.querySelector("#dolphin");
focusWindow(dolphin);
dragElement(dolphin);

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
document.addEventListener("mousedown", (e) => {
  if (!e.target.closest(".open-button")) {
    if (selectedIcon !== undefined) {
      deselectIcon(selectedIcon);
    }
  }
});

// sounds

const soundEffect = new Audio("./sounds/button-click.mp3");

document.addEventListener("click", (event) => {
  if (event.target.closest(".open-button, .close-button, button")) {
    soundEffect.play();
  } else {
    return;
  }
});
