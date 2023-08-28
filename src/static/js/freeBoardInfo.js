document.addEventListener('DOMContentLoaded', function () {
  fetchBoardDetailsForEdit();
  fetchPostDetails();
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

    const freeBoard = await response.json();
    const likeText = freeBoard.likeCount || 0;

    const boardContainer = document.querySelector('.board-container');

    // 자유 게시글 상세페이지
    const freeBoardContainerContent =
      boardContainer.querySelector('.post-content');
    freeBoardContainerContent.innerHTML = `
                                            <div class="d-flex justify-content-between align-items-center position-relative"> 
                                                <h3>${freeBoard.title}</h3>
                                                <div class="putdelbutton position-absolute end-0" style="top: 100%;"> 
                                                  <a href="http://localhost:3000/view/freeEditBoard.html?freeEditBoardId=${freeBoard.id}" class="btn btn-secondary edit-post">수정</a>
                                                  <button class="btn btn-secondary delete-post" onclick="deleteFreePost()">삭제</button>
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
                                                작성자: <span class="author">${freeBoard.id}</span> | 날짜: <span class="date">${freeBoard.created_at}</span>
                                            </p>
                                            <p>${freeBoard.description}</p>
                                            <button class="btn btn-primary" onclick="handleLikeClick()">👍  (${likeText})</button>
                                        `;

    // 댓글 섹션 업데이트
    const commentsSection = boardContainer.querySelector('.comments-section');
    const commentsList = commentsSection.querySelector('.list-group');
    const comments = freeBoard.comment || [];
    // 댓글 날짜만
    function formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(date.getDate()).padStart(2, '0')}`;
    }

    const commentsHTML = comments
      .map(
        (comment) => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between">
                                <strong>${comment.id}</strong>
                                <small>${formatDate(comment.updated_at)}</small>
                            </div>
                            <p class="mt-2">${comment.comment}</p>
                        </div>
                    `,
      )
      .join('');

    commentsList.innerHTML = `
                              ${commentsHTML}
                                <div>
                                <br>
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

//⚪ 게시글 삭제 함수
async function deleteFreePost() {
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
    if (!response.ok) {
      throw new Error('Failed to delete the post');
    }

    alert('게시글이 삭제되었습니다.');
    window.location.href = 'http://localhost:3000/view/freeBoard.html';
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

//⚪ 게시글 수정 함수
async function fetchBoardDetailsForEdit() {
  console.log(freeEditBoardId);
  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${freeEditBoardId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('패치 응답 에러');
    }

    const freeBoardId = await response.json();
    document.getElementById('titleInput').value = freeBoardId.title;
    document.getElementById('descriptionInput').value = freeBoardId.description;
  } catch (error) {
    console.error('Error fetching board details:', error);
  }
}

async function submitEdit() {
  const title = document.getElementById('editTitle').value;
  const description = document.getElementById('editDescription').value;
  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${freeEditBoardId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
      },
    );
    console.log(response);
    if (!response) {
      throw new Error('서버 접속 실패');
    }
    alert('게시글이 수정되었습니다.');
    window.location.href = 'http://localhost:3000/view/freeBoard.html';
  } catch (error) {
    console.log(err);
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
