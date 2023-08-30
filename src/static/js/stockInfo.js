document.addEventListener('DOMContentLoaded', () => {
  fetchStockDetail();
});
// 가격 천의단위로 구분
function formatNumberWithCommas(x) {
  const num = parseFloat(x); // 문자열 숫자로 변환
  return num.toLocaleString('ko-KR');
}

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

function drawChart(data) {
  const svg = d3.select('#stockChart');
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.stck_prpr))
    .curve(d3.curveMonotoneX);

  // Create a group to contain all chart content
  const chartGroup = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(d3.extent(data, (d) => d.date));
  y.domain(d3.extent(data, (d) => d.stck_prpr));

  // Add the X Axis
  chartGroup
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .append('text')
    .attr('fill', '#000')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Date');

  // Add the Y Axis
  chartGroup
    .append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', -50) // Adjusted the position to make sure the label is fully visible
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Price');

  // Add the line
  chartGroup
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);
}

const sampleData = [
  { date: new Date(2023, 7, 1), stck_prpr: 100 },
  { date: new Date(2023, 7, 2), stck_prpr: 105 },
  { date: new Date(2023, 7, 3), stck_prpr: 103 },
];

drawChart(sampleData);
