import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StockCommentDto {
  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
