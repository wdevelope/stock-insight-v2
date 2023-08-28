

-- ⭐ 유저 ⭐

-- 0. 회원가입
INSERT INTO users (nickname, password, email, provider, point , status, imgUrl, answer)
VALUES ('나그네', '비밀번호', 'example@email.com','kakao', 100, user, 'blabla.com', 0);

-- 1. 예측 성공한 유저 찾기
SELECT * FROM users WHERE answer = true ORDER BY id LIMIT 10 OFFSET ( page-1 ) * 10;

-- 2. 포인트 200이상 유저 찾기 (랭커)
SELECT * FROM users WHERE point > 199 ORDER BY id LIMIT 10 OFFSET ( page-1 ) * 10;

-- 3. 현재 로그인한 사용자 정보 조회
SELECT * FROM users WHERE id = :id;

-- 4. 포인트 업데이트
-- UPDATE users SET point = :newPoint WHERE id = :id;



-- 관리자 유저 찾기
-- SELECT * FROM users WHERE status = 'admin' ORDER BY id LIMIT 10;



-- ⭐ 게시물 ⭐

-- 0. 게시글 작성
INSERT INTO board (title, description, userId, created_at, updated_at) 
VALUES ('게시글 제목', '게시글 내용', 사용자ID, NOW(), NOW());

-- 1. 게시글 목록 조회
SELECT 
    board.id, 
    board.title, 
    board.description,
    board.updated_at,
    users.nickname,
    COUNT(DISTINCT likes.id) AS like_count, -- 좋아요 수
    COUNT(DISTINCT views.id) AS view_count  -- 조회수
FROM 
    board 
JOIN 
    users ON board.userId = users.id
LEFT JOIN
    likes ON board.id = likes.boardId
LEFT JOIN
    views ON board.id = views.boardId
GROUP BY -- 구분 집계
    board.id, users.nickname
LIMIT 20
OFFSET ( page-1 ) * 20;

-- 2. 게시글 상세페이지 조회 (id값으로)
SELECT * FROM board WHERE id = ?;

-- 3. 게시글 제목,내용 검색기능
SELECT title, description FROM board 
WHERE title LIKE '%example%' OR description LIKE '%example%';
LIMIT 20
OFFSET ( page-1 ) * 20;

-- 4. 유저 닉네임으로 게시글 검색기능
SELECT 
    board.id, 
    board.title, 
    board.description 
FROM 
    board 
JOIN 
    users ON board.userId = users.id 
WHERE 
    users.nickname LIKE '%example%'
LIMIT 20
OFFSET ( page-1 ) * 20;



-- ⭐ 댓글 ⭐

-- 0. 댓글 작성
INSERT INTO comment (boardId, userId, comment, created_at) 
VALUES (게시글ID, 사용자ID, '댓글 내용', NOW());

-- 1. 댓글 조회
SELECT * FROM comment WHERE boardId = ?;

-- 2. 댓글 수정
UPDATE comment 
SET comment = '수정된 댓글 내용'
WHERE id = 댓글ID;

-- 3. 댓글 삭제
DELETE FROM comment 
WHERE id = 댓글ID;


-- ⭐ 좋아요 ⭐

-- 0. 좋아요 누르기
UPDATE board 
SET like_count = like_count + 1
WHERE id = ?;

-- 1. 좋아요 순으로 게시글 정렬
SELECT b.*, COUNT(l.id) AS like_count
FROM board AS b
LEFT JOIN likes AS l ON b.id = l.boardID
GROUP BY b.id
ORDER BY like_count DESC;
LIMIT 20
OFFSET ( page-1 ) * 20;

-- ⭐ 조회수 ⭐

-- 0. 조회수 늘리기
UPDATE board 
SET view_count = view_count + 1
WHERE id = ?;

-- 1. 조회수 순으로 게시글 정렬
SELECT b.*, COUNT(v.count) AS view_count
FROM board AS b
LEFT JOIN views AS v ON b.id = v.boardID
GROUP BY b.id
ORDER BY view_count DESC;
LIMIT 20
OFFSET ( page-1 ) * 20;



-- ⭐ 주식 ⭐

-- 0. 주식 가격관련 정보 삽입
INSERT INTO stock_price 
(stck_prpr, prdy_vrss, prdy_vrss_sign, prdy_ctrt, stck_oprc, stck_hgpr, stck_lwpr, stck_sdpr, acml_vol, acml_tr_pbmn, hts_frgn_ehrt, hts_avls, per, pbr, w52_hgpr, w52_lwpr, whol_loan_rmnd_rate)
VALUES
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 0. 주식 코드,종목명,시장명 삽입
INSERT INTO stock (id, prdt_abrv_name, rprs_mrkt_kor_name,created_at, updated_at) 
VALUES (?, ?, ?,now(),now());


-- 1. 특정 주식 코드 조회
SELECT * FROM stock_price WHERE stck_shrn_iscd = '특정주식코드';

-- 2. 최근 n일간 주식 정보 불러오기
SELECT * FROM stock_price WHERE created_at >= NOW() - INTERVAL N DAY;
LIMIT 20
OFFSET ( page-1 ) * 20;

-- 3. 특정 조건에 따라 주식 정보를 필터링 (예시: 특정가격)
SELECT * FROM stock_price WHERE stck_prpr >= 특정가격;
LIMIT 20
OFFSET ( page-1 ) * 20;

-- 4. 전체 주식 목록 불러오기
SELECT * FROM stock 
LIMIT 20
OFFSET ( page-1 ) * 20;

-- 5. 주식명 조회
SELECT * FROM stock WHERE prdt_abrv_name Like '%example%'

