document.addEventListener('DOMContentLoaded', function () {
  fetchFavoriteStocks();
});

async function fetchFavoriteStocks() {
  try {
    const response = await fetch('http://localhost:3000/api/stocks/mystock', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch favorite stocks.');
    }

    const stocks = await response.json();
    console.log('즐겨찾기 종목 데이터 테스트', stocks);
    displayFavoriteStocks(stocks);
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
  }
}

function displayFavoriteStocks(stocks) {
  const stockListContainer = document.getElementById('favoriteStockList');
  stockListContainer.innerHTML = ''; // 기존 목록 초기화

  stocks.map((stock) => {
    const stockCard = document.createElement('div');
    stockCard.className = 'card text-white bg-dark mb-4 col-md-3 mx-2';
    stockCard.style.maxWidth = '18rem';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    const stockIdText = document.createElement('span');
    stockIdText.textContent = stock.stockId; // 종목 코드를 설정

    const deleteButton = document.createElement('span');
    deleteButton.innerHTML = '❌';
    deleteButton.className = 'delete-button'; // CSS 클래스 적용
    deleteButton.onclick = (e) => {
      e.stopPropagation(); // 상위 요소로의 이벤트 전파를 막음
      deleteMyStock(stock.stockId);
    };

    cardHeader.appendChild(stockIdText);
    cardHeader.appendChild(deleteButton);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = stock.prdt_abrv_name; // 종목명을 카드 제목으로 설정

    cardBody.appendChild(cardTitle);

    stockCard.appendChild(cardHeader);
    stockCard.appendChild(cardBody);

    stockListContainer.appendChild(stockCard);

    stockCard.onclick = () => {
      window.location.href = `http://localhost:3000/view/stocksInfo.html?id=${stock.stockId}`;
    };
  });
}

async function deleteMyStock(stockId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/stocks/mystock/${stockId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete the stock from favorites.');
    }

    // 삭제 후 목록을 다시 로드
    fetchFavoriteStocks();
  } catch (error) {
    console.error('Error:', error);
  }
}
