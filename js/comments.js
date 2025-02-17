const receivedComment = document.querySelector(".received-comment")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;


let index = 0;

async function fetchComments() {
  try {
    const response = await axios.get("/comments");
	return response.data.data.data;
  } catch (error) {
    throw new Error(`Error fetching comments: ${error.response?.data?.message || error.message}`);
  }  
}

async function renderComments() {
  let comments = await fetchComments();
console.log(comments)
  const { name, comment } = comments[index];

    const markup = `
    <p class="client-text-review">${comment}</p>
    <p class="client-name">${name}</p>
  `;

    receivedComment.innerHTML = markup;
    prev.disabled = index === 0;
    next.disabled = index === comments.length - 1;
  }
  
  window.onload = renderComments;
  
  next.addEventListener('click', () => {
    index++;
   renderComments();
  })

  prev.addEventListener('click', () => {
    index--;
   renderComments();
   
  })

  window.onload = renderComments;

// send comment

const sendOrder = document.querySelector(".form-button");
const backdropUser = document.querySelector(".backdrop-user");
const termsCheckbox = document.getElementById("user-privacy")

function sanitizeInput(input) {
  const dangerousChars = /['"<>&]/g;
  return input.replace(dangerousChars, '');
}

const form = document.querySelector(".form")
const STORAGE_KEY = 'feedback-form-state';

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
    alert('Please fill in email, name and message fields.');
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

  async function addComment() {
    try {
      const response = await axios.post("/comments/addComment", data);
    console.log(response.data);
    return true;
    } catch (error) {
      console.error(`Error adding comment: ${error.response?.data?.message || error.message}`);
      alert("There was an issue with submitting your comment. Please try again.");
    }
  }

  const success = await addComment(); 

  if(success){
  
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  backdropUser.classList.toggle("is-open");
  alert("The comment was added succesfully, thank you");
  }
  
})