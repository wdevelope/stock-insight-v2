document.addEventListener('DOMContentLoaded', () => {
  RenderNoticePosts();
});

// 🟢 공지사항 게시글 랜더링 함수
async function RenderNoticePosts() {
  try {
    const response = await fetch('http://localhost:3000/api/noticeboards', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('공지게시판 데이터 렌더링 테스트', data);
    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    const DEFAULT_IMAGE_URL = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = post.created_at.split('T')[0];
      const userImageUrl = post.user.imgUrl || DEFAULT_IMAGE_URL;

      postHTML += `
                    <a href="http://localhost:3000/view/noticeBoardInfo.html?noticeBoardId=${post.id}" class="list-group-item list-group-item-action"
                    onclick="handleBoardItemClick(${post.id})">

                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span>[공지]</span>
                          <strong class="mb-1 ms-2">${post.title}</strong>
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
  } catch (error) {
    console.error('Error fetching notice posts:', error);
  }
}

// 🟢 조회수 불러오기
async function viewsRender(boardId) {
  try {
    const response = await fetch(`http://localhost:3000/api/views/${boardId}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch view count for boardId:', boardId);
      return 0;
    }

    // const viewsCount = await response.json();
    // console.log(viewsCount);
    // return viewsCount;
  } catch (error) {
    console.error('Error fetching views count for boardId:', boardId, error);
    return 0;
  }
}
// 🟢 좋아요 불러오기
async function likesRender(boardId) {
  try {
    const response = await fetch(`http://localhost:3000/api/likes/${boardId}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch likes count for boardId:', boardId);
      return 0;
    }

    const likesCount = await response.json();
    return likesCount;
  } catch (error) {
    console.error('Error fetching likes count for boardId:', boardId, error);
    return 0;
  }
}

// 🟢 게시판 항목 클릭 이벤트 핸들러
function handleBoardItemClick(boardId) {
  fetch(`http://localhost:3000/api/views/${boardId}`, {
    method: 'POST',
    headers: {
      Authorization: token, // 필요한 경우 인증 토큰 포함
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update views count');
      }
      return response.json();
    })

    .catch((error) => {
      console.error('Error updating views count:', error);
    });
}
