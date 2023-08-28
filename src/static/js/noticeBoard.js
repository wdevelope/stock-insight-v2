window.onload = function () {
  RenderNoticePosts();
};

// 🟡 공지사항 게시글 랜더링 함수
async function RenderNoticePosts() {
  if (!token) {
    console.warn('Authorization token is missing');
    return;
  }

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
    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    data.forEach((post) => {
      const postDate = post.created_at.split('T')[0];
      // const likesCount = post.likes.length;

      postHTML += `
                    <a href="http://localhost:3000/view/board.html?noticeBoardId=${post.id}" class="list-group-item list-group-item-action">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span>[공지]</span>
                          <strong class="mb-1 ms-2">${post.title}</strong>
                        </div>
                        <div>
                          <small class="me-2">닉네임</small>
                          <span>${postDate}</span>
                          <i class="fas fa-eye ms-4"></i> 
                          <i class="fas fa-thumbs-up ms-4"></i>
                        </div>
                      </div>
                    </a>
                  `;
    });

    boardElement.innerHTML = postHTML;
  } catch (error) {
    console.error('Error fetching notice posts:', error);
  }
}

// 🟠 게시판 항목 클릭 이벤트 핸들러
function handleBoardItemClick(boardId) {
  // 게시글 조회수 증가시키기 위해 서버에 POST 요청 보내기
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
