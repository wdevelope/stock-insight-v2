const token = getCookie('Authorization');

function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search,
      ) || [, ''])[1].replace(/\+/g, '%20'),
    ) || null
  );
}

// 쿼리에서 boardId 가져옴
const freeBoardId = getURLParameter('freeBoardId');
const noticeBoardId = getURLParameter('noticeBoardId');
const askBoardId = getURLParameter('askBoardId');
const freeEditBoardId = getURLParameter('freeEditBoardId');
// const noticeBoardId = getURLParameter('noticeBoardId');

// 🟠 쿠키없으면 돌려보냄
document.addEventListener('DOMContentLoaded', () => {
  let currentURL = window.location.href;

  let navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (currentURL === link.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const token = getCookie('Authorization');

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'http://localhost:3000';
  }
});

// 🟠 쿠키 가져오기 함수
function getCookie(cookieName) {
  let name = cookieName + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

// 🟠 유저 디테일
async function fetchUserDetails() {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    console.log('유저 상세 정보  데이터 테스트', data);

    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

// 🟠 프로필 토글
async function toggleProfile() {
  const userDetailsElem = document.getElementById('userDetails');
  const profileImageElem = document.getElementById('profileImage');

  if (
    userDetailsElem.style.display === 'none' ||
    !userDetailsElem.style.display
  ) {
    const data = await fetchUserDetails();
    console.log('유저 정보 토글 데이터 테스트', data);

    if (data) {
      document.getElementById('nickname').textContent = data.nickname;
      document.getElementById('email').textContent = data.email;

      // 이미지 URL을 이미지 엘리먼트의 src 속성에 설정합니다.
      if (data.imgUrl) {
        profileImageElem.src = data.imgUrl;
      } else {
        // 만약 imgUrl 데이터가 없다면, 기본 이미지로 설정합니다.
        profileImageElem.src = 'https://ifh.cc/g/P5Wo5H.png';
      }

      userDetailsElem.style.display = 'block';
    }
  } else {
    userDetailsElem.style.display = 'none';
  }
}

// 🟠  수정,삭제 버튼 토글 기능
function toggleControlButtons() {
  const controlButtons = document.querySelector('.putdelbutton');
  if (
    controlButtons.style.display === 'none' ||
    !controlButtons.style.display
  ) {
    controlButtons.style.display = 'block';
  } else {
    controlButtons.style.display = 'none';
  }
}

// 🟠 로그아웃 함수
function logout() {
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  }
  deleteCookie('Authorization');
  alert('로그아웃 완료');
  window.location.href = 'http://localhost:3000';
}

//뒤로가기
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    location.reload();
  }
});
