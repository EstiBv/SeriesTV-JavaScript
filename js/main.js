"use strict";
const inputText = document.querySelector(".js-inputText");
const btnSearch = document.querySelector(".js-btn");
const results = document.querySelector(".js-searchResults");
const asideFav = document.querySelector(".js-saveFavorites");

let dataSeriesTv = [];
let dataSeriesTvFav = [];

// Fetch
function getDataSeries() {
  let inputValue = inputText.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      dataSeriesTv = data;
      paintCard();
      listenSeries();
    });
}

// Get LocarSotage
const getInLocalStorage = function () {
  const localStorageFav = localStorage.getItem("Favorites SeriesTv");
  if (localStorageFav !== null) {
    dataSeriesTvFav = JSON.parse(localStorageFav);
  }
};

// Set LocalStorage
const setInLocalStorage = function () {
  const stringifyFav = JSON.stringify(dataSeriesTvFav);
  localStorage.setItem("Favorites SeriesTv", stringifyFav);
};

// Paint Series
function paintCard() {
  let showResults = "";
  for (let i = 0; i < dataSeriesTv.length; i++) {
    const favIndex = dataSeriesTvFav.findIndex(
      (serieFav) => serieFav.show.id === dataSeriesTv[i].show.id
    );
    if (favIndex !== -1) {
      showResults += `<li class = "js-serie js-markFav" id="${[i]}">`;
    } else {
      showResults += `<li class = "js-serie" id="${[i]}">`;
    }
    showResults += `<p>${dataSeriesTv[i].show.name} </p>`;
    if (dataSeriesTv[i].show.image !== null) {
      showResults += `<img class= "img" src="${dataSeriesTv[i].show.image.medium}" alt="show tv image"/> `;
    } else if (dataSeriesTv[i].show.image === null) {
      showResults += `<img class= "img" src="https://via.placeholder.com/210x295/ffffff/666666/?" alt="show tv image"/> `;
    }
    showResults += `</div>`;
    showResults += "</li>";
  }

  results.innerHTML = showResults;
  listenSeries();
}

// Paint favorites
function paintFavorites() {
  let showFavors = " ";
  for (let i = 0; i < dataSeriesTvFav.length; i++) {
    showFavors += `<li class = "js-serie-fav" id =${[i]}>`;
    showFavors += `<p><input type="button" value="" class="btn-Fav" id="${i}"/> ${dataSeriesTvFav[i].show.name} </p>`;
    showFavors += `<div>`;
    if (
      dataSeriesTvFav[i].show.image !== null &&
      dataSeriesTvFav[i].show.image === undefined
    ) {
      showFavors += `<img src="${dataSeriesTv[i].show.image.medium}" alt="show tv image"/>`;
    } else if (dataSeriesTvFav[i].show.image === null) {
      showFavors += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?" alt="show tv image"/> `;
      showFavors += `</div>`;
      showFavors += "</li>";
    }
  }
  asideFav.innerHTML = showFavors;
  listenListBtnFav();
}

// Listen buttons favorites
function listenListBtnFav() {
  const buttonsRemove = document.querySelectorAll(".btn-Fav");
  for (const buttonRemove of buttonsRemove) {
    buttonRemove.addEventListener("click", removeSerieFav);
  }
}

// Delete favorites
function removeSerieFav(ev) {
  let removeFavId = ev.currentTarget.id;
  removeFavId = parseInt(ev.currentTarget.id);

  let removeFavIdItems = document.querySelectorAll(".btn-Fav");
  for (const serieFav of removeFavIdItems) {
    let removeFavSelect = parseInt(serieFav.id);
    if (removeFavId === removeFavSelect) {
      dataSeriesTvFav.splice(serieFav, 1);
    }
  }

  paintFavorites();
  paintCard();
  setInLocalStorage();
}

// Listen favorites
function addFavouritesSeries(ev) {
  let clickedId = ev.currentTarget.id;
  clickedId = parseInt(ev.currentTarget.id);
  if (dataSeriesTvFav.indexOf(dataSeriesTv[clickedId]) !== -1) {
    let serieIndex = dataSeriesTvFav.indexOf(dataSeriesTv[clickedId]);
    dataSeriesTvFav.splice(serieIndex, 1);
  } else {
    dataSeriesTvFav.push(dataSeriesTv[clickedId]);
  }

  setInLocalStorage();
  paintCard();
  paintFavorites();
  addFavouritesSeries();
}

// Listen all Series
function listenSeries() {
  const seriesItems = document.querySelectorAll(".js-serie");
  for (const serieItem of seriesItems) {
    serieItem.addEventListener("click", addFavouritesSeries);
  }
}

// Delete All Favourites
const buttonAllFav = document.querySelector(".js-btn-deleteAll");
function buttonDeleteAllFav() {
  for (const dataSerie of dataSeriesTvFav) {
    dataSeriesTvFav = [];
    setInLocalStorage();
    paintFavorites();
    paintCard();
  }
}
buttonAllFav.addEventListener("click", buttonDeleteAllFav);

getInLocalStorage();
paintFavorites();

// Listen click
const search = function (ev) {
  ev.currentTarget;
  ev.preventDefault();
  getDataSeries();
};
btnSearch.addEventListener("click", search);
