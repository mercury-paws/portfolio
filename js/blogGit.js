'use strict';

const blogList = document.querySelector('.blog-list');

// 👉 Replace with your GitHub raw URL
const BLOG_URL =
  'https://raw.githubusercontent.com/mercury-paws/portfolio/main/data/blogs.json';

async function fetchBlog() {
  try {
    const response = await fetch(BLOG_URL);
    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return [];
  }
}

async function renderBlog() {
  const blog = await fetchBlog();
  if (!blog.length) return;

  blogList.innerHTML = blog
    .map(({ title, header, date, _id }) => {
      return `
      <li class="blog-item">
        <h3 class="blog-item-header">${DOMPurify.sanitize(title)}</h3>
        <p class="blog-item-text">${DOMPurify.sanitize(header)}</p>
        <div class="date-btn-block">
          <p>${DOMPurify.sanitize(date)}</p>
          <button type="button" class="blog-item-btn" data-id="${_id}">
            More
          </button>
        </div>
      </li>
    `;
    })
    .join('');

  document.querySelectorAll('.blog-item-btn').forEach(button => {
    button.addEventListener('click', event => {
      const blogId = event.target.getAttribute('data-id');

      if (/^[a-zA-Z0-9_-]+$/.test(blogId)) {
        window.location.href = `blogArticle.html?id=${blogId}`;
      }
    });
  });
}

window.onload = renderBlog;
