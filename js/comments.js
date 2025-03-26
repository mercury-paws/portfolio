"use strict";

const receivedComment = document.querySelector(".received-comment")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")
const localComments = [
  {
    name: "Sebastian",
    comment:
      "Working with you was an absolute pleasure! The process was smooth and easy. Thank you for teamwork and for building great page!",
  },
  {
    name: "Юлія",
    comment:
      "Дуже добре попрацювали разом над проектом. Завжди допомагала колегам, якщо виникали якісь питання, роботу робила вчасно. Дякую!",
  },
  {
    name: "Natalia",
    comment:
      "Working with you felt like having a deep conversation with someone who understands human and the need for education. Thanks a lot!",
  },
  {
    name: "Helen",
    comment:
      "I couldn't be happier with the result! Your expertise and innovative approach made the entire experience smooth and rewarding.",
  },
];

axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
axios.defaults.withCredentials = true;


let index = 0;

async function fetchComments() {
  try {
    const response = await axios.get("/comments");
	return response.data.data.data;
  } catch (error) {
    console.warn("Server request failed. Using local comments.json instead.");
    // return localComments;
  }  
}

async function renderComments() {
  let comments = await fetchComments();

  let markup;

  if (comments) {
    const { name, comment } = comments[index];

  const sanitizedComment = DOMPurify.sanitize(comment);
  const sanitizedName = DOMPurify.sanitize(name);

  markup = `
    <p class="client-text-review">${sanitizedComment}</p>
    <p class="client-name">${sanitizedName}</p>
  `;
  } else {
    const { name, comment } = localComments[index];
    const sanitizedComment = DOMPurify.sanitize(comment);
  const sanitizedName = DOMPurify.sanitize(name);
    markup = `
    <p class="client-text-review">${sanitizedComment}</p>
    <p class="client-name">${sanitizedName}</p>
  `;
  }
  

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

