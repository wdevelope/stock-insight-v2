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
    const response = await fetch('/api/boards', {
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
    window.location = '/view/freeBoard.html';
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

// 🟡 공지사항 생성 함수
async function saveNoticeBoard() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;
  // 소켓io 포트번호
  const socket = io('');

  try {
    const response = await fetch('/api/noticeboards', {
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

    if (response.status === 400) {
      alert('글 작성 권한이 없습니다.');
      window.location = '/view/noticeBoard.html';
    } else {
      alert('글 작성이 완료되었습니다.');
      window.location = '/view/noticeBoard.html';
    }
  } catch (error) {
    console.error('Error saving post:', error);
  }
  // 소켓 이용해 보는중
  socket.on('ntcToClient', (notice) => {
    const noticebox = document.getElementById('notice-box');
    noticebox.innerHTML += `<div>${notice}</div>`;
  });

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  const text = '새 공지사항이 있습니다!';
  socket.emit('ntcToServer', text);
}

// 🟠 문의사항 게시글 생성 함수
async function saveAskBoard() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

  try {
    const response = await fetch('/api/askboards', {
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
    window.location = '/view/askBoard.html';
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

//🟠 문의 게시글 답글 생성
async function saveAskBoardReply() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

  try {
    const response = await fetch(`/api/askboards/${askReplyBoardId}/replies`, {
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
    alert('답글 작성이 완료되었습니다');
    window.location.href = '/view/askBoard.html';
  } catch (error) {
    console.log('답글 생성중 에러', error);
  }
}
