const banner = document.querySelector("#banner");
const bannerText = document.querySelector("#bannerText");
const closeBannerBtn = document.querySelector("#closeBannerBtn");

const form = document.querySelector("form");
const search = document.querySelector("#search");
const submitBtn = document.querySelector("#submitBtn");

const spinner = document.querySelector("#spinner");
const moviesInfo = document.querySelector("#movies-info");
const nominationInfo = document.querySelector("#nomination-info");

const moviesList = document.querySelector("#movies-list");
const nominationList = document.querySelector("#nomination-list");
const nomineesContainer = document.querySelector(".nominees-container");

let movieNominees = JSON.parse(localStorage.getItem("movieNominees")) || [];

const nominate = (e) => {
  if (movieNominees.length >= 5) {
    // return showBanner("You can only nominate five movies.", "red");
    alert("You can only nominate five movies.");
  }

  const movie = e.closest(".movie-item");
  const { title, imdbId, year } = movie.dataset;
  const imgSrc = movie.querySelector("img")
    ? movie.querySelector("img").src
    : "";

  // if movie isn't already nominated, proceed
  if (
    movieNominees.filter((nominee) => nominee.imdbId === imdbId).length === 0
  ) {
    movieNominees.push({ title, imdbId, year, imgSrc });
    localStorage.setItem("movieNominees", JSON.stringify(movieNominees));

    let movieClone = movie.cloneNode(true);
    let button = movieClone.querySelector("button");
    button.innerText = "Remove";
    button.classList.add("remove");

    button.setAttribute("onclick", "removeNomination(this)");

    nominationList.appendChild(movieClone);
    e.innerText = "Nominated";
    e.disabled = true;
  }

  // if (!movieNominees.length) nomineeInfo.classList.add("empty");
  // updateNomineesLeft();
  console.log("updated nominee");
};

const ifNominated = (movieId) => {
  return movieNominees.filter((movie) => movie.imdbId === movieId).length === 1;
};

const searchMovie = async (e) => {
  e.preventDefault();
  let searchTerm = search.value.trim();

  if (!searchTerm) {
    search.classList.add("error");
    setTimeout(() => {
      search.classList.remove("error");
    }, 5000);
    return;
  }
  spinner.classList.add("show");

  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "f669b4b1",
        s: searchTerm,
      },
    });

    spinner.classList.remove("show");
    const result = response.data.Search;
    let movieItem = "";

    if (result !== undefined && result.length) {
      result.forEach((movie) => {
        const { Title, Year, imdbID, Poster, Type } = movie;

        movieItem += `
          <li class="movie-item" data-title="${Title}" data-year="${Year}" data-imdb-id="${imdbID}">
          ${Poster === "N/A" ? "" : `<img src="${Poster}" alt="${Title}"/>`}
            <div class="movie-content">
              <div class="movie-content-info">
              <h3>${Title}</h3>
                <h4>${Type}</h4>
                <p>${Year}</p>
              </div>
              <button onclick="nominate(this)" ${
                ifNominated(imdbID) ? "disabled" : ""
              }>${ifNominated(imdbID) ? "Nominated" : "Nominate"}</button>
            </div>
          </li>      
            `;
      });

      moviesInfo.innerText = `Results for "${searchTerm}".`;
      moviesList.innerHTML = movieItem;
    } else {
      moviesList.innerHTML = "";
      moviesInfo.innerText = `No results for "${searchTerm}" found`;
    }
  } catch (error) {
    console.log(error);
  }
};

form.addEventListener("submit", searchMovie);
