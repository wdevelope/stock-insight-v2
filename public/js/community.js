document.addEventListener('DOMContentLoaded', function () {
  // 더미 데이터 생성 함수
  function generateDummyData(length) {
    const data = {
      tags: [],
      dates: [],
      titles: [],
      profiles: [],
      likes: [],
    };

    for (let i = 0; i < length; i++) {
      data.tags.push(`[카테고리${i + 1}]`);
      data.dates.push(`2023-08-${18 - i}`);
      data.titles.push(`게시글 제목${i + 1}`);
      data.profiles.push(`프로필${i + 1}`);
      data.likes.push(10 + i);
    }

    return data;
  }

  // 원하는 길이의 더미 데이터 생성 (예: 10개의 게시글)
  const dummyData = generateDummyData(10);

  // 게시글 예시를 생성하는 함수
  function createPost(tag, date, title, profile, likes) {
    const post = document.createElement('a');
    post.href = '#';
    post.className = 'list-group-item list-group-item-action';

    const postContent = `
          <div class="d-flex justify-content-between align-items-center">
              <div>
                  <span>${tag}</span>
                  <strong class="mb-1 ms-2">${title}</strong>
              </div>
              <div>
                  <small class="me-2">${profile}</small>
                  <span>${date}</span>
                  <i class="fas fa-thumbs-up ms-4"></i> ${likes}
              </div>
          </div>
      `;
    post.innerHTML = postContent;
    return post;
  }

  // 공지사항 DOM 요소를 선택
  const noticeSection = document
    .getElementById('notice')
    .querySelector('.list-group');

  // 반복문을 돌면서 게시글 예시 생성
  for (let i = 0; i < dummyData.tags.length; i++) {
    const post = createPost(
      dummyData.tags[i],
      dummyData.dates[i],
      dummyData.titles[i],
      dummyData.profiles[i],
      dummyData.likes[i],
    );
    noticeSection.appendChild(post);
  }
});

// Bootstrap 탭이 전환될 때 이벤트 리스너
$('#boardTabs button').on('shown.bs.tab', function (e) {
  // 현재 활성화된 탭의 href 값을 가져옵니다.
  let target = $(e.target).attr('href');

  // 모든 소제목을 숨깁니다.
  $('main .tab-content h2').hide();

  // 해당 게시판의 소제목만 표시합니다.
  $(target + ' > h2').show();
});

// 페이지 로드 시 첫 번째 탭의 소제목을 기본으로 표시합니다.
$('main .tab-content h2').hide();
$('#notice > h2').show();
