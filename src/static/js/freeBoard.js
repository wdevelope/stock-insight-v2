window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 1;
  fetchAndRenderPosts(page); // pass the current page
  document
    .querySelectorAll('input[name="sortOption"]')
    .forEach(function (radio) {
      radio.addEventListener('change', onSortOptionChanged);
    });
};

// 🟠 정렬 옵션 변경
function onSortOptionChanged() {
  const selectedOption = document.getElementById('sortSelector').value;
  fetchAndRenderPosts(1, selectedOption);
}

// 🟠 자유게시판 글 랜더링 함수
async function fetchAndRenderPosts(page = 1, orderBy = '') {
  window.history.pushState(null, null, `?page=${page}`);

  let url = `http://localhost:3000/api/boards/page?page=${page}`;

  if (orderBy === 'view') {
    url = `http://localhost:3000/api/boards/orderbyviewcount?page=${page}`;
  } else if (orderBy === 'like') {
    url = `http://localhost:3000/api/boards/orderbylikecount?page=${page}`;
  } else if (orderBy === 'ranker') {
    url = `http://localhost:3000/api/boards/orderbyRanker?page=${page}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('fetch res 에러');
    }

    const { data, meta } = await response.json();
    const today = new Date().toISOString().split('T')[0];

    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    const DEFAULT_IMAGE_URL = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = post.created_at.split('T')[0];
      const isNewPost =
        postDate === today ? '<i class="fa-solid fa-n"></i>' : '';
      const likesCount = post.likeCount;
      const viewsCount = post.viewCount;
      const userImageUrl = post.user.imgUrl || DEFAULT_IMAGE_URL;
      const rankerStar = post.user.status === 'ranker' ? '⭐️' : '';

      postHTML += `
                  <a href="http://localhost:3000/view/freeBoardInfo.html?freeBoardId=${post.id}" class="list-group-item list-group-item-action"                  
                  onclick="handleBoardItemClick(${post.id})">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                      ${isNewPost}
                        <span>[토론]</span>  
                        <strong class="mb-1 ms-2">${post.title}</strong>
                      </div>
                      <div>
                      ${rankerStar} 
                      <img src="${userImageUrl}" class="me-2 board-user-image">  
                        <small class="me-2">${post.user.nickname}</small>
                        <span>${postDate}</span>
                        <i class="fas fa-eye ms-4"></i> ${viewsCount}
                        <i class="fas fa-thumbs-up ms-4"></i> ${likesCount}
                      </div>
                    </div>
                  </a>
                `;
    }

    boardElement.innerHTML = postHTML;

    updatePaginationUI(meta);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 🟠 자유게시판 검색
async function freeBoardSearch() {
  const searchOption = document.getElementById('searchOption').value;
  const searchValue = document.getElementById('searchInput').value;

  let queryParams = 'page=1';

  if (searchOption === 'titleContent') {
    queryParams += '&title=' + searchValue;
    queryParams += '&description=' + searchValue;
  } else if (searchOption === 'nickname') {
    queryParams += '&nickname=' + searchValue;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/find?${queryParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results.');
    }
    const data = await response.json();
    renderSearchResults(data);
  } catch (error) {
    console.error('Error during search:', error);
  }
}

// 🟠 자유게시판 검색 결과 렌더링
async function renderSearchResults(data) {
  const hits = data.data;

  const boardElement = document.querySelector('#notice .list-group');
  let postHTML = '';

  if (hits.length === 0) {
    postHTML = '<p class="text-center">검색 결과가 없습니다.</p>';
  } else {
    hits.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    for (const post of hits) {
      console.log('검색시 불러오는 데이터', post);
      const postDate = post.created_at.split('T')[0];
      const likesCount = post.likeCount;
      const viewsCount = post.viewCount;
      postHTML += `
        <a href="http://localhost:3000/view/freeBoardInfo.html?freeBoardId=${post.id}" class="list-group-item list-group-item-action"
        onclick="handleBoardItemClick(${post.id})">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span>[토론]</span>
              <strong class="mb-1 ms-2">${post.title}</strong>
            </div>
            <div>
              <small class="me-2">${post.nickname}</small>
              <span>${postDate}</span>
              <i class="fas fa-eye ms-4"></i> ${viewsCount}
              <i class="fas fa-thumbs-up ms-4"></i> ${likesCount}
            </div>
          </div>
        </a>
      `;
    }
  }

  boardElement.innerHTML = postHTML;
}

let currentGroup = 1;

// 🟠 페이지 번호 동적 부여
function updatePaginationUI(meta) {
  if (!meta) {
    console.error('Meta data is not provided!');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page') || 1);
  const buttons = document
    .getElementById('pagination')
    .querySelectorAll('button:not(:first-child):not(:last-child)');

  buttons.forEach((button) => button.classList.remove('active'));

  const totalPageCount = meta.last_page;

  for (let i = 0; i < buttons.length; i++) {
    let pageNum = i + 1 + 5 * (currentGroup - 1);

    if (pageNum > totalPageCount) {
      // 전체 페이지 수를 초과하는 페이지 버튼은 숨기기
      buttons[i].style.display = 'none';
    } else {
      buttons[i].style.display = '';
      buttons[i].innerText = pageNum;
      buttons[i].onclick = function () {
        fetchAndRenderPosts(pageNum);
      };

      if (pageNum === currentPage) {
        buttons[i].classList.add('active');
      }
    }
  }
}

// 🟠 게시글 조회수
async function handleBoardItemClick(boardId) {
  try {
    const response = await fetch(`http://localhost:3000/api/views/${boardId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update views count');
    }
  } catch (error) {
    console.error('Error updating views count:', error);
  }
}
