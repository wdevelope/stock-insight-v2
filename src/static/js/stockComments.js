document.addEventListener('DOMContentLoaded', () => {
  fetchStockComment();
});

// 주식 댓글 렌더링
async function fetchStockComment() {
  try {
    const response = await fetch(`/api/stocks/${stockId}/stockcomment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error('error');
    }

    const comments = await response.json();
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = ''; // Clear previous comments

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
                                    <button class="btn btn-primary" id="postCommentButton" onclick="createStockComment()">댓글 등록</button>
                                </div>
                            `;

    // 이벤트 리스너 추가
    document
      .getElementById('postCommentButton')
      .addEventListener('click', createComment);
  } catch (error) {
    console.error('Error fetching and rendering comments:', error);
  }
}

// 주식 상세 댓글 생성
async function createStockComment() {
  const textarea = document.querySelector('.form-control'); // textarea 변수 선언
  const comment = textarea.value;

  try {
    const response = await fetch(`/api/stocks/${stockId}/stockcomment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ comment: comment }),
    });

    if (!response.ok) {
      throw new Error('Error creating comment');
    }

    textarea.value = ''; // Clear textarea
    fetchStockComment(); // Refresh comments
  } catch (error) {
    console.error('Error creating comment:', error);
  }
}
// 주식 상세 댓글 삭제
async function deleteComment(commentId) {
  try {
    const response = await fetch(
      `/api/stocks/${stockId}/stockcomment/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error deleting comment');
    }

    fetchStockComment(); // Refresh comments
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
}
