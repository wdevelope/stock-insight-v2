document.addEventListener('DOMContentLoaded', () => {
  renderUserDetails();
});

let currentPage = 1;
let userId;

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
  userId = data.id;
  renderUserQuizzes(userId);
}

//🟡 비밀번호 변경 함수
async function changePassword() {
  const password = document.getElementById('password').value;
  const newPassword = document.getElementById('newPassword').value;
  const newConfirm = document.getElementById('newConfirm').value;

  if (password && newPassword && newConfirm) {
    if (newPassword !== newConfirm) {
      alert('새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    const body = {
      password,
      newPassword,
      newConfirm,
    };
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        // 모달창 닫기
        const modalInstance = bootstrap.Modal.getInstance(
          document.getElementById('passwordChangeModal'),
        );
        modalInstance.hide();
      } else {
        const data = await response.json();
        alert(data.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('서버에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  } else {
    alert('모든 필드를 채워주세요.');
  }
}
// 닉네임 변경
async function changeNickname() {
  try {
    const password = document.getElementById('nickpassword').value;
    const nickname = document.getElementById('changenickname').value;
    const body = {
      password,
      nickname,
    };
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.statusCode === 201) {
      alert('닉네임이 변경되었습니다.');
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('nicknameChangeModal'),
      );
      modal.hide();
      location.reload();
    } else {
      throw new Error('API responded with non-200 status code');
    }
  } catch (error) {
    console.error('닉네임 변경 중 오류 발생:', error);
    alert('닉네임 변경에 실패하였습니다. 다시 시도해 주세요.');
  }
}

// 페이지네이션
document.getElementById('prevPage').addEventListener('click', function () {
  if (currentPage > 1) {
    currentPage--;
    renderUserQuizzes(userId, currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', function () {
  currentPage++;
  renderUserQuizzes(userId, currentPage);
});

// 🟢 퀴즈 현황 불러오기
async function fetchUserQuizzes(userId, page = 1) {
  const baseUrl = '/quiz/userQuiz';
  const queryParams = `?page=${page}&userId=${userId}`;

  try {
    const response = await fetch(baseUrl + queryParams);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API 호출 중 오류가 발생했습니다.');
    }
    return data;
  } catch (error) {
    console.error('Error fetching user quizzes:', error.message);
    throw error;
  }
}

async function renderUserQuizzes(userId, page = 1) {
  const quizContainer = document.getElementById('userQuizzes');
  const totalQuizzesEl = document.getElementById('totalQuizzes');
  const correctPercentageEl = document.getElementById('correctPercentage'); // 새로운 정답률을 표시할 요소 ID

  try {
    const quizResponse = await fetchUserQuizzes(userId, page);
    const quizzes = quizResponse.data;
    const lastPage = quizResponse.last_page;
    const totalQuizSubmissions = quizResponse.total;

    // 새로운 API 호출
    const correctResponse = await fetch(
      `http://localhost:3000/quiz/correct/${userId}`,
    );
    const correctPercentage = await correctResponse.json();

    quizzes.sort((a, b) => b.updated_date.localeCompare(a.updated_date));
    quizContainer.innerHTML = '';
    quizzes.forEach((quiz) => {
      let resultText = '';
      let bgColor = '';

      if (quiz.correct === null) {
        resultText = '대기중';
        bgColor = '#b0b5c2b7';
      } else if (quiz.correct === 'true') {
        resultText = '맞춤';
        bgColor = '#f3722ca5';
      } else {
        resultText = '틀림';
        bgColor = '#a3cef1';
      }

      const quizItem = document.createElement('li');
      quizItem.classList.add('list-group-item');
      quizItem.style.backgroundColor = bgColor;
      quizItem.innerHTML = `
              <div id="userInfoQuiz" onclick="navigateToStockDetail('${quiz.stockId}')">
                <strong>${quiz.stock.prdt_abrv_name} (${quiz.stockId}) </strong>
                <br>
                <strong>예측:</strong> ${quiz.upANDdown} 
                <strong>결과:</strong> ${resultText}
                <span style="float: right;"><strong>${quiz.updated_date}</strong></span> 
              </div>`;

      quizContainer.appendChild(quizItem);
    });

    // 페이지 정보 업데이트
    document.getElementById('currentPage').textContent = currentPage;
    totalQuizzesEl.textContent = `총 퀴즈 제출 개수: ${totalQuizSubmissions}`;
    correctPercentageEl.textContent = `정답률: ${correctPercentage}%`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === lastPage;
  } catch (error) {
    console.error('Error rendering user quizzes:', error.message);
  }
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

// 주식 상세 페이지로 이동
function navigateToStockDetail(id) {
  window.location.href = `stocksInfo?id=${id}`;
}
