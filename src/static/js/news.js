let currentPage = 1;
const PAGE_SIZE = 14;
const MAX_PAGES_PER_GROUP = 5;
let totalNews = 0;

document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
});

async function fetchNews(pageNumber = 1) {
  currentPage = pageNumber;
  try {
    const response = await fetch(
      `/search/news?query=${encodeURIComponent(
        '주식',
      )}&page=${pageNumber}&pageSize=${PAGE_SIZE}`,
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      displayNews(data.items);
      updatePaginationButtons(data.total);
    } else {
      console.log('no news');
    }
  } catch (error) {
    console.error(`뉴스를 가져오는 중 에러 발생: ${error}`);
  }
}

function displayNews(articles) {
  const newsList = document.querySelector('.news-list');
  newsList.innerHTML = ''; // Clear existing news

  articles.forEach((article, index) => {
    let newsItem = `
      <div class="col-lg-${index === 0 ? '12' : '4'} mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title"><a href="${article.link}" target="_blank">${
              article.title
            }</a></h5>
            <p class="card-text">${article.description}</p>
          </div>
        </div>
      </div>`;

    newsList.innerHTML += newsItem;
  });
}

function updatePaginationButtons(total) {
  totalNews = total || totalNews;
  const totalPages = Math.ceil(totalNews / PAGE_SIZE);
  const totalGroups = Math.ceil(totalPages / MAX_PAGES_PER_GROUP);
  const currentGroup = Math.ceil(currentPage / MAX_PAGES_PER_GROUP);

  for (let i = 1; i <= MAX_PAGES_PER_GROUP; i++) {
    const pageNumber = (currentGroup - 1) * MAX_PAGES_PER_GROUP + i;
    const button = document.querySelector(`button[onclick="fetchNews(${i})"]`);

    if (pageNumber <= totalPages) {
      button.textContent = pageNumber;
      button.style.display = 'inline-block';
    } else {
      button.style.display = 'none';
    }

    button.classList.remove('btn-primary', 'btn-outline-primary');
    if (pageNumber === currentPage) {
      button.classList.add('btn-primary');
    } else {
      button.classList.add('btn-outline-primary');
    }
  }

  const prevButton = document.querySelector('button[onclick="prevGroup()"]');
  const nextButton = document.querySelector('button[onclick="nextGroup()"]');

  prevButton.disabled = currentGroup <= 1;
  nextButton.disabled = currentGroup >= totalGroups;
}

function fetchAndRenderPosts(pageNumber) {
  currentPage = pageNumber;
  fetchNews(pageNumber);
}

function prevGroup() {
  if (currentPage > 1) {
    currentPage -= MAX_PAGES_PER_GROUP;
    fetchAndRenderPosts(currentPage);
  }
}

function nextGroup() {
  const totalGroups = Math.ceil(totalNews / PAGE_SIZE / MAX_PAGES_PER_GROUP);

  if (currentPage / MAX_PAGES_PER_GROUP < totalGroups) {
    currentPage += MAX_PAGES_PER_GROUP;
    fetchAndRenderPosts(currentPage);
  }
}
