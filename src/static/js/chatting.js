document.addEventListener('DOMContentLoaded', (event) => {
  const socket = io('');
  event.preventDefault();

  const chatBox = document.getElementById('chat-box');
  const messageInput = document.getElementById('message');
  const nicknameInput = document.getElementById('chattingNickname');
  const chatForm = document.getElementById('chat-form');

  socket.on('msgToClient', (messages) => {
    messages.reverse().forEach((message) => {
      chatBox.innerHTML += `<div>${message}</div>`;
    });
  });

  socket.on('connect', () => {
    console.log('connected');

    // 서버로부터 메시지를 받습니다.
  });

  chatForm.addEventListener('submit', function (event) {
    event.preventDefault(); // 폼 전송을 중단하여 페이지 새로고침 방지

    const nickname = nicknameInput.value;
    const message = messageInput.value;
    socket.emit('msgToServer', `${nickname}: ${message}`);
    messageInput.value = '';
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
