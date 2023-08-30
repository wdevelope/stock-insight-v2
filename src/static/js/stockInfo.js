document.addEventListener('DOMContentLoaded', () => {
  fetchStockDetail();
});

// 가격 천의단위로 구분
function formatNumberWithCommas(x) {
  const num = parseFloat(x); // 문자열 숫자로 변환
  return num.toLocaleString('ko-KR');
}

const favoriteButton = document.getElementById('favoriteButton');

// 🟤 즐겨찾기 버튼 리스너
favoriteButton.addEventListener('click', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const stockId = urlParams.get('id');
  if (!stockId) {
    console.error('No stock ID provided.');
    return;
  }

  const response = await addFavoriteStock(stockId);
  if (response && response.status === 201) {
    favoriteButton.classList.add('filled'); // 별 색깔 채우기
  }
});

// 🟤 주식 상세 정보를 가져오는 함수
async function fetchStockDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    console.error('No stock ID provided.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/price/${id}`,
    );
    const data = await response.json();
    console.log(data);
    renderStockDetail(data);

    const chartData = data.stockPrices.map((item) => ({
      date: new Date(item.date), // 가정: item.date가 문자열 형식이라면 Date 객체로 변환
      stck_prpr: item.stck_prpr,
    }));
    drawChart(chartData);
  } catch (error) {
    console.error('Error fetching stock detail:', error);
  }
}

// 🟤 주식 상세 정보를 화면에 표시하는 함수
function renderStockDetail(data) {
  const stockInfo = data.stockPrices[0];

  // Header 부분 정보 업데이트
  document.getElementById('stockId').textContent = `종목코드: ${data.id}`;
  document.getElementById(
    'stockPrice',
  ).textContent = `주식 가격: ${formatNumberWithCommas(stockInfo.stck_prpr)}`;
  document.getElementById(
    'priceDifference',
  ).textContent = `전일 대비: ${formatNumberWithCommas(stockInfo.prdy_vrss)}`;

  // Highlight 정보 업데이트
  document.getElementById(
    'highPrice',
  ).textContent = `고가: ${formatNumberWithCommas(stockInfo.stck_hgpr)}`;
  document.getElementById(
    'lowPrice',
  ).textContent = `저가: ${formatNumberWithCommas(stockInfo.stck_lwpr)}`;
  document.getElementById(
    'volume',
  ).textContent = `거래량: ${formatNumberWithCommas(stockInfo.acml_vol)}`;
  document.getElementById(
    'volumePrice',
  ).textContent = `거래대금: ${formatNumberWithCommas(stockInfo.acml_tr_pbmn)}`;

  // 주식 정보 및 차트 구성
  const stockInfoContainer = document.getElementById('stockInfo');

  const otherInfoHTML = `
      <p>기준가: ${formatNumberWithCommas(stockInfo.stck_sdpr)}</p>
      <p>외국인 보유율: ${stockInfo.hts_frgn_ehrt}</p>
      <p>가용 물량: ${formatNumberWithCommas(stockInfo.hts_avls)}</p>
      <p>PER: ${stockInfo.per}</p>
      <p>PBR: ${stockInfo.pbr}</p>
      <p>52주 최고가: ${formatNumberWithCommas(stockInfo.w52_hgpr)}</p>
      <p>52주 최저가: ${formatNumberWithCommas(stockInfo.w52_lwpr)}</p>
      <p>전체 대출 잔액 비율: ${stockInfo.whol_loan_rmnd_rate}</p>
      <p>한국 이름: ${stockInfo.bstp_kor_isnm}</p>
      <p>상태 코드: ${stockInfo.iscd_stat_cls_code}</p>
  `;

  stockInfoContainer.innerHTML = otherInfoHTML;
}
// 🟤 주식을 즐겨찾기에 추가하는 함수
async function addFavoriteStock(stockId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/mystock/${stockId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (response.status === 201) {
      alert('즐겨찾기에 추가되었습니다!');
      return response;
    } else if (response.status === 409) {
      alert('이 주식은 이미 즐겨찾기에 추가되어 있습니다.');
    } else {
      alert('즐겨찾기 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error adding favorite stock:', error);
  }
}

// 🟤 주식 차트를 그리는 함수

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
