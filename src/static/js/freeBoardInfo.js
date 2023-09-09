document.addEventListener('DOMContentLoaded', function () {
  fetchPostDetails();
});

// ⚪ 자유게시판 상세페이지 렌더링
async function fetchPostDetails() {
  try {
    const response = await fetch(`/api/boards/${freeBoardId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('패치 응답 에러');
    }

    const freeBoard = await response.json();
    const likeText = freeBoard.likeCount || 0;

    const defaultImageUrl = 'https://ifh.cc/g/a2Sg64.png';
    const authorImage = freeBoard.imgUrl || defaultImageUrl;

    const boardContainer = document.querySelector('.board-container');

    // 자유 게시글 상세페이지
    const freeBoardContainerContent =
      boardContainer.querySelector('.post-content');
    const postDate = toKoreanTime(freeBoard.created_at).split('T')[0];

    freeBoardContainerContent.innerHTML = `
                                            <div class="d-flex justify-content-between align-items-center position-relative"> 
                                                <h3>${freeBoard.title}</h3>
                                                <div class="putdelbutton position-absolute end-0" style="top: 100%;"> 
                                                  <a href="/view/freeEditBoard.html?freeEditBoardId=${freeBoard.id}" class="btn btn-secondary edit-post">수정</a>
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
                                            <img src="${authorImage}" alt="Author's Image" style="width: 30px; height: 30px; border-radius: 50%;">
                                               <span class="author">${freeBoard.nickname}</span> | 날짜: <span class="date">${postDate}</span>
                                            </p>
                                            <p>${freeBoard.description}</p>
                                            <button class="btn btn-primary" onclick="handleLikeClick()">👍(${likeText})</button>
                                        `;

    // 댓글 섹션 업데이트
    const comments = await fetchComments(freeBoardId);
    const commentsSection = boardContainer.querySelector('.comments-section');
    const commentsList = commentsSection.querySelector('.list-group');

    // 댓글 날짜만
    const commentsHTML = comments
      .map((comment) => {
        const commentImage = comment.user.imgUrl || defaultImageUrl;
        const commentDate = toKoreanTime(comment.created_at).split('T')[0];

        return `
                  <div class="list-group-item">
                      <div class="d-flex justify-content-between align-items-center">
                          <div class="d-flex align-items-center">
                              <img src="${commentImage}" alt="Author's Image" style="width: 30px; height: 30px; border-radius: 50%;">
                              <strong class="ms-2">${comment.user.nickname}</strong>
                          </div>
                          <div>
                              <button class="btn-close" aria-label="Close" onclick="deleteComment(${comment.id})"></button>
                          </div>
                      </div>
                      <p class="mt-2">${comment.comment}</p>
                      <div style="text-align: right;">
                          <small>${commentDate}</small>
                      </div>
                  </div>
              `;
      })
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
    const response = await fetch(`/api/boards/${freeBoardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('삭제 권한이 없습니다.');
    }

    alert('게시글이 삭제되었습니다.');
    window.location.href = '/view/freeBoard.html';
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('Error deleting post:', error);
  }
}

// ⚪ 댓글 조회
async function fetchComments(freeBoardId) {
  try {
    const response = await fetch(`/api/boards/${freeBoardId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const comments = await response.json();

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
}

// ⚪ 댓글 생성
async function createComment() {
  const commentBox = document.querySelector('textarea');
  const commentContent = commentBox.value;

  try {
    const response = await fetch(`/api/boards/${freeBoardId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ comment: commentContent }),
    });

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

// ⚪ 댓글 삭제
async function deleteComment(commentId) {
  try {
    const response = await fetch(
      `/api/boards/${freeBoardId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('댓글 삭제에 실패했습니다.');
    }

    alert('댓글이 삭제되었습니다.');
    fetchPostDetails();
  } catch (error) {
    alert('댓글 삭제에 실패했습니다.');
    console.error('Error deleting comment:', error);
  }
}

// ⚪ 좋아요 기능
async function handleLikeClick() {
  try {
    const response = await fetch(`/api/likes/${freeBoardId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      await fetchPostDetails();
    } else {
      alert('좋아요 처리에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error processing like:', error);
  }
}
