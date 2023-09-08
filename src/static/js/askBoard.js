document.addEventListener('DOMContentLoaded', () => {
  RenderAskPosts();
});

// 🟠 문의게시판 글 랜더링 함수
async function RenderAskPosts() {
  try {
    const response = await fetch('/api/askboards', {
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

    const defaultImage = 'https://ifh.cc/g/a2Sg64.png';

    for (const post of data) {
      const postDate = post.created_at.split('T')[0];
      const userImageUrl = post.user.imgUrl || defaultImage;

      postHTML += `
                      <a href="/view/askBoardInfo.html?askBoardId=${post.id}" class="list-group-item list-group-item-action"                  
                      onclick="handleBoardItemClick(${post.id})">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span>[문의]</span>
                            <strong class="mb-1 ms-2">${post.title} <i class="fa-solid fa-lock"></i></strong>
                          </div>
                          <div>
                          <img src="${userImageUrl}"  class="me-2 board-user-image"> 
                            <small class="me-2">${post.user.nickname}</small>
                            <span>${postDate}</span>
                 
                          </div>
                        </div>
                      </a>
                    `;
    }

    boardElement.innerHTML = postHTML;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 🟠 문의 게시글 답글 조회
// async function getRepliesForPost(postId) {
//   const response = await fetch(
//     `/api/askboards/${postId}/replies`,
//     {
//       headers: {
//         Authorization: token,
//       },
//     },
//   );

//   if (!response.ok) {
//     throw new Error('Failed to fetch replies');
//   }

//   return await response.json();
// }
