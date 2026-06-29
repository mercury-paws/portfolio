'use strict';

// 👉 Same JSON source
const BLOG_URL =
  'https://raw.githubusercontent.com/mercury-paws/portfolio/main/data/blogs.json';

async function fetchArticle(id) {
  try {
    const response = await fetch(BLOG_URL);
    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();

    // 🔥 Find article by ID
    return data.items.find(item => item._id === id);
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function renderArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');

  if (!blogId) {
    console.error('No article ID provided.');
    return;
  }

  const article = await fetchArticle(blogId);

  if (article) {
    document.getElementById('article-title').textContent = DOMPurify.sanitize(
      article.title
    );

    document.getElementById('article-text').innerHTML = DOMPurify.sanitize(
      article.text
    );

    document.getElementById('article-date').textContent = DOMPurify.sanitize(
      article.date
    );
  }
}

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
  window.location.href = 'blog.html';
});

// Language switch (unchanged)
document.querySelectorAll('.lang').forEach(langLink => {
  langLink.addEventListener('click', e => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    const targetHref = langLink.getAttribute('href');

    if (blogId) {
      window.location.href = `${targetHref}?id=${blogId}`;
    } else {
      window.location.href = targetHref;
    }
  });
});

window.onload = renderArticle;
