window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 1;
  RenderAskPosts(page);

  const meta = await RenderAskPosts(page);

  document
    .getElementById('pagination')
    .querySelector('button:first-child').onclick = () => prevGroup(meta);
  document
    .getElementById('pagination')
    .querySelector('button:last-child').onclick = () => nextGroup(meta);
};

let currentGroup = 1;

// 🟠 문의게시판 글 랜더링 함수
async function RenderAskPosts(page = 1) {
  window.history.pushState(null, null, `?page=${page}`);

  try {
    const response = await fetch(`/api/askboards?page=${page}`, {
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

    const defaultImage = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = toKoreanTime(post.created_at).split('T')[0];
      const userImageUrl = post.user.imgUrl || defaultImage;
      const isNewPost =
        postDate === today ? '<span class="newFreePost">N</span>' : '';
      const rankerStar = post.status === 'ranker' ? '🏅' : '';

      postHTML += `
                      <a href="/askBoardInfo?askBoardId=${post.id}" class="list-group-item list-group-item-action"                  
                      onclick="handleBoardItemClick(${post.id})">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                          ${isNewPost}
                            <span>[문의]</span>
                            <strong class="mb-1 ms-2">${post.title} <i class="fa-solid fa-lock"></i></strong>
                          </div>
                          <div>
                          ${rankerStar} 
                          <img src="${userImageUrl}"  class="me-2 board-user-image"> 
                            <small class="me-2">${post.user.nickname}</small>
                            <span>${postDate}</span>
                 
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

// 🟠 검색 처리 함수
async function handleSearch() {
  const searchOption = document.getElementById('searchOption').value;
  const searchInput = document.getElementById('searchInput').value.trim();

  if (!searchInput) {
    alert('검색어를 입력하세요.');
    return;
  }

  try {
    let response;
    switch (searchOption) {
      case 'nickname':
        response = await fetch(
          `/api/askboards/search/nickname?nickname=${searchInput}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        break;
      default:
        console.error('Invalid search option:', searchOption);
        return;
    }

    if (!response.ok) {
      throw new Error('검색 중 오류가 발생했습니다.');
    }

    const { data } = await response.json();
    renderSearchResults(data); // 데이터를 게시판에 랜더링하는 함수
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

// 🟠 검색 결과 랜더링 함수
function renderSearchResults(data) {
  const boardElement = document.querySelector('#notice .list-group');
  let postHTML = '';
  const defaultImage = 'https://ifh.cc/g/a2Sg64.png';
  const today = toKoreanTime(new Date().toISOString()).split('T')[0];

  for (const post of data) {
    const postDate = toKoreanTime(post.created_at).split('T')[0];
    const userImageUrl = post.user.imgUrl || defaultImage;
    const isNewPost =
      postDate === today ? '<span class="newFreePost">N</span>' : '';

    postHTML += `
                    <a href="/askBoardInfo?askBoardId=${post.id}" class="list-group-item list-group-item-action" onclick="handleBoardItemClick(${post.id})">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          ${isNewPost}
                          <span>[문의]</span>
                          <strong class="mb-1 ms-2">${post.title} <i class="fa-solid fa-lock"></i></strong>
                        </div>
                        <div>
                          <img src="${userImageUrl}" class="me-2 board-user-image"> 
                          <small class="me-2">${post.user.nickname}</small>
                          <span>${postDate}</span>
                        </div>
                      </div>
                    </a>
                  `;
  }

  boardElement.innerHTML = postHTML;
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
        RenderAskPosts(pageNum);
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
  currentGroup++;
  updatePaginationUI(meta);
};

// 🟠 페이지 네이션 이전페이지
const prevGroup = (meta) => {
  if (currentGroup > 1) {
    currentGroup--;
    updatePaginationUI(meta);
  }
};
