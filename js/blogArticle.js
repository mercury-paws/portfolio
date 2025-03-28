'use strict'

axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
axios.defaults.withCredentials = true;

async function fetchArticle(id) {
    try {
      const response = await axios.get(`/blog/${id}`);
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.response?.data?.message || error.message}`);
    }  
  }

  async function renderArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");

    if (!blogId) {
        console.error("No article ID provided.");
        return;
    }

    const article = await fetchArticle(blogId);
    if (article) {
        document.getElementById("article-title").textContent = DOMPurify.sanitize(article.title);
        document.getElementById("article-text").innerHTML = DOMPurify.sanitize(article.text);
        document.getElementById("article-date").textContent = DOMPurify.sanitize(article.date);
    }
}

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "blog.html"; // Replace with your actual blog list page
});

window.onload = renderArticle;