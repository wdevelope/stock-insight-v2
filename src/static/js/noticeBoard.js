window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 1;
  RenderNoticePosts(page);

  const meta = await RenderNoticePosts(page);

  document
    .getElementById('pagination')
    .querySelector('button:first-child').onclick = () => prevGroup(meta);
  document
    .getElementById('pagination')
    .querySelector('button:last-child').onclick = () => nextGroup(meta);
};

let currentGroup = 1;

// 🟢 공지사항 게시글 랜더링 함수
async function RenderNoticePosts(page = 1) {
  window.history.pushState(null, null, `?page=${page}`);

  try {
    const response = await fetch(`/api/noticeboards/page?page=${page}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const { data, meta } = await response.json(); // 서버 응답 데이터 구조에 따라 변경
    const today = toKoreanTime(new Date().toISOString()).split('T')[0];

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    const DEFAULT_IMAGE_URL = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = toKoreanTime(post.created_at).split('T')[0];
      const userImageUrl = post.imgUrl || DEFAULT_IMAGE_URL;
      const isNewPost =
        postDate === today ? '<span class="newFreePost">N</span>' : '';

      postHTML += `
        <a href="/noticeBoardInfo?noticeBoardId=${post.id}" class="list-group-item list-group-item-action"
          onclick="handleBoardItemClick(${post.id})">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              ${isNewPost}
              <span>[공지]</span>
              <strong class="mb-1 ms-2">${post.title}</strong>
            </div>
            <div>
              <img src="${userImageUrl}" class="me-2 board-user-image">  
              <small class="me-2">${post.nickname}</small> <!-- 서버 응답 데이터 구조에 따라 변경 -->
              <span>${postDate}</span>
            </div>
          </div>
        </a>
      `;
    }

    boardElement.innerHTML = postHTML;
    updatePaginationUI(meta); // 페이지네이션 업데이트 함수 호출
  } catch (error) {
    console.error('Error fetching notice posts:', error);
  }

  // 공지사항 알림 창 띄우는 소켓
  const socket = io('');
  const noticebox = document.getElementById('notice-box');

  socket.on('ntcToClient', (notice) => {
    noticebox.innerHTML = `<div>${notice}</div>`;
    if (notice === null) {
      noticebox.innerHTML = `<div></div>`;
    }
  });
}

// 🟢 페이지 번호 동적 부여
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
        RenderNoticePosts(pageNum);
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

// 🟢 페이지 네이션 다음페이지
const nextGroup = (meta) => {
  currentGroup++;
  updatePaginationUI(meta);
};

// 🟢 페이지 네이션 이전페이지
const prevGroup = (meta) => {
  if (currentGroup > 1) {
    currentGroup--;
    updatePaginationUI(meta);
  }
};
