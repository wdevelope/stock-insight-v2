function getQueryParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const askReplyBoardId = getQueryParameterByName('askBoardId');

// 🔴 게시글 생성 함수
async function saveFreeBoard() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

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

    if (!response.ok) {
      throw new Error('Failed to save the post');
    }
    alert('글 작성이 완료되었습니다.');
    window.location = 'http://localhost:3000/view/freeBoard.html';
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

// 🟡 공지사항 생성 함수
async function saveNoticeBoard() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;
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
    if (!response.ok) {
      throw new Error('Failed to save the post');
    }
    alert('글 작성이 완료되었습니다.');
    window.location = 'http://localhost:3000/view/noticeBoard.html';
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

// 🟠 문의사항 게시글 생성 함수
async function saveAskBoard() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

  try {
    const response = await fetch('http://localhost:3000/api/askboards', {
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

    if (!response.ok) {
      throw new Error('Failed to save the post');
    }
    alert('글 작성이 완료되었습니다.');
    window.location = 'http://localhost:3000/view/askBoard.html';
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

//🟠 문의 게시글 답글 생성
async function saveAskBoardReply() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;
  console.log(title, description);

  try {
    const response = await fetch(
      `http://localhost:3000/api/askboards/${askReplyBoardId}/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to save the post');
    }
    alert('답글 작성이 완료되었습니다');
    window.location.href = 'http://localhost:3000/view/askBoard.html';
  } catch (error) {
    console.log('답글 생성중 에러', error);
  }
}
