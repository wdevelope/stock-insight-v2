window.onload = renderUserDetails;

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
}

// 🟡 s3 이미지 생성
async function uploadImageToServer() {
  try {
    const fileInput = document.getElementById('profileImageInput');
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3000/api/upload', {
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
