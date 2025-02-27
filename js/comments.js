"use strict";

const receivedComment = document.querySelector(".received-comment")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")

axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
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
  const { name, comment } = comments[index];

  const sanitizedComment = DOMPurify.sanitize(comment);
  const sanitizedName = DOMPurify.sanitize(name);

    const markup = `
    <p class="client-text-review">${sanitizedComment}</p>
    <p class="client-name">${sanitizedName}</p>
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

