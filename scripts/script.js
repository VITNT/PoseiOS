// Real Time clock
function updateTime() {
  var timeElement = document.getElementById("time");
  timeElement.innerHTML = new Date().toLocaleString();
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
    if (selectedIcon != element && selectedIcon != undefined) {
      deselectIcon(selectedIcon);
    }
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

// JS for poseidon.md app with local storage to save notes

var storage = "notes";
var currentIndex = 0;

var storedNotes = [
  {
    title: "Welcome",
    date: "06/28/2026",
    content: `<p contenteditable="True" style="outline: none;"> Welcome to <strong>Poseidon Notes </p>`,
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
  var note = content[index];
  var pane = document.querySelector("#poseidon-md-content");
  pane.innerHTML = "";

  var titleInput = document.createElement("input");
  titleInput.className = "note-title";
  titleInput.type = "text";
  titleInput.placeholder = "Title";
  titleInput.value = note.title;

  //test code
  var bodyInput = document.createElement("textarea");
  bodyInput.className = "note-body";
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

  pane.appendChild(titleInput);
  pane.appendChild(bodyInput);
  pane.appendChild(del);

  addToSidebar();
  // test code
}

function addToSidebar() {
  var sideBar = document.querySelector("#poseidon-md-sidebar");
  sideBar.innerHTML = "";

  var newNote = document.createElement("div");
  newNote.className = "addnote";
  newNote.textContent = "+ New Note";
  newNote.addEventListener("click", addNote);
  sideBar.appendChild(newNote);

  for (let i = 0; i < content.length; i++) {
    var note = content[i];
    var div = document.createElement("div");
    //idk
    div.className = "entry" + (i === currentIndex ? " active" : "");
    //idk
    var t = document.createElement("p");
    t.className = "entrytitle";
    t.textContent = note.title || "Untitled";
    var d = document.createElement("p");
    d.className = "entrydate";
    d.textContent = note.date || "";
    div.appendChild(t);
    div.appendChild(d);

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
  currentIndex = content.length - 1;
  addToSidebar();
  saveNotes();
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
    info: "This book is about Percy Jackson waking up in a Roman Legion far away from his greek friends...",
  },
  {
    title: "The Mark of Athena",
    author: "Rick Riordan",
    info: "Roanldo SUIII",
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

    card.addEventListener("click", function () {
      selectedBook = i;
      renderBookContent(selectedBook);
    });

    sideBar.appendChild(card);
  }
}

function renderBookContent(selectedBook) {
  var bookContent = document.querySelector("#poseidon-book-content");
  var book = books[selectedBook];
  bookContent.innerHTML = "";

  var title = document.createElement("h2");
  title.className = "book-content-title";
  title.innerHTML = books[selectedBook].title;

  var author = document.createElement("p");
  author.className = "book-content-author";
  author.innerText = book.author;

  var info = document.createElement("p");
  info.className = "book-content-info";
  info.innerHTML = book.info;

  bookContent.appendChild(title);
  bookContent.appendChild(author);
  bookContent.appendChild(info);
}

renderBooks();
renderBookContent(0);
