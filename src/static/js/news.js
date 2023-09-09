document.addEventListener('DOMContentLoaded', () => {
  fetchNews();
});

async function fetchNews() {
  try {
    const response = await fetch(
      `/search/news?query=${encodeURIComponent('주식')}`,
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      displayNews(data.items);
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
            <h5 class="card-title"><a href="${
              article.link
            }" target="_blank" style="color: navy;">${article.title}</a>
            </h5>
            <p class="card-text">${article.description}</p>
          </div>
        </div>
      </div>`;

    newsList.innerHTML += newsItem;
  });
}
