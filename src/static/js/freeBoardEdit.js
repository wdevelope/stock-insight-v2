document.addEventListener('DOMContentLoaded', function () {
  fetchBoardDetailsForEdit();
});

//⚪ 게시글 수정 기존 정보 렌더링
async function fetchBoardDetailsForEdit() {
  try {
    const response = await fetch(`/api/boards/${freeEditBoardId}`, {
      headers: {
        Authorization: token,
      },
    });

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

// ⚪ 게시글 수정
async function submitEdit() {
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;

  try {
    const response = await fetch(`/api/boards/${freeEditBoardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        alert('수정 권한이 없습니다.');
      } else {
        throw new Error('서버 접속 실패');
      }
      return;
    }
    alert('게시글이 수정되었습니다.');
    window.location.href = `/view/freeBoardInfo.html?freeBoardId=${freeEditBoardId}`;
  } catch (error) {
    console.log(err);
  }
}
