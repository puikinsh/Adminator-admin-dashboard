// Google Search

function googleSearch() {
  var text = document.getElementById("search-text").value;
  text = text.replaceAll(" ", "+");
  console.log(text);
  if (text != undefined && text != null) {
    window.open("https://www.google.com/search?q=" + text, '_blank');
  }
}
