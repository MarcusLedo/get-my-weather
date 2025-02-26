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

// WEATHER BANNER DOM
const weatherBanner = document.querySelector(".weather-data-banner");
const weatherDataSection = document.querySelector(".weather-data");

//LIGHT AND DARK MODE BUTTON DOM (DARK MODE STUFF)
const btnToggleLightDark = document.querySelector(".toggle-light-dark");
const iconPath = document.querySelector(".icon-path-light-dark");

// BACK-END VARIABLES
let APIkey = "";
let searchTerm = "";
let weatherData = ""; // Data from the API
let city = {}; // City object
let isDarkMode = false;

// EVENT LISTENERS -----------------------------------

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (isThereAnAPIKey(APIkey)) {
    // CONTINUES EXECUTION NORMALLY

    //Getting the search term (city name)
    searchTerm = searchBar.value;

    //Getting the data from the API
    weatherData = await getWeatherData(searchTerm, APIkey);

    if (weatherData.cod === "404") {
      // CITY NOT FOUND (RENDER ALERT)
      createAlert("City not Found!");
      console.log("CITY NOT FOUND");
    } else {
      // Building an object with the data
      city = constructCityObject(weatherData);
      //Update the page with the city info
      updateWeatherSection(city);
    }
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

btnToggleLightDark.addEventListener("click", function (e) {
  changeIconToDark(isDarkMode, iconPath);
  toggleLightAndDarkMode(isDarkMode);
  isDarkMode = isDarkMode ? false : true;
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

  // Ex.: "Monday, Feb 24"
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

function updateWeatherSection(city) {
  const cityName = getCityNameElem();
  const cityDate = getCityDateElem();
  const windSpeed = getWindSpeedElem();
  const cityHumidity = getHumidityElem();
  const weatherIcon = getWeatherIconElem();
  const cityTemperature = getTemperatureElem();

  cityName.innerText = city.name;
  cityDate.innerText = city.date;
  windSpeed.innerText = city["wind"].toString();
  cityHumidity.innerText = city["humidity"].toString();
  cityTemperature.innerText = city["temperature"].toString() + "℃";
  weatherIcon.setAttribute(
    "src",
    `/images/weather_icons/${city.weatherIcon}.svg`
  );
}

function getCityNameElem() {
  return document.querySelector(".city-name-text");
}

function getCityDateElem() {
  return document.querySelector(".date-text");
}

function getWindSpeedElem() {
  return document.querySelector(".wind-speed");
}

function getHumidityElem() {
  return document.querySelector(".humidity");
}

function getWeatherIconElem() {
  return document.querySelector(".weather-icon");
}

function getTemperatureElem() {
  return document.querySelector(".temperature-text");
}

function createAlert(message) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  const btn = document.createElement("button");

  div.classList.add(
    "alert",
    "alert-danger",
    "alert-dismissible",
    "fade",
    "show"
  );

  div.setAttribute("role", "alert");

  p.innerText = message;
  btn.setAttribute("type", "button");
  btn.classList.add("btn-close");
  btn.setAttribute("data-bs-dismiss", "alert");

  div.append(p);
  div.append(btn);
  document.querySelector("main").prepend(div);
}

function changeIconToDark(isDarkMode, iconPathField) {
  if (isDarkMode) {
    iconPathField.setAttribute(
      "d",
      "M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
    );
  } else {
    iconPathField.setAttribute(
      "d",
      "M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"
    );
  }
}

function toggleLightAndDarkMode(isDarkMode) {
  const navbar = document.querySelector(".navbar");
  const body = document.querySelector("body");
  const carouselText = document.querySelector(".slider-paragraph");
  const cardsSectionText = document.querySelector(".cards-sec-label");
  const cards = document.querySelectorAll(".card");
  const faqLabel = document.querySelector(".faq-label");
  const accordion = document.querySelector(".accordion");
  const accordionButtons = document.querySelectorAll(".accordion-button");
  const footer = document.querySelector("footer");

  navbar.classList.toggle("bg-dark");
  body.classList.toggle("bg-dark");
  carouselText.classList.toggle("text-white");
  cardsSectionText.classList.toggle("text-white");
  faqLabel.classList.toggle("text-white");
  accordion.classList.toggle("accordion-dark");
  footer.classList.toggle("dark-footer");

  for (const card of cards) {
    card.classList.toggle("text-bg-dark");
  }

  for (const btn of accordionButtons) {
    btn.classList.toggle("accordion-button-dark");
  }

  if (isDarkMode) {
    navbar.setAttribute("data-bs-theme", "light");
  } else {
    navbar.setAttribute("data-bs-theme", "dark");
  }
}

function closeModal(modal) {
  modal.classList.remove("my-modal-open");
}
