let currentPage = 1;
const PAGE_SIZE = 14;

async function fetchNews(pageNumber = 1) {
  const API_KEY = 'b66e7dd9acba4b4ba841ef0e6634a6f6'; // NewsAPI의 API 키

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 1);

  const START_DATE = startDate.toISOString().slice(0, 10);
  const END_DATE = endDate.toISOString().slice(0, 10);

  try {
    const response = await $.ajax({
      url: `https://newsapi.org/v2/everything?q=stock OR stocks OR equity&from=${START_DATE}&to=${END_DATE}&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${pageNumber}&apiKey=${API_KEY}`,
      method: 'GET',
    });

    if (response.status === 'ok' && response.articles.length > 0) {
      displayNews(response.articles);
    } else {
      console.log('no news');
    }
  } catch (error) {
    console.error(`뉴스를 가져오는 중 에러 발생: ${error}`);
  }
}

function displayNews(articles) {
  const mainArticle = articles[0];
  $('.col-lg-8 img').attr('src', mainArticle.urlToImage);
  $('.col-lg-8 h2').html(
    `<a href="${mainArticle.url}" target="_blank">${mainArticle.title}</a>`,
  );
  $('.col-lg-8 p').text(mainArticle.description);

  $('.col-lg-8 img').wrap(`<a href="${mainArticle.url}" target="_blank"></a>`);

  const mostViewedNews = $('.col-lg-4 ul');
  mostViewedNews.empty(); // 기존 뉴스 지우기
  articles.slice(1, 7).forEach((article) => {
    mostViewedNews.append(`
                            <li class="mb-3">
                                <a href="${article.url}" target="_blank"><img src="${article.urlToImage}" alt="${article.title}" class="img-fluid" style="width: 120px"></a>
                                <a href="${article.url}" target="_blank">${article.title}</a>
                            </li>
                          `);
  });

  // 최신 주식 뉴스 섹션에 뉴스 추가
  const stockNewsSection = $('#stock-news-section');
  stockNewsSection.empty(); // 기존 뉴스 지우기
  articles.slice(7, 10).forEach((article) => {
    stockNewsSection.append(`
                                <div class="col-md-4 mb-4">
                                    <a href="${article.url}" target="_blank"><img src="${article.urlToImage}" alt="${article.title}" class="img-fluid"></a>
                                    <h4 class="mt-2"><a href="${article.url}" target="_blank">${article.title}</a></h4>
                                    <p>${article.description}</p>
                                </div>
                            `);
  });
}

// 페이지네이션
function updatePaginationButtons() {
  // 현재 페이지 그룹 확인 (예: 1-5, 6-10)
  const group = Math.ceil(currentPage / 5);

  // 페이지 버튼에 해당 페이지 번호 할당
  for (let i = 0; i < 5; i++) {
    const pageNumber = (group - 1) * 5 + i + 1;
    $(`.page-button[data-page="${i + 1}"]`).text(pageNumber);
  }

  // 현재 페이지 강조
  $('.page-button').removeClass('btn-primary').addClass('btn-outline-primary');
  $(`.page-button:contains("${currentPage}")`)
    .removeClass('btn-outline-primary')
    .addClass('btn-primary');
}

$('.prev-page').on('click', function () {
  if (currentPage > 1) {
    currentPage -= 5; // 이전 페이지 그룹으로 이동
    if (currentPage < 1) currentPage = 1; // 페이지를 음수로 설정하지 않기 위해
    fetchNews(currentPage);
    updatePaginationButtons();
    $('.current-page').text(currentPage);
  }
});

$('.next-page').on('click', function () {
  currentPage += 5; // 다음 페이지 그룹으로 이동
  fetchNews(currentPage);
  updatePaginationButtons();
  $('.current-page').text(currentPage);
});

$('.page-button').on('click', function () {
  currentPage = parseInt($(this).text());
  fetchNews(currentPage);
  updatePaginationButtons();
  $('.current-page').text(currentPage);
});

// 페이지 로드 시 뉴스 데이터 가져오기
$(document).ready(function () {
  fetchNews();
  updatePaginationButtons();
});
