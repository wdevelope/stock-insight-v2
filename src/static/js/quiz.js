// 현재 보고 있는 주식 정보 저장하기 위한 변수
let currentStocks = null;

// DOM 요소 가져오기
const stockNameTitle = document.getElementById('stock-name-title');
const stockPrice = document.getElementById('stock-price');
const riseButton = document.getElementById('rise-button');
const fallButton = document.getElementById('fall-button');
const TOTAL_PAGES = 87;

document.addEventListener('DOMContentLoaded', () => getRandomStock());

function getRandomPage() {
  return Math.floor(Math.random() * TOTAL_PAGES) + 1;
}

// 🟢 주식 종목 가져오기
async function getRandomStock() {
  const randomPage = getRandomPage();
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/?page=${randomPage}`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }

    const data = await response.json();
    const stocks = data.data;

    console.log(data);

    if (stocks) {
      currentStocks = stocks;
      createCards(stocks);
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
                    <div class="card" style="height: 400px;">
                      <div class="card-header">${stock.prdt_abrv_name}</div>
                      <div class="card-body" style="position: relative;">
                        <h2 class="card-title" id="stock-name-title-${index}">${stock.prdt_abrv_name}</h2>
                        <h4 class="card-subtitle mb-2 text-muted" id="stock-price-${index}">현재가 : ${stock.stck_prpr}원</h4>
                        <p class="card-text lead">${stock.rprs_mrkt_kor_name}</p>
                        <div class="buttons-container d-flex justify-content-between mt-4" style="position: absolute; bottom: 10px; width: 100%;">
                          <button class="btn btn-outline-success btn-lg custom-btn me-1" id="up-button-${index}" onclick="submitQuiz('up', ${index})">
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
    const response = await fetch('http://localhost:3000/quiz/submit', {
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
