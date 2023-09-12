document.addEventListener('DOMContentLoaded', () => {
  createDemoChart('kospiChart', 'KOSPI Demo Stock Price'); // KOSPI 차트 생성
  createDemoChart('kosdaqChart', 'KOSDAQ Demo Stock Price'); // KOSDAQ 차트 생성
  fetchStockData();
  getStockRank();
});

// 🟢 코스피 코스닥 불러오기
async function fetchStockData() {
  try {
    const response = await fetch('/api/stocks/index');

    if (!response.ok) {
      throw new Error('Failed to fetch stock data.');
    }

    const data = await response.json();
    displayStockData(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

// 🟢 메인페이지 index데이터
function displayStockData(data) {
  const kospiPriceEl = document.getElementById('kospi-price');
  const kospiChangeEl = document.getElementById('kospi-change');
  const kosdaqPriceEl = document.getElementById('kosdaq-price');
  const kosdaqChangeEl = document.getElementById('kosdaq-change');

  const kospiData = data.KOSPI;
  const kosdaqData = data.KOSDAQ;

  // KOSPI data
  kospiPriceEl.textContent = `${Number(
    kospiData.bstp_nmix_prpr,
  ).toLocaleString()}`;
  kospiPriceEl.style.fontSize = '30px';
  kospiChangeEl.textContent = `변동: ${kospiData.bstp_nmix_prdy_vrss} (${kospiData.bstp_nmix_prdy_ctrt}%)`;
  kospiChangeEl.style.color =
    kospiData.bstp_nmix_prdy_ctrt >= 0 ? 'green' : 'red';

  // KOSDAQ data
  kosdaqPriceEl.textContent = `${Number(
    kosdaqData.bstp_nmix_prpr,
  ).toLocaleString()}`;
  kosdaqPriceEl.style.fontSize = '30px';
  kosdaqChangeEl.textContent = `변동: ${kosdaqData.bstp_nmix_prdy_vrss} (${kosdaqData.bstp_nmix_prdy_ctrt}%)`;
  kosdaqChangeEl.style.color =
    kosdaqData.bstp_nmix_prdy_ctrt >= 0 ? 'green' : 'red';
}

// 🟢 차트 그리기
function createDemoChart(canvasId, labelName) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Gradient creation for KOSPI
  const gradientKospi = ctx.createLinearGradient(0, 0, 0, 400);
  gradientKospi.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
  gradientKospi.addColorStop(1, 'rgba(255, 99, 132, 0.0)');

  // Gradient creation for KOSDAQ
  const gradientKosdaq = ctx.createLinearGradient(0, 0, 0, 400);
  gradientKosdaq.addColorStop(0, 'rgba(54, 162, 235, 0.5)');
  gradientKosdaq.addColorStop(1, 'rgba(54, 162, 235, 0.0)');

  // Default settings
  let backgroundColor = gradientKospi;
  let borderColor = 'rgba(255, 99, 132, 1)';
  let dataPoints = [12, 19, 3, 5, 2, 3, 9];

  if (canvasId === 'kosdaqChart') {
    backgroundColor = gradientKosdaq;
    borderColor = 'rgba(54, 162, 235, 1)';
    dataPoints = [5, 15, 8, 12, 6, 10, 7];
  }

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: labelName,
          data: dataPoints,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2,
          pointRadius: 0, // Setting the pointRadius to 0 as you wanted
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFontSize: 16,
        bodyFontSize: 14,
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        y: {
          beginAtZero: true,
          display: true,
          gridLines: {
            drawBorder: false,
            color: 'rgba(255, 255, 255, 0.1)',
            zeroLineColor: 'rgba(255, 255, 255, 0.5)',
          },
          ticks: {
            display: false,
          },
        },
        x: {
          display: false,
          gridLines: {
            drawBorder: false,
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      title: {
        display: true,
        text: labelName,
        fontSize: 25,
        padding: 20,
      },
      legend: {
        display: true,
        labels: {
          fontColor: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          boxWidth: 40,
        },
        position: 'bottom',
      },
      animation: {
        duration: 1000,
        easing: 'easeOutBounce',
      },
    },
  });
}

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
    const data = (await response.json()).slice(0, 20);

    // 데이터 포맷팅
    data.forEach((stock) => {
      stock.prdy_vrss = formatNumberWithCommas(stock.prdy_vrss);
      if (!stock.prdy_vrss.startsWith('-')) {
        stock.prdy_vrss = `+${stock.prdy_vrss}`;
      }
    });

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
    const formattedPer = stock.prdy_ctrt;

    stockItem.innerHTML = `
          <div class="stock-item" onclick="navigateToStockDetail('${stock.id}')">
              <span class="stock-rank">${rank}. </span>  
              <span class="stock-name" > ${stock.prdt_abrv_name}</span>
              <span class="stock-id">${stock.id}</span>
              <span class="stock-price">${formattedPrice}</span>
              <span class="stock-change" style="color: ${changeColor};">${formattedChange}(${formattedPer})%</span>
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
  window.location.href = `stocksInfo?id=${id}`;
}
