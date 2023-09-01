//페이지 로드시 함수실행
document.addEventListener('DOMContentLoaded', () => getRandomStock());

// DOM 요소 가져오기
const stockNameTitle = document.getElementById('stock-name-title');
const stockPrice = document.getElementById('stock-price');
const riseButton = document.getElementById('rise-button');
const fallButton = document.getElementById('fall-button');
const TOTAL_PAGES = 87;

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

// 버튼 클릭 이벤트
riseButton.addEventListener('click', () => {
  alert('올라간다를 선택하셨습니다. 결과를 기다려주세요!');
});

fallButton.addEventListener('click', () => {
  alert('내려간다를 선택하셨습니다. 결과를 기다려주세요!');
});

// 초기 로딩시 주식 정보 갱신
updateStockInfo();
