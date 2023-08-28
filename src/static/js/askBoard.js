window.onload = function () {
  RenderAskPosts();
};

// 🟠 자유게시판 글 랜더링 함수
async function RenderAskPosts() {
  if (!token) {
    console.warn('Authorization token is missing');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/askboards', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('fetch res 에러');
    }

    const data = await response.json();
    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    data.forEach((post) => {
      const postDate = post.created_at.split('T')[0];
      const viewsCount =
        post.views && post.views.length > 0 ? post.views[0].count : 0;

      postHTML += `
                      <a href="http://localhost:3000/view/Board.html?askBoardId=${post.id}" class="list-group-item list-group-item-action"                  
                      onclick="handleBoardItemClick(${post.id})">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span>[문의]</span>
                            <strong class="mb-1 ms-2">${post.title} <i class="fa-solid fa-lock"></i></strong>
                          </div>
                          <div>
                            <small class="me-2">${post.user.nickname}</small>
                            <span>${postDate}</span>
                            <i class="fas fa-eye ms-4"></i> ${viewsCount}
                            <i class="fas fa-thumbs-up ms-4"></i> 0
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
