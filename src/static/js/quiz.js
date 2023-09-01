// 현재 보고 있는 주식 정보 저장하기 위한 변수
let currentStock = null;

// DOM 요소 가져오기
const stockNameTitle = document.getElementById('stock-name-title');
const stockPrice = document.getElementById('stock-price');
const riseButton = document.getElementById('rise-button');
const fallButton = document.getElementById('fall-button');
const TOTAL_PAGES = 87;

//페이지 로드시 함수실행
document.addEventListener('DOMContentLoaded', () => getRandomStock());

// 페이지 로드시 제출 날짜 체크
const lastSubmittedDate = localStorage.getItem('lastSubmittedDate');
if (lastSubmittedDate === new Date().toLocaleDateString()) {
  riseButton.disabled = true;
  fallButton.disabled = true;
}

function getRandomPage() {
  return Math.floor(Math.random() * TOTAL_PAGES) + 1;
}

// 주식 종목 가져오기
async function getRandomStock() {
  const randomPage = getRandomPage();
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/?page=${randomPage}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }
    const data = await response.json();
    console.log(data);
    const stocks = data.data;
    return stocks[Math.floor(Math.random() * stocks.length)];
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
}

// 주식 정보 업데이트
async function updateStockInfo() {
  const stock = await getRandomStock();
  stockNameTitle.textContent = `${stock.prdt_abrv_name} 종목이 오를지, 내릴지 맞혀보세요!`;
  stockPrice.textContent = `${stock.prdt_abrv_name} 주식의 현재 가격: ${Number(
    stock.stck_prpr,
  ).toLocaleString()}원`;
}

// 퀴즈 제출 함수
async function submitQuiz(prediction) {
  const stockName = stockNameTitle.textContent.split(' ')[0];
  const bodyData = {
    upANDdown: prediction,
    stockName: stockName,
  };

  try {
    const response = await fetch('http://localhost:3000/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token, // token 변수 값이 어디서 오는지 확인 필요
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit quiz.');
    }
    localStorage.setItem('lastSubmittedDate', new Date().toLocaleDateString());
    riseButton.disabled = true;
    fallButton.disabled = true;

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    alert('퀴즈 제출 중 오류가 발생했습니다.');
  }
}

// 버튼 클릭 이벤트 수정
riseButton.addEventListener('click', () => {
  submitQuiz('up');
});

fallButton.addEventListener('click', () => {
  submitQuiz('down');
});

// 초기 로딩시 주식 정보 갱신
updateStockInfo();
