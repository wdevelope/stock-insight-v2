// 🟠 토큰 전역변수 지정
const token = getCookie('Authorization');

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

  if (!token) {
    alert('로그인이 필요합니다.');
    window.location.href = 'http://localhost:3000';
  }
});

// 🟠 유저 디테일 불러오기
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
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

// 🟠 유저 정보 토글함수
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

      // 이미지 URL을 이미지 엘리먼트의 src 속성에 설정
      if (data.imgUrl) {
        profileImageElem.src = data.imgUrl;
      } else {
        profileImageElem.src = 'https://ifh.cc/g/YacO4N.png';
      }

      userDetailsElem.style.display = 'block';
    }
  } else {
    userDetailsElem.style.display = 'none';
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

// 🟠 query url에서 Id값들 가져오는 코드들
function getURLParameter(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.search,
      ) || [, ''])[1].replace(/\+/g, '%20'),
    ) || null
  );
}

const freeBoardId = getURLParameter('freeBoardId');
const noticeBoardId = getURLParameter('noticeBoardId');
const askBoardId = getURLParameter('askBoardId');

const freeEditBoardId = getURLParameter('freeEditBoardId');

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

// 🟠 페이지 네이션 다음페이지
const nextGroup = () => {
  currentGroup++;
  updatePaginationUI();
};

// 🟠 페이지 네이션 이전페이지
const prevGroup = () => {
  if (currentGroup > 1) {
    currentGroup--;
    updatePaginationUI();
  }
};

// 🟠 뒤로가기
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    location.reload();
  }
});
