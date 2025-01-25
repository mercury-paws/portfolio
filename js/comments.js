const receivedComment = document.querySelector(".received-comment")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;



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
  console.log('Comments:', comments)
  console.log("com", comments[`${index}`])
  const { name, comment } = comments[index];

    const markup = `
    <p class="client-text-review">${comment}</p>
    <p class="client-name">${name}</p>
  `;

    receivedComment.innerHTML = markup;

    prev.disabled = index === 0;

    // Disable the "Next" button if at the last comment
    next.disabled = index === comments.length - 1;
  }
  
  window.onload = renderComments;
  
  let index = 0;
  next.addEventListener('click', () => {
    index++;
   renderComments();
  })

  prev.addEventListener('click', () => {
    index--;
   renderComments();
   
  })

  // if(index === comments.length)

  

  window.onload = renderComments;

