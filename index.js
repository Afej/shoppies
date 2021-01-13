const banner = document.querySelector("#banner");
const bannerText = document.querySelector("#bannerText");
const closeBannerBtn = document.querySelector("#closeBannerBtn");

const form = document.querySelector("form");
const search = document.querySelector("#search");
// const submitBtn = document.querySelector("#submitBtn");

const spinner = document.querySelector("#spinner");
const moviesInfo = document.querySelector("#movies-info");
const nominationInfo = document.querySelector("#nomination-info");

const moviesList = document.querySelector("#movies-list");
const nominationList = document.querySelector("#nomination-list");
const nomineesContainer = document.querySelector(".nominees-container");

let movieNominees = JSON.parse(localStorage.getItem("movieNominees")) || [];

//////////////////////////////////////////////////
//// function to keep nomination list updated ////
//////////////////////////////////////////////////
const updateNomineesLeft = () => {
  if (movieNominees.length) {
    nominationInfo.innerHTML = `You have ${
      5 - movieNominees.length
    } nomination${5 - movieNominees.length !== 1 ? "s" : ""} left.
    <button class="toggle-btn" onclick="toggleShow()">
    View
    <i class="fas fa-angle-double-down"></i>
    </button>
    `;

    if (movieNominees.length === 5) {
      alert("You have selected five movies. Thank you!");
      // showBanner("You have selected five movies. Thank you!");
    }
  } else {
    nominationInfo.innerText = "Search movies and add your nominations.";
  }
};

const toggleShow = () => {
  nominationList.classList.toggle("show-nominees");
  let viewButton = nominationInfo.querySelector("button");

  if (nominationList.classList.contains("show-nominees")) {
    viewButton.innerHTML = `Close <i class="fas fa-angle-double-up"></i>`;
  } else {
    viewButton.innerHTML = `View <i class="fas fa-angle-double-down"></i>`;
  }
};

/////////////////////////////////////////////////////////////////////
//// populating the nomination list with data from local storage ////
/////////////////////////////////////////////////////////////////////
const fillNominationList = () => {
  let html = ``;
  updateNomineesLeft();

  movieNominees.forEach((movie) => {
    const { title, imdbId, year, type, imgSrc } = movie;

    html += `
    <li class="movie-item" data-title="${title}" data-year="${year}" data-imdb-id="${imdbId}" data-type="${type}">
    ${imgSrc ? `<img src="${imgSrc}" alt="${title}" />` : ""}
      <div class="movie-content">
        <div class="movie-content-info">
        <h3>${title}</h3>
          <h4>${type}</h4>
          <p>${year}</p>
        </div>
        <button onclick="removeNomination(this)" class="remove">Remove</button>
      </div>
    </li> 
    `;
  });

  nominationList.innerHTML = html;
};

fillNominationList();

////////////////////////////////////
//// remove a movie nomination ////
///////////////////////////////////
const removeNomination = (e) => {
  // hideBanner();
  const movie = e.closest(".movie-item");
  const { imdbId } = movie.dataset;

  movieNominees = movieNominees.filter((nominee) => nominee.imdbId !== imdbId);

  localStorage.setItem("movieNominees", JSON.stringify(movieNominees));

  setTimeout(() => nominationList.removeChild(movie), 300);

  // enable button in results
  let movieButton = moviesList.querySelector(
    `.movie-item[data-imdb-id="${imdbId}"] button`
  );

  if (movieButton) {
    movieButton.disabled = false;
    movieButton.innerText = "Nominate";
  }
  updateNomineesLeft();
};

//////////////////////////////////////
//// function to nominate a movie ////
//////////////////////////////////////
const nominate = (e) => {
  if (movieNominees.length >= 5) {
    // return showBanner("You can only nominate five movies.", "red");
    alert("You can only nominate five movies.");
    return;
  }

  const movie = e.closest(".movie-item");
  const { title, imdbId, year, type } = movie.dataset;
  const imgSrc = movie.querySelector("img")
    ? movie.querySelector("img").src
    : "";

  // if movie isn't already nominated, proceed
  if (
    movieNominees.filter((nominee) => nominee.imdbId === imdbId).length === 0
  ) {
    movieNominees.push({ title, imdbId, year, type, imgSrc });
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

  updateNomineesLeft();
};

// checks if a movie has already been nominated
const ifNominated = (movieId) => {
  return movieNominees.filter((movie) => movie.imdbId === movieId).length === 1;
};

/////////////////////////////////////
//// Search function to Imdb api ////
/////////////////////////////////////
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
    const response = await axios.get("https://www.omdbapi.com/", {
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
          <li class="movie-item" data-title="${Title}" data-year="${Year}" data-imdb-id="${imdbID}" data-type="${Type}">
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
      moviesInfo.innerText = `No results for "${searchTerm}" found`;
      moviesList.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
};

//////////////////////////
//// Event listeners ////
/////////////////////////
form.addEventListener("submit", searchMovie);
