import { ApiProperty } from '@nestjs/swagger';

export class BoardResponseDto {
  @ApiProperty({ description: '게시글 ID' })
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  description: string;

  @ApiProperty({ description: '게시글 이미지 URL' })
  image: string;

  @ApiProperty({ description: '게시글 좋아요 수' })
  likeCount: number;

  @ApiProperty({ description: '게시글 조회 수' })
  viewCount: number;

  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @ApiProperty({ description: '게시글 수정 날짜' })
  updated_at: Date;

  @ApiProperty({ description: '게시글 작성자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '게시글 작성자 프로필 이미지' })
  imgUrl: string;

  @ApiProperty({ description: '게시글 작성자 상태' })
  status: string;
}
