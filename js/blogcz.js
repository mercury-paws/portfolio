'use strict'

const blogList = document.querySelector('.blog-list');
axios.defaults.baseURL = "https://profile-server-qbyd.onrender.com";
axios.defaults.withCredentials = true;

async function fetchBlog() {
    try {
      const response = await axios.get("/blogcz");
      // console.log(response.data.data.data.data)
      console.log(response.data.data.items)
      return response.data.data.items;
    } catch (error) {
      throw new Error(`Error fetching blog: ${error.response?.data?.message || error.message}`);
    }  
  }

  async function renderBlog() {
    let blog = await fetchBlog();
    if (!blog || blog.length === 0) return;
    console.log(blog)

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
            window.location.href = `blogArticlecz.html?id=${blogId}`;
        }
            });
        });
    }
    
    window.onload = renderBlog;
