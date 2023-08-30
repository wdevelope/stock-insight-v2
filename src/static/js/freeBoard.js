window.onload = function () {
  fetchAndRenderPosts();
};

// 🟠 자유게시판 검색
async function freeBoardSearch() {
  const searchOption = document.getElementById('searchOption').value;
  const searchValue = document.getElementById('searchInput').value;

  let queryParams = new URLSearchParams(); // 쿼리 문자열을 쉽게 생성하기 위해 URLSearchParams 사용
  queryParams.append('page', '1');

  if (searchOption === 'titleContent') {
    queryParams.append('title', searchValue);
    queryParams.append('description', searchValue);
  } else if (searchOption === 'nickname') {
    queryParams.append('title', searchValue);
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/find?${queryParams.toString()}`, // 쿼리 파라미터를 문자열로 변환하여 URL에 추가
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results.');
    }

    const data = await response.json();
    renderSearchResults(data); // 검색 결과를 화면에 표시하는 함수
  } catch (error) {
    console.error('Error during search:', error);
  }
}

// 🟠 자유게시판 검색 결과 렌더링
async function renderSearchResults(data) {
  data.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const boardElement = document.querySelector('#notice .list-group');
  let postHTML = '';

  for (const post of data) {
    const postDate = post.updated_at.split('T')[0];
    const likesCount = post.likeCount;
    const viewsCount = post.viewCount;
    console.log('검색 결과:', post);
    postHTML += `
                  <a href="http://localhost:3000/view/freeBoardInfo.html?freeBoardId=${post.id}" class="list-group-item list-group-item-action"                  
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
  }

  boardElement.innerHTML = postHTML;
}

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
      throw new Error('fetch res 에러');
    }

    const data = await response.json();
    console.log(data);
    data.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const boardElement = document.querySelector('#notice .list-group');
    let postHTML = '';

    for (const post of data) {
      const postDate = post.updated_at.split('T')[0];
      const likesCount = post.likeCount;
      const viewsCount = post.viewCount;
      console.log('자유게시판 렌더링 테스트:', post);
      postHTML += `
                    <a href="http://localhost:3000/view/freeBoardInfo.html?freeBoardId=${post.id}" class="list-group-item list-group-item-action"                  
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
    }

    boardElement.innerHTML = postHTML;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 🟠 조회수 불러오기
// async function viewsRender(boardId) {
//   try {
//     const response = await fetch(`http://localhost:3000/api/views/${boardId}`, {
//       method: 'GET',
//       headers: {
//         Authorization: token,
//       },
//     });

//     if (!response.ok) {
//       console.error('Failed to fetch view count for boardId:', boardId);
//       return 0;
//     }

//     const viewsCount = await response.json();
//     return viewsCount;
//   } catch (error) {
//     console.error('Error fetching views count for boardId:', boardId, error);
//     return 0;
//   }
// }

// 🟠 게시판 항목 클릭 이벤트 핸들러
function handleBoardItemClick(boardId) {
  fetch(`http://localhost:3000/api/views/${boardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
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
