const token = getCookie('Authorization');

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

async function toggleProfile() {
  const userDetailsElem = document.getElementById('userDetails');
  if (
    userDetailsElem.style.display === 'none' ||
    !userDetailsElem.style.display
  ) {
    const data = await fetchUserDetails();
    if (data) {
      document.getElementById('nickname').textContent = data.nickname;
      document.getElementById('email').textContent = data.email;
      userDetailsElem.style.display = 'block';
    }
  } else {
    userDetailsElem.style.display = 'none';
  }
}

function goToProfile() {}

// 로그아웃 함수
function logout() {
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  deleteCookie('Authorization');
  alert('로그아웃 완료');
  window.location.href = 'http://localhost:3000';
}

// 쿠키 가져오기 함수
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

async function fetchUserInfo(token) {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    return data.nickname; // 사용자의 닉네임을 반환합니다.
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}
