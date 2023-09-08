import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({ description: '타이틀' })
  title?: string;
  @ApiProperty({ description: '내용' })
  description?: string;
  @ApiProperty({ description: '이미지' })
  image?: string;
  @ApiProperty({ description: '좋아요 수' })
  likeCount?: number;
  @ApiProperty({ description: '조회수' })
  viewCount?: number;
  @ApiProperty({ description: '인덱싱' })
  is_checked?: boolean;
}
