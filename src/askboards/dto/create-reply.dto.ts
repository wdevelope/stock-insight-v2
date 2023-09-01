import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({ description: '타이틀' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
