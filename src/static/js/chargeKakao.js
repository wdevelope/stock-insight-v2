document.addEventListener('DOMContentLoaded', () => {
  renderUserInfo();
});
let userId;
let userEmail;
let userNickname;
let userSub;

//🟡 유저 정보 렌더링
async function renderUserInfo() {
  const data = await fetchUserDetails();
  userNickname = data.nickname;
  userEmail = data.email;
  userId = data.id;
  userSub = data.is_subscribe;
  console.log(data);
}

$('#charge_kakao').click(function () {
  // getter
  let IMP = window.IMP;
  IMP.init('imp06801784');

  IMP.request_pay(
    {
      pg: 'kakaopay.TC0ONETIME',
      pay_method: 'card',
      merchant_uid: 'merchant_' + new Date().getTime(),
      name: 'Stock Insight 결제 서비스',
      amount: '1000',
      buyer_email: userEmail,
      buyer_name: '구매자이름',
      buyer_tel: '010-1234-5678',
      buyer_addr: '인천광역시 부평구',
      buyer_postcode: '123-456',
    },
    function (rsp) {
      console.log(rsp);
      if (rsp.success) {
        var msg = '결제가 완료되었습니다.';
        msg += '결제 금액 : ' + rsp.paid_amount;
        $.ajax({
          type: 'PATCH',
          url: `/api/users/charge/${userId}`, //충전 금액값을 보낼 url 설정
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          data: JSON.stringify({ amount: 1000 }),
        });
      } else {
        var msg = '결제에 실패하였습니다.';
        msg += '에러내용 : ' + rsp.error_msg;
      }
      alert(msg);
      // document.location.href = '/user/mypage/home'; //alert창 확인 후 이동할 url 설정
    },
  );
});

//🟡 more quiz 함수
$('#quizMore').click(function () {
  if (userSub === true) {
    document.location.href = '/quizMore';
  } else {
    alert('결제를 하셔야 사용하실 수 있는 서비스 입니다.');
  }
});
