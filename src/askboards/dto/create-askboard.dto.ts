import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAskboardDto {
  @ApiProperty({ description: '타이틀' })
  @IsString()
  title: string;
  @ApiProperty({ description: '내용' })
  @IsString()
  description: string;
}
