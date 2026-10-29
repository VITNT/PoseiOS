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
