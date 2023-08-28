window.onload = function () {
  //   fetchStockPrices();
};

async function fetchStockPrices() {
  try {
    const response = await fetch('http://localhost:3000/stock/prices', {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const dataArray = await response.json();
    console.log(dataArray);
    const data = dataArray.find((item) => item.id === 1);

    const stockInfoElement = document.querySelector('#stockInfo');
    let stockHTML = '';

    if (data)
      stockHTML += `
            <div class="stock-item">
                <p>주식 가격: ${data.stck_prpr}</p>
                <p>전일 대비: ${data.prdy_vrss}</p>
                <p>전일 대비 기호: ${data.prdy_vrss_sign}</p>
                <p>전일 종가: ${data.prdy_ctrt}</p>
                <p>시가: ${data.stck_oprc}</p>
                <p>고가: ${data.stck_hgpr}</p>
                <p>저가: ${data.stck_lwpr}</p>
                <p>기준가: ${data.stck_sdpr}</p>
                <p>누적 거래량: ${data.acml_vol}</p>
                <p>누적 거래 대금: ${data.acml_tr_pbmn}</p>
                <p>외국인 보유율: ${data.hts_frgn_ehrt}</p>
                <p>가용 물량: ${data.hts_avls}</p>
                <p>PER: ${data.per}</p>
                <p>PBR: ${data.pbr}</p>
                <p>52주 최고가: ${data.w52_hgpr}</p>
                <p>52주 최저가: ${data.w52_lwpr}</p>
                <p>전체 대출 잔액 비율: ${data.whol_loan_rmnd_rate}</p>
                <p>한국 이름: ${data.bstp_kor_isnm}</p>
                <p>상태 코드: ${data.iscd_stat_cls_code}</p>
                <p>주식 ID: ${data.id}</p>
            </div>
        `;

    stockInfoElement.innerHTML = stockHTML;
    drawStockChartD3(data);
  } catch (error) {
    console.error('Error fetching stock prices:', error);
  }
}

function drawStockChartD3(data) {
  const svgWidth = 600,
    svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3
    .select('#stockChart')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.selectAll('*').remove(); // Remove any previous drawing

  const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const x = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(['주식 가격', '전일 종가', '시가', '고가', '저가', '기준가']);

  const y = d3
    .scaleLinear()
    .rangeRound([height, 0])
    .domain([
      0,
      d3.max([
        data.stck_prpr,
        data.prdy_ctrt,
        data.stck_oprc,
        data.stck_hgpr,
        data.stck_lwpr,
        data.stck_sdpr,
      ]),
    ]);

  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('가격');

  const line = d3
    .line()
    .x(function (d, i) {
      return x(['주식 가격', '전일 종가', '시가', '고가', '저가', '기준가'][i]);
    })
    .y(function (d) {
      return y(d);
    });

  g.append('path')
    .datum([
      data.stck_prpr,
      data.prdy_ctrt,
      data.stck_oprc,
      data.stck_hgpr,
      data.stck_lwpr,
      data.stck_sdpr,
    ])
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line);
}
