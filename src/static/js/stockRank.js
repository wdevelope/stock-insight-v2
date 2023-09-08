document.addEventListener('DOMContentLoaded', () => {
  getStockRank();
});

function formatNumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function getStockRank() {
  try {
    const response = await fetch('/api/stocks/rank', {
      headers: {
        'content-type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stocks.');
    }
    const data = await response.json();

    // 데이터 포맷팅
    data.forEach((stock) => {
      stock.prdy_vrss = formatNumberWithCommas(stock.prdy_vrss);
      if (!stock.prdy_vrss.startsWith('-')) {
        stock.prdy_vrss = `+${stock.prdy_vrss}`;
      }
    });

    console.log(data);

    populateStockList(data);
  } catch (error) {
    console.log(error);
  }
}

function populateStockList(data) {
  const stockListElement = document.getElementById('stockRankList');

  data.forEach((stock, index) => {
    const stockItem = document.createElement('li');
    const formattedPrice = formatPrice(stock.stck_prpr);
    const formattedChange = stock.prdy_vrss;
    const changeColor = getChangeColor(formattedChange);
    const rank = index + 1;

    stockItem.innerHTML = `
          <div class="stock-item" onclick="navigateToStockDetail('${stock.id}')">
              <span class="stock-rank">${rank}. </span>  
              <span class="stock-name" > ${stock.prdt_abrv_name}</span>
              <span class="stock-id">${stock.id}</span>
              <span class="stock-price">${formattedPrice}</span>
              <span class="stock-change" style="color: ${changeColor};">${formattedChange}</span>
              <span class="stock-market">${stock.rprs_mrkt_kor_name}</span>
          </div>
      `;
    stockListElement.appendChild(stockItem);
  });
}

function formatPrice(price) {
  return parseInt(price, 10).toLocaleString('ko-KR');
}

function getChangeColor(change) {
  if (change.startsWith('-')) {
    return 'blue';
  } else if (change.startsWith('+') || !isNaN(change)) {
    return 'red';
  }
  return 'black'; // default color
}

function navigateToStockDetail(id) {
  window.location.href = `stocksInfo.html?id=${id}`;
}
