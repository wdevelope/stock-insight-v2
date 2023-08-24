window.onload = function () {
  fetchAndRenderPosts();
};

// 🟠 자유게시판 글 랜더링 함수
async function fetchAndRenderPosts() {
  if (!token) {
    console.warn('Authorization token is missing');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/boards', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    data.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    data.forEach((post) => {
      const postDate = post.updated_at.split('T')[0];
      const likesCount = post.likes.length;
      const viewsCount =
        post.views && post.views.length > 0 ? post.views[0].count : 0;

      postHTML += `
                    <a href="http://localhost:3000/view/board.html?postId=${post.id}" class="list-group-item list-group-item-action"                  
                    onclick="handleBoardItemClick(${post.id})">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <span>[토론]</span>
                          <strong class="mb-1 ms-2">${post.title}</strong>
                        </div>
                        <div>
                          <small class="me-2">닉네임</small>
                          <span>${postDate}</span>
                          <i class="fas fa-eye ms-4"></i> ${viewsCount}
                          <i class="fas fa-thumbs-up ms-4"></i> ${likesCount}
                        </div>
                      </div>
                    </a>
                  `;
    });

    boardElement.innerHTML = postHTML;
  } catch (error) {
    console.error('Error fetching posts:', error);
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
