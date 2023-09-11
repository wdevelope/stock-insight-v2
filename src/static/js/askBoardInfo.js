document.addEventListener('DOMContentLoaded', function () {
  fetchAskePostDetails();
});

// 🟡 문의게시판 상세페이지 렌더링
async function fetchAskePostDetails() {
  try {
    const response = await fetch(`/api/askBoards/${askBoardId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      alert('권한이 없습니다.');
      window.location.href = '/askBoard';
    }

    const askBoard = await response.json();

    const defaultImageUrl = 'https://ifh.cc/g/a2Sg64.png';
    const userImage = askBoard.user.imgUrl || defaultImageUrl;
    const postDate = toKoreanTime(askBoard.created_at).split('T')[0];
    const boardContainer = document.querySelector('main');
    const askBoardContainer = boardContainer.querySelector('.post-content');
    const formattedDescription = askBoard.description.replace(/\n/g, '<br>');

    askBoardContainer.innerHTML = `
                                    <div class="d-flex justify-content-between align-items-center position-relative">
                                    <h3>${askBoard.title}</h3>
                                    <div class="putdelbutton position-absolute end-0" style="top: 100%;"> 
                                      <button class="btn btn-secondary delete-post" onclick="deleteAskPost()">삭제</button>
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
                                  <img src="${userImage}" alt="Author's Image" style="width: 30px; height: 30px; border-radius: 50%;"> 
                                   <span class="author">${askBoard.user.nickname}</span> | 날짜: <span class="date">${postDate}</span>
                                  </p>
                                  <p>${formattedDescription}</p>
                                  <br/><br/>
                                  <a type="button" class="btn btn-secondary" href="/askBoardReply?askBoardId=${askBoardId}">답글 달기</a>                                `;
    boardContainer.style.display = 'block';

    // 답글 가져오기
    const replies = await fetchReply(askBoardId);
    if (replies && replies.length) {
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'replies-section';
      replies.forEach((reply) => {
        const replyEl = document.createElement('div');
        const replyDate = toKoreanTime(reply.created_at).split('T')[0];
        replyEl.className = 'reply';
        replyEl.innerHTML = `
                             <h4>${reply.title}</h4>
                             <p class="text-muted">
                               <span class="author">${reply.user.nickname}</span> | 날짜: <span class="date">${replyDate}</span>
                             </p>
                             <p>${reply.description}</p>
                             <hr/>`;
        repliesContainer.appendChild(replyEl);
      });
      boardContainer.appendChild(repliesContainer);
    }
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
}

// 🟡 답글 조회
async function fetchReply(askBoardId) {
  try {
    const response = await fetch(`/api/askboards/${askBoardId}/replies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const reply = await response.json();

    return reply;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
}

// 🟡 게시글 삭제 함수
async function deleteAskPost() {
  try {
    const response = await fetch(`/api/askboards/${askBoardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete the post');
    }

    alert('게시글이 삭제되었습니다.');
    window.location.href = '/askBoard';
  } catch (error) {
    alert('게시글 삭제에 실패했습니다.');
    console.error('Error deleting post:', error);
  }
}
