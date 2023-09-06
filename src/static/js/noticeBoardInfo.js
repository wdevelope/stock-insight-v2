document.addEventListener('DOMContentLoaded', function () {
  fetchNoticePostDetails();
});

// 🟢 공지게시판 상세페이지 렌더링
async function fetchNoticePostDetails() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/noticeBoards/${noticeBoardId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('패치 응답 에러');
    }
    const noticeBoard = await response.json();
    console.log('공지게시판 데이터 테스트', noticeBoard);
    const defaultImageUrl = 'https://ifh.cc/g/a2Sg64.png';
    const authorImage = noticeBoard.user.imgUrl || defaultImageUrl;

    const boardContainer = document.querySelector('.board-container');
    // 공지 게시글 상세페이지
    const noticeBoardContainer = boardContainer.querySelector('.post-content');
    noticeBoardContainer.innerHTML = `
                                          <div class="d-flex justify-content-between align-items-center position-relative"> 
                                              <h3>${noticeBoard.title}</h3>
                                              <div class="putdelbutton position-absolute end-0" style="top: 100%;">
                                                  <button class="btn btn-secondary edit-post">수정</button>
                                                  <button class="btn btn-secondary delete-post" onclick="deleteNoticePost()">삭제</button>
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
                                          <img src="${authorImage}" alt="Author's Image" style="width: 30px; height: 30px; border-radius: 50%;"> <!-- 작성자의 이미지 추가 -->
                                             <span class="author">${noticeBoard.user.nickname}</span> | 날짜: <span class="date">${noticeBoard.created_at}</span>
                                          </p>
                                          <p>${noticeBoard.description}</p>
                                          <button class="btn btn-primary" onclick="handleLikeClick()">👍 (0)</button>
                                      `;
    boardContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

// 🟢 공지 게시글 삭제 함수
async function deleteNoticePost() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/noticeboards/${noticeBoardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete the post');
    }

    alert('게시글이 삭제되었습니다.');
    window.location.href = 'http://localhost:3000/view/noticeBoard.html';
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('Error deleting post:', error);
  }
}

// 🟢 댓글 생성
async function createComment() {
  const commentBox = document.querySelector('textarea');
  const commentContent = commentBox.value;

  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${freeBoardId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ comment: commentContent }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to post comment');
    }

    commentBox.value = ''; // clear the comment box
    fetchPostDetails();
    alert('댓글 작성이 성공했습니다.');
  } catch (error) {
    console.error('Error posting comment:', error);
  }
}

// 🟢 좋아요 기능
async function handleLikeClick() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/likes/${freeBoardId}`,
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 201) {
      // 좋아요 처리가 성공하면 게시글 상세 정보를 다시 불러옵니다.
      await fetchPostDetails();
    } else {
      alert('좋아요 처리에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error processing like:', error);
  }
}
