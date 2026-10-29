// browser

var inputUrl = document.querySelector("#browser-input");
var openInNewTab = document.querySelector("#browser-button");
var searchButton = document.querySelector("#browser-open");
var iframe = document.querySelector("#browser-view");

function openUrl() {
  let url = inputUrl.value;
  if (!url.includes("https://")) {
    url = "https://www.google.com/search?q=" + inputUrl.value;
  }
  window.open(url, "_blank");
}

function displayUrl() {
  let url = inputUrl.value;
  if (!url.includes("https://")) {
    url = "https://www.google.com/search?q=" + inputUrl.value;
  }
  iframe.src = url;
}

openInNewTab.addEventListener("click", openUrl);
searchButton.addEventListener("click", displayUrl);
inputUrl.addEventListener("keydown", (keystroke) => {
  if (keystroke.key === "Enter") {
    displayUrl();
  }
});
