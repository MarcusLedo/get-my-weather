"use strict";

// FORM SEARCH DOM
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const searchForm = document.querySelector(".search-form");

// FORM MODAL (API) DOM
const modalForm = document.querySelector(".modal-form");
const btnSubmitAPI = document.querySelector(".btn-submit-api");
const APIInputField = document.querySelector(".api-input-field");
const invalidAPIKey = document.querySelector(".invalid-api-key");

// MODAL DOM
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".btn-close-model");

// BACK-END VARIABLES
let APIkey = "";
let searchTerm = "";
let weatherData = ""; // Data from the API
let city = {}; // City object

// EVENT LISTENERS -----------------------------------

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (isThereAnAPIKey(APIkey)) {
    // CONTINUES EXECUTION NORMALLY

    //Getting the search term (city name)
    searchTerm = searchBar.value;

    //Getting the data from the API
    weatherData = await getWeatherData(searchTerm, APIkey);
    // Building an object with the data
    city = constructCityObject(weatherData);
    console.log(city);
  } else {
    // RENDER POP UP ASKING FOR AN API KEY
    modal.classList.add("my-modal-open");
  }
});

modalForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (await isAPIKeyValid(APIInputField.value)) {
    APIkey = APIInputField.value;
    closeModal(modal);
  } else {
    // RENDER ERROR MESSAGE
    invalidAPIKey.classList.add("make-it-visible");
  }
});

closeModalBtn.addEventListener("click", function (e) {
  closeModal(modal);
});

// FUNCTIONS -------------------------------------------

function isThereAnAPIKey(key) {
  if (key) return true;
  else return false;
}

async function isAPIKeyValid(key) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${key}`;
  const res = await fetch(url);

  if (res.status === 401) return false;
  else return true;
}

async function getWeatherData(cityName, key) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&type=hour&units=metric&appid=${key}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
  return data;
}

function constructCityObject(data) {
  const city = {};

  city.name = data.name;
  city.temperature = parseInt(data.main.temp);
  city.description = data.weather[0].description;
  city.weatherIcon = data.weather[0].icon;
  city.humidity = data.main.humidity;
  city.wind = data.wind.speed;
  city.date = getDateString(data.dt, data.timezone);

  return city;
}

function getDateString(unixTime, timezone) {
  const date = convertUnixTimeToLocalTime(unixTime, timezone);
  const dateArr = date.replace(",", "").split(" ");
  const dayText = getFullDayName(dateArr[0]);
  const dayNumber = dateArr[1];
  const month = dateArr[2];

  return `${dayText}, ${month} ${dayNumber}`;
}

function convertUnixTimeToLocalTime(unixTime, timezone) {
  const date = new Date((unixTime + timezone) * 1000);

  return date.toUTCString();
}

// Please, don't laugh at me. I wasn't able to find a built in function to do this
// I'm so tired of dealing with dates without a third party library
// AAAAAAAAAAAA
function getFullDayName(shortDay) {
  switch (shortDay) {
    case "Sun":
      return "Sunday";
    case "Mon":
      return "Monday";
    case "Tue":
      return "Tuesday";
    case "Wed":
      return "Wednesday";
    case "Thu":
      return "Thursday";
    case "Fri":
      return "Friday";
    case "Sat":
      return "Saturday";
  }
}

function closeModal(modal) {
  modal.classList.remove("my-modal-open");
}
