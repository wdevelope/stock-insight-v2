import { ApiProperty } from '@nestjs/swagger';

export class NoticeBoardResponseDto {
  @ApiProperty({ description: '게시글 ID' })
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  description: string;

  @ApiProperty({ description: '게시글 이미지 URL' })
  image: string;

  @ApiProperty({ description: '게시글 생성 날짜' })
  created_at: Date;

  @ApiProperty({ description: '게시글 수정 날짜' })
  updated_at: Date;
}
