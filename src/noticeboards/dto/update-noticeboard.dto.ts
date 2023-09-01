import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeboardDto } from './create-noticeboard.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoticeboardDto extends PartialType(CreateNoticeboardDto) {
  @ApiProperty({ description: '타이틀' })
  title?: string;
  @ApiProperty({ description: '내용' })
  description?: string;
  @ApiProperty({ description: '이미지' })
  image?: string;
}
