"use strict";

//FORM SEARCH DOM
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const searchForm = document.querySelector(".search-form");

//FORM MODAL (API) DOM
const modalForm = document.querySelector(".modal-form");
const btnSubmitAPI = document.querySelector(".btn-submit-api");
const APIInputField = document.querySelector(".api-input-field");

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

modalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  APIkey = APIInputField.value;
  closeModal(modal);
});

closeModalBtn.addEventListener("click", function (e) {
  closeModal(modal);
});

function isThereAnAPIKey(key) {
  if (key) return true;
  else return false;
}

function closeModal(modal) {
  modal.classList.remove("my-modal-open");
}
