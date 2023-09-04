import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({ description: '타이틀' })
  title?: string;
  @ApiProperty({ description: '내용' })
  description?: string;
  @ApiProperty({ description: '닉네임' })
  nickname?: string;
}
