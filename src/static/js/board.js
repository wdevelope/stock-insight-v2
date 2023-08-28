function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search,
      ) || [, ''])[1].replace(/\+/g, '%20'),
    ) || null
  );
}

// 쿼리에서 boardId 가져옴
const freeBoardId = getURLParameter('freeBoardId');
const noticeBoardId = getURLParameter('noticeBoardId');
const askBoardId = getURLParameter('askBoardId');

document.addEventListener('DOMContentLoaded', function () {
  // 현재 URL에서 게시판 타입을 판별하는 로직
  if (freeBoardId) {
    fetchPostDetails();
  } else if (noticeBoardId) {
    fetchNoticePostDetails();
  } else if (askBoardId) {
    fetchAskePostDetails();
  }
});

// ⚪ 자유게시판 상세페이지 렌더링
async function fetchPostDetails() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${freeBoardId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('패치 응답 에러');
    }

    const board = await response.json();
    const likeText = board.likeCount || 0;

    const boardContainer = document.querySelector('.board-container');

    // 게시글 헤더 업데이트
    const postHeader = boardContainer.querySelector('.post-header');
    postHeader.innerHTML = `
                              <div class="d-flex justify-content-between align-items-center position-relative"> <!-- position-relative 추가 -->
                                  <h3>${board.title}</h3>
                                  <div class="putdelbutton position-absolute end-0" style="top: 100%;"> <!-- position-absolute, end-0, top: 100% 추가 -->
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
                                  작성자: <span class="author">${board.id}</span> | 날짜: <span class="date">${board.updated_at}</span>
                              </p>
                          `;

    // 게시글 본문 업데이트
    const postContent = boardContainer.querySelector('.post-content');
    postContent.innerHTML = `
                                <p>${board.description}</p>
                                <button class="btn btn-primary" onclick="handleLikeClick()">👍 좋아요 (${likeText})</button>
                            `;

    // 댓글 섹션 업데이트
    const commentsSection = boardContainer.querySelector('.comments-section');
    const commentsList = commentsSection.querySelector('.list-group');
    const comments = board.comment || [];

    const commentsHTML = comments
      .map(
        (comment) => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between">
                                <strong>${comment.id}</strong>
                                <small>${comment.updated_at}</small>
                            </div>
                            <p class="mt-2">${comment.comment}</p>
                        </div>
                    `,
      )
      .join('');

    commentsList.innerHTML = `
                              ${commentsHTML}
                                <div>
                                    <h5>댓글 작성하기</h5>
                                    <textarea class="form-control mb-3" rows="4" placeholder="댓글을 입력하세요..."></textarea>
                                    <button class="btn btn-primary" id="postCommentButton">댓글 등록</button>
                                </div>
                            `;

    // 이벤트 리스너 추가
    document
      .getElementById('postCommentButton')
      .addEventListener('click', createComment);

    boardContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

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
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

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
      throw new Error('패치 응답 에러');
    }
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

//⚪ 게시글 삭제 함수
async function deletePost() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${freeBoardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      },
    );
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to delete the post');
    }

    alert('게시글이 삭제되었습니다.');
    location.reload();
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('Error deleting post:', error);
  }
}

// ⚪ 댓글 생성
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

// ⚪ 좋아요 기능
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
// 수정,삭제 토글 기능
function toggleControlButtons() {
  const controlButtons = document.querySelector('.putdelbutton');
  if (
    controlButtons.style.display === 'none' ||
    !controlButtons.style.display
  ) {
    controlButtons.style.display = 'block';
  } else {
    controlButtons.style.display = 'none';
  }
}
