// Google Search

function googleSearch() {
  var text = document.getElementById("search-text").value;
  text = text.replaceAll(" ", "+");
  console.log(text);
  if (text != undefined && text != null) {
    window.open("https://www.google.com/search?q=" + text, "_blank");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.collectapi.com/news/getNews?country=tr&tag=general", {
    method: "GET",
    headers: {
      "Access-Control-Request-Headers": "Accept",
      "Content-Type": "application/json",
      Authorization: "YOUR API KEY",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const newsContainer = document.getElementById("news-container");

      data.result.forEach((newsItem, index) => {
        const newsDiv = document.createElement("div");
        newsDiv.classList.add("layer", "w-100", "mt-15", "single-news");

        const newsImgContainer = document.createElement("div");
        newsImgContainer.classList.add(
          "news-img-container",
          "float-l",
          "mr-15"
        );

        const img = document.createElement("img");
        img.src = newsItem.image || "https://placehold.co/100"; // Varsayılan görüntü

        const title = document.createElement("h5");
        title.classList.add("mB-5");
        title.textContent = newsItem.name; // Haber başlığı veya herhangi bir metin

        const source = document.createElement("small");
        source.classList.add("fw-600", "c-grey-700");
        source.textContent = newsItem.source || "Source"; // Haber kaynağı veya herhangi bir metin

        newsDiv.addEventListener("click", () => {
          window.open(newsItem.url, "_blank");
        });

        newsImgContainer.appendChild(img);
        newsDiv.appendChild(newsImgContainer);
        newsDiv.appendChild(title);
        newsDiv.appendChild(source);

        newsContainer.appendChild(newsDiv);
      });
    })
    .catch((error) => {
      console.error("Hata:", error.message);
    });
});

console.log(process.env.ENV_TEST);