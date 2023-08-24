function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search,
      ) || [, ''])[1].replace(/\+/g, '%20'),
    ) || null
  );
}

const boardId = getURLParameter('postId');

// ⚪ 게시글 상세페이지 렌더링
async function fetchPostDetails() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${boardId}`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch post details');
    }

    const board = await response.json();

    document.querySelector('.board-container h3').innerHTML = board.title;
    document.querySelector('.board-container .text-muted span').innerHTML =
      board.id; // 작성자 필드
    document.querySelector('.board-container .text-muted span').innerHTML =
      board.id; // 날짜
    document.querySelector('.board-container div.mb-5 p').innerHTML =
      board.description;

    // 좋아요 버튼 추가
    document.querySelector(
      '.board-container .btn.btn-primary',
    ).innerText = `👍 좋아요 (${board.likes.length})`;

    document
      .querySelector('.board-container .btn.btn-primary')
      .addEventListener('click', handleLikeClick);

    // Rendering comments
    const commentsList = document.querySelector('.board-container .list-group');
    const comments = board.comment || [];

    // 댓글 목록만 매핑
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

    // 댓글 작성 섹션
    const commentFormHTML = `
                              <div>
                                  <h5>댓글 작성하기</h5>
                                  <textarea class="form-control mb-3" rows="4" placeholder="댓글을 입력하세요..."></textarea>
                                  <button class="btn btn-primary" id="postCommentButton">댓글 등록</button>
                              </div>
                            `;

    // 댓글 목록과 댓글 작성 섹션을 합치기
    commentsList.innerHTML = commentsHTML + commentFormHTML;
    document
      .getElementById('postCommentButton')
      .addEventListener('click', createComment);

    const boardContainer = document.querySelector('.board-container');
    boardContainer.style.display = 'block';
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

// ⚪ 게시글 삭제 함수
// async function deletePost() {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/boards/${boardId}`,
//       {
//         method: 'DELETE',
//         headers: {
//           Authorization: token,
//         },
//       },
//     );
//     if (!response.ok) {
//       throw new Error('Failed to delete the post');
//     }

//     alert('게시글이 삭제되었습니다.');
//     location.reload();
//   } catch (error) {
//     alert('게시글 삭제에 실패했습니다.');
//     console.error('Error deleting post:', error);
//   }
// }

// ⚪ 댓글 생성
async function createComment() {
  const commentBox = document.querySelector('textarea');
  const commentContent = commentBox.value;

  if (!commentContent) {
    alert('댓글을 입력하세요.');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/boards/${boardId}/comments`,
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
    const response = await fetch(`http://localhost:3000/api/likes/${boardId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

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

document.addEventListener('DOMContentLoaded', fetchPostDetails);
