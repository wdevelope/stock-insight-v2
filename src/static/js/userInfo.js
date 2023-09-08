document.addEventListener('DOMContentLoaded', () => {
  renderUserDetails();
});

//🟡 유저 상세페이지 렌더링
async function renderUserDetails() {
  const userProfileImage = document.getElementById('mainProfileImage');
  const userNickname = document.getElementById('mainNickname');
  const userEmail = document.getElementById('mainEmail');
  const userPoint = document.getElementById('mainPoint');
  const userStatus = document.getElementById('mainStatus');

  const data = await fetchUserDetails();

  // 이미지 렌더링
  if (data.imgUrl) {
    userProfileImage.src = data.imgUrl;
  } else {
    userProfileImage.src = 'https://ifh.cc/g/YacO4N.png';
  }

  // 닉네임 및 이메일 렌더링
  userNickname.textContent = data.nickname;
  userEmail.textContent = data.email;
  userPoint.textContent = data.point;
  userStatus.textContent = data.status;

  const userId = data.id;
  renderUserQuizzes(userId);
}

// 🟡 s3 이미지 생성
async function uploadImageToServer() {
  try {
    const fileInput = document.getElementById('profileImageInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      headers: {
        Authorization: token,
      },
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.url) {
      const imageElement = document.getElementById('mainProfileImage');
      imageElement.src = data.url;
    } else {
      console.error('Upload 실패:');
      alert('업로드 실패!');
    }
  } catch (error) {
    alert('업로드 중 오류 발생: ' + error);
  }
}

async function fetchUserQuizzes(userId, page = 1) {
  const baseUrl = '/quiz/userQuiz';
  const queryParams = `?page=${page}&userId=${userId}`;

  try {
    const response = await fetch(baseUrl + queryParams);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.message || 'API 호출 중 오류가 발생했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user quizzes:', error.message);
    throw error;
  }
}

async function renderUserQuizzes(userId) {
  const quizContainer = document.getElementById('userQuizzes');

  try {
    const response = await fetchUserQuizzes(userId);
    const quizzes = response.data;

    quizContainer.innerHTML = '';

    quizzes.forEach((quiz) => {
      const quizItem = document.createElement('li');
      quizItem.classList.add('list-group-item');

      // 데이터를 문자열로 변환하여 렌더링
      quizItem.innerHTML = `
        <strong>주식 코드명 :</strong> ${quiz.stockId} 
        <br>
        <strong>예측:</strong> ${quiz.upANDdown} 
        <strong>맞춤:</strong> ${quiz.correct === null ? 'null' : quiz.correct} 
        <strong>날짜:</strong> ${quiz.updated_date}
      `;

      quizContainer.appendChild(quizItem);
    });
  } catch (error) {
    console.error('Error rendering user quizzes:', error.message);
  }
}
