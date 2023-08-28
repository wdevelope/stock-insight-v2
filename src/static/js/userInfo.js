window.onload = renderUserDetails;

//🟡 유저 상세페이지 렌더링
async function renderUserDetails() {
  const mainProfileImageElem = document.getElementById('mainProfileImage');
  const mainNicknameElem = document.getElementById('mainNickname');
  const mainEmailElem = document.getElementById('mainEmail');

  const data = await fetchUserDetails();

  // 이미지 렌더링
  if (data.imgUrl) {
    mainProfileImageElem.src = data.imgUrl;
  } else {
    mainProfileImageElem.src = 'https://ifh.cc/g/P5Wo5H.png';
  }

  // 닉네임 및 이메일 렌더링
  mainNicknameElem.textContent = data.nickname || '사용자닉네임';
  mainEmailElem.textContent = data.email || 'example@example.com';
  mainPoint.textContent = data.point || 100;
}

// 페이지 로드 시 사용자 정보를 렌더링합니다.

// 🟡 s3 이미지 생성
function uploadImageToServer() {
  const fileInput = document.getElementById('profileImageInput');
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  fetch('http://localhost:3000/api/upload', {
    headers: {
      Authorization: token,
    },
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.url) {
        const imageElement = document.getElementById('mainProfileImage');
        imageElement.src = data.url;
      } else {
        console.error('Upload 실패:');
        alert('업로드 실패!');
      }
    })
    .catch((error) => {
      alert('업로드 중 오류 발생', error);
    });
}
