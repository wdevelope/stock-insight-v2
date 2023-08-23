// 게시글 생성 함수
async function savePost() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

  if (!title || !description) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });
    console.log(response);

    if (response.status === 201) {
      alert('게시글이 성공적으로 저장되었습니다.');
      location.href = 'http://localhost:3000/view/community.html';
    } else {
      alert('게시글 저장에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

// 공지사항 게시글 생성 함수
async function saveNoticePost() {
  const title = document.getElementById('noticePostTitle').value;
  const description = document.getElementById('noticePostContent').value;

  if (!title || !description) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/noticeboards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });

    if (response.status === 201) {
      alert('공지사항이 성공적으로 저장되었습니다.');
      location.reload(); // 페이지를 새로고침하여 새로운 공지사항 반영
    } else {
      alert('공지사항 저장에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error saving notice post:', error);
  }
}
