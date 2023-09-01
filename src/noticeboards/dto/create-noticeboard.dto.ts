import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeboardDto {
  @ApiProperty({ description: '타이틀' })
  @IsString()
  title: string;
  @ApiProperty({ description: '내용' })
  @IsString()
  description: string;
  // @IsString()
  image: string;
}
