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
