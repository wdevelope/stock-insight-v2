window.onload = function () {
  const targetTab =
    localStorage.getItem('activeTab') || location.hash || '#notice';

  $(`[href="${targetTab}"]`).tab('show');

  fetchAndRenderPosts();
};

// 🟠 게시글 생성 함수
async function savePost() {
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postContent').value;

  if (!title || !description) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });

    if (response.status === 201) {
      alert('게시글이 성공적으로 저장되었습니다.');
      $('#writeModal').modal('hide');
      $('#boardTabs a[href="#freeBoard"]').tab('show');
      fetchAndRenderPosts();
    } else {
      alert('게시글 저장에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error saving post:', error);
  }
}

// 🟠 게시글 랜더링 함수
async function fetchAndRenderPosts() {
  if (!token) {
    console.warn('Authorization token is missing');
    return;
  }

  const userNickname = await fetchUserInfo(token);

  try {
    const response = await fetch('http://localhost:3000/api/boards', {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    data.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    const boardElement = document.querySelector('#freeBoard .list-group');
    let postHTML = '';

    data.forEach((post) => {
      const postDate = post.updated_at.split('T')[0];
      const likesCount = post.likes.length; // 좋아요의 총 개수

      postHTML += `
                  <a href="http://localhost:3000/view/board.html?postId=${post.id}" class="list-group-item list-group-item-action">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <span>[토론]</span>
                        <strong class="mb-1 ms-2">${post.title}</strong>
                      </div>
                      <div>
                        <small class="me-2">${post.id}</small>
                        <span>${postDate}</span>
                        <i class="fas fa-thumbs-up ms-4"></i> ${likesCount}
                      </div>
                    </div>
                  </a>
                `;
    });

    boardElement.innerHTML = postHTML;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 🟠 게시판 탭이 전환될 때
$('#boardTabs button').on('shown.bs.tab', function (e) {
  // 현재 활성화된 탭의 href 값을 가져옴
  let target = $(e.target).attr('href');

  // 현재 활성화된 탭 정보를 localStorage에 저장
  localStorage.setItem('activeTab', target);

  // 모든 소제목을 숨김
  $('main .tab-content .d-flex > h2').hide();

  // 해당 게시판의 소제목만 표시합니다.
  $(target + ' .d-flex > h2').show();
});

// 페이지 로드 시 첫 번째 탭의 소제목을 기본으로 표시
$('main .tab-content .d-flex > h2').hide();
$('#notice .d-flex > h2').show();

// 🟠 뒤로 가기 버튼 등으로 인해 페이지가 다시 로드될 때
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    const targetTab =
      localStorage.getItem('activeTab') || location.hash || '#notice';

    $(`[href="${targetTab}"]`).tab('show');
  }
  fetchAndRenderPosts();
});
