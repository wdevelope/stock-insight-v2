let currentPage = 1;
let currentGroup = 1;

function updateStockCount(total) {
  const stockCountElement = document.getElementById('stockCount');
  stockCountElement.textContent = total;
}

// stock price
function navigateToStockDetail(id) {
  window.location.href = `stocksInfo.html?id=${id}`;
}

// stock 렌더링
const fetchStocks = async (page) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/?page=${page}`,
    );
    const data = await response.json();
    const stocks = data.data;

    const tableBody = document.getElementById('stockTable');
    tableBody.innerHTML = ''; // clear current table data

    stocks.forEach((stock) => {
      const row = tableBody.insertRow();
      row.insertCell().textContent = stock.id;
      row.insertCell().textContent = stock.prdt_abrv_name;
      row.insertCell().textContent = stock.rprs_mrkt_kor_name;
      // 주식 가격은 천의 자리마다 쉼표로 구분하여 표시
      const formattedPrice = Number(stock.stck_prpr).toLocaleString();
      row.insertCell().textContent = formattedPrice;

      updateStockCount(data.meta.total);
      // 클릭 이벤트
      row.addEventListener('click', () => navigateToStockDetail(stock.id));
    });

    currentPage = page;
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
};

// 페이지 네이션 다음페이지
const nextGroup = () => {
  currentGroup++;
  for (let i = 0; i < 5; i++) {
    document.getElementById('pagination').children[i + 1].innerText =
      i + 1 + 5 * (currentGroup - 1);
  }
};

// 페이지 네이션 이전페이지
const prevGroup = () => {
  if (currentGroup > 1) {
    currentGroup--;
    for (let i = 0; i < 5; i++) {
      document.getElementById('pagination').children[i + 1].innerText =
        i + 1 + 5 * (currentGroup - 1);
    }
  }
};

// 초기 데이터 로드
fetchStocks(1);
