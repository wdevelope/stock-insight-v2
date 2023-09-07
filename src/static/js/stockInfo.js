document.addEventListener('DOMContentLoaded', () => {
  fetchStockDetail();
});

// 가격 천의단위로 구분
function formatNumberWithCommas(x) {
  const num = parseFloat(x); // 문자열 숫자로 변환
  return num.toLocaleString('ko-KR');
}

const favoriteButton = document.getElementById('favoriteButton');

// 🟤 찜하기 버튼 리스너
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
    console.log('주식상세정보 데이터 테스트', data);
    renderStockDetail(data);

    const chartData = data.prices.map((item) => ({
      date: new Date(item.time),
      price: parseFloat(item.price),
    }));
    renderChart(chartData);
  } catch (error) {
    console.error('Error fetching stock detail:', error);
  }
}

// 🟤 주식 상세 정보를 화면에 표시하는 함수
function renderStockDetail(data) {
  const stockInfo = data.stock.stockPrices[0];

  // 전일 대비 값
  const priceDiff = formatNumberWithCommas(stockInfo.prdy_vrss);
  const priceDiffPercent = stockInfo.prdy_ctrt;

  // 전일 대비 값에 따라 색상 지정
  const priceDiffElem = document.getElementById('priceDifference');
  if (parseFloat(stockInfo.prdy_vrss) > 0) {
    priceDiffElem.style.color = 'red'; // 상승일 때 빨간색
    priceDiffElem.textContent = `전일 대비: +${priceDiff} (${priceDiffPercent}%)`;
  } else if (parseFloat(stockInfo.prdy_vrss) < 0) {
    priceDiffElem.style.color = 'blue'; // 하락일 때 파란색
    priceDiffElem.textContent = `전일 대비: ${priceDiff} (${priceDiffPercent}%)`;
  } else {
    priceDiffElem.style.color = 'black'; // 변동 없을 때 검은색
    priceDiffElem.textContent = `전일 대비: ${priceDiff}`;
  }

  document.getElementById(
    'stock-name',
  ).textContent = `${data.stock.prdt_abrv_name} (${data.stock.id})`;
  // Header 부분 정보 업데이트
  document.getElementById(
    'stockId',
  ).textContent = `${data.stock.rprs_mrkt_kor_name} `;
  document.getElementById(
    'stockPrice',
  ).textContent = `주식 가격: ${formatNumberWithCommas(
    stockInfo.stck_prpr,
  )} 원`;
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
// 🟤 주식을 찜하기에 추가하는 함수
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
      console.log('찜한 종목에 추가되었습니다!');
      return response;
    } else if (response.status === 409) {
      alert('이 주식은 이미 찜한 종목에 추가되어 있습니다.');
    } else {
      alert('찜한 종목 추가에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error adding favorite stock:', error);
  }
}

// 🟤 주식 차트를 그리는 함수
function renderChart(chartData) {
  const ctx = document.getElementById('myChart');

  // 차트 데이터를 역순으로 정렬
  chartData = chartData.reverse();

  // 차트 데이터에서 날짜와 가격 분리, 날짜에 5시간 40분 더함
  const labels = chartData.map((data) => {
    const date = new Date(data.date);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 40);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  });
  const prices = chartData.map((data) => data.price);

  // 가격 데이터의 최대값과 최소값을 구하고, 여유분을 둔 범위 설정
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const padding = (maxPrice - minPrice) * 0.05; // 예: 전체 범위의 5%를 여유분으로 설정

  new Chart(ctx, {
    type: 'line', // 선형 차트 사용
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderWidth: 1,
          borderColor: 'blue',
          fill: true,
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: minPrice - padding,
          max: maxPrice + padding,
        },
      },
    },
  });
}
