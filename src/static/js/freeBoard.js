window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 1;
  const sort = urlParams.get('sort') || '';
  fetchAndRenderPosts(page, sort);
  document
    .querySelectorAll('input[name="sortOption"]')
    .forEach(function (radio) {
      radio.addEventListener('change', onSortOptionChanged);
    });

  const meta = await fetchAndRenderPosts(page, sort);

  document
    .getElementById('pagination')
    .querySelector('button:first-child').onclick = () => prevGroup(meta);
  document
    .getElementById('pagination')
    .querySelector('button:last-child').onclick = () => nextGroup(meta);
};

let currentGroup = 1;

function handleSortChange() {
  const sortOption = document.getElementById('sortSelector').value;
  fetchAndRenderPosts(1, sortOption);
}

// 🟠 자유게시판 글 랜더링 함수 (검색 결과 포함)
async function fetchAndRenderPosts(
  page = 1,
  sortOption = '',
  searchOption = '',
  searchValue = '',
) {
  let newUrl = `?page=${page}`;
  if (sortOption) {
    newUrl += `&sort=${sortOption}`;
  }
  window.history.pushState(null, null, newUrl);

  let url = `/api/boards/page?page=${page}`;
  if (sortOption === 'view') {
    url = `/api/boards/orderbyviewcount?page=${page}`;
  } else if (sortOption === 'like') {
    url = `/api/boards/orderbylikecount?page=${page}`;
  } else if (sortOption === 'ranker') {
    url = `/api/boards/orderbyRanker?page=${page}`;
  }

  if (searchOption === 'titleContent') {
    url = `/api/boards/search?page=${page}&title=${encodeURIComponent(
      searchValue,
    )}&description=${encodeURIComponent(searchValue)}`;
  } else if (searchOption === 'nickname') {
    url = `/api/boards/search?page=${page}&nickname=${encodeURIComponent(
      searchValue,
    )}`;
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

    const today = toKoreanTime(new Date().toISOString()).split('T')[0];

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    const DEFAULT_IMAGE_URL = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = toKoreanTime(post.created_at).split('T')[0];
      const isNewPost =
        postDate === today ? '<span class="newFreePost">N</span>' : '';
      const likesCount = post.likeCount;
      const viewsCount = post.viewCount;
      const userImageUrl = post.imgUrl || DEFAULT_IMAGE_URL;
      const rankerStar = post.status === 'ranker' ? '⭐️' : '';

      postHTML += `
                  <a href="/freeBoardInfo?freeBoardId=${post.id}" class="list-group-item list-group-item-action"                  
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
                        <small class="me-2">${post.nickname}</small>
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
    return meta;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 🟠 자유게시판 검색
async function freeBoardSearch() {
  const searchOption = document.getElementById('searchOption').value;
  const searchValue = document.getElementById('searchInput').value;

  fetchAndRenderPosts(1, '', searchOption, searchValue);
}

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

  const totalPageCount = meta.lastPage;
  for (let i = 0; i < buttons.length; i++) {
    let pageNum = i + 1 + 5 * (currentGroup - 1);

    if (pageNum > totalPageCount) {
      // 전체 페이지 수를 초과하는 페이지 버튼은 숨기기
      buttons[i].style.display = 'none';
    } else {
      buttons[i].style.display = '';
      buttons[i].innerText = pageNum;
      buttons[i].onclick = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const sort = urlParams.get('sort') || '';
        fetchAndRenderPosts(pageNum, sort);
      };

      if (pageNum === currentPage) {
        buttons[i].classList.add('active');
      }
    }
  }

  const nextButton = document
    .getElementById('pagination')
    .querySelector('button:last-child');
  let isLastGroup = currentGroup * 5 >= totalPageCount;

  if (isLastGroup) {
    nextButton.setAttribute('disabled', 'disabled');
  } else {
    nextButton.removeAttribute('disabled');
  }
}

// 🟠 페이지 네이션 다음페이지
const nextGroup = (meta) => {
  const urlParams = new URLSearchParams(window.location.search);
  const sort = urlParams.get('sort') || '';
  currentGroup++;
  fetchAndRenderPosts(1 + 5 * (currentGroup - 1), sort);
  updatePaginationUI(meta);
};

// 🟠 페이지 네이션 이전페이지
const prevGroup = (meta) => {
  const urlParams = new URLSearchParams(window.location.search);
  const sort = urlParams.get('sort') || '';
  if (currentGroup > 1) {
    currentGroup--;
    fetchAndRenderPosts(1 + 5 * (currentGroup - 1), sort);
    updatePaginationUI(meta);
  }
};

// 🟠 게시글 조회수
async function handleBoardItemClick(boardId) {
  try {
    const response = await fetch(`api/views/${boardId}`, {
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
