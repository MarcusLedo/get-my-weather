"use strict";

//FORM SEARCH DOM
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const searchForm = document.querySelector(".search-form");

//FORM MODAL (API) DOM
const modalForm = document.querySelector(".modal-form");
const btnSubmitAPI = document.querySelector(".btn-submit-api");
const APIInputField = document.querySelector(".api-input-field");
const invalidAPIKey = document.querySelector(".invalid-api-key");

//MODAL DOM
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".btn-close-model");

let APIkey = "";

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("submit");

  if (isThereAnAPIKey(APIkey)) {
    // CONTINUES EXECUTION NORMALLY
  } else {
    // RENDER POP UP ASKING FOR AN API KEY
    modal.classList.add("my-modal-open");
  }
});

modalForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log(await isAPIKeyValid(APIInputField.value));
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

function isThereAnAPIKey(key) {
  if (key) return true;
  else return false;
}

async function isAPIKeyValid(key) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${key}`;
  const res = await fetch(url);
  console.log(res);

  if (res.statusText === "Unauthorized") return false;
  else return true;
}

function closeModal(modal) {
  modal.classList.remove("my-modal-open");
}
