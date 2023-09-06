document.addEventListener('DOMContentLoaded', () => {
  createDemoChart('kospiChart', 'KOSPI Demo Stock Price'); // KOSPI 차트 생성
  createDemoChart('kosdaqChart', 'KOSDAQ Demo Stock Price'); // KOSDAQ 차트 생성
  fetchStockData();
});

// 🟢 코스피 코스닥 불러오기
async function fetchStockData() {
  try {
    const response = await fetch('http://localhost:3000/api/stocks/index');

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

  // 기본 색상 및 수치 설정
  let backgroundColor = 'rgba(255, 99, 132, 0.2)';
  let borderColor = 'rgba(255, 99, 132, 1)';
  let dataPoints = [12, 19, 3, 5, 2, 3, 9];

  if (canvasId === 'kosdaqChart') {
    backgroundColor = 'rgba(54, 162, 235, 0.2)';
    borderColor = 'rgba(54, 162, 235, 1)';
    dataPoints = [5, 15, 8, 12, 6, 10, 7];
  }

  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: labelName,
          data: dataPoints,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
