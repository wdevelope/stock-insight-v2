// 🟢 이메일 인증 함수
async function verifyEmail() {
  const email = document.getElementById('signupEmail').value;

  const data = {
    email: email,
  };

  try {
    const response = await fetch(`${API_URL}/api/users/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      alert('인증 코드를 이메일로 발송하였습니다.');
    } else {
      alert('인증 코드 발송에 실패하였습니다.');
    }
  } catch (error) {
    console.log('이메일인증 에러', error);
    alert('인증 코드 발송 중 오류가 발생했습니다.');
  }
}

// 로그인 배경
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  for (let ellipse of ellipses) {
    ellipse.resetSizeAndPosition();
  }

  for (let number of numbers) {
    number.resetPosition();
  }
});

// 이메일 인증 상태 저장
let emailVerified = false;

// 🟢 이메일 인증 함수
async function verifyEmail() {
  const email = document.getElementById('signupEmail').value;

  const data = {
    email: email,
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      alert('인증 코드를 이메일로 발송하였습니다.');
    } else {
      alert('인증 코드 발송에 실패하였습니다.');
    }
  } catch (error) {
    console.log('이메일인증 에러', err);
    alert('인증 코드 발송 중 오류가 발생했습니다.');
  }
}

// 🟢 이메일 인증코드 확인 함수
async function checkEmailCode() {
  const email = document.getElementById('signupEmail').value;
  const randomCode = parseInt(
    document.getElementById('verificationCode').value,
    10,
  );

  const data = {
    email: email,
    randomCode: randomCode,
  };

  try {
    const response = await fetch(
      'http://localhost:3000/api/users/verifyEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (response.status === 201) {
      alert('이메일 인증이 완료되었습니다.');
      emailVerified = true;
    } else {
      alert('인증 코드가 올바르지 않습니다.');
    }
  } catch (error) {
    console.log('이메일 인증코드 에러', err);
    alert('이메일 인증 중 오류가 발생했습니다.');
  }
}

// 🟠 로그인 함수
async function loginUser() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const data = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.status === 201) {
      alert('로그인이 성공했습니다.');

      // 토큰을 쿠키에 저장
      setCookie('Authorization', `Bearer ${result.token}`, 3); // 3은 시간설정

      window.location.href = 'http://localhost:3000/view/index.html';
    } else {
      alert(result.message || '로그인 실패');
    }
  } catch (error) {
    console.error('로그인 중 에러 발생:', error);
    alert('로그인 중 에러 발생');
  }
}

// 🟠 회원가입 함수
async function signup() {
  const email = document.getElementById('signupEmail').value;
  const nickname = document.getElementById('signupNickname').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('confirmPassword').value;

  // 비밀번호 확인
  if (password !== passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  //이메일 인증 확인
  if (!emailVerified) {
    alert('이메일 인증을 먼저 완료해주세요.');
    return;
  }

  const data = {
    email: email,
    nickname: nickname,
    password: password,
    confirm: passwordConfirm,
  };

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // 회원가입 성공 시
    if (response.status === 201) {
      alert('회원가입 성공!');
      $('#signupModal').modal('hide'); // 모달 창 닫기
    } else {
      console.error('Signup response:', response); // 실패 콘솔
      alert(result.message || '회원가입 실패');
    }
  } catch (error) {
    console.error('회원가입 중 에러 발생:', error);
    alert('회원가입 중 에러 발생');
  }
}

// 🟠 쿠키에 값을 설정하는 함수
function setCookie(cookieName, cookieValue, expirationHour) {
  const date = new Date();
  date.setTime(date.getTime() + expirationHour * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${cookieName}=${encodeURIComponent(
    cookieValue,
  )}; ${expires}; path=/`;
}

// 로그인화면 꾸미기용 변수
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
// 로그인 배경
class Ellipse {
  constructor(delayAngle) {
    this.resetSizeAndPosition();
    this.angle = delayAngle;
    this.rotationSpeed = 0.001;
  }

  resetSizeAndPosition() {
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.horizontalRadius =
      width / 3 + (Math.random() * width * 0.08 - width * 0.02);
    this.verticalRadius =
      height / 6 + (Math.random() * height * 0.02 - height * 0.01);
  }

  draw() {
    const wobbleFactor = 0.02;
    const time = new Date().getTime() * 0.001;
    const wobbleRadiusH =
      this.horizontalRadius * (1 + wobbleFactor * Math.sin(time + this.angle));
    const wobbleRadiusV =
      this.verticalRadius * (1 + wobbleFactor * Math.cos(time + this.angle));

    ctx.beginPath();
    ctx.strokeStyle = '#40916c';
    ctx.ellipse(
      this.centerX,
      this.centerY,
      wobbleRadiusH,
      wobbleRadiusV,
      this.angle,
      0,
      2 * Math.PI,
    );
    ctx.lineWidth = 0.5;
    ctx.stroke();
    this.angle += this.rotationSpeed;
  }
}
// 로그인 배경
class RandomNumber {
  constructor() {
    this.resetPosition();
    this.value = Math.floor(Math.random() * 10);
    this.fontSize = 20 + Math.random() * 30;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  resetPosition() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }

  draw() {
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillStyle = `rgba(50, 50, 50, ${this.opacity})`;
    ctx.fillText(this.value, this.x, this.y);
  }
}
// 로그인 배경
const ellipses = [];
for (let i = 0; i < 70; i++) {
  ellipses.push(new Ellipse(i * ((2 * Math.PI) / 70)));
}
// 로그인 배경
const numbers = [];
for (let i = 0; i < 100; i++) {
  numbers.push(new RandomNumber());
}
// 로그인 배경
function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let ellipse of ellipses) {
    ellipse.draw();
  }

  for (let number of numbers) {
    number.draw();
  }

  requestAnimationFrame(animate);
}
animate();
