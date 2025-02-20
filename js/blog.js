'use strict'

const blogList = document.querySelector('.blog-list');
axios.defaults.baseURL = "http://localhost:3000";
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
              <h3 class="blog-item-header">${title}</h3>
              <p class="blog-item-text">${header}</p>
              <div class="date-btn-block">
                <p>${date}</p>
                <button type="button" class="blog-item-btn" data-id="${_id}">More</button>
              </div>
            </li>`;
            }
          )
          .join('');

          document.querySelectorAll(".blog-item-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const blogId = event.target.getAttribute("data-id");
                    window.location.href = `blogArticle.html?id=${blogId}`
            });
        });
    }
    
    window.onload = renderBlog;