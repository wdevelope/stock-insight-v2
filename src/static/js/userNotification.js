document.addEventListener('DOMContentLoaded', function () {
  userNotification();
});

let userNoti;

//🟠 유저 알림 불러오기
async function userNotification() {
  const userData = await fetchUserDetails();
  const userId = userData.id;

  try {
    const response = await fetch(`/api/users/notification/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const data = await response.json();
    userNoti = data;
    return data;
  } catch (error) {
    console.error('Error fetching notification:', error);
    return null;
  }
}

// 🟠 알림 정보 토글함수
async function toggleNotification() {
  const userNotification = document.getElementById('userNotification');
  const notiContainer = document.getElementById('userNoti');

  if (
    userNotification.style.display === 'none' ||
    !userNotification.style.display
  ) {
    if (userNoti) {
      notiContainer.innerHTML = '';
      userNoti.forEach((noti) => {
        const notiItem = document.createElement('li');
        notiItem.classList.add('list-group-item');
        const notiDiv = document.createElement('div');
        notiDiv.id = noti.u_id;
        notiDiv.addEventListener('click', () => {
          navigateToFreeBoard(noti.notification_boardId, noti.notification_id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => {
          deleteNotification(noti.notification_id);
        });

        if (noti.notification_isRead === 1) {
          notiDiv.innerHTML = `
        <strong> 읽음 </strong>
        <br> ${noti.notification_message} </br>
      `;
        } else {
          notiDiv.innerHTML = `
        <strong> 읽지않음 </strong>
        <br> ${noti.notification_message} </br>
      `;
        }

        notiDiv.appendChild(deleteButton);
        notiItem.appendChild(notiDiv);
        notiContainer.appendChild(notiItem);
      });
    }

    userNotification.style.display = 'block';
  } else {
    userNotification.style.display = 'none';
  }
}

// 해당 보드로 이동
async function navigateToFreeBoard(notification_boardId, notification_id) {
  try {
    const response = await fetch(
      `/api/boards/notification/${notification_id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to patch');
    }
    window.location.href = `freeBoardInfo?freeBoardId=${notification_boardId}`;
  } catch (error) {
    console.error('Error patching:', error);
  }
}

// 🟢 알림 삭제 함수 notification.id 로 들어가야함
async function deleteNotification(notification_id) {
  try {
    const response = await fetch(
      `/api/boards/notification/${notification_id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Failed to delete');
    }
  } catch (error) {
    console.error('Error deleting:', error);
  }
}
