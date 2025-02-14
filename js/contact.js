'use strict';

const STORAGE_KEY = 'feedback-form-state';
const form = document.querySelector('.contact-form');

function readFormData(form) {
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const userName = form.userName.value.trim();
  return {
    email,
    message,
    userName,
  };
}

form.addEventListener('input', event => {
  const data = readFormData(event.currentTarget);
  const jsonData = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, jsonData);
});

const inputData = localStorage.getItem(STORAGE_KEY);
if (inputData) {
  const data = JSON.parse(inputData);
  form.email.value = data.email;
  form.message.value = data.message;
  form.userName.value = data.userName;

}

form.addEventListener('submit', event => {
  event.preventDefault();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const userName = form.userName.value.trim();

  if (!email || !message || !userName || email === ' ' || userName === ' ' || message === ' ') {
    alert('Please fill in both email and message fields.');
    return;
  }
  console.log(readFormData(event.currentTarget));

  localStorage.removeItem(STORAGE_KEY);
  form.reset();
});