document.addEventListener('DOMContentLoaded', function () {
  fetchAskePostDetails();
});

// 🟡 문의게시판 상세페이지 렌더링
async function fetchAskePostDetails() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/askBoards/${askBoardId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      alert('권한이 없습니다.');
      window.location.href = 'http://localhost:3000/view/askBoard.html';
    }
    const askBoard = await response.json();

    const boardContainer = document.querySelector('.board-container');
    // 공지 게시글 상세페이지
    const askBoardContainer = boardContainer.querySelector('.post-content');
    askBoardContainer.innerHTML = `
                                          <div class="d-flex justify-content-between align-items-center position-relative">
                                              <h3>${askBoard.title}</h3>
                                              <div class="putdelbutton position-absolute end-0" style="top: 100%;"> 
                                                  <button class="btn btn-secondary edit-post">수정</button>
                                                  <button class="btn btn-secondary delete-post" onclick="deletePost()">삭제</button>
                                              </div>
                                              <button
                                                class="btn btn-light ms-auto"
                                                style="font-size: 1.5em; padding: 0.5em 1em"
                                                onclick="toggleControlButtons()"
                                              >
                                                ⋮
                                              </button>   
                                          </div>         
                                          <p class="text-muted post-info">
                                              작성자: <span class="author">${askBoard.id}</span> | 날짜: <span class="date">${askBoard.created_at}</span>
                                          </p>
                                          <p>${askBoard.description}</p>
                                      `;
    boardContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}
