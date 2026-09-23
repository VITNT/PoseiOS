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

// App functions
// POSEIDON.MD app with local storage to save notes

var storage = "notes";
var currentIndex = 0;

var storedNotes = [
  {
    title: "Welcome",
    date: "06/28/2026",
    body: "Welcome to POSEIDON.md",
  },
];

var currentDate = () => {
  return new Date().toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
var content = loadNotes();

function loadNotes() {
  try {
    var saved = localStorage.getItem(storage);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return storedNotes.slice();
}

function saveNotes() {
  try {
    localStorage.setItem(storage, JSON.stringify(content));
  } catch (e) {}
}

function openNote(index) {
  currentIndex = index;
  var note = content[currentIndex];
  var contentPanel = document.querySelector("#poseidon-md-content");

  var titleInput = document.createElement("input");
  titleInput.className = "note-title";
  titleInput.name = "note-title";
  titleInput.type = "text";
  titleInput.placeholder = "Title";
  titleInput.value = note.title;

  var bodyInput = document.createElement("textarea");
  bodyInput.className = "note-body";
  bodyInput.name = "note-body";
  bodyInput.placeholder = "Write your note...";
  bodyInput.value = note.body;

  var del = document.createElement("button");
  del.className = "note-delete";
  del.textContent = "Delete note";
  del.addEventListener("click", function () {
    deleteNote(index);
  });

  titleInput.addEventListener("input", function () {
    content[currentIndex].title = titleInput.value;
    saveNotes();
    addToSidebar();
  });

  bodyInput.addEventListener("input", function () {
    content[currentIndex].body = bodyInput.value;
    saveNotes();
  });

  contentPanel.replaceChildren(titleInput, bodyInput, del);

  addToSidebar();
}

function addToSidebar() {
  var sideBar = document.querySelector("#poseidon-md-sidebar");
  sideBar.innerHTML = "";

  var newNote = document.createElement("div");
  newNote.className = "add-note";
  newNote.textContent = "+ NEW NOTE";
  newNote.addEventListener("click", addNote);
  sideBar.appendChild(newNote);

  for (let i = 0; i < content.length; i++) {
    var note = content[i];
    var div = document.createElement("div");
    if (i === currentIndex) {
      div.className = "entry" + " active";
    } else {
      div.className = "entry";
    }
    var title = document.createElement("p");
    title.className = "entry-title";
    if (note.title === "") {
      title.textContent = "Untitled";
    } else {
      title.textContent = note.title;
    }
    var date = document.createElement("p");
    date.className = "entry-date";
    date.textContent = note.date;
    div.appendChild(title);
    div.appendChild(date);

    div.addEventListener("click", function () {
      openNote(i);
    });
    sideBar.appendChild(div);
  }
}

function addNote() {
  content.push({ title: "Untitled", date: currentDate(), body: "" });
  currentIndex = content.length - 1;
  saveNotes();
  openNote(currentIndex);
}

function deleteNote(index) {
  content.splice(index, 1);
  saveNotes();

  // Prevent openNote from opening an index of -1 (undefined) when last note is deleted
  if (content.length === 0) {
    currentIndex = 0;
    document.querySelector("#poseidon-md-content").innerHTML = "";
    addToSidebar();
    return;
  }
  currentIndex = content.length - 1;
  openNote(currentIndex);
}

addToSidebar();
if (content.length > 0) {
  openNote(0);
}

// Book App

var books = [
  {
    title: "The Son of Neptune",
    author: "Rick Riordan",
    info: "This book is about Percy Jackson waking up in a Roman Demigod Camp far away from his greek friends... Percy has no recollection of his past self. He shows his demigod powers as the Son of Poseidon.",
  },
  {
    title: "Poseidon",
    author: "Mystery...",
    info: "Poseidon is the greek god of the sea. He is the son of the titans Cronus and Rhea. He is one of the 3 strongest gods, on par with Zeus and Hades. He is also the god of storms, earthquakes, and horses.",
  },
  {
    title: "The Odyssey",
    author: "Homer",
    info: "In the Odyssey, Poseidon uses his power to send violent sea storms to throw Odysseus off course.",
  },
];

var selectedBook = 0;

function renderBooks() {
  var sideBar = document.querySelector("#poseidon-book-sidebar");
  sideBar.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    var book = books[i];
    var card = document.createElement("div");

    var title = document.createElement("p");
    title.className = "poseidon-book-title";
    title.textContent = book.title;

    var author = document.createElement("p");
    author.className = "poseidon-book-author";
    author.textContent = book.author;

    card.className = "bookCard";
    card.appendChild(title);
    card.appendChild(author);

    if (i === selectedBook) {
      card.classList.add("selectedBook");
    }

    card.addEventListener("click", function () {
      selectedBook = i;
      renderBooks();
      renderBookContent(selectedBook);
    });

    sideBar.appendChild(card);
  }
}

function renderBookContent(selectedBook) {
  var book = books[selectedBook];
  var bookContent = document.querySelector("#poseidon-book-content");

  var title = document.createElement("h2");
  title.className = "book-content-title";
  title.textContent = book.title;

  var author = document.createElement("p");
  author.className = "book-content-author";
  author.textContent = book.author;

  var info = document.createElement("p");
  info.className = "book-content-info";
  info.textContent = book.info;

  bookContent.replaceChildren(title, author, info);
}

renderBooks();
renderBookContent(0);

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

// browser

inputUrl = document.querySelector("#browser-input");
searchButton = document.querySelector("#browser-button");

function openUrl() {
  let url = inputUrl.value;
  if (!url.includes("https://")) {
    url = "https://www.google.com/search?q=" + inputUrl.value;
  }
  window.open(url, "_blank");
}

searchButton.addEventListener("click", openUrl);
