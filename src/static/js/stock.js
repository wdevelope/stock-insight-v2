// 현재 페이지와 그룹
let currentPage = 1;
let currentGroup = 1;

// DOM 요소 가져오기
const stockSearchInput = document.getElementById('stockSearchInput');
const autocompleteContainer =
  document.getElementById('autocompleteContainer') ||
  createAutocompleteContainer();
const stockCountElement = document.getElementById('stockCount');
const tableBody = document.getElementById('stockTable');

// 검색 입력창 이벤트 설정
stockSearchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchStock();
  }
});
// 디바운스 1초
stockSearchInput.addEventListener('input', debounce(handleInput, 1000));

// 입력 이벤트 핸들러: 자동완성 기능
async function handleInput(event) {
  const query = event.target.value;
  if (query.length < 2) {
    autocompleteContainer.innerHTML = '';
    return;
  }
  const stocks = await fetchStocksByQuery(query);
  renderAutocompleteResults(stocks);
}

// 자동완성 컨테이너 생성 함수
function createAutocompleteContainer() {
  const container = document.createElement('div');
  container.id = 'autocompleteContainer';
  document.body.appendChild(container);
  return container;
}

// 주식 이름으로 API 호출하여 검색 (디바운스 적용되는 api)
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

    const data = await response.json();
    return data.data; // 'data' 키에 해당하는 배열 반환
  } catch (error) {
    console.error('Error during stock search:', error);
  }
}

// 페이지 번호를 이용하여 주식 정보 API 호출
async function fetchStocks(page) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/?page=${page}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }

    const data = await response.json();
    renderStocks(data.data); // 'data' 키에 해당하는 배열 사용
    updateStockCount(data.meta.total);
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }
}

// 자동 완성 결과 렌더링
function renderAutocompleteResults(stocks) {
  autocompleteContainer.innerHTML = '';

  if (stocks.length === 0) {
    autocompleteContainer.style.display = 'none'; // 결과가 없으면 숨김
    return;
  }

  stocks.forEach((stock) => {
    const item = document.createElement('div');
    item.textContent = stock.prdt_abrv_name;
    item.addEventListener('click', () => {
      stockSearchInput.value = stock.prdt_abrv_name;
      navigateToStockDetail(stock.id);
      autocompleteContainer.innerHTML = '';
      autocompleteContainer.style.display = 'none'; // 선택 후 숨김
    });
    autocompleteContainer.appendChild(item);
  });

  autocompleteContainer.style.display = 'block'; // 결과가 있으면 보임
}

// 화면의 다른 곳을 클릭하면 자동완성 컨테이너 숨김
document.addEventListener('click', function (event) {
  if (
    event.target !== stockSearchInput &&
    event.target !== autocompleteContainer
  ) {
    autocompleteContainer.style.display = 'none';
  }
});

// 주식 정보를 테이블 형태로 출력
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
// 테이블에 셀 추가
function addCellsToRow(row, cellValues) {
  cellValues.forEach((value) => (row.insertCell().textContent = value));
}

// 주식 검색 함수
async function searchStock() {
  const query = stockSearchInput.value;
  const stocks = await fetchStocksByQuery(query);

  renderSearchResults(stocks);
}

// 검색 결과 출력
function renderSearchResults(stocks) {
  renderStocks(stocks); // This can use the same function if the rendering process is the same.
}

// 전체 주식 수 업데이트
function updateStockCount(total) {
  stockCountElement.textContent = total;
}

// 주식 상세 페이지로 이동
function navigateToStockDetail(id) {
  window.location.href = `stocksInfo.html?id=${id}`;
}

// 디바운스 함수: 이벤트 연속 발생 시 일정 시간 후 한 번만 호출
function debounce(func, delay) {
  let inDebounce;
  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
}
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

// 페이지 로딩시 초기 주식 목록 불러오기
fetchStocks(currentPage);
