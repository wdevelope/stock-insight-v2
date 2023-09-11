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
  });

  chatForm.addEventListener('submit', function (event) {
    event.preventDefault(); // 폼 전송을 중단하여 페이지 새로고침 방지

    // 현재 시간을 'HH:mm:ss' 형식으로 가져오기
    const currentTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const nickname = nicknameInput.value;
    const message = messageInput.value;
    socket.emit(
      'msgToServer',
      `<span class="chat-time">[${currentTime}]</span> ${nickname}: ${message}`,
    );
    messageInput.value = '';
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
