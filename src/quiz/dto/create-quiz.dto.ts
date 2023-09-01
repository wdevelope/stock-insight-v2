import { ApiProperty } from '@nestjs/swagger';
export class CreateQuizDto {
  @ApiProperty()
  upANDdown: string;
  @ApiProperty()
  stockName: string;
  // user answer
}
