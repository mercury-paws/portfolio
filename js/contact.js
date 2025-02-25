'use strict';

axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
axios.defaults.withCredentials = true;

const STORAGE_KEY = 'feedback-form-state';
const form = document.querySelector('.contact-form');
const termsCheckbox = document.getElementById("contact-user-privacy")

function sanitizeInput(input) {
  const dangerousChars = /['"<>&]/g;
  return input.replace(dangerousChars, '');
}

function readFormData(form) {
  const email = form.email.value.trim();
  const comment = form.comment.value.trim();
  const name = form.name.value.trim();
  return {
    email,
    comment,
    name,
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
  form.comment.value = data.comment;
  form.name.value = data.name;

}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.email.value.trim();
  const comment = form.comment.value.trim();
  const name = form.name.value.trim();

  const sanitizedEmail = sanitizeInput(email);
  const sanitizedComment = sanitizeInput(comment);
  const sanitizedName = sanitizeInput(name);

  if (!email || !comment || !name || email === ' ' || name === ' ' || comment === ' ') {
    alert('Please fill in both email and message fields.');
    return;
  }

  if (!sanitizedEmail.includes('@') || !sanitizedEmail.includes('.')) {
    alert('Please enter a valid email address.');
    return;
  }
  
  if (!termsCheckbox.checked) {
    alert('You must accept the terms and conditions before submitting.');
    return;
  }

  const data = {
    email: sanitizedEmail,
    comment: sanitizedComment,
    name: sanitizedName 
  }

  console.log(readFormData(event.currentTarget));

  async function addContact() {
    try {
      const response = await axios.post("/contacts/addContact", data);
    console.log(response.data);
    return true;
    } catch (error) {
      console.error(`Error sending contact request: ${error.response?.data?.message || error.message}`);
      alert("There was an issue with submitting your request. Please try again.");
    }
  }

  const success = await addContact(); 

  if(success){
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  alert("The request was sent succesfully, thank you");
  }
});