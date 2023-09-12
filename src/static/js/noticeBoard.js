document.addEventListener('DOMContentLoaded', () => {
  RenderNoticePosts();
});

// 🟢 공지사항 게시글 랜더링 함수
async function RenderNoticePosts() {
  try {
    const response = await fetch('/api/noticeboards', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const today = toKoreanTime(new Date().toISOString()).split('T')[0];

    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    const DEFAULT_IMAGE_URL = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = toKoreanTime(post.created_at).split('T')[0];
      const userImageUrl = post.user.imgUrl || DEFAULT_IMAGE_URL;
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

  // 공지사항 알림 창 띄우는 소켓
  const socket = io('');
  const noticebox = document.getElementById('notice-box');

  socket.on('ntcToClient', (notice) => {
    noticebox.innerHTML = `<div>${notice}</div>`;
    console.log(notice);
    if (notice === null) {
      noticebox.innerHTML = `<div></div>`;
    }
  });
}
