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

//////// order form

const backdropUser = document.querySelector(".backdrop-user");
const isOpen = document.querySelector(".is-open");
const closeIcon = document.querySelector(".close-icon");
const orderService = document.querySelector(".button-style");
const sendOrder = document.querySelector(".form-button");

orderService.addEventListener("click", () => {
  backdropUser.classList.toggle("is-open");
});

sendOrder.addEventListener("click", () => {
  backdropUser.classList.toggle("is-open");
});

closeIcon.addEventListener("click", () => {
  backdropUser.classList.toggle("is-open");
});