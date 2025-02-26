'use strict'

const blogList = document.querySelector('.blog-list');
axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
axios.defaults.withCredentials = true;

async function fetchBlog() {
    try {
      const response = await axios.get("/blog");
      console.log(response.data.data.data)
      return response.data.data.data;
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.response?.data?.message || error.message}`);
    }  
  }

  async function renderBlog() {
    let blog = await fetchBlog();
    blogList.innerHTML = blog
        .map(
            ({  title, 
                header, 
                date, 
                _id
            }) => {
                return `<li class="blog-item">
              <h3 class="blog-item-header">${DOMPurify.sanitize(title)}</h3>
              <p class="blog-item-text">${DOMPurify.sanitize(header)}</p>
              <div class="date-btn-block">
                <p>${DOMPurify.sanitize(date)}</p>
                <button type="button" class="blog-item-btn" data-id="${DOMPurify.sanitize(_id)}">More</button>
              </div>
            </li>`;
            }
          )
          .join('');

          document.querySelectorAll(".blog-item-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
              const blogId = event.target.getAttribute("data-id");
              if (/^[a-zA-Z0-9_-]+$/.test(blogId)) { 
            window.location.href = `blogArticle.html?id=${blogId}`;
        }
            });
        });
    }
    
    window.onload = renderBlog;