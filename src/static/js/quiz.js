// 현재 보고 있는 주식 정보 저장하기 위한 변수
let currentStocks = null;

// DOM 요소 가져오기
const stockNameTitle = document.getElementById('stock-name-title');
const stockPrice = document.getElementById('stock-price');
const riseButton = document.getElementById('rise-button');
const fallButton = document.getElementById('fall-button');
const TOTAL_PAGES = 87;

document.addEventListener('DOMContentLoaded', () => {
  const savedDate = localStorage.getItem('quizDate');
  const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  if (savedDate && savedDate === todayDate) {
    const savedStocks = JSON.parse(localStorage.getItem('quizStocks'));
    if (savedStocks && savedStocks.length > 0) {
      currentStocks = savedStocks;
      createCards(savedStocks);
    } else {
      getRandomStock();
    }
  } else {
    getRandomStock();
  }
});

function getPageByDate() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const dayOfYear = Math.floor((today - startOfYear) / millisecondsPerDay) + 1;

  return (dayOfYear % TOTAL_PAGES) + 1;
}

// 🟢 주식 종목 가져오기
async function getRandomStock() {
  const page = getPageByDate();

  try {
    const response = await fetch(`/api/stocks/?page=${page}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }

    const data = await response.json();
    const stocks = data.data;

    if (stocks) {
      currentStocks = stocks;
      createCards(stocks);

      const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
      localStorage.setItem('quizDate', todayDate);
      localStorage.setItem('quizStocks', JSON.stringify(stocks));
    } else {
      console.error('주식 정보를 가져오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
}

// 🟢 카드 생성 함수
function createCards(stocks) {
  const cardsContainer = document.querySelector('.cards-container');
  cardsContainer.innerHTML = '';

  const cardRow = document.createElement('div');
  cardRow.className = 'row';
  cardsContainer.appendChild(cardRow);

  stocks.forEach((stock, index) => {
    const card = `
                  <div class="col-md-3 mb-4">
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

function navigateToStockDetail(id) {
  window.location.href = `stocksInfo.html?id=${id}`;
}
