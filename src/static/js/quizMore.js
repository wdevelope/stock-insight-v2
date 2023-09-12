// 현재 페이지와 그룹
let currentPage = 1;
let currentGroup = 1;

// DOM 요소 가져오기
const stockSearchInput = document.getElementById('stockSearchInput');

// 검색 입력창 이벤트 설정
stockSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleInput(event);
  }
});

let currentStocks = [];

// input 검색
async function handleInput(event) {
  const query = event.target.value;
  if (query.length < 1) {
    createCards(currentStocks);
    return;
  }
  const stocks = await fetchStocksByQuery(query);
  createCards(stocks);
  stockSearchInput.value = '';
}

// 주식 이름으로 API 호출하여 검색
async function fetchStocksByQuery(query) {
  try {
    const response = await fetch(`/api/stocks/search?query=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch stock search results.');
    }

    const data = await response.json();
    return data.data; // 'data' 키에 해당하는 배열 반환
  } catch (error) {
    console.error('Error during stock search:', error);
  }
}

// 페이지 번호를 이용하여 주식 정보 API 호출
async function fetchStocks(page) {
  try {
    const response = await fetch(`/api/stocks/?page=${page}`);

    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }

    const data = await response.json();
    currentStocks = data.data;
    createCards(currentStocks);
    updateURL(page);
    updatePaginationUI();
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
}

// 🟢 카드 생성 함수
function createCards(stocks) {
  const cardsContainer = document.querySelector('.cards-container');

  if (!cardsContainer) {
    console.error("Error: Can't find the cards container.");
    return;
  }

  cardsContainer.innerHTML = '';

  const cardRow = document.createElement('div');
  cardRow.className = 'row';
  cardsContainer.appendChild(cardRow);

  stocks.forEach((stock, index) => {
    const card = `
                <div class="col-lg-2 col-md-3 col-sm-6 col-xs-12 mb-4">
                    <div class="card" style="height: 300px;">
                      <div class="card-header"><i class="fa-brands fa-square-pinterest me-2"></i>${
                        stock.rprs_mrkt_kor_name
                      }</div>
                      <div class="card-body" style="position: relative;">
                        <div class="quiz-bodyclik" onclick="navigateToStockDetail('${
                          stock.id
                        }')">
                            <h4 class="card-title clickable-title" id="stock-name-title-${index}" >${
                              stock.prdt_abrv_name
                            }</h4>
                          <h4 class="card-subtitle mb-2 text-muted" id="stock-price-${index}">
                            <span class="current-price-text">현재가</span> <br> 
                            <span class="current-price-value">${parseInt(
                              stock.stck_prpr,
                            ).toLocaleString()}원</span>
                        
                            <span class="change-price-value" style="color:${
                              stock.prdy_vrss_sign === '5' ? 'red' : 'green'
                            };"> (${stock.prdy_ctrt}%)</span>
                          </div>
                        </h4>
                      
                        <div class="buttons-container d-flex justify-content-between mt-4" style="position: absolute; bottom: 10px; width: 100%;">
                          <button class="btn btn-outline-success btn-lg custom-btn me-2 " id="up-button-${index}" onclick="submitQuiz('up', ${index})">
                          <i class="fa-solid fa-arrow-trend-up"></i> 
                          </button>
                          <button class="btn btn-outline-danger btn-lg custom-btn" id="down-button-${index}" onclick="submitQuiz('down', ${index})">
                            <i class="fa-solid fa-arrow-trend-down"></i> 
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

    cardRow.innerHTML += card;
  });
}

// 주식 검색 함수
async function searchStock() {
  const query = stockSearchInput.value;
  const stocks = await fetchStocksByQuery(query);
  createCards(stocks);
  stockSearchInput.value = '';
}

// 검색 결과 출력
function renderSearchResults(stocks) {
  createCards(stocks);
}

// 주식 상세 페이지로 이동
function navigateToStockDetail(id) {
  window.location.href = `stocksInfo?id=${id}`;
}

// 🟢 퀴즈 제출 함수
async function submitQuiz(prediction, index) {
  const stock = currentStocks[index];
  const stockId = stock.id;
  const bodyData = {
    upANDdown: prediction,
    stockId: stockId,
  };

  try {
    const response = await fetch('/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit quiz.');
    }

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    alert('퀴즈 제출 중 오류가 발생했습니다.');
  }
}

// 페이지 번호 동적 부여
function updatePaginationUI() {
  const buttons = document
    .getElementById('pagination')
    .querySelectorAll('button:not(:first-child):not(:last-child)');
  const currentPage = getPageFromURL();

  for (let i = 0; i < buttons.length; i++) {
    let pageNum = i + 1 + 5 * (currentGroup - 1);
    buttons[i].innerText = pageNum;
    buttons[i].onclick = function () {
      fetchStocks(pageNum);
    };

    if (pageNum === currentPage) {
      buttons[i].classList.add('active');
    } else {
      buttons[i].classList.remove('active');
    }
  }
}

// 🟠 페이지 네이션 다음페이지
const nextGroup = () => {
  currentGroup++;
  updatePaginationUI();
};

// 🟠 페이지 네이션 이전페이지
const prevGroup = () => {
  if (currentGroup > 1) {
    currentGroup--;
    updatePaginationUI();
  }
};

function updateURL(page) {
  const currentURL = window.location.href.split('?')[0];
  const newURL = `${currentURL}?page=${page}`;
  window.history.pushState({ path: newURL }, '', newURL);
}

function getPageFromURL() {
  const searchParams = new URLSearchParams(window.location.search);
  return parseInt(searchParams.get('page')) || 1;
}

window.onload = function () {
  const currentPage = getPageFromURL();
  fetchStocks(currentPage);
};
