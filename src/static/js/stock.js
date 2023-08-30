// 현재 페이지와 그룹
let currentPage = 1;
let currentGroup = 1;

// DOM 요소들
const stockSearchInput = document.getElementById('stockSearchInput');
const autocompleteContainer =
  document.getElementById('autocompleteContainer') ||
  createAutocompleteContainer();
const stockCountElement = document.getElementById('stockCount');
const tableBody = document.getElementById('stockTable');

// 이벤트 핸들러
stockSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchStock();
  }
});

stockSearchInput.addEventListener('input', debounce(handleInput, 300));

// 이벤트 핸들러
async function handleInput(event) {
  const query = event.target.value;
  if (query.length < 3) {
    autocompleteContainer.innerHTML = '';
    return;
  }
  const stocks = await fetchStocksByQuery(query);
  renderAutocompleteResults(stocks);
}

// 함수들
function createAutocompleteContainer() {
  const container = document.createElement('div');
  container.id = 'autocompleteContainer';
  document.body.appendChild(container);
  return container;
}
// 주식 이름으로 검색하는 API 호출
async function fetchStocksByQuery(query) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/search?query=${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stock search results.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during stock search:', error);
  }
}

// 페이지 번호로 주식 정보를 가져오는 API 호출
async function fetchStocks(page) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/?page=${page}`,
    );
    const data = await response.json();
    renderStocks(data.data);
    updateStockCount(data.meta.total);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
}

// 자동 완성 결과 렌더링
function renderAutocompleteResults(stocks) {
  autocompleteContainer.innerHTML = '';
  stocks.forEach((stock) => {
    const item = document.createElement('div');
    item.textContent = stock.prdt_abrv_name;
    item.addEventListener('click', () => {
      stockSearchInput.value = stock.prdt_abrv_name;
      navigateToStockDetail(stock.id);
      autocompleteContainer.innerHTML = '';
    });
    autocompleteContainer.appendChild(item);
  });
}

// 주식 정보 테이블 렌더링
function renderStocks(stocks) {
  tableBody.innerHTML = '';
  stocks.forEach((stock) => {
    const row = tableBody.insertRow();
    addCellsToRow(row, [
      stock.id,
      stock.prdt_abrv_name,
      stock.rprs_mrkt_kor_name,
      Number(stock.stck_prpr).toLocaleString(),
    ]);
    row.addEventListener('click', () => navigateToStockDetail(stock.id));
  });
}

function addCellsToRow(row, cellValues) {
  cellValues.forEach((value) => (row.insertCell().textContent = value));
}

async function searchStock() {
  const query = stockSearchInput.value;
  const stocks = await fetchStocksByQuery(query);
  renderSearchResults(stocks);
}

function renderSearchResults(stocks) {
  renderStocks(stocks); // This can use the same function if the rendering process is the same.
}

function updateStockCount(total) {
  stockCountElement.textContent = total;
}

function navigateToStockDetail(id) {
  window.location.href = `stocksInfo.html?id=${id}`;
}

function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

// Initialize
fetchStocks(currentPage);
