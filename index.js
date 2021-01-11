const banner = document.querySelector("#banner");
const bannerText = document.querySelector("#bannerText");
const closeBannerBtn = document.querySelector("#closeBannerBtn");

const form = document.querySelector("form");
const search = document.querySelector("#search");
const submitBtn = document.querySelector("#submitBtn");

const moviesInfo = document.querySelector("#movies-info");
const nominationInfo = document.querySelector("#nomination-info");

const moviesList = document.querySelector("#movies-list");
const nominationList = document.querySelector("#nomination-list");
const nomineesContainer = document.querySelector(".nominees-container");

let nominees = JSON.parse(localStorage.getItem("awardNominees")) || [];

// const response = axios.get("http://www.omdbapi.com/", {
//   params: {
//     apikey: "f669b4b1",
//     s: "batman",
//   },
// });
