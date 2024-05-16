"use strict";

const buttonBurger = document.querySelector(".burger-wrapper");
const backdrop = document.querySelector(".backdrop");
const buttonClose = document.querySelector(".close-mobile-menu-bttn");
const portfolio = document.querySelector(".portfolio");

buttonBurger.addEventListener("click", () => {
  backdrop.classList.toggle("is-open");
});

buttonClose.addEventListener("click", () => {
  backdrop.classList.toggle("is-open");
});

portfolio.addEventListener("click", () => {
  backdrop.classList.toggle("is-open");
});
